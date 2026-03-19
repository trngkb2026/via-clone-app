// QMK -> Karabiner-Elements key_code mapping
export const qmkToKarabiner = {
  'KC_A':'a', 'KC_B':'b', 'KC_C':'c', 'KC_D':'d', 'KC_E':'e', 'KC_F':'f', 'KC_G':'g', 'KC_H':'h', 'KC_I':'i', 'KC_J':'j', 'KC_K':'k', 'KC_L':'l', 'KC_M':'m', 'KC_N':'n', 'KC_O':'o', 'KC_P':'p', 'KC_Q':'q', 'KC_R':'r', 'KC_S':'s', 'KC_T':'t', 'KC_U':'u', 'KC_V':'v', 'KC_W':'w', 'KC_X':'x', 'KC_Y':'y', 'KC_Z':'z',
  'KC_1':'1', 'KC_2':'2', 'KC_3':'3', 'KC_4':'4', 'KC_5':'5', 'KC_6':'6', 'KC_7':'7', 'KC_8':'8', 'KC_9':'9', 'KC_0':'0',
  'KC_ENTER':'return_or_enter', 'KC_ESCAPE':'escape', 'KC_BSPACE':'delete_or_backspace', 'KC_TAB':'tab', 'KC_SPACE':'spacebar',
  'KC_MINUS':'hyphen', 'KC_EQUAL':'equal_sign', 'KC_LBRC':'open_bracket', 'KC_RBRC':'close_bracket', 'KC_SCOLON':'semicolon', 'KC_QUOTE':'quote', 'KC_GRV':'grave_accent_and_tilde', 'KC_COMM':'comma', 'KC_DOT':'period', 'KC_SLSH':'slash',
  'KC_UP':'up_arrow', 'KC_DOWN':'down_arrow', 'KC_LEFT':'left_arrow', 'KC_RIGHT':'right_arrow',
  'KC_PGUP':'page_up', 'KC_PGDN':'page_down', 'KC_HOME':'home', 'KC_END':'end', 'KC_DELETE':'delete_forward', 'KC_INSERT':'insert',
  'KC_LCTRL':'left_control', 'KC_LSHIFT':'left_shift', 'KC_LALT':'left_option', 'KC_LGUI':'left_command',
  'KC_RCTRL':'right_control', 'KC_RSHIFT':'right_shift', 'KC_RALT':'right_option', 'KC_RGUI':'right_command',
  'KC_MUTE':'mute', 'KC_VOLU':'volume_increment', 'KC_VOLD':'volume_decrement', 'KC_MPLY':'play_or_pause', 'KC_MSTP':'stop', 'KC_MPRV':'rewind', 'KC_MNXT':'fastforward',
  'KC_JYEN':'international3', 'KC_RO':'international1'
};

// Default keymap for Numpad (MCO TENBT03)
export const initNumpad = {
  n_esc: 'KC_ESCAPE', n_f2: 'KC_F2', n_f4: 'KC_F4', n_num: 'KC_NUM', n_lp: 'KC_LPRN', n_rp: 'KC_RPRN', n_del: 'KC_DELETE',
  n_hz: 'KC_GRV', n_alt: 'KC_LALT', n_ctrl: 'KC_LCTRL', n_eq: 'KC_EQUAL', n_div: 'KC_SLSH', n_mul: 'KC_AST', n_bs: 'KC_BSPACE',
  n_fn: 'KC_FN', n_shift: 'KC_LSHIFT', n_tab: 'KC_TAB', n_7: 'KC_7', n_8: 'KC_8', n_9: 'KC_9', n_min: 'KC_MINUS',
  n_up: 'KC_UP', n_4: 'KC_4', n_5: 'KC_5', n_6: 'KC_6', n_plus: 'KC_PLUS',
  n_left: 'KC_LEFT', n_down: 'KC_DOWN', n_right: 'KC_RIGHT', n_1: 'KC_1', n_2: 'KC_2', n_3: 'KC_3', n_enter: 'KC_ENTER',
  n_0: 'KC_0', n_00: 'KC_00', n_dot: 'KC_DOT'
};

