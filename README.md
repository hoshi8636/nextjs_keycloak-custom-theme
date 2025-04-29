# Next.js + Keycloak ログイン統合プロジェクト

このプロジェクトは、Next.js 14（App Router）と Keycloak 22.0.1 を連携し、  
利用者向けにカスタマイズされたログイン画面を提供する Web アプリケーション基盤です。

## 📦 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- Keycloak 22.0.1
- Docker / Docker Compose

---

## 📂 ディレクトリ構成

```
keycloak-login-ui/
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
├── .env.local
├── package.json
├── next.config.ts
├── README.md
└── その他Next.jsファイル
```

---

## 🚀 セットアップ手順

### 1. 必要なパッケージインストール

```bash
cd keycloak-login-ui
npm install
```

### 2. Keycloak の起動

```bash
docker compose up -d
```

- アクセス URL: [http://localhost:8080](http://localhost:8080)
- 管理者ログイン:
  - ID: `admin`
  - PW: `admin`

---

### 3. Keycloak 初期設定

- `myrealm` Realm を作成
- クライアント ID `nextjs-client` を作成
- リダイレクト URI に以下を設定：

```
http://localhost:3000/api/auth/callback/keycloak
```

- クライアントシークレットを発行し、メモしておく

---

### 4. カスタムテーマ適用

- `myrealm` の Realm 設定 → **ログインテーマ**を `my-login-theme` に変更

---

### 5. Next.js 環境変数設定 `.env.local`

```env
KEYCLOAK_CLIENT_ID=nextjs-client
KEYCLOAK_CLIENT_SECRET=＜ここにKeycloakで発行したシークレットを貼る＞
KEYCLOAK_ISSUER=http://localhost:8080/realms/myrealm

NEXTAUTH_SECRET=＜openssl rand -base64 32 などで生成したランダム文字列＞
NEXTAUTH_URL=http://localhost:3000
```

---

### 6. Next.js アプリ起動

```bash
npm run dev
```

- アクセス URL: [http://localhost:3000/login](http://localhost:3000/login)

---

## ⚙️ docker-compose.yml 構成

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

volumes:
  keycloak_data:
```
