"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { register } from "@/features/auth/api/auth.api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({ email, password });
      setCreated(true);
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Register gagal");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-bold">Akun berhasil dibuat</h1>
        <p className="mt-2">Sekarang login dengan email dan password tadi.</p>
        <Link className="mt-4 inline-block text-blue-600" href="/login">
          Ke halaman login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        <label className="block">
          <span>Password</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {submitting ? "Menyimpan..." : "Buat akun"}
        </button>
      </form>
      <Link className="mt-4 inline-block text-blue-600" href="/login">
        Sudah punya akun? Login
      </Link>
    </main>
  );
}
