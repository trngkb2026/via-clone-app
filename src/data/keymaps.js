// ===== Device Identifiers =====
export const devices = {
  numpad: { vendor_id: 9427, product_id: 12427, name: 'TENBT03 (MCO)' },
  ewin: { vendor_id: 1452, product_id: 599, name: 'Ewin X8' },
};

// ===== QMK <-> Karabiner Mappings =====
export const qmkToKarabiner = {
  'KC_A':'a', 'KC_B':'b', 'KC_C':'c', 'KC_D':'d', 'KC_E':'e', 'KC_F':'f', 'KC_G':'g', 'KC_H':'h', 'KC_I':'i', 'KC_J':'j', 'KC_K':'k', 'KC_L':'l', 'KC_M':'m', 'KC_N':'n', 'KC_O':'o', 'KC_P':'p', 'KC_Q':'q', 'KC_R':'r', 'KC_S':'s', 'KC_T':'t', 'KC_U':'u', 'KC_V':'v', 'KC_W':'w', 'KC_X':'x', 'KC_Y':'y', 'KC_Z':'z',
  'KC_1':'1', 'KC_2':'2', 'KC_3':'3', 'KC_4':'4', 'KC_5':'5', 'KC_6':'6', 'KC_7':'7', 'KC_8':'8', 'KC_9':'9', 'KC_0':'0',
  'KC_KP1':'keypad_1', 'KC_KP2':'keypad_2', 'KC_KP3':'keypad_3', 'KC_KP4':'keypad_4', 'KC_KP5':'keypad_5',
  'KC_KP6':'keypad_6', 'KC_KP7':'keypad_7', 'KC_KP8':'keypad_8', 'KC_KP9':'keypad_9', 'KC_KP0':'keypad_0',
  'KC_ENTER':'return_or_enter', 'KC_ESCAPE':'escape', 'KC_BSPACE':'delete_or_backspace', 'KC_TAB':'tab', 'KC_SPACE':'spacebar',
  'KC_MINUS':'hyphen', 'KC_EQUAL':'equal_sign', 'KC_LBRC':'open_bracket', 'KC_RBRC':'close_bracket', 'KC_SCOLON':'semicolon', 'KC_QUOTE':'quote', 'KC_GRV':'grave_accent_and_tilde', 'KC_COMM':'comma', 'KC_DOT':'period', 'KC_SLSH':'slash',
  'KC_UP':'up_arrow', 'KC_DOWN':'down_arrow', 'KC_LEFT':'left_arrow', 'KC_RIGHT':'right_arrow',
  'KC_PGUP':'page_up', 'KC_PGDN':'page_down', 'KC_HOME':'home', 'KC_END':'end', 'KC_DELETE':'delete_forward', 'KC_INSERT':'insert',
  'KC_LCTRL':'left_control', 'KC_LSHIFT':'left_shift', 'KC_LALT':'left_option', 'KC_LGUI':'left_command',
  'KC_RCTRL':'right_control', 'KC_RSHIFT':'right_shift', 'KC_RALT':'right_option', 'KC_RGUI':'right_command',
  'KC_MUTE':'mute', 'KC_VOLU':'volume_increment', 'KC_VOLD':'volume_decrement', 'KC_MPLY':'play_or_pause', 'KC_MSTP':'stop', 'KC_MPRV':'rewind', 'KC_MNXT':'fastforward',
  'KC_JYEN':'international3', 'KC_RO':'international1',
  'KC_F1':'f1', 'KC_F2':'f2', 'KC_F3':'f3', 'KC_F4':'f4', 'KC_F5':'f5', 'KC_F6':'f6',
  'KC_F7':'f7', 'KC_F8':'f8', 'KC_F9':'f9', 'KC_F10':'f10', 'KC_F11':'f11', 'KC_F12':'f12',
  'KC_F13':'f13', 'KC_F14':'f14', 'KC_F15':'f15', 'KC_F16':'f16', 'KC_F17':'f17', 'KC_F18':'f18', 'KC_F19':'f19', 'KC_F20':'f20',
  'KC_FN':'fn',
};

export const karabinerToQmk = Object.fromEntries(
  Object.entries(qmkToKarabiner).map(([qmk, kb]) => [kb, qmk])
);

