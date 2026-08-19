import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function patchHtml(file, { canonical, title, robots } = {}) {
  let html = readFileSync(file, "utf8");
  if (canonical) {
    html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
    html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  }
  if (title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
  }
  if (robots) {
    html = html.replace(
      /<meta name="robots" content="[^"]*" \/>/,
      `<meta name="robots" content="${robots}" />`
    );
  }
  writeFileSync(file, html);
}

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
if (existsSync(join(dist, "logo.png"))) cpSync(join(dist, "logo.png"), join(root, "logo.png"));
if (existsSync(join(dist, "logo-mark.png"))) cpSync(join(dist, "logo-mark.png"), join(root, "logo-mark.png"));
if (existsSync(join(dist, "logo-icon.png"))) cpSync(join(dist, "logo-icon.png"), join(root, "logo-icon.png"));
if (existsSync(join(dist, "_redirects"))) cpSync(join(dist, "_redirects"), join(root, "_redirects"));
if (existsSync(join(dist, "robots.txt"))) cpSync(join(dist, "robots.txt"), join(root, "robots.txt"));
if (existsSync(join(dist, "sitemap.xml"))) cpSync(join(dist, "sitemap.xml"), join(root, "sitemap.xml"));
const routes = [
  ["harbour-kitchen", { canonical: "https://webworkco.com/harbour-kitchen/", title: "Harbour Kitchen | Sample restaurant site by Web Work Co" }],
  ["drift-supply", { canonical: "https://webworkco.com/drift-supply/", title: "Drift Supply | Sample shop site by Web Work Co" }],
  ["about", { canonical: "https://webworkco.com/about", title: "About Web Work Co | Website studio" }],
  ["privacy", { canonical: "https://webworkco.com/privacy", title: "Privacy | Web Work Co" }],
  ["terms", { canonical: "https://webworkco.com/terms", title: "Terms | Web Work Co" }],
];
for (const [folder, meta] of routes) {
  mkdirSync(join(root, folder), { recursive: true });
  const file = join(root, folder, "index.html");
  cpSync(join(dist, "index.html"), file);
  patchHtml(file, meta);
}
cpSync(join(dist, "index.html"), join(root, "404.html"));
patchHtml(join(root, "404.html"), { robots: "noindex, follow" });

console.log("Exported built site to repo root for Cloudflare.");
