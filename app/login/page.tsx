"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
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