// ===== Physical key → Karabiner from (what the device sends to the OS) =====
export const keyIdToKarabinerFrom = {
  numpad: {
    n_esc: { key_code: 'escape' },
    n_f2: { key_code: 'f2' },
    n_f4: { key_code: 'f4' },
    n_num: { key_code: 'keypad_num_lock' },
    n_lp: { key_code: '8', modifiers: { mandatory: ['shift'], optional: ['caps_lock'] } },
    n_rp: { key_code: '9', modifiers: { mandatory: ['shift'], optional: ['caps_lock'] } },
    n_del: { key_code: 'delete_forward' },
    // n_hz: vendor-specific HID (Report ID 17) - Karabiner cannot remap
    n_alt: { key_code: 'left_option' },
    n_ctrl: { key_code: 'left_control' },
    n_eq: { key_code: 'equal_sign' },
    n_div: { key_code: 'keypad_slash' },
    n_mul: { key_code: 'keypad_asterisk' },
    n_bs: { key_code: 'delete_or_backspace' },
    n_fn: null,
    n_shift: { key_code: 'left_shift' },
    n_tab: { key_code: 'tab' },
    n_7: { key_code: 'keypad_7' }, n_8: { key_code: 'keypad_8' }, n_9: { key_code: 'keypad_9' },
    n_min: { key_code: 'keypad_hyphen' },
    n_up: { key_code: 'up_arrow' },
    n_4: { key_code: 'keypad_4' }, n_5: { key_code: 'keypad_5' }, n_6: { key_code: 'keypad_6' },
    n_plus: { key_code: 'keypad_plus' },
    n_left: { key_code: 'left_arrow' }, n_down: { key_code: 'down_arrow' }, n_right: { key_code: 'right_arrow' },
    n_1: { key_code: 'keypad_1' }, n_2: { key_code: 'keypad_2' }, n_3: { key_code: 'keypad_3' },
    n_enter: { key_code: 'keypad_enter' },
    n_0: { key_code: 'keypad_0' },
    n_00: null,
    n_dot: { key_code: 'keypad_period' },
  },
  ewin: {
    e_esc: { key_code: 'escape' },
    e_1: { key_code: '1' }, e_2: { key_code: '2' }, e_3: { key_code: '3' },
    e_4: { key_code: '4' }, e_5: { key_code: '5' }, e_6: { key_code: '6' },
    e_7: { key_code: '7' }, e_8: { key_code: '8' }, e_9: { key_code: '9' },
    e_0: { key_code: '0' }, e_yen: { key_code: 'international3' },
    e_tab: { key_code: 'tab' },
    e_q: { key_code: 'q' }, e_w: { key_code: 'w' }, e_e: { key_code: 'e' },
    e_r: { key_code: 'r' }, e_t: { key_code: 't' }, e_y: { key_code: 'y' },
    e_u: { key_code: 'u' }, e_i: { key_code: 'i' }, e_o: { key_code: 'o' },
    e_p: { key_code: 'p' }, e_bs: { key_code: 'delete_or_backspace' },
    e_caps: { key_code: 'caps_lock', modifiers: { optional: ['any'] } },
    e_a: { key_code: 'a' }, e_s: { key_code: 's' }, e_d: { key_code: 'd' },
    e_f: { key_code: 'f' }, e_g: { key_code: 'g' }, e_h: { key_code: 'h' },
    e_j: { key_code: 'j' }, e_k: { key_code: 'k' }, e_l: { key_code: 'l' },
    e_enter: { key_code: 'return_or_enter' },
    e_plus: { key_code: 'keypad_plus' },
    e_shift: { key_code: 'left_shift' },
    e_z: { key_code: 'z' }, e_x: { key_code: 'x' }, e_c: { key_code: 'c' },
    e_v: { key_code: 'v' }, e_b: { key_code: 'b' }, e_n: { key_code: 'n' },
    e_m: { key_code: 'm' }, e_lt: { key_code: 'comma' }, e_gt: { key_code: 'period' },
    e_slash: { key_code: 'slash' }, e_ro: { key_code: 'international1' },
    e_ctrl: { key_code: 'left_control' },
    e_fn: null,
    e_eq: { key_code: 'equal_sign' }, e_tilde: { key_code: 'grave_accent_and_tilde' },
    e_opt: { key_code: 'left_option' }, e_space: { key_code: 'spacebar' },
    e_cmd: { key_code: 'left_command' }, e_alt: { key_code: 'right_option' },
    e_at: null, e_lbr: { key_code: 'open_bracket' }, e_ast: null,
  }
};

// ===== Current Karabiner Config (pre-loaded from ~/.config/karabiner/karabiner.json) =====
export const currentNumpadConfig = {
  n_esc: { type: 'consumer', consumer_key_code: 'dictation', label: '🎤Dict' },
  n_f2: { type: 'system', key_code: 'f13', label: 'F13' },
  n_f4: { type: 'combo', key_code: 'f13', modifiers: ['shift'], label: '⇧F13' },
  n_lp: { type: 'combo', key_code: 'x', modifiers: ['command', 'right_shift'], label: '1Pass' },
  n_rp: { type: 'combo', key_code: 'h', modifiers: ['command', 'shift', 'option'], label: '⌘⇧⌥H' },
  n_min: { type: 'combo', key_code: 'comma', modifiers: ['command'], label: '⌘,' },
  n_dot: { type: 'sequence', keys: [
    { key_code: 'japanese_eisuu' }, { key_code: 'comma' }, { key_code: 'japanese_kana' }
  ], label: '英,か' },
  n_enter: 'KC_SPACE',
  n_plus: { type: 'combo', key_code: 'c', modifiers: ['control'], label: '⌃C' },
  n_del: { type: 'sequence', keys: [
    { key_code: 'spacebar' }, { key_code: 'spacebar' },
    { key_code: 'spacebar' }, { key_code: 'spacebar' },
    { key_code: 'return_or_enter' }
  ], label: 'Sp×4⏎' },
  n_div: { type: 'combo', key_code: 'return_or_enter', modifiers: ['command'], label: '⌘⏎' },
};

export const currentEwinConfig = {
  e_caps: { type: 'system', key_code: 'japanese_eisuu', label: '英数' },
};

// ===== Default Keymaps (physical defaults without Karabiner remapping) =====
export const initNumpad = {
  n_esc: 'KC_ESCAPE', n_f2: 'KC_F2', n_f4: 'KC_F4', n_num: 'KC_NUM', n_lp: 'KC_LPRN', n_rp: 'KC_RPRN', n_del: 'KC_DELETE',
  n_alt: 'KC_LALT', n_ctrl: 'KC_LCTRL', n_eq: 'KC_EQUAL', n_div: 'KC_SLSH', n_mul: 'KC_AST', n_bs: 'KC_BSPACE',
  n_fn: 'KC_FN', n_shift: 'KC_LSHIFT', n_tab: 'KC_TAB', n_7: 'KC_7', n_8: 'KC_8', n_9: 'KC_9', n_min: 'KC_MINUS',
  n_up: 'KC_UP', n_4: 'KC_4', n_5: 'KC_5', n_6: 'KC_6', n_plus: 'KC_PLUS',
  n_left: 'KC_LEFT', n_down: 'KC_DOWN', n_right: 'KC_RIGHT', n_1: 'KC_1', n_2: 'KC_2', n_3: 'KC_3', n_enter: 'KC_ENTER',
  n_0: 'KC_0', n_00: 'KC_00', n_dot: 'KC_DOT'
};

