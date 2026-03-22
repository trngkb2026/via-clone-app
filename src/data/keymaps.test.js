import { describe, it, expect } from 'vitest';
import { parseKarabinerConfig, generateKarabinerConfig, initNumpad, initEwin, currentNumpadConfig, currentEwinConfig, devices, keyIdToKarabinerFrom } from './keymaps';

// === Helpers ===

function buildKarabinerJson(manipulators) {
  return {
    profiles: [{
      complex_modifications: {
        rules: [{
          description: 'test rule',
          manipulators,
        }]
      }
    }]
  };
}

function manip(deviceType, fromKeyCode, to, fromMods) {
  const d = devices[deviceType];
  const m = {
    type: 'basic',
    conditions: [{ type: 'device_if', identifiers: [{ vendor_id: d.vendor_id, product_id: d.product_id }] }],
    from: { key_code: fromKeyCode },
    to: Array.isArray(to) ? to : [to],
  };
  if (fromMods) m.from.modifiers = fromMods;
  return m;
}

// 実機karabiner.jsonから抜粋したTENBT03ルール（テスト用スナップショット）
const REAL_TENBT03_MANIPULATORS = [
  manip('numpad', 'escape', { consumer_key_code: 'dictation' }),
  manip('numpad', 'f2', [
    { key_code: 't', modifiers: ['left_shift'] }, { key_code: 'e' }, { key_code: 'n' },
    { key_code: 't' }, { key_code: 'e' }, { key_code: 'n' },
    { key_code: 'keypad_8' }, { key_code: 'keypad_2' }, { key_code: 'keypad_2' },
    { key_code: 'keypad_3' }, { key_code: 'return_or_enter' },
  ]),
  manip('numpad', 'f4', { key_code: 'f13', modifiers: ['shift'] }),
  manip('numpad', '8', { key_code: 'x', modifiers: ['command', 'right_shift'] },
    { mandatory: ['shift'], optional: ['caps_lock'] }),
  manip('numpad', '9', { key_code: 'h', modifiers: ['command', 'shift', 'option'] },
    { mandatory: ['shift'], optional: ['caps_lock'] }),
  manip('numpad', 'keypad_hyphen', { key_code: 'comma', modifiers: ['command'] }),
  manip('numpad', 'keypad_plus', { key_code: 'c', modifiers: ['control'] }),
  manip('numpad', 'delete_forward', [
    { key_code: 'spacebar' }, { key_code: 'spacebar' },
    { key_code: 'spacebar' }, { key_code: 'spacebar' },
    { key_code: 'return_or_enter' },
  ]),
  manip('numpad', 'keypad_slash', { key_code: 'return_or_enter', modifiers: ['command'] }),
  manip('numpad', 'left_arrow', { key_code: 'left_arrow', modifiers: ['command', 'option'] }),
  manip('numpad', 'right_arrow', { key_code: 'right_arrow', modifiers: ['command', 'option'] }),
  manip('numpad', 'keypad_1', [{ key_code: 'keypad_1' }, { key_code: 'return_or_enter' }]),
  manip('numpad', 'keypad_2', [{ key_code: 'keypad_2' }, { key_code: 'return_or_enter' }]),
  manip('numpad', 'keypad_3', [{ key_code: 'keypad_3' }, { key_code: 'return_or_enter' }]),
  manip('numpad', 'keypad_enter', { key_code: 'spacebar' }),
  manip('numpad', 'keypad_0', { key_code: 'return_or_enter', modifiers: ['shift'] }),
  manip('numpad', 'keypad_period', [
    { key_code: 'japanese_eisuu' }, { key_code: 'comma' }, { key_code: 'japanese_kana' },
  ]),
];

const REAL_EWIN_MANIPULATORS = [
  manip('ewin', 'caps_lock', { key_code: 'japanese_kana' },
    { optional: ['any'] }),
];


