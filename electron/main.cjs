const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');

const KARABINER_DIR = path.join(os.homedir(), '.config', 'karabiner');
const KARABINER_CONFIG = path.join(KARABINER_DIR, 'karabiner.json');
const KARABINER_CLI = '/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli';
const GRABBER_LOG = '/var/log/karabiner/grabber.log';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 4 },
    backgroundColor: '#141414',
    title: 'VIA Configurator',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

// Sync: directly update karabiner.json rules for immediate effect
ipcMain.handle('sync-karabiner', async (_event, { device, manipulators, managedFromKeys }) => {
  try {
    if (!fs.existsSync(KARABINER_CONFIG)) {
      return { success: false, error: 'karabiner.json not found' };
    }
    const config = JSON.parse(fs.readFileSync(KARABINER_CONFIG, 'utf-8'));
    const profile = config.profiles[0];
    if (!profile?.complex_modifications?.rules) {
      return { success: false, error: 'No profile/rules found' };
    }

    const rules = profile.complex_modifications.rules;

    // Find existing rule for this device by vendor_id + product_id
    const ruleIndex = rules.findIndex(r =>
      r.manipulators?.some(m =>
        m.conditions?.some(c =>
          c.type === 'device_if' &&
          c.identifiers?.some(id =>
            id.vendor_id === device.vendor_id && id.product_id === device.product_id
          )
        )
      )
    );

    // managedFromKeysはアプリが管理するすべてのfromキー（デフォルトに戻したものも含む）
    // このリストにあるキーの既存manipulatorは削除し、ないものだけ保護する
    const managedSet = new Set(managedFromKeys || []);

    // Merge: keep existing manipulators the app doesn't manage
    let mergedManipulators = [...manipulators];
    if (ruleIndex >= 0) {
      const existing = rules[ruleIndex].manipulators || [];
      for (const em of existing) {
        const key = em.from?.key_code || '';
        const mods = em.from?.modifiers?.mandatory?.join(',') || '';
        const fromId = `${key}|${mods}`;
        if (!managedSet.has(fromId)) {
          mergedManipulators.push(em);
        }
      }
    }

    const newRule = {
      description: `${device.name} - カスタム設定`,
      manipulators: mergedManipulators,
    };

    if (ruleIndex >= 0) {
      rules[ruleIndex] = newRule;
    } else {
      rules.push(newRule);
    }

    fs.writeFileSync(KARABINER_CONFIG, JSON.stringify(config, null, 4));
    return { success: true, path: KARABINER_CONFIG, replaced: ruleIndex >= 0, count: manipulators.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Read current karabiner.json
ipcMain.handle('read-karabiner-config', async () => {
  try {
    if (!fs.existsSync(KARABINER_CONFIG)) {
      return { success: false, error: 'karabiner.json not found' };
    }
    const data = fs.readFileSync(KARABINER_CONFIG, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Verify: read-back + device connection + Karabiner reload check
ipcMain.handle('verify-karabiner', async (_event, { device, manipulators, syncTimestamp }) => {
  const checks = { readBack: false, deviceConnected: false, configReloaded: false, errors: [] };
  try {
    // 1. Read-back: verify written manipulators match
    const config = JSON.parse(fs.readFileSync(KARABINER_CONFIG, 'utf-8'));
    const rules = config.profiles[0]?.complex_modifications?.rules || [];
    const rule = rules.find(r =>
      r.manipulators?.some(m =>
        m.conditions?.some(c =>
          c.type === 'device_if' &&
          c.identifiers?.some(id =>
            id.vendor_id === device.vendor_id && id.product_id === device.product_id
          )
        )
      )
    );
    if (rule) {
      // アプリが送ったmanipulatorsが全てファイルに含まれているか確認
      // (マージで追加された非管理エントリは無視)
      const writtenStr = rule.manipulators.map(m => JSON.stringify(m));
      const allFound = manipulators.every(m => writtenStr.includes(JSON.stringify(m)));
      checks.readBack = allFound && rule.manipulators.length >= manipulators.length;
      if (!checks.readBack) {
        checks.errors.push(`Read-back mismatch: ${rule.manipulators.length} in file, ${manipulators.length} expected (missing entries)`);
      }
    } else {
      checks.errors.push('Device rule not found in karabiner.json after write');
    }

    // 2. Device connection: check via karabiner_cli
    await new Promise((resolve) => {
      execFile(KARABINER_CLI, ['--list-connected-devices'], (err, stdout) => {
        if (err) {
          checks.errors.push(`karabiner_cli error: ${err.message}`);
          resolve();
          return;
        }
        try {
          const devices = JSON.parse(stdout);
          checks.deviceConnected = devices.some(d =>
            d.device_identifiers?.vendor_id === device.vendor_id &&
            d.device_identifiers?.product_id === device.product_id
          );
          if (!checks.deviceConnected) {
            checks.errors.push(`Device ${device.name} not connected (vendor:${device.vendor_id} product:${device.product_id})`);
          }
        } catch (e) {
          checks.errors.push(`Failed to parse connected devices: ${e.message}`);
        }
        resolve();
      });
    });

    // 3. Config reload: check grabber.log for reload after sync timestamp
    if (fs.existsSync(GRABBER_LOG)) {
      const log = fs.readFileSync(GRABBER_LOG, 'utf-8');
      const lines = log.split('\n');
      const reloadLines = lines.filter(l =>
        l.includes('core_configuration is updated')
      );
      if (reloadLines.length > 0) {
        const lastReload = reloadLines[reloadLines.length - 1];
        const match = lastReload.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)\]/);
        if (match) {
          const reloadTime = new Date(match[1].replace(' ', 'T')).getTime();
          checks.configReloaded = reloadTime >= syncTimestamp - 5000; // 5s tolerance
          checks.lastReloadAt = match[1];
          if (!checks.configReloaded) {
            checks.errors.push(`Last Karabiner reload at ${match[1]} is before sync`);
          }
        }
      } else {
        checks.errors.push('No config reload entries found in grabber.log');
      }
    } else {
      checks.errors.push('grabber.log not found');
    }

    checks.success = checks.readBack && checks.deviceConnected;
    return checks;
  } catch (err) {
    checks.errors.push(err.message);
    return checks;
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