export const initEwin = {
  e_esc: 'KC_ESCAPE', e_1: 'KC_1', e_2: 'KC_2', e_3: 'KC_3', e_4: 'KC_4', e_5: 'KC_5', e_6: 'KC_6', e_7: 'KC_7', e_8: 'KC_8', e_9: 'KC_9', e_0: 'KC_0', e_yen: 'KC_JYEN',
  e_tab: 'KC_TAB', e_q: 'KC_Q', e_w: 'KC_W', e_e: 'KC_E', e_r: 'KC_R', e_t: 'KC_T', e_y: 'KC_Y', e_u: 'KC_U', e_i: 'KC_I', e_o: 'KC_O', e_p: 'KC_P', e_bs: 'KC_BSPACE',
  e_caps: 'KC_CAPS', e_a: 'KC_A', e_s: 'KC_S', e_d: 'KC_D', e_f: 'KC_F', e_g: 'KC_G', e_h: 'KC_H', e_j: 'KC_J', e_k: 'KC_K', e_l: 'KC_L', e_plus: 'KC_PLUS', e_enter: 'KC_ENTER',
  e_shift: 'KC_LSHIFT', e_z: 'KC_Z', e_x: 'KC_X', e_c: 'KC_C', e_v: 'KC_V', e_b: 'KC_B', e_n: 'KC_N', e_m: 'KC_M', e_lt: 'KC_COMM', e_gt: 'KC_DOT', e_slash: 'KC_SLSH', e_ro: 'KC_RO',
  e_ctrl: 'KC_LCTRL', e_fn: 'KC_FN', e_eq: 'KC_EQUAL', e_tilde: 'KC_GRV', e_opt: 'KC_LALT', e_space: 'KC_SPACE', e_cmd: 'KC_LGUI', e_alt: 'KC_RALT', e_at: 'KC_AT', e_lbr: 'KC_LBRC', e_ast: 'KC_AST'
};

// ===== Key Layout Definitions =====
export const numpadKeys = [
  { id: 'n_esc', x: 50, y: 50, w: 60, h: 60, orig: 'ESC' }, { id: 'n_f2', x: 130, y: 50, w: 60, h: 60, orig: 'F2' }, { id: 'n_f4', x: 210, y: 50, w: 60, h: 60, orig: 'F4' },
  { id: 'n_hz', x: 50, y: 130, w: 60, h: 60, orig: '半/全', disabled: true }, { id: 'n_alt', x: 130, y: 130, w: 60, h: 60, orig: 'Alt' }, { id: 'n_ctrl', x: 210, y: 130, w: 60, h: 60, orig: 'Ctrl' },
  { id: 'n_fn', x: 50, y: 210, w: 60, h: 60, orig: 'FN', disabled: true }, { id: 'n_shift', x: 130, y: 210, w: 60, h: 60, orig: 'Shift' }, { id: 'n_tab', x: 210, y: 210, w: 60, h: 60, orig: 'Tab' },
  { id: 'n_up', x: 130, y: 370, w: 60, h: 60, orig: '↑' }, { id: 'n_left', x: 50, y: 450, w: 60, h: 60, orig: '←' }, { id: 'n_down', x: 130, y: 450, w: 60, h: 60, orig: '↓' }, { id: 'n_right', x: 210, y: 450, w: 60, h: 60, orig: '→' },
  { id: 'n_num', x: 320, y: 50, w: 60, h: 60, orig: 'NUM' }, { id: 'n_lp', x: 400, y: 50, w: 60, h: 60, orig: '(' }, { id: 'n_rp', x: 480, y: 50, w: 60, h: 60, orig: ')' }, { id: 'n_del', x: 560, y: 50, w: 60, h: 60, orig: 'DEL' },
  { id: 'n_eq', x: 320, y: 130, w: 60, h: 60, orig: '=' }, { id: 'n_div', x: 400, y: 130, w: 60, h: 60, orig: '/' }, { id: 'n_mul', x: 480, y: 130, w: 60, h: 60, orig: '*' }, { id: 'n_bs', x: 560, y: 130, w: 60, h: 60, orig: 'BS' },
  { id: 'n_7', x: 320, y: 210, w: 60, h: 60, orig: '7' }, { id: 'n_8', x: 400, y: 210, w: 60, h: 60, orig: '8' }, { id: 'n_9', x: 480, y: 210, w: 60, h: 60, orig: '9' }, { id: 'n_min', x: 560, y: 210, w: 60, h: 60, orig: '-' },
  { id: 'n_4', x: 320, y: 290, w: 60, h: 60, orig: '4' }, { id: 'n_5', x: 400, y: 290, w: 60, h: 60, orig: '5' }, { id: 'n_6', x: 480, y: 290, w: 60, h: 60, orig: '6' }, { id: 'n_plus', x: 560, y: 290, w: 60, h: 60, orig: '+' },
  { id: 'n_1', x: 320, y: 370, w: 60, h: 60, orig: '1' }, { id: 'n_2', x: 400, y: 370, w: 60, h: 60, orig: '2' }, { id: 'n_3', x: 480, y: 370, w: 60, h: 60, orig: '3' }, { id: 'n_enter', x: 560, y: 370, w: 60, h: 140, orig: 'Ent' },
  { id: 'n_0', x: 320, y: 450, w: 60, h: 60, orig: '0' }, { id: 'n_00', x: 400, y: 450, w: 60, h: 60, orig: '00', disabled: true }, { id: 'n_dot', x: 480, y: 450, w: 60, h: 60, orig: '.' },
];

