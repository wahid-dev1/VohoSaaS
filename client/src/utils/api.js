// src/utils/api.js

/**
 * Get API base URL depending on current host.
 * 
 * Example:
 *  If frontend is at http://acme.lvh.me:5173
 *  → API base will be http://acme.lvh.me:4000
 */
export function getApiBaseUrl() {
  const { protocol, hostname } = window.location;

  // Port 4000 for backend (adjust if your server runs elsewhere)
  return `${protocol}//${hostname}:4000`;
}

/**
 * Helper wrapper for fetch with auth token
 */
export async function apiFetch(path, options = {}, token) {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `API error ${res.status}`);
  }
  return data;
}
