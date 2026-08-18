import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
if (!existsSync(dist)) {
  throw new Error("dist/ is missing. Run vite build first.");
}

const assets = join(root, "assets");
if (existsSync(assets)) rmSync(assets, { recursive: true, force: true });

cpSync(join(dist, "index.html"), join(root, "index.html"));
if (existsSync(join(dist, "assets"))) cpSync(join(dist, "assets"), assets, { recursive: true });
if (existsSync(join(dist, "images"))) cpSync(join(dist, "images"), join(root, "images"), { recursive: true });
if (existsSync(join(dist, "logo.jpg"))) cpSync(join(dist, "logo.jpg"), join(root, "logo.jpg"));
if (existsSync(join(dist, "_redirects"))) cpSync(join(dist, "_redirects"), join(root, "_redirects"));
if (existsSync(join(dist, "index.html"))) {
  mkdirSync(join(root), { recursive: true });
  cpSync(join(dist, "index.html"), join(root, "404.html"));
}

console.log("Exported built site to repo root for Cloudflare.");