// =============================================================
// 1. ハードコード汚染テスト
// =============================================================
describe('ハードコード汚染の防止', () => {
  it('karabiner.jsonに存在しないキーはパース結果に含まれない', () => {
    const json = buildKarabinerJson([
      manip('numpad', 'escape', { consumer_key_code: 'dictation' }),
    ]);
    const result = parseKarabinerConfig(json, 'numpad');

    expect(result.n_esc).toBeDefined();
    const hardcodedKeys = Object.keys(currentNumpadConfig).filter(k => k !== 'n_esc');
    for (const key of hardcodedKeys) {
      expect(result[key], `${key} がパース結果に混入`).toBeUndefined();
    }
  });

  it('空のkarabiner.jsonではパース結果も空', () => {
    const json = buildKarabinerJson([]);
    const parsed = parseKarabinerConfig(json, 'numpad');
    expect(Object.keys(parsed)).toHaveLength(0);
  });

  it('initDefaults + parse だけで正しいstateが構築できる', () => {
    const json = buildKarabinerJson([
      manip('numpad', 'escape', { consumer_key_code: 'dictation' }),
      manip('numpad', 'keypad_enter', { key_code: 'spacebar' }),
    ]);
    const parsed = parseKarabinerConfig(json, 'numpad');
    const state = { ...initNumpad, ...parsed };

    expect(state.n_esc.consumer_key_code).toBe('dictation');
    expect(state.n_enter).toBe('KC_SPACE');
    expect(state.n_f2).toBe('KC_F2'); // untouched = default
  });
});


// =============================================================
// 2. ラウンドトリップテスト（generate → parse → generate で同一）
// =============================================================
describe('ラウンドトリップ: generate → parse → generate', () => {
  it('全マッピングタイプが往復しても壊れない', () => {
    // simple, combo, sequence, consumer をすべて含むkeymap
    const keymap = {
      ...initNumpad,
      n_esc: { type: 'consumer', consumer_key_code: 'dictation', label: '🎤Dict' },
      n_f4: { type: 'combo', key_code: 'f13', modifiers: ['shift'], label: '⇧F13' },
      n_min: { type: 'combo', key_code: 'comma', modifiers: ['command'], label: '⌘,' },
      n_enter: 'KC_SPACE',
      n_dot: { type: 'sequence', keys: [
        { key_code: 'japanese_eisuu' }, { key_code: 'comma' }, { key_code: 'japanese_kana' },
      ], label: '英,か' },
      n_plus: { type: 'combo', key_code: 'c', modifiers: ['control'], label: '⌃C' },
      n_del: { type: 'sequence', keys: [
        { key_code: 'spacebar' }, { key_code: 'spacebar' },
        { key_code: 'spacebar' }, { key_code: 'spacebar' },
        { key_code: 'return_or_enter' },
      ], label: 'Sp×4⏎' },
    };

    // generate: keymap → karabiner manipulators
    const generated = generateKarabinerConfig(keymap, 'numpad', initNumpad);
    const manipulators = generated.rules[0].manipulators;

    // parse: manipulators → keymap values
    const fakeJson = buildKarabinerJson(manipulators);
    const parsed = parseKarabinerConfig(fakeJson, 'numpad');

    // re-generate: parsed keymap → karabiner manipulators
    const state2 = { ...initNumpad, ...parsed };
    const generated2 = generateKarabinerConfig(state2, 'numpad', initNumpad);
    const manipulators2 = generated2.rules[0].manipulators;

    // manipulators の from/to ペアが同一であること（順序不問）
    const normalize = (ms) => ms
      .map(m => ({ from: m.from, to: m.to }))
      .sort((a, b) => JSON.stringify(a.from).localeCompare(JSON.stringify(b.from)));

    expect(normalize(manipulators2)).toEqual(normalize(manipulators));
  });

  it('ewinデバイスもラウンドトリップが成立する', () => {
    const keymap = {
      ...initEwin,
      e_caps: { type: 'system', key_code: 'japanese_eisuu', label: '英数' },
      e_esc: { type: 'combo', key_code: 'q', modifiers: ['command'], label: '⌘Q' },
    };

    const gen1 = generateKarabinerConfig(keymap, 'ewin', initEwin);
    const parsed = parseKarabinerConfig(buildKarabinerJson(gen1.rules[0].manipulators), 'ewin');
    const gen2 = generateKarabinerConfig({ ...initEwin, ...parsed }, 'ewin', initEwin);

    const norm = (ms) => ms
      .map(m => ({ from: m.from, to: m.to }))
      .sort((a, b) => JSON.stringify(a.from).localeCompare(JSON.stringify(b.from)));

    expect(norm(gen2.rules[0].manipulators)).toEqual(norm(gen1.rules[0].manipulators));
  });
});


