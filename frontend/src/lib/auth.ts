import { API_BASE_URL } from "./api";

export async function checkExpiry(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function tryRefresh(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * Confirms the stored access token is still valid, transparently refreshing it
 * with the stored refresh token if it has expired. Returns false (and clears
 * both tokens) when neither token is usable, so callers can redirect to login.
 */
export async function ensureValidSession(): Promise<boolean> {
  const token = localStorage.getItem("token");
  if (!token) return false;

  if (await checkExpiry(token)) return true;

  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken && (await tryRefresh(refreshToken))) return true;

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  return false;
}
