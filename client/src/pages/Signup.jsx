// src/pages/Signup.jsx
import { useState } from "react";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/tenants/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful ✅ Token: " + data.token);
      } else {
        setMessage("❌ Error: " + (data.message || res.status));
      }
    } catch (err) {
      setMessage("❌ Network error");
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tenant Name"
          value={form.name}
          onChange={handleChange}
        />
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
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
