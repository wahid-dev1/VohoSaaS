import { createContext, useContext, useState, useEffect } from "react";
import { getApiBaseUrl } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists (from cookie/localStorage fallback)
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      setToken(saved);
      // Optionally validate token with backend
      fetch(`${getApiBaseUrl()}/api/auth/me`, {
        headers: { Authorization: `Bearer ${saved}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (slug, email, password) => {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Tenant-Slug": slug },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token); // fallback, later replace with cookies
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token"); // fallback
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
