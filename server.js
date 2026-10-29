import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname);
const envPath = resolve(root, ".env");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const loadEnv = () => {
  if (!existsSync(envPath)) return;
  readFileSync(envPath, "utf8").split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator < 1) return;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
    if (!process.env[key]) process.env[key] = value;
  });
};

loadEnv();

const apiEndpoint = "https://apis.data.go.kr/6260000/AttractionService/getAttractionKr";
const apiKey = process.env.BUSAN_ATTRACTION_API_KEY;
const port = Number(process.env.PORT) || 8787;

const sendJson = (response, status, payload) => {
  response.statusCode = status;
  response.setHeader("Content-Type", mime[".json"]);
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
};

const numberInRange = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
};

const getAttractions = async (requestUrl, response) => {
  if (!apiKey) {
    return sendJson(response, 503, {
      ok: false,
      error: "BUSAN_ATTRACTION_API_KEY가 없습니다. 터미널에서 npm run setup-api를 실행해 주세요."
    });
  }

  const pageNo = numberInRange(requestUrl.searchParams.get("pageNo"), 1, 1, 1000);
  const numOfRows = numberInRange(requestUrl.searchParams.get("numOfRows"), 12, 1, 50);
  const contentId = requestUrl.searchParams.get("UC_SEQ")?.trim();
  const upstream = new URL(apiEndpoint);
  upstream.searchParams.set("serviceKey", apiKey);
  upstream.searchParams.set("pageNo", String(pageNo));
  upstream.searchParams.set("numOfRows", String(numOfRows));
  upstream.searchParams.set("resultType", "json");
  if (contentId) upstream.searchParams.set("UC_SEQ", contentId.slice(0, 30));

  try {
    const apiResponse = await fetch(upstream, {
      headers: { Accept: "application/json", "User-Agent": "Busan-Tourism-Portfolio/1.0" },
      signal: AbortSignal.timeout(10000)
    });
    const raw = await apiResponse.text();
    if (!apiResponse.ok) {
      return sendJson(response, 502, { ok: false, error: `부산명소정보 API 응답 오류 (${apiResponse.status})` });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return sendJson(response, 502, { ok: false, error: "API가 JSON이 아닌 응답을 반환했습니다." });
    }

    return sendJson(response, 200, { ok: true, source: "부산광역시 부산명소정보 서비스", data });
  } catch (error) {
    const message = error?.name === "TimeoutError" ? "API 응답 시간이 초과되었습니다." : "API에 연결할 수 없습니다.";
    return sendJson(response, 502, { ok: false, error: message });
  }
};

const server = createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/ping") {
    return sendJson(response, 200, { ok: true, busanAttractionApi: Boolean(apiKey) });
  }

  if (requestUrl.pathname === "/api/busan-attractions") {
    if (request.method !== "GET") return sendJson(response, 405, { ok: false, error: "GET 요청만 지원합니다." });
    return getAttractions(requestUrl, response);
  }

  const requestPath = decodeURIComponent(requestUrl.pathname);
  const target = resolve(root, `.${requestPath === "/" ? "/index.html" : requestPath}`);
  if (!target.startsWith(root + sep) || !existsSync(target) || !statSync(target).isFile()) {
    response.statusCode = 404;
    return response.end("Not found");
  }
  response.setHeader("Content-Type", mime[extname(target).toLowerCase()] || "application/octet-stream");
  createReadStream(target).pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Busan Tourism Portfolio: http://localhost:${port}`);
  console.log(apiKey ? "부산명소정보 API 키를 불러왔습니다." : "API 키 없음: npm run setup-api를 실행해 주세요.");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") console.error(`${port} 포트가 이미 사용 중입니다. 실행 중인 창을 확인해 주세요.`);
  else console.error(error);
});
