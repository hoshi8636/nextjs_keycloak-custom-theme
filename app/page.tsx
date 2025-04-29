"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-xl font-semibold mb-4">Not signed in</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session.user?.name}</h1>
      <pre className="bg-gray-100 text-gray-800 p-4 rounded text-sm max-w-lg overflow-x-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <button
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </main>
  );
}