// Default keymap for EWIN
export const initEwin = {
  e_esc: 'KC_ESCAPE', e_1: 'KC_1', e_2: 'KC_2', e_3: 'KC_3', e_4: 'KC_4', e_5: 'KC_5', e_6: 'KC_6', e_7: 'KC_7', e_8: 'KC_8', e_9: 'KC_9', e_0: 'KC_0', e_yen: 'KC_JYEN',
  e_tab: 'KC_TAB', e_q: 'KC_Q', e_w: 'KC_W', e_e: 'KC_E', e_r: 'KC_R', e_t: 'KC_T', e_y: 'KC_Y', e_u: 'KC_U', e_i: 'KC_I', e_o: 'KC_O', e_p: 'KC_P', e_bs: 'KC_BSPACE',
  e_caps: 'KC_CAPS', e_a: 'KC_A', e_s: 'KC_S', e_d: 'KC_D', e_f: 'KC_F', e_g: 'KC_G', e_h: 'KC_H', e_j: 'KC_J', e_k: 'KC_K', e_l: 'KC_L', e_plus: 'KC_PLUS', e_enter: 'KC_ENTER',
  e_shift: 'KC_LSHIFT', e_z: 'KC_Z', e_x: 'KC_X', e_c: 'KC_C', e_v: 'KC_V', e_b: 'KC_B', e_n: 'KC_N', e_m: 'KC_M', e_lt: 'KC_COMM', e_gt: 'KC_DOT', e_slash: 'KC_SLSH', e_ro: 'KC_RO',
  e_ctrl: 'KC_LCTRL', e_fn: 'KC_FN', e_eq: 'KC_EQUAL', e_tilde: 'KC_GRV', e_opt: 'KC_LALT', e_space: 'KC_SPACE', e_cmd: 'KC_LGUI', e_alt: 'KC_RALT', e_at: 'KC_AT', e_lbr: 'KC_LBRC', e_ast: 'KC_AST'
};

// Key layout definitions for Numpad
export const numpadKeys = [
  { id: 'n_esc', x: 50, y: 50, w: 60, h: 60, orig: 'ESC' }, { id: 'n_f2', x: 130, y: 50, w: 60, h: 60, orig: 'F2' }, { id: 'n_f4', x: 210, y: 50, w: 60, h: 60, orig: 'F4' },
  { id: 'n_hz', x: 50, y: 130, w: 60, h: 60, orig: '半/全' }, { id: 'n_alt', x: 130, y: 130, w: 60, h: 60, orig: 'Alt' }, { id: 'n_ctrl', x: 210, y: 130, w: 60, h: 60, orig: 'Ctrl' },
  { id: 'n_fn', x: 50, y: 210, w: 60, h: 60, orig: 'FN' }, { id: 'n_shift', x: 130, y: 210, w: 60, h: 60, orig: 'Shift' }, { id: 'n_tab', x: 210, y: 210, w: 60, h: 60, orig: 'Tab' },
  { id: 'n_up', x: 130, y: 370, w: 60, h: 60, orig: '↑' }, { id: 'n_left', x: 50, y: 450, w: 60, h: 60, orig: '←' }, { id: 'n_down', x: 130, y: 450, w: 60, h: 60, orig: '↓' }, { id: 'n_right', x: 210, y: 450, w: 60, h: 60, orig: '→' },
  { id: 'n_num', x: 320, y: 50, w: 60, h: 60, orig: 'NUM' }, { id: 'n_lp', x: 400, y: 50, w: 60, h: 60, orig: '(' }, { id: 'n_rp', x: 480, y: 50, w: 60, h: 60, orig: ')' }, { id: 'n_del', x: 560, y: 50, w: 60, h: 60, orig: 'DEL' },
  { id: 'n_eq', x: 320, y: 130, w: 60, h: 60, orig: '=' }, { id: 'n_div', x: 400, y: 130, w: 60, h: 60, orig: '/' }, { id: 'n_mul', x: 480, y: 130, w: 60, h: 60, orig: '*' }, { id: 'n_bs', x: 560, y: 130, w: 60, h: 60, orig: 'BS' },
  { id: 'n_7', x: 320, y: 210, w: 60, h: 60, orig: '7' }, { id: 'n_8', x: 400, y: 210, w: 60, h: 60, orig: '8' }, { id: 'n_9', x: 480, y: 210, w: 60, h: 60, orig: '9' }, { id: 'n_min', x: 560, y: 210, w: 60, h: 60, orig: '-' },
  { id: 'n_4', x: 320, y: 290, w: 60, h: 60, orig: '4' }, { id: 'n_5', x: 400, y: 290, w: 60, h: 60, orig: '5' }, { id: 'n_6', x: 480, y: 290, w: 60, h: 60, orig: '6' }, { id: 'n_plus', x: 560, y: 290, w: 60, h: 60, orig: '+' },
  { id: 'n_1', x: 320, y: 370, w: 60, h: 60, orig: '1' }, { id: 'n_2', x: 400, y: 370, w: 60, h: 60, orig: '2' }, { id: 'n_3', x: 480, y: 370, w: 60, h: 60, orig: '3' }, { id: 'n_enter', x: 560, y: 370, w: 60, h: 140, orig: 'Ent' },
  { id: 'n_0', x: 320, y: 450, w: 60, h: 60, orig: '0' }, { id: 'n_00', x: 400, y: 450, w: 60, h: 60, orig: '00' }, { id: 'n_dot', x: 480, y: 450, w: 60, h: 60, orig: '.' },
];

