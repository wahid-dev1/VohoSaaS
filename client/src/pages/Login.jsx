// src/pages/Login.jsx
import { useState } from "react";

function Login() {
  const [form, setForm] = useState({ slug: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);   // ✅ Save token
      setMessage("✅ Login successful. Redirecting...");
      const slug = form.slug;  // e.g. "acme"
      window.location.href = `http://${slug}.lvh.me:5173/dashboard`;
         // ✅ Redirect to dashboard
    } else {
      setMessage("❌ Error: " + (data.message || res.status));
    }
  } catch (err) {
    setMessage("❌ Network error");
  }
};

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="slug"
          placeholder="Tenant Slug"
          value={form.slug}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
