# 📘 README: Next.js + Keycloak (Docker) ログイン統合プロジェクト

このプロジェクトは、Next.js アプリケーションと Keycloak (v22.0.1) を連携し、**Web アプリ利用者用ログイン画面をカスタマイズ**しつつ、**認証処理を完全に構築する**環境です。

## 📦 技術構成

- Next.js 14 (App Router + TypeScript)
- NextAuth.js
- Keycloak 22.0.1
- Docker / Docker Compose

## 🗂 ディレクトリ構成

```
project-root/
├── docker-compose.yml
├── keycloak/
│   └── themes/
│       └── my-login-theme/
│           ├── theme.properties
│           └── login/
│               ├── login.ftl
│               └── theme.properties
├── keycloak-login-ui/ ← Next.js プロジェクト
│   ├── app/
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── login/page.tsx
│   │   └── page.tsx
│   ├── .env.local
│   └── ...
```

## 🚀 手順

### ① Next.js プロジェクトの作成

```bash
npx create-next-app@latest keycloak-login-ui --app --typescript --tailwind
cd keycloak-login-ui
```

### ② NextAuth.js のインストール

```bash
npm install next-auth
```

## 🔐 Keycloak の構築（docker-compose）

### ① `docker-compose.yml` をプロジェクトルートに作成

```yaml
version: "3.8"

services:
  keycloak:
    image: quay.io/keycloak/keycloak:22.0.1
    container_name: keycloak
    restart: unless-stopped
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

### ② カスタムテーマ配置

```
keycloak/
└── themes/
    └── my-login-theme/
        ├── theme.properties
        └── login/
            ├── login.ftl
            └── theme.properties
```

#### `theme.properties`（ルート）

```properties
parent=base
import=common/keycloak
```

#### `login/theme.properties`

```properties
parent=base
```

#### `login.ftl`（カスタム UI の一例）

```ftl
<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=true displayInfo=true; section>
  <#if section = "form">
    <h2 style="color: crimson;">🚀 これはカスタムログイン画面です</h2>
    <form action="${url.loginAction}" method="post">
      <label>🎯 カスタムユーザー名</label>
      <input name="username" type="text" value="${(login.username!'')}" autofocus/>
      <label>🔒 カスタムパスワード</label>
      <input name="password" type="password"/>
      <button type="submit">🚀 ログインする！</button>
    </form>
  </#if>
</@layout.registrationLayout>
```

### ③ 起動

```bash
docker compose up -d
```

- 管理画面: http://localhost:8080/
- ユーザー: `admin` / `admin`

## 🌐 Next.js 側：NextAuth + Keycloak 連携

### ① API Route：`app/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```

### ② .env.local

```env
KEYCLOAK_CLIENT_ID=nextjs-client
KEYCLOAK_CLIENT_SECRET=＜my-app realmのclientシークレット＞
KEYCLOAK_ISSUER=http://localhost:8080/realms/my-app

NEXTAUTH_SECRET=＜openssl rand -base64 32で生成＞
NEXTAUTH_URL=http://localhost:3000
```

## 🔑 Realm 分離によるテーマ切替

- `master`：Keycloak 管理用 → デフォルトテーマ
- `my-app`：アプリ認証用 → `my-login-theme` を適用

Next.js の `.env.local` にて `KEYCLOAK_ISSUER` を `my-app` Realm に設定する。

## 🧪 認証画面の構成

### `/login`（app/login/page.tsx）

```tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">ログインしてください</h1>
      <button
        onClick={() => signIn()}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Keycloakでログイン
      </button>
    </main>
  );
}
```

### `/`（app/page.tsx）

```tsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not logged in</p>;

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Welcome, {session.user?.name}</h1>
      <pre className="bg-gray-100 text-gray-800 p-4 rounded mt-4">
        {JSON.stringify(session, null, 2)}
      </pre>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </main>
  );
}
```

## 🛡 middleware.ts で認証ガード

```ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
```

## ✅ 実行方法まとめ

```bash
# Keycloak を起動
docker compose up -d

# Next.js を起動
cd keycloak-login-ui
npm run dev

# ブラウザアクセス
http://localhost:3000/login
```

## ✅ 状態チェック

- `http://localhost:8080/admin/` → Keycloak デフォルトテーマ
- `http://localhost:3000/login` → カスタムテーマを適用したログイン画面（Keycloak 側）
- `http://localhost:3000/` → ログイン済みユーザーのみアクセス可