// =============================================================
// 3. 実機karabiner.jsonパーステスト
// =============================================================
describe('実機karabiner.json互換', () => {
  it('TENBT03: 実際のルール17件がすべてパースされる', () => {
    const json = buildKarabinerJson(REAL_TENBT03_MANIPULATORS);
    const parsed = parseKarabinerConfig(json, 'numpad');
    const parsedKeys = Object.keys(parsed);

    // 17 manipulators → 17 keys parsed
    expect(parsedKeys.length).toBe(REAL_TENBT03_MANIPULATORS.length);
  });

  it('TENBT03: パース結果の各キーが正しいタイプを持つ', () => {
    const json = buildKarabinerJson(REAL_TENBT03_MANIPULATORS);
    const parsed = parseKarabinerConfig(json, 'numpad');

    expect(parsed.n_esc.type).toBe('consumer');
    expect(parsed.n_esc.consumer_key_code).toBe('dictation');
    expect(parsed.n_f2.type).toBe('sequence');
    expect(parsed.n_f4.type).toBe('combo');
    expect(parsed.n_f4.modifiers).toContain('shift');
    expect(parsed.n_lp.type).toBe('combo'); // 1Password
    expect(parsed.n_rp.type).toBe('combo'); // ⌘⇧⌥H
    expect(parsed.n_min.type).toBe('combo'); // ⌘,
    expect(parsed.n_plus.type).toBe('combo'); // ⌃C
    expect(parsed.n_del.type).toBe('sequence'); // Sp×4⏎
    expect(parsed.n_div.type).toBe('combo'); // ⌘⏎
    expect(parsed.n_left.type).toBe('combo');
    expect(parsed.n_right.type).toBe('combo');
    expect(parsed.n_1.type).toBe('sequence');
    expect(parsed.n_2.type).toBe('sequence');
    expect(parsed.n_3.type).toBe('sequence');
    expect(parsed.n_enter).toBe('KC_SPACE'); // simple (string)
    expect(parsed.n_0.type).toBe('combo'); // Shift+Enter
    expect(parsed.n_dot.type).toBe('sequence'); // 英,か
  });

  it('TENBT03: ラウンドトリップで実機データが保存される', () => {
    const json = buildKarabinerJson(REAL_TENBT03_MANIPULATORS);
    const parsed = parseKarabinerConfig(json, 'numpad');
    const state = { ...initNumpad, ...parsed };

    const gen = generateKarabinerConfig(state, 'numpad', initNumpad);
    const reparsed = parseKarabinerConfig(buildKarabinerJson(gen.rules[0].manipulators), 'numpad');
    const state2 = { ...initNumpad, ...reparsed };

    const gen2 = generateKarabinerConfig(state2, 'numpad', initNumpad);

    const norm = (ms) => ms
      .map(m => ({ from: m.from, to: m.to }))
      .sort((a, b) => JSON.stringify(a.from).localeCompare(JSON.stringify(b.from)));

    expect(norm(gen2.rules[0].manipulators)).toEqual(norm(gen.rules[0].manipulators));
  });

  it('Ewin: caps_lock → japanese_kana がパースされる', () => {
    const json = buildKarabinerJson(REAL_EWIN_MANIPULATORS);
    const parsed = parseKarabinerConfig(json, 'ewin');

    expect(parsed.e_caps).toBeDefined();
    expect(parsed.e_caps.type).toBe('system');
    expect(parsed.e_caps.key_code).toBe('japanese_kana');
  });
});


