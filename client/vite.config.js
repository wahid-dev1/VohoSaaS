import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // 👈 run on subdomain
    port: 5173,
    allowedHosts: [
      '.lvh.me', // allow all subdomains of lvh.me
    ]
  },
});