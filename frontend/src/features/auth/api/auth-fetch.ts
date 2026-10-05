import { clearToken, getToken } from "../session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function authFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  if (!token) {
    window.location.replace("/login");
    throw new Error("Silakan login terlebih dahulu");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.replace("/login");
    throw new Error("Sesi berakhir. Silakan login kembali");
  }

  return response;
}
