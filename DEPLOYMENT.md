# Vercel デプロイ手順

## 方法 1: Vercel Web UI（推奨）

### Step 1: Vercel にログイン
1. https://vercel.com にアクセス
2. GitHub アカウントでサインイン

### Step 2: 新しいプロジェクトをインポート
1. **Dashboard** > **Add New...** > **Project** をクリック
2. **Import Git Repository** を選択
3. `zukkyyoshida-arch/mg-ipad-app` を検索・選択

### Step 3: プロジェクト設定
- **Project Name**: `mg-ipad-app`
- **Framework**: `Vite` (自動検出)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: 環境変数設定（オプション）
後で追加する場合：
- Project Settings > Environment Variables
- Firebase 環境変数を追加

### Step 5: デプロイ
**Deploy** ボタンをクリック → 自動デプロイ開始

---

## 方法 2: Vercel CLI

### Step 1: Vercel CLI インストール
```bash
npm install -g vercel
```

### Step 2: ログイン
```bash
vercel login
```
ブラウザで認証完了後、ターミナルに戻る

### Step 3: プロジェクト初期化
```bash
cd /Users/kazukiyoshida/Antigravty/mg-ipad-app
vercel
```

プロンプトに答える：
- **Set up and deploy "~/Antigravty/mg-ipad-app"?** → Yes
- **Which scope do you want to deploy to?** → Personal Account
- **Link to existing project?** → No
- **Project name:** → mg-ipad-app
- **In which directory is your code located?** → ./ (Enter)
- **Want to modify vercel.json?** → No

### Step 4: デプロイ
```bash
vercel deploy --prod
```

---

## デプロイ後の確認

### URL 確認
Vercel Dashboard で確認：
- **Production URL**: https://mg-ipad-app.vercel.app
- **Preview URL**: https://mg-ipad-app-[branch-name].vercel.app

### テスト
```bash
# リモート URL を開く
open https://mg-ipad-app.vercel.app
```

iPad ブラウザで：
- Landscape / Portrait モード両方をテスト
- サイドバー・コンテンツ表示を確認
- ネットワーク遅延なくロード

---

## 自動デプロイ設定

GitHub に push すると自動的に Vercel にデプロイされます：

1. `main` ブランチへの push → **Production デプロイ**
2. PR / feature ブランチ → **Preview デプロイ**

---

## トラブルシューティング

### デプロイ失敗：Build エラー
```bash
# ローカルでビルド確認
cd /Users/kazukiyoshida/Antigravty/mg-ipad-app
npm install
npm run build
```

### デプロイ後に 404 エラー
Vercel Settings で確認：
- **Build & Development Settings** > **Output Directory**: `dist`
- **Redeployments** > Redeploy ボタンでリトライ

### Firebase 接続エラー
環境変数を設定：
- Project Settings > Environment Variables
- VITE_FIREBASE_* を追加

---

## 参考リンク
- [Vercel Docs](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/guides/deploying-vite-with-vercel)
