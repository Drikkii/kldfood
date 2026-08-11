import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const webDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(webDir, "../..");

/** GitHub Pages: VITE_BASE_PATH=/kldfood/ · Beget (свой домен): / */
const base = process.env.VITE_BASE_PATH ?? "/";

/** Сборка по умолчанию: корень репо /dist (для gh-pages и Beget) */
const outDir = process.env.VITE_OUT_DIR ?? join(repoRoot, "dist");

export default defineConfig({
  publicDir: join(webDir, "public"),
  base,
  plugins: [
    react(),
    {
      name: "spa-fallback-404",
      closeBundle() {
        const index = join(outDir, "index.html");
        if (existsSync(index)) {
          cpSync(index, join(outDir, "404.html"));
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": join(webDir, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir,
    emptyOutDir: true,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
});
