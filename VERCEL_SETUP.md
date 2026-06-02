# Vercel セットアップガイド（Web UI）

## 🎯 目標
GitHub リポジトリから Vercel プロジェクトを自動デプロイ設定する

---

## 📝 セットアップ手順

### Step 1: Vercel にログイン
```
https://vercel.com
```
→ **GitHub アカウント**でサインイン

---

### Step 2: 新しいプロジェクトを作成

1. **Dashboard** に移動
2. 右上の **Add New...** ボタン → **Project** を選択

---

### Step 3: GitHub リポジトリをインポート

1. **Import Git Repository** をクリック
2. 検索欄に以下を入力：
   ```
   mg-ipad-app
   ```
3. 結果から `zukkyyoshida-arch/mg-ipad-app` を選択
4. **Import** をクリック

---

### Step 4: プロジェクト設定を確認

Vercel が自動的に以下を検出します：

| 設定項目 | 値 |
|---------|-----|
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

✅ すべて正しく設定されているはずです（vercel.json で定義）

---

### Step 5: デプロイ

1. **Deploy** ボタンをクリック
2. デプロイが開始（2-3分待機）
3. 完了後、本番 URL が表示される

```
https://mg-ipad-app.vercel.app
```

---

## ✅ デプロイ確認

デプロイが完了したら、以下をテストしてください：

### iPad で
- **Landscape（横向き）**
  - サイドバー + メインコンテンツ表示を確認
  - タブ切り替えで各セクション表示確認

- **Portrait（縦向き）**
  - スタック型レイアウト表示を確認

### レスポンシブ
- Chrome DevTools で iPad サイズにリサイズして確認

---

## 🔗 デプロイ後の URL

| 用途 | URL |
|-----|-----|
| **本番** | https://mg-ipad-app.vercel.app |
| **GitHub リポジトリ** | https://github.com/zukkyyoshida-arch/mg-ipad-app |
| **Dashboard** | https://vercel.com/dashboard |

---

## 🚀 自動デプロイ設定

セットアップ後、以下は自動で行われます：

- `main` ブランチへの push → **自動本番デプロイ**
- PR / feature ブランチ → **Preview デプロイ**（自動）
- デプロイログ → **Vercel Dashboard** で確認可能

---

## ❓ トラブルシューティング

### プロジェクトが見つからない場合

1. Vercel アカウントが GitHub と連携しているか確認
2. GitHub で `zukkyyoshida-arch/mg-ipad-app` にアクセス権があるか確認
3. 別のブラウザで Vercel にログインし直す

### デプロイが失敗する場合

1. **Vercel Dashboard** > **Project Settings** > **Build & Development** を確認
2. **Output Directory** が `dist` になっているか確認
3. **Deployments** タブで詳細ログを確認

### ドメイン設定が必要な場合

1. **Project Settings** > **Domains**
2. カスタムドメイン追加可能

---

## 📧 サポート

Vercel ドキュメント: https://vercel.com/docs
