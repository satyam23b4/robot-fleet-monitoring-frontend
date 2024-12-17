import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind Vite to all network interfaces
    port: 3000,      // Force Vite to use port 3000
    strictPort: true // Ensure it doesn't switch to a different port
  },
});