export const ewinKeys = [
  { id: 'e_esc', x: 60, y: 270, w: 46, h: 34, orig: 'Esc' }, { id: 'e_1', x: 112, y: 270, w: 46, h: 34, orig: '1' }, { id: 'e_2', x: 164, y: 270, w: 46, h: 34, orig: '2' }, { id: 'e_3', x: 216, y: 270, w: 46, h: 34, orig: '3' }, { id: 'e_4', x: 268, y: 270, w: 46, h: 34, orig: '4' }, { id: 'e_5', x: 320, y: 270, w: 46, h: 34, orig: '5' }, { id: 'e_6', x: 372, y: 270, w: 46, h: 34, orig: '6' }, { id: 'e_7', x: 424, y: 270, w: 46, h: 34, orig: '7' }, { id: 'e_8', x: 476, y: 270, w: 46, h: 34, orig: '8' }, { id: 'e_9', x: 528, y: 270, w: 46, h: 34, orig: '9' }, { id: 'e_0', x: 580, y: 270, w: 46, h: 34, orig: '0' }, { id: 'e_yen', x: 632, y: 270, w: 68, h: 34, orig: '¥' },
  { id: 'e_tab', x: 60, y: 310, w: 56, h: 34, orig: 'Tab' }, { id: 'e_q', x: 122, y: 310, w: 46, h: 34, orig: 'Q' }, { id: 'e_w', x: 174, y: 310, w: 46, h: 34, orig: 'W' }, { id: 'e_e', x: 226, y: 310, w: 46, h: 34, orig: 'E' }, { id: 'e_r', x: 278, y: 310, w: 46, h: 34, orig: 'R' }, { id: 'e_t', x: 330, y: 310, w: 46, h: 34, orig: 'T' }, { id: 'e_y', x: 382, y: 310, w: 46, h: 34, orig: 'Y' }, { id: 'e_u', x: 434, y: 310, w: 46, h: 34, orig: 'U' }, { id: 'e_i', x: 486, y: 310, w: 46, h: 34, orig: 'I' }, { id: 'e_o', x: 538, y: 310, w: 46, h: 34, orig: 'O' }, { id: 'e_p', x: 590, y: 310, w: 46, h: 34, orig: 'P' }, { id: 'e_bs', x: 642, y: 310, w: 58, h: 34, orig: 'BACK' },
  { id: 'e_caps', x: 60, y: 350, w: 66, h: 34, orig: 'Caps' }, { id: 'e_a', x: 132, y: 350, w: 46, h: 34, orig: 'A' }, { id: 'e_s', x: 184, y: 350, w: 46, h: 34, orig: 'S' }, { id: 'e_d', x: 236, y: 350, w: 46, h: 34, orig: 'D' }, { id: 'e_f', x: 288, y: 350, w: 46, h: 34, orig: 'F' }, { id: 'e_g', x: 340, y: 350, w: 46, h: 34, orig: 'G' }, { id: 'e_h', x: 392, y: 350, w: 46, h: 34, orig: 'H' }, { id: 'e_j', x: 444, y: 350, w: 46, h: 34, orig: 'J' }, { id: 'e_k', x: 496, y: 350, w: 46, h: 34, orig: 'K' }, { id: 'e_l', x: 548, y: 350, w: 46, h: 34, orig: 'L' }, { id: 'e_plus', x: 600, y: 350, w: 46, h: 34, orig: '+' }, { id: 'e_enter', x: 652, y: 350, w: 48, h: 34, orig: 'Ent' },
  { id: 'e_shift', x: 60, y: 390, w: 76, h: 34, orig: 'Shift' }, { id: 'e_z', x: 142, y: 390, w: 46, h: 34, orig: 'Z' }, { id: 'e_x', x: 194, y: 390, w: 46, h: 34, orig: 'X' }, { id: 'e_c', x: 246, y: 390, w: 46, h: 34, orig: 'C' }, { id: 'e_v', x: 298, y: 390, w: 46, h: 34, orig: 'V' }, { id: 'e_b', x: 350, y: 390, w: 46, h: 34, orig: 'B' }, { id: 'e_n', x: 402, y: 390, w: 46, h: 34, orig: 'N' }, { id: 'e_m', x: 454, y: 390, w: 46, h: 34, orig: 'M' }, { id: 'e_lt', x: 506, y: 390, w: 46, h: 34, orig: '<' }, { id: 'e_gt', x: 558, y: 390, w: 46, h: 34, orig: '>' }, { id: 'e_slash', x: 610, y: 390, w: 46, h: 34, orig: '?' }, { id: 'e_ro', x: 662, y: 390, w: 38, h: 34, orig: '}' },
  { id: 'e_ctrl', x: 60, y: 430, w: 46, h: 34, orig: 'Ctrl' }, { id: 'e_fn', x: 112, y: 430, w: 46, h: 34, orig: 'Fn' }, { id: 'e_eq', x: 164, y: 430, w: 46, h: 34, orig: '=' }, { id: 'e_tilde', x: 216, y: 430, w: 46, h: 34, orig: '~' }, { id: 'e_opt', x: 268, y: 430, w: 56, h: 34, orig: 'Opt' }, { id: 'e_space', x: 330, y: 430, w: 134, h: 34, orig: 'Space' }, { id: 'e_cmd', x: 470, y: 430, w: 46, h: 34, orig: 'Cmd' }, { id: 'e_alt', x: 522, y: 430, w: 46, h: 34, orig: 'Alt' }, { id: 'e_at', x: 574, y: 430, w: 46, h: 34, orig: '@' }, { id: 'e_lbr', x: 626, y: 430, w: 46, h: 34, orig: '{' }, { id: 'e_ast', x: 678, y: 430, w: 46, h: 34, orig: '*' },
];

