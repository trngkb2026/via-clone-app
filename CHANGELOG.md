# Changelog

## 2026-03-21 — バグ修正 & 検証機能追加

### 発見した問題

#### 1. sync時にアプリ管理外のルールが消える（致命的）
- **症状**: VIAアプリで設定変更 → UIでは反映済みに見える → 実際はKarabinerに反映されていない
- **原因**: `sync-karabiner` がデバイスルール全体を**全置換**していた。アプリが管理していないmanipulator（`left_shift → to_if_alone eisuu` 等）が上書きで消失
- **修正**: merge方式に変更。アプリが管理する `from` キーだけ上書きし、それ以外の既存manipulatorは保持

#### 2. sync結果を検証していない
- **症状**: `window.karabiner.sync()` の戻り値を無視。`catch { /* silent */ }` でエラーも握りつぶし
- **原因**: App.jsx の auto-sync ブロックでレスポンス未検証
- **修正**: `result.success` を確認し、失敗時はトースト通知 + console.error

#### 3. TENBT03 半/全キーのfromキーコードが間違っていた
- **症状**: 半/全キーに `⌥V` を設定しても効かない
- **原因**: `from: grave_accent_and_tilde` で設定していたが、実際のファームウェアは **`Ctrl+Space` を直接送信**していた。キーキャプチャで全ルール無効化後に判明
- **修正**: `from: { key_code: spacebar, modifiers: { mandatory: [control] } }` に変更

#### 4. TENBT03 `(` `)` キーが効かない
- **症状**: `(` / `)` キーに `⌘⇧X` / `⌘⇧⌥H` を設定しても効かない
- **原因**: `left_shift → japanese_eisuu` ルールがShiftを先に消費するため、`from: shift+8` / `shift+9` がマッチしなかった
- **修正**: `left_shift` を `to_if_alone` 方式に変更（タップ=英数、ホールド=Shift modifier）

#### 5. `keypad_plus` のマッピングが空
- **症状**: テンキー `+` キーが反応しない
- **原因**: `to: [{}]`（空オブジェクト）にマッピングされていた
- **修正**: `to: [{ key_code: fn }]`（地球儀キー）に修正

### 追加機能

#### キャプチャモード（Key Capture）
- ヘッダーの「Capture」ボタンでON/OFF
- 物理キーの `keydown` / `keyup` イベントをリアルタイム表示
- 表示内容: modifier状態、`e.code`、`e.key`、`e.keyCode`
- デバッグ用途: Karabiner処理後の出力を確認し、ルールのマッチ状況を診断可能
- 全ルール無効化 + キャプチャで**ファームウェアの生キーコード**を特定できる

#### 自己検証機能（Verify）
- sync成功後に自動実行（1秒後）
- 3段階チェック:
  - **File**: karabiner.json を再読み込みし、書き込み内容の一致を確認
  - **Device**: `karabiner_cli --list-connected-devices` で対象デバイスの接続確認
  - **Reload**: `grabber.log` のタイムスタンプでKarabinerがリロードしたか確認
- ヘッダーにステータスバッジ表示（Verified / Failed）

### 学んだこと

- TENBT03の一部キーはファームウェアレベルで修飾キー+キーの組み合わせを送信する（半/全 = `Ctrl+Space`）。UIのキーラベルやHIDの想定と実際の送信キーコードが一致しないケースがある
- Karabinerの `to_if_alone` は modifier キーの二重用途（タップ=別機能、ホールド=modifier）に有効
- sync時にデバイスルール全体を置換すると、手動追加ルールが消える。merge方式が必須

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/App.jsx` | sync結果検証、キャプチャモード、verify UI |
| `electron/main.cjs` | merge方式sync、verify IPCハンドラ |
| `electron/preload.cjs` | verify API公開 |
| `vite.config.js` | merge方式sync、verify エンドポイント |
