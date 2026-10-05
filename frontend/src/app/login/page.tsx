"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { login } from "@/features/auth/api/auth.api";
import { saveToken } from "@/features/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await login({ email, password });
      saveToken(result.accessToken);
      router.replace("/tasks");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login gagal");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        <label className="block">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {submitting ? "Memeriksa..." : "Login"}
        </button>
      </form>
      <Link className="mt-4 inline-block text-blue-600" href="/register">
        Belum punya akun? Register
      </Link>
    </main>
  );
}