// =============================================================
// 4. generate: デフォルト値は出力しない
// =============================================================
describe('generate: 不要なmanipulatorを生成しない', () => {
  it('全キーがデフォルトならmanipulatorsは空だがmanagedFromKeysは返る', () => {
    const gen = generateKarabinerConfig(initNumpad, 'numpad', initNumpad);
    expect(gen.rules[0].manipulators).toHaveLength(0);
    expect(gen.managedFromKeys.length).toBeGreaterThan(0);
  });

  it('変更したキーだけmanipulatorが生成される', () => {
    const keymap = { ...initNumpad, n_enter: 'KC_SPACE' };
    const gen = generateKarabinerConfig(keymap, 'numpad', initNumpad);
    expect(gen.rules[0].manipulators).toHaveLength(1);
    expect(gen.rules[0].manipulators[0].from.key_code).toBe('keypad_enter');
    expect(gen.rules[0].manipulators[0].to[0].key_code).toBe('spacebar');
  });

  it('fromDefがnull（FN/00等）のキーは変更してもmanipulatorに含まれない', () => {
    const keymap = { ...initNumpad, n_fn: 'KC_A', n_00: 'KC_B' };
    const gen = generateKarabinerConfig(keymap, 'numpad', initNumpad);
    expect(gen.rules[0].manipulators).toHaveLength(0);
  });
});


// =============================================================
// 5. parse: 他デバイスのルールを拾わない
// =============================================================
describe('parse: デバイス分離', () => {
  it('numpadパーサーはewinのmanipulatorを無視する', () => {
    const json = buildKarabinerJson(REAL_EWIN_MANIPULATORS);
    const parsed = parseKarabinerConfig(json, 'numpad');
    expect(Object.keys(parsed)).toHaveLength(0);
  });

  it('ewinパーサーはnumpadのmanipulatorを無視する', () => {
    const json = buildKarabinerJson(REAL_TENBT03_MANIPULATORS);
    const parsed = parseKarabinerConfig(json, 'ewin');
    expect(Object.keys(parsed)).toHaveLength(0);
  });

  it('両デバイス混在でも正しく分離される', () => {
    const json = buildKarabinerJson([...REAL_TENBT03_MANIPULATORS, ...REAL_EWIN_MANIPULATORS]);

    const numpad = parseKarabinerConfig(json, 'numpad');
    const ewin = parseKarabinerConfig(json, 'ewin');

    expect(Object.keys(numpad).length).toBe(REAL_TENBT03_MANIPULATORS.length);
    expect(Object.keys(ewin).length).toBe(REAL_EWIN_MANIPULATORS.length);
  });
});


// =============================================================
// 6. デフォルト復帰時にmanipulatorが削除される
// =============================================================
describe('デフォルト復帰の保存', () => {
  it('managedFromKeysにはfromDef非nullの全キーが含まれる', () => {
    const gen = generateKarabinerConfig(initNumpad, 'numpad', initNumpad);
    const managed = gen.managedFromKeys;

    // n_fn, n_00, n_hzはfromDefがnullなので含まれない
    expect(managed).toContain('escape|');
    expect(managed).toContain('keypad_enter|');
    expect(managed).toContain('8|shift'); // n_lp (shift+8)
  });

  it('キーをデフォルトに戻すとmanipulatorは0件だがmanagedFromKeysで既存を削除できる', () => {
    const remapped = { ...initNumpad, n_enter: 'KC_SPACE' };
    const gen1 = generateKarabinerConfig(remapped, 'numpad', initNumpad);
    expect(gen1.rules[0].manipulators).toHaveLength(1);

    const gen2 = generateKarabinerConfig(initNumpad, 'numpad', initNumpad);
    expect(gen2.rules[0].manipulators).toHaveLength(0);
    expect(gen2.managedFromKeys).toContain('keypad_enter|');
  });
});