// ===== Keycode Categories (3 tabs) =====
export const keycodes = {
  Basic: [
    // --- Letters ---
    { id: 'sec_letters', section: 'Letters' },
    ...Array.from({length: 26}, (_, i) => ({ id: `letter_${i}`, code: `KC_${String.fromCharCode(65+i)}`, label: String.fromCharCode(65+i) })),
    // --- Numbers (tenkey = IME bypass, always half-width) ---
    { id: 'sec_numbers', section: 'Numbers (Tenkey)' },
    ...Array.from({length: 9}, (_, i) => ({ id: `kp_${i+1}`, code: `KC_KP${i+1}`, label: `${i+1}` })),
    { id: 'kp_0', code: 'KC_KP0', label: '0' },
    // --- Whitespace ---
    { id: 'sec_whitespace', section: 'Whitespace' },
    { id: 'b_enter', code: 'KC_ENTER', label: 'Enter' }, { id: 'b_space', code: 'KC_SPACE', label: 'Space' },
    { id: 'b_tab', code: 'KC_TAB', label: 'Tab' }, { id: 'b_esc', code: 'KC_ESCAPE', label: 'Esc' },
    { id: 'b_bs', code: 'KC_BSPACE', label: 'Backspc' },
    // --- Symbols ---
    { id: 'sec_symbols', section: 'Symbols' },
    { id: 'b_minus', code: 'KC_MINUS', label: '-' }, { id: 'b_equal', code: 'KC_EQUAL', label: '=' },
    { id: 'b_lbrc', code: 'KC_LBRC', label: '[' }, { id: 'b_rbrc', code: 'KC_RBRC', label: ']' },
    { id: 'b_bslash', code: 'KC_BSLASH', label: '\\' }, { id: 'b_scolon', code: 'KC_SCOLON', label: ';' },
    { id: 'b_quote', code: 'KC_QUOTE', label: '\'' }, { id: 'b_grv', code: 'KC_GRV', label: '`' },
    { id: 'b_comm', code: 'KC_COMM', label: ',' }, { id: 'b_dot', code: 'KC_DOT', label: '.' },
    { id: 'b_slsh', code: 'KC_SLSH', label: '/' },
    // --- Navigation ---
    { id: 'sec_nav', section: 'Navigation' },
    { id: 'b_up', code: 'KC_UP', label: '↑' }, { id: 'b_down', code: 'KC_DOWN', label: '↓' },
    { id: 'b_left', code: 'KC_LEFT', label: '←' }, { id: 'b_right', code: 'KC_RIGHT', label: '→' },
    { id: 'b_pgup', code: 'KC_PGUP', label: 'PgUp' }, { id: 'b_pgdn', code: 'KC_PGDN', label: 'PgDn' },
    { id: 'b_home', code: 'KC_HOME', label: 'Home' }, { id: 'b_end', code: 'KC_END', label: 'End' },
    { id: 'b_del', code: 'KC_DELETE', label: 'Del' }, { id: 'b_ins', code: 'KC_INSERT', label: 'Ins' },
    // --- Modifiers ---
    { id: 'sec_modifiers', section: 'Modifiers' },
    { id: 'b_lctrl', code: 'KC_LCTRL', label: 'LCtrl' }, { id: 'b_lshift', code: 'KC_LSHIFT', label: 'LShift' },
    { id: 'b_lalt', code: 'KC_LALT', label: 'LAlt/Opt' }, { id: 'b_lgui', code: 'KC_LGUI', label: 'LCmd' },
    { id: 'b_rctrl', code: 'KC_RCTRL', label: 'RCtrl' }, { id: 'b_rshift', code: 'KC_RSHIFT', label: 'RShift' },
    { id: 'b_ralt', code: 'KC_RALT', label: 'RAlt/Opt' }, { id: 'b_rgui', code: 'KC_RGUI', label: 'RCmd' },
    { id: 'b_fn', code: 'KC_FN', label: 'fn' },
    // --- Function Keys ---
    { id: 'sec_fkeys', section: 'Function Keys' },
    ...Array.from({length: 20}, (_, i) => ({ id: `fkey_${i+1}`, code: `KC_F${i+1}`, label: `F${i+1}` })),
    // --- Media ---
    { id: 'sec_media', section: 'Media' },
    { id: 'b_mute', code: 'KC_MUTE', label: 'Mute' }, { id: 'b_volu', code: 'KC_VOLU', label: 'Vol+' }, { id: 'b_vold', code: 'KC_VOLD', label: 'Vol-' },
    { id: 'b_play', code: 'KC_MPLY', label: 'Play' }, { id: 'b_stop', code: 'KC_MSTP', label: 'Stop' },
    { id: 'b_prev', code: 'KC_MPRV', label: 'Prev' }, { id: 'b_next', code: 'KC_MNXT', label: 'Next' },
    // --- System ---
    { id: 'sec_system', section: 'System' },
    { id: 'dictation', code: { type: 'consumer', consumer_key_code: 'dictation', label: '🎤Dict' }, label: '🎤 Dictation' },
    { id: 'eisuu', code: { type: 'system', key_code: 'japanese_eisuu', label: '英数' }, label: '英数' },
    { id: 'kana', code: { type: 'system', key_code: 'japanese_kana', label: 'かな' }, label: 'かな' },
    { id: 'print_screen', code: { type: 'system', key_code: 'print_screen', label: 'PrtSc' }, label: 'PrintScreen' },
    { id: 'mission_ctrl', code: { type: 'system', key_code: 'mission_control', label: 'Mission' }, label: 'Mission Ctrl' },
    { id: 'launchpad', code: { type: 'system', key_code: 'launchpad', label: 'Launchpad' }, label: 'Launchpad' },
    { id: 'app_windows', code: { type: 'shell', shell_command: "osascript -e 'tell application \"System Events\" to key code 125 using control down'", label: '⌃↓AppWin' }, label: '⌃↓ App Windows' },
    { id: 'expose_desktop', code: { type: 'shell', shell_command: "osascript -e 'tell application \"System Events\" to key code 103'", label: 'Desktop' }, label: '🖥 Show Desktop' },
    { id: 'bright_up', code: { type: 'consumer', consumer_key_code: 'display_brightness_increment', label: '🔆+' }, label: '🔆 Bright+' },
    { id: 'bright_down', code: { type: 'consumer', consumer_key_code: 'display_brightness_decrement', label: '🔅-' }, label: '🔅 Bright-' },
    { id: 'globe_fn', code: { type: 'apple_vendor', apple_vendor_top_case_key_code: 'keyboard_fn', label: '🌐fn' }, label: '🌐 fn (Globe)' },
    // --- Misc ---
    { id: 'sec_misc', section: 'Misc' },
    { id: 'sp_none', code: 'KC_NONE', label: 'None' }, { id: 'sp_trns', code: 'KC_TRNS', label: 'Trans' },
    { id: 'sp_num', code: 'KC_NUM', label: 'NumLk' }, { id: 'sp_caps', code: 'KC_CAPS', label: 'CapsLk' },
  ],
  Shortcuts: [
    { id: 'cmd_c', code: { type: 'combo', key_code: 'c', modifiers: ['command'], label: '⌘C' }, label: '⌘C Copy' },
    { id: 'cmd_v', code: { type: 'combo', key_code: 'v', modifiers: ['command'], label: '⌘V' }, label: '⌘V Paste' },
    { id: 'cmd_x', code: { type: 'combo', key_code: 'x', modifiers: ['command'], label: '⌘X' }, label: '⌘X Cut' },
    { id: 'cmd_z', code: { type: 'combo', key_code: 'z', modifiers: ['command'], label: '⌘Z' }, label: '⌘Z Undo' },
    { id: 'cmd_shift_z', code: { type: 'combo', key_code: 'z', modifiers: ['command', 'shift'], label: '⌘⇧Z' }, label: '⌘⇧Z Redo' },
    { id: 'cmd_s', code: { type: 'combo', key_code: 's', modifiers: ['command'], label: '⌘S' }, label: '⌘S Save' },
    { id: 'cmd_a', code: { type: 'combo', key_code: 'a', modifiers: ['command'], label: '⌘A' }, label: '⌘A All' },
    { id: 'cmd_f', code: { type: 'combo', key_code: 'f', modifiers: ['command'], label: '⌘F' }, label: '⌘F Find' },
    { id: 'cmd_w', code: { type: 'combo', key_code: 'w', modifiers: ['command'], label: '⌘W' }, label: '⌘W Close' },
    { id: 'cmd_t', code: { type: 'combo', key_code: 't', modifiers: ['command'], label: '⌘T' }, label: '⌘T Tab' },
    { id: 'cmd_n', code: { type: 'combo', key_code: 'n', modifiers: ['command'], label: '⌘N' }, label: '⌘N New' },
    { id: 'cmd_q', code: { type: 'combo', key_code: 'q', modifiers: ['command'], label: '⌘Q' }, label: '⌘Q Quit' },
    { id: 'cmd_enter', code: { type: 'combo', key_code: 'return_or_enter', modifiers: ['command'], label: '⌘⏎' }, label: '⌘⏎ Send' },
    { id: 'cmd_comma', code: { type: 'combo', key_code: 'comma', modifiers: ['command'], label: '⌘,' }, label: '⌘, Settings' },
    { id: 'cmd_l', code: { type: 'combo', key_code: 'l', modifiers: ['command'], label: '⌘L' }, label: '⌘L URL' },
    { id: 'cmd_r', code: { type: 'combo', key_code: 'r', modifiers: ['command'], label: '⌘R' }, label: '⌘R Reload' },
    { id: 'cmd_space', code: { type: 'combo', key_code: 'spacebar', modifiers: ['command'], label: '⌘Space' }, label: '⌘Space Spot' },
    { id: 'cmd_tab', code: { type: 'combo', key_code: 'tab', modifiers: ['command'], label: '⌘Tab' }, label: '⌘Tab Switch' },
    { id: 'ctrl_c', code: { type: 'combo', key_code: 'c', modifiers: ['control'], label: '⌃C' }, label: '⌃C SIGINT' },
    { id: 'cmd_rshift_x', code: { type: 'combo', key_code: 'x', modifiers: ['command', 'right_shift'], label: '1Pass' }, label: '1Password' },
    { id: 'cmd_shift_opt_h', code: { type: 'combo', key_code: 'h', modifiers: ['command', 'shift', 'option'], label: '⌘⇧⌥H' }, label: '⌘⇧⌥H' },
  ],
  Sequence: [
    // Presets
    { id: 'sec_presets', section: 'Presets' },
    { id: 'sp4_enter', code: { type: 'sequence', keys: [
      { key_code: 'spacebar' }, { key_code: 'spacebar' }, { key_code: 'spacebar' }, { key_code: 'spacebar' }, { key_code: 'return_or_enter' }
    ], label: 'Sp×4⏎' }, label: 'Space×4+Enter' },
    { id: 'eisuu_comma_kana', code: { type: 'sequence', keys: [
      { key_code: 'japanese_eisuu' }, { key_code: 'comma' }, { key_code: 'japanese_kana' }
    ], label: '英,か' }, label: '英数→,→かな' },
    { id: 'triple_enter', code: { type: 'sequence', keys: [
      { key_code: 'return_or_enter' }, { key_code: 'return_or_enter' }, { key_code: 'return_or_enter' }
    ], label: '⏎×3' }, label: 'Enter×3' },
  ],
};

