# 🚀 Next.js + Keycloak ログイン統合プロジェクト（Docker 開発環境対応版）

このプロジェクトは、Next.js 14（App Router）と Keycloak 22.0.1 を連携し、  
カスタマイズログイン画面を提供する Web アプリケーション基盤を構築します。

Docker 環境前提で開発・運用するため、セットアップが非常に簡単になっています。

---

# 📦 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- Keycloak 22.0.1
- Docker / Docker Compose

---

# 📂 ディレクトリ構成

```
nextjs_keycloak-custom-theme/
├── app/
│   ├── api/auth/[...nextauth]/route.ts
│   ├── login/page.tsx
│   └── page.tsx
├── keycloak/
│   └── themes/
│       └── my-login-theme/
│           ├── theme.properties
│           └── login/
│               ├── login.ftl
│               └── theme.properties
├── docker-compose.yml
├── Dockerfile.dev
├── .env.local
├── package.json
├── next.config.ts
├── middleware.ts
├── README.md
└── その他Next.js関連ファイル
```

---

# 🚀 セットアップ手順

## 1. ソースコードクローン & 依存インストール

```bash
git clone https://github.com/hoshi8636/nextjs_keycloak-custom-theme.git
cd nextjs_keycloak-custom-theme
npm install
```

---

## 2. .env.local 設定

以下の内容で `.env.local` を作成します。

```env
# Keycloak連携設定
KEYCLOAK_CLIENT_ID=nextjs-client
KEYCLOAK_CLIENT_SECRET=＜Keycloakで発行したシークレット＞
KEYCLOAK_ISSUER=http://keycloak:8080/realms/myrealm

# NextAuth.js用
NEXTAUTH_SECRET=＜openssl rand -base64 32などで生成したランダム文字列＞
NEXTAUTH_URL=http://localhost:3000
```

---

## 3. Docker コンテナ起動（Keycloak + Next.js）

```bash
docker compose up -d --build
```

- Keycloak 管理画面: [http://localhost:8080](http://localhost:8080)
- Next.js アプリケーション: [http://localhost:3000/login](http://localhost:3000/login)

---

## 4. Keycloak 初期設定

1. Keycloak 管理画面ログイン

   - ID: `admin`
   - PW: `admin`

2. Realm 作成

   - 名称: `myrealm`

3. クライアント作成

   - Client ID: `nextjs-client`
   - Client authentication: **ON**
   - Valid redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
   - Web origins: `http://localhost:3000` または `*`
   - Standard flow enabled: **ON**
   - Direct access grants enabled: **ON**

4. クライアントシークレット発行（`.env.local`に反映）

---

## 5. Realm の設定

- Realm Settings → General タブ → Frontend URL に `http://localhost:8080/` を設定
- Realm Settings → Themes タブ → Login Theme に `my-login-theme` を選択

---

# ⚙️ docker-compose.yml 詳細

```yaml
version: "3.8"

services:
  keycloak:
    image: quay.io/keycloak/keycloak:22.0.1
    container_name: keycloak
    ports:
      - 8080:8080
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev
    volumes:
      - ./keycloak/themes:/opt/keycloak/themes
      - keycloak_data:/opt/keycloak/data

  nextjs:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: nextjs
    ports:
      - 3000:3000
    env_file:
      - .env.local
    environment:
      NODE_ENV: development
      NEXT_DISABLE_LIGHTNINGCSS: true

volumes:
  keycloak_data:
```

---

# 🛠 開発 Tips

- Next.js ソースを変更すると、自動リビルドされホットリロードされます
- Keycloak の設定変更後は、必ず Keycloak コンテナを再起動すること
- `.env.local` を変更した場合は、Next.js コンテナも再起動してください

```bash
docker compose restart nextjs
```
