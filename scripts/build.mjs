import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "client/css"), { recursive: true });
await mkdir(resolve(dist, "client/js"), { recursive: true });
await mkdir(resolve(dist, "client/assets/images/report"), { recursive: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });
await cp(resolve(root, "index.html"), resolve(dist, "client/index.html"));
await cp(resolve(root, "css/cardnews.css"), resolve(dist, "client/css/cardnews.css"));
await cp(resolve(root, "css/cardnews-polish.css"), resolve(dist, "client/css/cardnews-polish.css"));
await cp(resolve(root, "js/cardnews.js"), resolve(dist, "client/js/cardnews.js"));
await cp(resolve(root, "assets/images/report"), resolve(dist, "client/assets/images/report"), { recursive: true });
await cp(resolve(root, "assets/images/og.png"), resolve(dist, "client/assets/images/og.png"));
await cp(resolve(root, ".openai/hosting.json"), resolve(dist, ".openai/hosting.json"));
await writeFile(resolve(dist, "server/index.js"), `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n`);
