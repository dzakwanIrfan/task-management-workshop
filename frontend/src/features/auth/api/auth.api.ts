import { authFetch } from "./auth-fetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type PublicUser = { id: number; email: string };
export type Credentials = { email: string; password: string };
export type LoginResult = { accessToken: string; user: PublicUser };

async function errorMessage(response: Response): Promise<string> {
  const data: unknown = await response.json().catch(() => null);

  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }

  return `Request gagal (${response.status})`;
}

export async function register(input: Credentials): Promise<PublicUser> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json();
}

export async function login(input: Credentials): Promise<LoginResult> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json();
}

export async function getMe(): Promise<PublicUser> {
  const response = await authFetch("/auth/me");
  if (!response.ok) throw new Error("Gagal mengambil profil");
  return response.json();
}
