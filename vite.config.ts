import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true, gzipSize: true, brotliSize: true })],
  server: {
    port: 3000,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700, // raise warning limit a bit if you want
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "vendor_react";
            }
            if (id.includes("react-router-dom")) {
              return "vendor_react_router";
            }
            if (id.includes("sonner")) {
              return "vendor_sonner";
            }
            if (id.includes("zod") || id.includes("react-hook-form") || id.includes("@tanstack")) {
              return "vendor_form_validation";
            }
            // add more vendors or libs here if needed
            return "vendor_misc";
          }
        },
      },
    },
  },
  logLevel: "info",
});
