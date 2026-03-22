# VIA Configurator 仕様書

更新日: 2026-03-20

* * *

## 概要

Karabiner-Elementsと連携するキーボードリマッピングツール。 Ewinキーボード付属の「Ultimate Software」に近いUXを目指し、GUIでキー設定を視覚的に編集し、Karabiner設定に直接反映する。

* * *

## 対応デバイス

| デバイス | vendor_id | product_id | 用途 |
| --- | --- | --- | --- |
| TENBT03 (MCO) | 9427 | 12427 | Bluetoothテンキーパッド |
| Ewin X8 | 1452 | 599 | ミニキーボード |

* * *

## 技術スタック

| 技術 | バージョン | 用途 |
| --- | --- | --- |
| React | 19.x | UI |
| Vite | 8.x | ビルド/開発サーバー |
| Tailwind CSS | 4.x | スタイリング |
| Electron | 41.x | デスクトップアプリ化 |
| electron-builder | 26.x | .dmgパッケージング |
| lucide-react | 0.577.x | アイコン |

* * *

## 起動方法

```bash
# 開発（ブラウザ）
npm run dev

# 開発（Electronデスクトップアプリ）
npm run electron:dev

# ビルド → Electron起動
npm run build && npx electron .

# .dmgパッケージ生成
npm run electron:build
```

* * *

## 画面レイアウト

```
┌─────────────────────────────────────────────────────────┐
│  VIA Configurator  [Numpad|EWIN] [読込][Import][Export] │
│                                    [Reset] [Sync]       │  ← ヘッダー
├──────────────────────────────┬──────────────────────────┤
│                              │ Key combo プレビューバー  │
│                              │ [←] [Enter]              │
│    デバイス SVG              ├──────────────────────────┤
│    （キーボード可視化）       │ [Cmd][Shift][Alt][Ctrl]  │
│    左 60%                    │ ● キーボード入力OK        │
│                              ├──────────────────────────┤
│                              │ [Basic][Shortcuts][Seq]  │
│    凡例                      │ キーグリッド（スクロール） │
│    Simple/Shortcut/Macro/... │          右 40%           │
└──────────────────────────────┴──────────────────────────┘
```

- 左右分割レイアウト（左60% / 右40%）
- 右パネルの文字サイズ: 120%

* * *

## キー入力方法（2種類）

### 1. パネル選択

右パネルのタブからキーをクリックして割当。

### 2. キーボード直接入力

デバイス上のキーを選択すると、Appleキーボードからの入力が自動的に受け付けられる（Captureボタン不要）。

- 単キー → そのまま割当
- 修飾キー+キー（⌘+C等）→ コンボとして割当
- Sequenceタブ中 → シーケンスに追加
- 入力時にフラッシュアニメーション（キー名を画面中央に大きく表示、0.8秒でフェードアウト）
- 緑インジケータ「キーボード入力OK」がキー選択中に表示

* * *

## タブ構成（3タブ）

### Basic

全キーをカテゴリ別セクションで1タブに統合。各カテゴリにセクション見出し表示。

| セクション | 内容 |
| --- | --- |
| Letters | A-Z |
| Numbers (Tenkey) | 0-9（テンキーコード: かな入力時でも半角出力） |
| Whitespace | Enter, Space, Tab, Esc, Backspace |
| Symbols | - = [ ] \ ; ' ` , . / |
| Navigation | ↑ ↓ ← → PgUp PgDn Home End Del Ins |
| Modifiers | LCtrl, LShift, LAlt/Opt, LCmd, RCtrl, RShift, RAlt/Opt, RCmd |
| Function Keys | F1-F20 |
| Media | Mute, Vol+, Vol-, Play, Stop, Prev, Next |
| System | Dictation, 英数, かな, PrintScreen, Mission Ctrl, Launchpad, App Windows, Show Desktop, Bright+/- |
| Misc | None, Trans, NumLk, CapsLk |

### Shortcuts

修飾キー+キーのプリセットコンボ。

