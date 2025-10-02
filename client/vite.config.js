export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // accept all hosts
    port: 5173,
  },
});