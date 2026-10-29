import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const envPath = resolve(import.meta.dirname, "..", ".env");
const terminal = createInterface({ input, output });

const apiKey = (await terminal.question("부산명소정보 서비스 API 키를 입력하세요: ")).trim();
terminal.close();

if (!apiKey) {
  console.error("API 키가 입력되지 않아 저장하지 않았습니다.");
  process.exitCode = 1;
} else {
  const current = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  const lines = current.split(/\r?\n/).filter(Boolean);
  const next = lines.filter((line) => !line.startsWith("BUSAN_ATTRACTION_API_KEY="));
  next.unshift(`BUSAN_ATTRACTION_API_KEY=${apiKey}`);
  if (!next.some((line) => line.startsWith("PORT="))) next.push("PORT=8787");
  writeFileSync(envPath, `${next.join("\n")}\n`, { encoding: "utf8", mode: 0o600 });
  console.log(".env에 API 키를 저장했습니다. 이제 `npm start`를 실행하세요.");
}
