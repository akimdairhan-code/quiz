import Client, { Environment, Local } from "./client";

const apiBaseUrl = typeof window === "undefined"
  ? Environment("staging")
  : (process.env.NEXT_PUBLIC_API_URL ?? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? Local : Environment("staging")));

export function getClient(token?: string) {
  return new Client(apiBaseUrl, {
    auth: token ?? getToken() ?? "",
  });
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
}

export function saveAuth(token: string, role: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
