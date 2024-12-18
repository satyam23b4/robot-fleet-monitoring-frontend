import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all network interfaces
    port: 3000,      // Use port 3000 for local development
    strictPort: true // Prevent switching ports if 3000 is in use
  },
  build: {
    outDir: "dist",     // Ensure the build output is in the "dist" directory
    emptyOutDir: true,  // Clean the output directory before each build
  },
  resolve: {
    alias: {
      // Add any necessary aliases for simplifying imports
      "@": "/src",
    },
  },
  define: {
    // Define global constants if needed
    "process.env": {},
  },
});