// ===== KeyboardEvent.code → Karabiner key_code =====
export const eventCodeToKarabiner = {
  'KeyA':'a','KeyB':'b','KeyC':'c','KeyD':'d','KeyE':'e','KeyF':'f','KeyG':'g','KeyH':'h',
  'KeyI':'i','KeyJ':'j','KeyK':'k','KeyL':'l','KeyM':'m','KeyN':'n','KeyO':'o','KeyP':'p',
  'KeyQ':'q','KeyR':'r','KeyS':'s','KeyT':'t','KeyU':'u','KeyV':'v','KeyW':'w','KeyX':'x',
  'KeyY':'y','KeyZ':'z',
  'Digit1':'1','Digit2':'2','Digit3':'3','Digit4':'4','Digit5':'5',
  'Digit6':'6','Digit7':'7','Digit8':'8','Digit9':'9','Digit0':'0',
  'Numpad1':'keypad_1','Numpad2':'keypad_2','Numpad3':'keypad_3','Numpad4':'keypad_4','Numpad5':'keypad_5',
  'Numpad6':'keypad_6','Numpad7':'keypad_7','Numpad8':'keypad_8','Numpad9':'keypad_9','Numpad0':'keypad_0',
  'Enter':'return_or_enter','NumpadEnter':'keypad_enter',
  'Escape':'escape','Backspace':'delete_or_backspace','Tab':'tab','Space':'spacebar',
  'Minus':'hyphen','Equal':'equal_sign','BracketLeft':'open_bracket','BracketRight':'close_bracket',
  'Backslash':'backslash','Semicolon':'semicolon','Quote':'quote','Backquote':'grave_accent_and_tilde',
  'Comma':'comma','Period':'period','Slash':'slash',
  'ArrowUp':'up_arrow','ArrowDown':'down_arrow','ArrowLeft':'left_arrow','ArrowRight':'right_arrow',
  'PageUp':'page_up','PageDown':'page_down','Home':'home','End':'end',
  'Delete':'delete_forward','Insert':'insert',
  'F1':'f1','F2':'f2','F3':'f3','F4':'f4','F5':'f5','F6':'f6',
  'F7':'f7','F8':'f8','F9':'f9','F10':'f10','F11':'f11','F12':'f12',
  'F13':'f13','F14':'f14','F15':'f15','F16':'f16','F17':'f17','F18':'f18','F19':'f19','F20':'f20',
  'CapsLock':'caps_lock','NumLock':'keypad_num_lock',
  'NumpadDivide':'keypad_slash','NumpadMultiply':'keypad_asterisk',
  'NumpadSubtract':'keypad_hyphen','NumpadAdd':'keypad_plus','NumpadDecimal':'keypad_period',
  'IntlRo':'international1','IntlYen':'international3',
};