// Key layout definitions for EWIN
export const ewinKeys = [
  { id: 'e_esc', x: 60, y: 270, w: 46, h: 34, orig: 'Esc' }, { id: 'e_1', x: 112, y: 270, w: 46, h: 34, orig: '1' }, { id: 'e_2', x: 164, y: 270, w: 46, h: 34, orig: '2' }, { id: 'e_3', x: 216, y: 270, w: 46, h: 34, orig: '3' }, { id: 'e_4', x: 268, y: 270, w: 46, h: 34, orig: '4' }, { id: 'e_5', x: 320, y: 270, w: 46, h: 34, orig: '5' }, { id: 'e_6', x: 372, y: 270, w: 46, h: 34, orig: '6' }, { id: 'e_7', x: 424, y: 270, w: 46, h: 34, orig: '7' }, { id: 'e_8', x: 476, y: 270, w: 46, h: 34, orig: '8' }, { id: 'e_9', x: 528, y: 270, w: 46, h: 34, orig: '9' }, { id: 'e_0', x: 580, y: 270, w: 46, h: 34, orig: '0' }, { id: 'e_yen', x: 632, y: 270, w: 68, h: 34, orig: '¥' },
  { id: 'e_tab', x: 60, y: 310, w: 56, h: 34, orig: 'Tab' }, { id: 'e_q', x: 122, y: 310, w: 46, h: 34, orig: 'Q' }, { id: 'e_w', x: 174, y: 310, w: 46, h: 34, orig: 'W' }, { id: 'e_e', x: 226, y: 310, w: 46, h: 34, orig: 'E' }, { id: 'e_r', x: 278, y: 310, w: 46, h: 34, orig: 'R' }, { id: 'e_t', x: 330, y: 310, w: 46, h: 34, orig: 'T' }, { id: 'e_y', x: 382, y: 310, w: 46, h: 34, orig: 'Y' }, { id: 'e_u', x: 434, y: 310, w: 46, h: 34, orig: 'U' }, { id: 'e_i', x: 486, y: 310, w: 46, h: 34, orig: 'I' }, { id: 'e_o', x: 538, y: 310, w: 46, h: 34, orig: 'O' }, { id: 'e_p', x: 590, y: 310, w: 46, h: 34, orig: 'P' }, { id: 'e_bs', x: 642, y: 310, w: 58, h: 34, orig: 'BACK' },
  { id: 'e_caps', x: 60, y: 350, w: 66, h: 34, orig: 'Caps' }, { id: 'e_a', x: 132, y: 350, w: 46, h: 34, orig: 'A' }, { id: 'e_s', x: 184, y: 350, w: 46, h: 34, orig: 'S' }, { id: 'e_d', x: 236, y: 350, w: 46, h: 34, orig: 'D' }, { id: 'e_f', x: 288, y: 350, w: 46, h: 34, orig: 'F' }, { id: 'e_g', x: 340, y: 350, w: 46, h: 34, orig: 'G' }, { id: 'e_h', x: 392, y: 350, w: 46, h: 34, orig: 'H' }, { id: 'e_j', x: 444, y: 350, w: 46, h: 34, orig: 'J' }, { id: 'e_k', x: 496, y: 350, w: 46, h: 34, orig: 'K' }, { id: 'e_l', x: 548, y: 350, w: 46, h: 34, orig: 'L' }, { id: 'e_plus', x: 600, y: 350, w: 46, h: 34, orig: '+' }, { id: 'e_enter', x: 652, y: 350, w: 48, h: 34, orig: 'Ent' },
  { id: 'e_shift', x: 60, y: 390, w: 76, h: 34, orig: 'Shift' }, { id: 'e_z', x: 142, y: 390, w: 46, h: 34, orig: 'Z' }, { id: 'e_x', x: 194, y: 390, w: 46, h: 34, orig: 'X' }, { id: 'e_c', x: 246, y: 390, w: 46, h: 34, orig: 'C' }, { id: 'e_v', x: 298, y: 390, w: 46, h: 34, orig: 'V' }, { id: 'e_b', x: 350, y: 390, w: 46, h: 34, orig: 'B' }, { id: 'e_n', x: 402, y: 390, w: 46, h: 34, orig: 'N' }, { id: 'e_m', x: 454, y: 390, w: 46, h: 34, orig: 'M' }, { id: 'e_lt', x: 506, y: 390, w: 46, h: 34, orig: '<' }, { id: 'e_gt', x: 558, y: 390, w: 46, h: 34, orig: '>' }, { id: 'e_slash', x: 610, y: 390, w: 46, h: 34, orig: '?' }, { id: 'e_ro', x: 662, y: 390, w: 38, h: 34, orig: '}' },
  { id: 'e_ctrl', x: 60, y: 430, w: 46, h: 34, orig: 'Ctrl' }, { id: 'e_fn', x: 112, y: 430, w: 46, h: 34, orig: 'Fn' }, { id: 'e_eq', x: 164, y: 430, w: 46, h: 34, orig: '=' }, { id: 'e_tilde', x: 216, y: 430, w: 46, h: 34, orig: '~' }, { id: 'e_opt', x: 268, y: 430, w: 56, h: 34, orig: 'Opt' }, { id: 'e_space', x: 330, y: 430, w: 134, h: 34, orig: 'Space' }, { id: 'e_cmd', x: 470, y: 430, w: 46, h: 34, orig: 'Cmd' }, { id: 'e_alt', x: 522, y: 430, w: 46, h: 34, orig: 'Alt' }, { id: 'e_at', x: 574, y: 430, w: 46, h: 34, orig: '@' }, { id: 'e_lbr', x: 626, y: 430, w: 46, h: 34, orig: '{' }, { id: 'e_ast', x: 678, y: 430, w: 46, h: 34, orig: '*' },
];

