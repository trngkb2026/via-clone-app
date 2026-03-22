import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { homedir } from 'os'
import { execFile } from 'child_process'

const KARABINER_CONFIG = path.join(homedir(), '.config', 'karabiner', 'karabiner.json');
const KARABINER_CLI = '/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli';
const GRABBER_LOG = '/var/log/karabiner/grabber.log';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'karabiner-sync',
      configureServer(server) {
        // Sync: directly update karabiner.json rules
        server.middlewares.use('/api/sync-karabiner', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end('Method not allowed');
            return;
          }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { device, manipulators, managedFromKeys } = JSON.parse(body);
              if (!fs.existsSync(KARABINER_CONFIG)) {
                res.end(JSON.stringify({ success: false, error: 'karabiner.json not found' }));
                return;
              }
              const config = JSON.parse(fs.readFileSync(KARABINER_CONFIG, 'utf-8'));
              const profile = config.profiles[0];
              const rules = profile.complex_modifications.rules;

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

              // GUARDRAIL: managedFromKeysが空なら拒否
              if (!managedFromKeys || managedFromKeys.length === 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'GUARDRAIL: managedFromKeys is empty. Sync rejected.' }));
                return;
              }
              const managedSet = new Set(managedFromKeys);

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
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, path: KARABINER_CONFIG, replaced: ruleIndex >= 0, count: manipulators.length }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        });

        // Verify: read-back + device connection + Karabiner reload check
        server.middlewares.use('/api/verify-karabiner', (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; res.end('Method not allowed'); return; }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { device, manipulators, syncTimestamp } = JSON.parse(body);
              const checks = { readBack: false, deviceConnected: false, configReloaded: false, errors: [] };

              // 1. Read-back
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
                const writtenStr = rule.manipulators.map(m => JSON.stringify(m));
                const allFound = manipulators.every(m => writtenStr.includes(JSON.stringify(m)));
                checks.readBack = allFound && rule.manipulators.length >= manipulators.length;
                if (!checks.readBack) checks.errors.push(`Read-back mismatch: ${rule.manipulators.length} in file, ${manipulators.length} expected`);
              } else {
                checks.errors.push('Device rule not found after write');
              }

              // 2. Device connection
              await new Promise((resolve) => {
                execFile(KARABINER_CLI, ['--list-connected-devices'], (err, stdout) => {
                  if (err) { checks.errors.push(`CLI error: ${err.message}`); resolve(); return; }
                  try {
                    const devices = JSON.parse(stdout);
                    checks.deviceConnected = devices.some(d =>
                      d.device_identifiers?.vendor_id === device.vendor_id &&
                      d.device_identifiers?.product_id === device.product_id
                    );
                    if (!checks.deviceConnected) checks.errors.push(`${device.name} not connected`);
                  } catch (e) { checks.errors.push(`Parse error: ${e.message}`); }
                  resolve();
                });
              });

              // 3. Reload check
              if (fs.existsSync(GRABBER_LOG)) {
                const log = fs.readFileSync(GRABBER_LOG, 'utf-8');
                const reloadLines = log.split('\n').filter(l => l.includes('core_configuration is updated'));
                if (reloadLines.length > 0) {
                  const last = reloadLines[reloadLines.length - 1];
                  const match = last.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)\]/);
                  if (match) {
                    const reloadTime = new Date(match[1].replace(' ', 'T')).getTime();
                    checks.configReloaded = reloadTime >= syncTimestamp - 5000;
                    checks.lastReloadAt = match[1];
                    if (!checks.configReloaded) checks.errors.push(`Last reload at ${match[1]} is before sync`);
                  }
                }
              } else {
                checks.errors.push('grabber.log not found');
              }

              checks.success = checks.readBack && checks.deviceConnected;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(checks));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, errors: [err.message] }));
            }
          });
        });

        // Read karabiner.json
        server.middlewares.use('/api/read-karabiner', (req, res) => {
          try {
            if (fs.existsSync(KARABINER_CONFIG)) {
              const data = fs.readFileSync(KARABINER_CONFIG, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: JSON.parse(data) }));
            } else {
              res.end(JSON.stringify({ success: false, error: 'not found' }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      }
    }
  ],
})