| ショートカット | 内容 |
| --- | --- |
| ⌘C / ⌘V / ⌘X | Copy / Paste / Cut |
| ⌘Z / ⌘⇧Z | Undo / Redo |
| ⌘S / ⌘A / ⌘F | Save / All / Find |
| ⌘W / ⌘T / ⌘N / ⌘Q | Close / Tab / New / Quit |
| ⌘⏎ / ⌘, | Send / Settings |
| ⌘L / ⌘R | URL / Reload |
| ⌘Space / ⌘Tab | Spotlight / App Switch |
| ⌃C | SIGINT |
| 1Password | ⌘+右Shift+X |
| ⌘⇧⌥H | カスタムショートカット |

### Sequence

連続キー入力のプリセット + カスタムビルダー。

**プリセット:**

- Space×4+Enter
- 英数→,→かな
- Enter×3

**カスタムビルダー:** Sequenceタブを開くとビルダーモードになる。タブ内のキーをクリックするとシーケンスに追加。

| セクション | 内容 |
| --- | --- |
| Navigation | ↑ ↓ ← → PgUp PgDn Home End |
| Actions | Enter, Space, Tab, Esc, Back, Del, 英数, かな |
| Letters (lowercase) | a-z |
| Letters (UPPERCASE) | A-Z（Shift付き出力） |
| Numbers | 0-9（テンキー） |
| Symbols | , . / - ; ' |

**操作フロー:**

1. キーを順番にクリック → プレビューバーに `→` 区切りで表示
2. ← ボタンで最後のキーを削除
3. Enter ボタン（オレンジ色）で確定・割当

* * *

## Key Combo ビルダー（Ultimate Software準拠）

プレビューバー + 修飾キートグル + Enter/← ボタンの3要素で構成。

### 操作フロー

1. デバイス上のキーを選択
2. 修飾キーボタン（Cmd / Shift / Alt/Opt / Ctrl）をトグルON
3. プレビューバーに「⌘ + キーを選択」と表示
4. Basicタブ等からキーをクリック → プレビューに「⌘ + C」表示（まだ確定しない）
5. **Enter** で確定・割当 / **←** で取り消し

修飾キーなしの場合はキークリックで即割当（Enterボタン不要）。

* * *

## マッピングの種類と色分け