// Keycode categories for the palette
export const keycodes = {
  Basic: [
    ...Array.from({length: 26}, (_, i) => ({ code: `KC_${String.fromCharCode(65+i)}`, label: String.fromCharCode(65+i) })),
    ...Array.from({length: 10}, (_, i) => ({ code: `KC_${(i+1)%10}`, label: `${(i+1)%10}` })),
    { code: 'KC_0', label: '0' }, { code: 'KC_ENTER', label: 'Enter' }, { code: 'KC_ESCAPE', label: 'Esc' },
    { code: 'KC_BSPACE', label: 'Backspc' }, { code: 'KC_TAB', label: 'Tab' }, { code: 'KC_SPACE', label: 'Space' },
    { code: 'KC_MINUS', label: '-' }, { code: 'KC_EQUAL', label: '=' }, { code: 'KC_LBRC', label: '[' }, { code: 'KC_RBRC', label: ']' },
    { code: 'KC_BSLASH', label: '\\' }, { code: 'KC_SCOLON', label: ';' }, { code: 'KC_QUOTE', label: '\'' }, { code: 'KC_GRV', label: '`' },
    { code: 'KC_COMM', label: ',' }, { code: 'KC_DOT', label: '.' }, { code: 'KC_SLSH', label: '/' }
  ],
  Modifiers: [
    {code: 'KC_LCTRL', label: 'LCtrl'}, {code: 'KC_LSHIFT', label: 'LShift'}, {code: 'KC_LALT', label: 'LAlt'}, {code: 'KC_LGUI', label: 'LWin'},
    {code: 'KC_RCTRL', label: 'RCtrl'}, {code: 'KC_RSHIFT', label: 'RShift'}, {code: 'KC_RALT', label: 'RAlt'}, {code: 'KC_RGUI', label: 'RWin'}
  ],
  Media: [
    {code: 'KC_MUTE', label: 'Mute'}, {code: 'KC_VOLU', label: 'Vol+'}, {code: 'KC_VOLD', label: 'Vol-'},
    {code: 'KC_MPLY', label: 'Play'}, {code: 'KC_MSTP', label: 'Stop'}, {code: 'KC_MPRV', label: 'Prev'}, {code: 'KC_MNXT', label: 'Next'}
  ],
  Nav: [
    {code: 'KC_UP', label: 'Up'}, {code: 'KC_DOWN', label: 'Down'}, {code: 'KC_LEFT', label: 'Left'}, {code: 'KC_RIGHT', label: 'Right'},
    {code: 'KC_PGUP', label: 'PgUp'}, {code: 'KC_PGDN', label: 'PgDn'}, {code: 'KC_HOME', label: 'Home'}, {code: 'KC_END', label: 'End'},
    {code: 'KC_DELETE', label: 'Del'}, {code: 'KC_INSERT', label: 'Ins'}
  ],
  Special: [
    {code: 'KC_NONE', label: 'None'}, {code: 'KC_TRNS', label: 'Trans'}, {code: 'KC_NUM', label: 'NumLk'}, {code: 'KC_CAPS', label: 'CapsLk'}
  ]
};