// =============================================================
// 7. syncマージロジック: managedFromKeysで既存が実際に削除される
// =============================================================

// Electron/Viteのsyncハンドラと同一のマージロジックを抽出してテスト
function mergeManipulators(newManipulators, existingManipulators, managedFromKeys) {
  const managedSet = new Set(managedFromKeys || []);
  const merged = [...newManipulators];
  for (const em of existingManipulators) {
    const key = em.from?.key_code || '';
    const mods = em.from?.modifiers?.mandatory?.join(',') || '';
    const fromId = `${key}|${mods}`;
    if (!managedSet.has(fromId)) {
      merged.push(em);
    }
  }
  return merged;
}

describe('syncマージ: managedFromKeysによる既存manipulator削除', () => {
  it('デフォルト復帰時、既存manipulatorが削除される', () => {
    // 既存: keypad_enter→spacebar のmanipulatorがkarabiner.jsonにある
    const existing = [
      manip('numpad', 'keypad_enter', { key_code: 'spacebar' }),
    ];

    // アプリがデフォルトに戻した → manipulators空、managedFromKeysにkeypad_enter含む
    const gen = generateKarabinerConfig(initNumpad, 'numpad', initNumpad);

    const merged = mergeManipulators(gen.rules[0].manipulators, existing, gen.managedFromKeys);

    // keypad_enterはmanagedFromKeysに含まれるので既存から削除される
    expect(merged).toHaveLength(0);
  });

  it('アプリ管理外のmanipulatorは保護される', () => {
    // 既存: アプリが管理しないキー（例: 別アプリが設定したcaps_lock→escape）
    const unmanagedManip = {
      type: 'basic',
      conditions: [{ type: 'device_if', identifiers: [{ vendor_id: 9427, product_id: 12427 }] }],
      from: { key_code: 'caps_lock' },
      to: [{ key_code: 'escape' }],
    };
    const existing = [unmanagedManip];

    const gen = generateKarabinerConfig(initNumpad, 'numpad', initNumpad);
    const merged = mergeManipulators(gen.rules[0].manipulators, existing, gen.managedFromKeys);

    // caps_lockはkeyIdToKarabinerFrom.numpadに存在しないので保護される
    expect(merged).toHaveLength(1);
    expect(merged[0].from.key_code).toBe('caps_lock');
  });

  it('一部をデフォルト復帰、一部をリマップ、管理外は保護の混合ケース', () => {
    const existing = [
      manip('numpad', 'keypad_enter', { key_code: 'spacebar' }),      // アプリ管理: デフォルト復帰で削除
      manip('numpad', 'escape', { consumer_key_code: 'dictation' }),   // アプリ管理: リマップ上書き
      { type: 'basic',
        conditions: [{ type: 'device_if', identifiers: [{ vendor_id: 9427, product_id: 12427 }] }],
        from: { key_code: 'caps_lock' },
        to: [{ key_code: 'escape' }] },                               // 管理外: 保護
    ];

    // n_enterはデフォルト、n_escはDictationにリマップ
    const keymap = {
      ...initNumpad,
      n_esc: { type: 'consumer', consumer_key_code: 'dictation', label: '🎤Dict' },
    };
    const gen = generateKarabinerConfig(keymap, 'numpad', initNumpad);

    const merged = mergeManipulators(gen.rules[0].manipulators, existing, gen.managedFromKeys);

    // n_esc: 新しいmanipulatorで上書き (1件)
    // n_enter: managedだが0件 → 既存削除
    // caps_lock: 管理外 → 保護 (1件)
    expect(merged).toHaveLength(2);
    const fromKeys = merged.map(m => m.from.key_code).sort();
    expect(fromKeys).toEqual(['caps_lock', 'escape']);
  });
});