export const karabinerKeyLabel = {
  'a':'A','b':'B','c':'C','d':'D','e':'E','f':'F','g':'G','h':'H','i':'I','j':'J','k':'K','l':'L','m':'M',
  'n':'N','o':'O','p':'P','q':'Q','r':'R','s':'S','t':'T','u':'U','v':'V','w':'W','x':'X','y':'Y','z':'Z',
  '1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0',
  'keypad_1':'KP1','keypad_2':'KP2','keypad_3':'KP3','keypad_4':'KP4','keypad_5':'KP5',
  'keypad_6':'KP6','keypad_7':'KP7','keypad_8':'KP8','keypad_9':'KP9','keypad_0':'KP0',
  'return_or_enter':'Ent','keypad_enter':'KPEnt','escape':'Esc','delete_or_backspace':'Back',
  'tab':'Tab','spacebar':'Space','hyphen':'-','equal_sign':'=',
  'open_bracket':'[','close_bracket':']','backslash':'\\','semicolon':';','quote':"'",'grave_accent_and_tilde':'`',
  'comma':',','period':'.','slash':'/',
  'up_arrow':'↑','down_arrow':'↓','left_arrow':'←','right_arrow':'→',
  'page_up':'PgUp','page_down':'PgDn','home':'Home','end':'End',
  'delete_forward':'Del','insert':'Ins','caps_lock':'Caps',
  'f1':'F1','f2':'F2','f3':'F3','f4':'F4','f5':'F5','f6':'F6','f7':'F7','f8':'F8','f9':'F9','f10':'F10',
  'f11':'F11','f12':'F12','f13':'F13','f14':'F14','f15':'F15','f16':'F16',
  'international1':'ろ','international3':'¥',
  'fn':'fn',
};

// ===== Display Helpers =====
export const getDisplayLabel = (code) => {
  if (!code) return '';
  if (typeof code === 'object') return code.label || '???';
  const overrides = {
    'KC_ENTER': 'Ent', 'KC_ESCAPE': 'Esc', 'KC_BSPACE': 'Back', 'KC_SPACE': 'Space',
    'KC_LSHIFT': 'Shift', 'KC_LCTRL': 'Ctrl', 'KC_LALT': 'Alt', 'KC_LGUI': 'Cmd',
    'KC_RSHIFT': 'R-Shf', 'KC_RCTRL': 'R-Ctl', 'KC_RALT': 'R-Alt', 'KC_RGUI': 'R-Cmd',
    'KC_VOLU': 'Vol+', 'KC_VOLD': 'Vol-', 'KC_MUTE': 'Mute',
    'KC_MNXT': 'Next', 'KC_MPRV': 'Prev', 'KC_MPLY': 'Play',
    'KC_UP': '↑', 'KC_DOWN': '↓', 'KC_LEFT': '←', 'KC_RIGHT': '→',
    'KC_MINUS': '-', 'KC_EQUAL': '=', 'KC_LBRC': '[', 'KC_RBRC': ']', 'KC_BSLASH': '\\',
    'KC_SCOLON': ';', 'KC_QUOTE': '\'', 'KC_GRV': '`', 'KC_COMM': ',', 'KC_DOT': '.', 'KC_SLSH': '/',
    'KC_DELETE': 'Del', 'KC_INSERT': 'Ins', 'KC_JYEN': '¥', 'KC_RO': 'ろ', 'KC_NONE': ' ', 'KC_TRNS': '▽', 'KC_FN': 'fn',
    'KC_F1': 'F1', 'KC_F2': 'F2', 'KC_F3': 'F3', 'KC_F4': 'F4', 'KC_F5': 'F5', 'KC_F6': 'F6',
    'KC_F7': 'F7', 'KC_F8': 'F8', 'KC_F9': 'F9', 'KC_F10': 'F10', 'KC_F11': 'F11', 'KC_F12': 'F12',
    'KC_F13': 'F13', 'KC_F14': 'F14', 'KC_F15': 'F15', 'KC_F16': 'F16',
    'KC_KP1': '1', 'KC_KP2': '2', 'KC_KP3': '3', 'KC_KP4': '4', 'KC_KP5': '5',
    'KC_KP6': '6', 'KC_KP7': '7', 'KC_KP8': '8', 'KC_KP9': '9', 'KC_KP0': '0',
  };
  return overrides[code] || code.replace('KC_', '');
};

export const getMappingType = (code) => {
  if (!code || typeof code === 'string') return 'simple';
  return code.type || 'simple';
};