export const getDisplayLabel = (code) => {
  if (!code) return '';
  const overrides = {
    'KC_ENTER': 'Ent', 'KC_ESCAPE': 'Esc', 'KC_BSPACE': 'Back', 'KC_SPACE': 'Space',
    'KC_LSHIFT': 'Shift', 'KC_LCTRL': 'Ctrl', 'KC_LALT': 'Alt', 'KC_LGUI': 'Win',
    'KC_RSHIFT': 'R-Shf', 'KC_RCTRL': 'R-Ctl', 'KC_RALT': 'R-Alt', 'KC_RGUI': 'R-Win',
    'KC_VOLU': 'Vol+', 'KC_VOLD': 'Vol-', 'KC_MUTE': 'Mute',
    'KC_MNXT': 'Next', 'KC_MPRV': 'Prev', 'KC_MPLY': 'Play',
    'KC_UP': '↑', 'KC_DOWN': '↓', 'KC_LEFT': '←', 'KC_RIGHT': '→',
    'KC_MINUS': '-', 'KC_EQUAL': '=', 'KC_LBRC': '[', 'KC_RBRC': ']', 'KC_BSLASH': '\\',
    'KC_SCOLON': ';', 'KC_QUOTE': '\'', 'KC_GRV': '`', 'KC_COMM': ',', 'KC_DOT': '.', 'KC_SLSH': '/',
    'KC_DELETE': 'Del', 'KC_INSERT': 'Ins', 'KC_JYEN': '¥', 'KC_RO': 'ろ', 'KC_NONE': ' ', 'KC_TRNS': '▽'
  };
  return overrides[code] || code.replace('KC_', '');
};
