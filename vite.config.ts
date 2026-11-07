import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The WebGL engine is intentionally large but split from app code below.
    chunkSizeWarningLimit: 1_250,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("three")) return "three-vendor";
          if (id.includes("react")) return "react-vendor";
          return "vendor";
        },
      },
    },
  },
});
