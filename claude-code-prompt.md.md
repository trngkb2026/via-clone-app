# VIA Clone App デプロイ自動化プロンプト  
## 🤖 Claude Code への指示  
あなたは熟練したフロントエンドエンジニアです。  
このプロンプトの最後にある「単一HTMLファイルのReactコード」を解析し、ViteベースのモダンなReactプロジェクトとして再構築した上で、GitHubリポジトリの作成とVercelへのデプロイを完了させてください。  
ターミナルコマンドの実行とファイルの作成・編集を自律的に行って構いません。必要に応じて私（ユーザー）に実行許可を求めてください。  
## 🛠 前提条件（ユーザー確認用）  
※ Claude: 実行前に以下のCLIツールが利用可能かチェックし、エラーが出た場合はユーザーにログインを促してください。  
• gh (GitHub CLI): gh auth status  
• vercel (Vercel CLI): vercel whoami  
• node & npm  
## 📋 タスクステップ  
**Step 1: Viteプロジェクトのセットアップ**  
1. カレントディレクトリに via-clone-app という名前のディレクトリを作成し、Vite + React (JavaScript) テンプレートを展開してください。  
コマンド例: npm create vite@latest via-clone-app -- --template react  
2. via-clone-app ディレクトリに移動してください。  
3. npm install を実行してください。  
4. Tailwind CSS とアイコンライブラリをインストールしてください。  
コマンド例: npm install -D tailwindcss postcss autoprefixer および npx tailwindcss init -p  
コマンド例: npm install lucide-react  
5. tailwind.config.js の content に ./index.html と ./src/**/*.{js,ts,jsx,tsx} を追加してください。  
6. src/index.css に Tailwind のディレクティブ (@tailwind base; @tailwind components; @tailwind utilities;) を追加してください。  
**Step 2: コードの移植とリファクタリング**  
提供されたHTMLファイル内のReactコード（CDN経由で動作していたもの）を、以下の構造でモジュール分割して移植してください。  
lucide-react のアイコンは自作のSVG関数ではなく、インポートしたパッケージ（例: import { Download, Upload, Keyboard, CheckCircle2, Monitor, X } from 'lucide-react'）を使用するように書き換えてください。  
ディレクトリ構成案:  
• src/data/keymaps.js: initNumpad, initEwin, numpadKeys, ewinKeys, keycodes, qmkToKarabiner, getDisplayLabel などの定数や変換ロジックをエクスポートするファイル。  
• src/components/KeyNode.jsx: キー描画用の共通コンポーネント。  
• src/components/NumpadSVG.jsx: テンキー用のSVGコンポーネント。  
• src/components/EwinSVG.jsx: EWINキーボード用のSVGコンポーネント。  
• src/App.jsx: メインのアプリケーションロジック（状態管理、インポート/エクスポート処理、Karabiner JSON生成ロジック、UI全体）。  
**Step 3: Git & GitHub リポジトリの作成**  
1. プロジェクトルート(via-clone-app)で git init を実行してください。  
2. .gitignore が適切に設定されていることを確認してください。  
3. git add . および git commit -m "Initial commit: VIA Clone App" を実行してください。  
4. GitHub CLI (gh) を使用して、リモートリポジトリを作成しプッシュしてください。  
コマンド例: gh repo create via-clone-app --public --source=. --remote=origin --push  
**Step 4: Vercelへのデプロイ**  
1. Vercel CLI を使用して、プロジェクトを本番環境としてデプロイしてください。  
コマンド例: vercel --prod --yes  
2. デプロイが完了したら、発行された本番URLを私（ユーザー）に報告してください。  
## 📄 元コード (移植対象)  
以下はブラウザで直接動作していた単一HTMLのコードです。これをViteプロジェクトのソースとして解釈してください。  