// ===== Karabiner Config Parser (import from karabiner.json) =====
export function parseKarabinerConfig(jsonData, deviceType) {
  const device = devices[deviceType];
  const fromMap = keyIdToKarabinerFrom[deviceType];
  const result = {};

  const profile = jsonData.profiles?.[0];
  if (!profile) return result;

  const rules = profile.complex_modifications?.rules || [];

  for (const rule of rules) {
    for (const m of (rule.manipulators || [])) {
      const conditions = m.conditions || [];
      const isOurDevice = conditions.some(c =>
        c.type === 'device_if' &&
        c.identifiers?.some(id =>
          id.vendor_id === device.vendor_id && id.product_id === device.product_id
        )
      );
      if (!isOurDevice) continue;

      const fromKeyCode = m.from?.key_code;
      const fromMods = m.from?.modifiers?.mandatory || [];

      let keyId = null;
      for (const [kid, fromDef] of Object.entries(fromMap)) {
        if (!fromDef) continue;
        if (fromDef.key_code !== fromKeyCode) continue;
        const defMods = fromDef.modifiers?.mandatory || [];
        if (fromMods.length === defMods.length && fromMods.every(fm => defMods.includes(fm))) {
          keyId = kid;
          break;
        }
        if (fromMods.length === 0 && defMods.length === 0) {
          keyId = kid;
          break;
        }
      }
      if (!keyId) continue;

      const toArray = m.to || [];
      if (toArray.length === 0) continue;

      const modSymbols = { command: '⌘', shift: '⇧', option: '⌥', control: '⌃', right_shift: '⇧', left_command: '⌘' };
      const keyLabels = {
        'return_or_enter': '⏎', 'spacebar': 'Sp', 'delete_or_backspace': 'Back',
        'comma': ',', 'period': '.', 'tab': 'Tab', 'escape': 'Esc',
        'japanese_eisuu': '英数', 'japanese_kana': 'かな',
        'keypad_0': '0', 'keypad_1': '1', 'keypad_2': '2', 'keypad_3': '3',
        'keypad_4': '4', 'keypad_5': '5', 'keypad_6': '6', 'keypad_7': '7',
        'keypad_8': '8', 'keypad_9': '9', 'keypad_period': '.', 'keypad_enter': '⏎',
        'right_arrow': '→', 'left_arrow': '←', 'up_arrow': '↑', 'down_arrow': '↓',
      };

      if (toArray.length === 1) {
        const to = toArray[0];
        if (to.shell_command) {
          const shellLabels = {
            "osascript -e 'tell application \"System Events\" to key code 103'": 'Desktop',
            "osascript -e 'tell application \"System Events\" to key code 125 using control down'": '⌃↓AppWin',
          };
          result[keyId] = { type: 'shell', shell_command: to.shell_command, label: shellLabels[to.shell_command] || 'Shell' };
        } else if (to.apple_vendor_top_case_key_code) {
          const avLabels = { keyboard_fn: '🌐fn' };
          result[keyId] = { type: 'apple_vendor', apple_vendor_top_case_key_code: to.apple_vendor_top_case_key_code, label: avLabels[to.apple_vendor_top_case_key_code] || to.apple_vendor_top_case_key_code };
        } else if (to.apple_vendor_keyboard_key_code) {
          const avkLabels = { expose_desktop: 'Desktop' };
          result[keyId] = { type: 'apple_vendor_kb', apple_vendor_keyboard_key_code: to.apple_vendor_keyboard_key_code, label: avkLabels[to.apple_vendor_keyboard_key_code] || to.apple_vendor_keyboard_key_code };
        } else if (to.consumer_key_code) {
          const consumerLabels = { dictation: '🎤Dict', display_brightness_increment: '🔆+', display_brightness_decrement: '🔅-' };
          result[keyId] = { type: 'consumer', consumer_key_code: to.consumer_key_code, label: consumerLabels[to.consumer_key_code] || to.consumer_key_code };
        } else if (to.modifiers?.length > 0) {
          const modLabel = to.modifiers.map(m2 => modSymbols[m2] || m2).join('');
          const kl = keyLabels[to.key_code] || to.key_code?.toUpperCase() || '?';
          result[keyId] = { type: 'combo', key_code: to.key_code, modifiers: to.modifiers, label: `${modLabel}${kl}` };
        } else {
          const qmk = karabinerToQmk[to.key_code];
          if (qmk) {
            result[keyId] = qmk;
          } else {
            result[keyId] = { type: 'system', key_code: to.key_code, label: keyLabels[to.key_code] || to.key_code };
          }
        }
      } else {
        const parts = toArray.map(t => keyLabels[t.key_code] || t.key_code || t.consumer_key_code || t.apple_vendor_top_case_key_code || t.apple_vendor_keyboard_key_code || '?');
        const label = parts.length <= 3 ? parts.join('→') : `${parts[0]}×${parts.filter(p => p === parts[0]).length}${parts[parts.length-1] !== parts[0] ? '+' + parts[parts.length-1] : ''}`;
        result[keyId] = { type: 'sequence', keys: toArray, label };
      }
    }
  }
  return result;
}

// ===== Karabiner Config Generator (export with device conditions) =====
export function generateKarabinerConfig(keymap, deviceType, defaults) {
  const device = devices[deviceType];
  const fromMap = keyIdToKarabinerFrom[deviceType];
  const manipulators = [];

  for (const [keyId, value] of Object.entries(keymap)) {
    const defaultValue = defaults[keyId];
    if (JSON.stringify(value) === JSON.stringify(defaultValue)) continue;

    const fromDef = fromMap[keyId];
    if (!fromDef) continue;

    const from = { key_code: fromDef.key_code };
    if (fromDef.modifiers) from.modifiers = fromDef.modifiers;

    let to;
    if (typeof value === 'string') {
      const kbKey = qmkToKarabiner[value];
      if (!kbKey) continue;
      to = [{ key_code: kbKey }];
    } else if (value.type === 'combo') {
      to = [{ key_code: value.key_code, modifiers: value.modifiers }];
    } else if (value.type === 'sequence') {
      to = value.keys;
    } else if (value.type === 'consumer') {
      to = [{ consumer_key_code: value.consumer_key_code }];
    } else if (value.type === 'apple_vendor') {
      to = [{ apple_vendor_top_case_key_code: value.apple_vendor_top_case_key_code }];
    } else if (value.type === 'apple_vendor_kb') {
      to = [{ apple_vendor_keyboard_key_code: value.apple_vendor_keyboard_key_code }];
    } else if (value.type === 'shell') {
      to = [{ shell_command: value.shell_command }];
    } else if (value.type === 'system') {
      to = [{ key_code: value.key_code }];
    } else {
      continue;
    }

    manipulators.push({
      type: 'basic',
      conditions: [{
        type: 'device_if',
        identifiers: [{ vendor_id: device.vendor_id, product_id: device.product_id }]
      }],
      from,
      to
    });
  }

  return {
    title: `${device.name} Custom Layout`,
    rules: [{
      description: `${device.name} - VIA Configurator`,
      manipulators
    }]
  };
}