| 種類 | 色 | 説明 |
| --- | --- | --- |
| Simple | 白 (#e5e5e5) | 単一キー（KC_A等） |
| Combo (Shortcut) | シアン (#00d8ff) | 修飾キー+キー（⌘C等） |
| Sequence (Macro) | オレンジ (#ffb800) | 連続キー入力（→→→Enter等） |
| Consumer | 緑 (#00ff88) | Dictation, Brightness等 |
| System | 紫 (#b388ff) | 英数, かな, F13等 |

デバイスSVG上の表示:

- 変更されたキーには右上にドット表示
- タイプ別に下部にカラーバー表示

* * *

## Auto Sync（自動同期）

**表示**: ヘッダー右端のシアン色インジケータ（パルスドット付き「Auto Sync」バッジ）

**動作**: キーマップが変更されるたびに `~/.config/karabiner/karabiner.json` を自動更新（500msデバウンス）

1. キーマップ変更を検知（デバウンス500ms）
2. 両デバイス（Numpad / Ewin）のデフォルトと異なるキーを抽出
3. 対象デバイスの vendor_id / product_id で既存ルールを検索
4. ルールが存在 → manipulators を置換 / 存在しない → 新規追加
5. karabiner.json を上書き保存
6. Karabiner-Elements が自動検知して即反映

手動のSyncボタン操作は不要。起動時の初期読み込み中は自動同期を抑制。

* * *

## 自動読み込み

### 起動時

アプリ起動時に `~/.config/karabiner/karabiner.json` を自動読み込み。 TENBT03 / Ewin X8 の既存ルールを解析し、キーマップに反映。

- Electron: IPC経由 (`window.karabiner.readConfig()`)
- Web: Vite API経由 (`/api/read-karabiner`)

### 手動読み込み

- **読込ボタン**: karabiner.json ファイルを選択して読み込み
- **Import ボタン**: VIA独自フォーマット（JSON）を読み込み

* * *

## Export / Import

| 操作 | ファイル | 内容 |
| --- | --- | --- |
| Export | `via_keymap_backup.json` | 全デバイスのキーマップ（VIA独自フォーマット） |
| Import | `.json` | VIA独自フォーマットの読み込み |

* * *

## Reset

- **ボタン**: ヘッダーの Reset ボタン
- **確認ダイアログ**: デバイス名と変更件数を表示、赤い「リセットする」ボタンで実行
- **動作**: 現在のKarabiner設定の状態（起動時読み込み値）に戻す

* * *

## データモデル

### キーマップ値の型

```js
// Simple（文字列）
'KC_A'
'KC_KP1'    // テンキー数字

// Combo（修飾キー+キー）
{
  type: 'combo',
  key_code: 'c',
  modifiers: ['command'],
  label: '⌘C'
}

// Sequence（連続入力）
{
  type: 'sequence',
  keys: [
    { key_code: 'right_arrow' },
    { key_code: 'right_arrow' },
    { key_code: 'return_or_enter' }
  ],
  label: '→→Ent'
}

// Consumer（メディア/システム）
{
  type: 'consumer',
  consumer_key_code: 'dictation',
  label: '🎤Dict'
}

// System（Karabiner固有キー）
{
  type: 'system',
  key_code: 'japanese_eisuu',
  label: '英数'
}
```

* * *

## Karabiner出力フォーマット

Sync to Device が生成する manipulator の構造:

```json
{
  "type": "basic",
  "conditions": [{
    "type": "device_if",
    "identifiers": [{
      "vendor_id": 9427,
      "product_id": 12427
    }]
  }],
  "from": { "key_code": "escape" },
  "to": [{ "consumer_key_code": "dictation" }]
}
```

デバイス条件（vendor_id / product_id）が必ず付与されるため、他のキーボードに影響しない。

* * *

## 数字キーの仕様

Basicタブの数字キーはすべてテンキーコード（KC_KP0〜KC_KP9）を使用。 Karabiner出力時は `keypad_0`〜`keypad_9` となり、かな入力モード中でもIMEを通さず半角数字を出力する。

* * *

## Electronデスクトップアプリ

### ウィンドウ設定

- サイズ: 1280×860（最小 900×600）
- タイトルバー: `hiddenInset`（Mac信号機ボタン統合）
- 背景色: #141414
- タイトルバードラッグ対応

### IPC ハンドラ

| チャネル | 機能 |
| --- | --- |
| `sync-karabiner` | karabiner.json のルールを直接更新 |
| `read-karabiner-config` | karabiner.json を読み取り |

### Web開発フォールバック

Electron外（ブラウザ）での開発時は Vite dev server のAPIミドルウェアが同等の機能を提供。

| エンドポイント | 機能 |
| --- | --- |
| `POST /api/sync-karabiner` | karabiner.json 更新 |
| `GET /api/read-karabiner` | karabiner.json 読み取り |

* * *

## ファイル構成

```
via-clone-app/
├── electron/
│   ├── main.cjs          # Electronメインプロセス
│   └── preload.cjs       # IPC ブリッジ
├── src/
│   ├── App.jsx           # メインアプリ（状態管理/UI）
│   ├── main.jsx          # エントリポイント
│   ├── index.css         # グローバルCSS
│   ├── components/
│   │   ├── KeyNode.jsx   # 個別キーSVG（色分け/変更インジケータ）
│   │   ├── NumpadSVG.jsx # TENBT03 キーボードSVG
│   │   └── EwinSVG.jsx   # Ewin X8 キーボードSVG
│   └── data/
│       └── keymaps.js    # キーマップ定義/Karabinerパーサー/ジェネレーター
├── package.json
├── vite.config.js
└── SPEC.md               # この仕様書
```

* * *

## 既知のプリロード設定（TENBT03）

起動時に karabiner.json から読み込まれる現在の設定:

| 元キー | 変換先 | タイプ |
| --- | --- | --- |
| ESC | 音声入力 (Dictation) | Consumer |
| F2 | F13 (スクショ) | System |
| F4 | Shift+F13 (動画SS) | Combo |
| ( | 1Password (⌘+右Shift+X) | Combo |
| ) | ⌘+Shift+Option+H | Combo |
| 半/全 | Backspace | Simple |
| - | ⌘+, (設定) | Combo |
| . | 英数→,→かな | Sequence |
| Enter | Space | Simple |
| + | Control+C | Combo |
| DEL | Space×4+Enter | Sequence |
| / | ⌘+Enter | Combo |