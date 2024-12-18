import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all network interfaces
    port: 3000,      // Use port 3000 for local development
    strictPort: true, // Prevent switching ports if 3000 is in use
    proxy: {
      // Proxy API requests to your backend hosted on Render
      "/api": {
        target: "https://robot-fleet-monitoring-backend.onerender.com", // Replace with your Render backend URL
        changeOrigin: true,
        secure: true,
      },
      "/ws": {
        target: "wss://robot-fleet-monitoring-backend.onerender.com", // Replace with WebSocket URL
        ws: true, // Proxy WebSocket requests
      },
    },
  },
  build: {
    outDir: "dist",     // Ensure the build output is in the "dist" directory
    emptyOutDir: true,  // Clean the output directory before each build
  },
  resolve: {
    alias: {
      "@": "/src", // Simplify imports using "@" for the "src" directory
    },
  },
  define: {
    "process.env": {}, // Define global constants if needed
  },
});
