export const TOKEN_KEY = "workshop_access_token";

export function saveToken(token: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_KEY}=${token}; Path=/; SameSite=Lax${secure}`;
}

export function getToken(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${TOKEN_KEY}=`));
  return cookie?.slice(TOKEN_KEY.length + 1) ?? null;
}

export function clearToken() {
  document.cookie = `${TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}
