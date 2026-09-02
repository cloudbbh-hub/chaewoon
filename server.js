import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname);
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".json":"application/json; charset=utf-8" };
const server = createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.url === "/ping") { response.setHeader("Content-Type", mime[".json"]); return response.end(JSON.stringify({ ok:true, pexels:false, codex:false, gemini:false, openai:false })); }
  const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
  const target = resolve(root, `.${requestPath === "/" ? "/index.html" : requestPath}`);
  if (!target.startsWith(root + sep) || !existsSync(target) || !statSync(target).isFile()) { response.statusCode = 404; return response.end("Not found"); }
  response.setHeader("Content-Type", mime[extname(target).toLowerCase()] || "application/octet-stream");
  createReadStream(target).pipe(response);
});
server.listen(8787, "0.0.0.0", () => console.log("PLY Cardnews Studio: http://localhost:8787"));
server.on("error", error => { if (error.code === "EADDRINUSE") console.error("8787 포트가 이미 사용 중입니다. 실행 중인 창을 확인해 주세요."); else console.error(error); });
