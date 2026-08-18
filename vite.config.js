import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  root: "client",
  publicDir: path.resolve("public"),
  build: {
    outDir: path.resolve("dist"),
    emptyOutDir: true,
  },
});
