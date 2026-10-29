import { promises as fs } from "node:fs";
import path from "node:path";

const startedAt = Date.now();
const requests = new Map();
const resultSet = [
  { rank: 1, document: "Ayar optical engine", match: "Thermal drift compensation", score: .94, latency: 82 },
  { rank: 2, document: "Chiplet inspection guide", match: "Surface anomaly detection", score: .89, latency: 76 },
  { rank: 3, document: "Packaging specification", match: "Alignment tolerance", score: .84, latency: 91 },
  { rank: 4, document: "Defect taxonomy", match: "Edge fracture class", score: .78, latency: 69 },
];

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

async function body(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 32_000) throw new Error("payload_too_large");
  }
  return raw ? JSON.parse(raw) : {};
}

function limited(req) {
  const key = req.socket.remoteAddress ?? "local";
  const now = Date.now();
  const history = (requests.get(key) ?? []).filter((time) => now - time < 60_000);
  history.push(now);
  requests.set(key, history);
  return history.length > 30;
}

export async function handleApi(req, res) {
  if (!req.url?.startsWith("/api/")) return false;
  if (limited(req)) return json(res, 429, { error: "Rate limit reached. Try again shortly." }), true;
  const url = new URL(req.url, "http://localhost");

  try {
    if (req.method === "GET" && url.pathname === "/api/status") {
      json(res, 200, { state: "nominal", node: "SK-ML-01", uptime: Math.floor((Date.now() - startedAt) / 1000), services: { retrieval: "online", assistant: "online", intake: "online" }, timestamp: new Date().toISOString() });
      return true;
    }
    if (req.method === "GET" && url.pathname === "/api/retrieval") {
      const model = url.searchParams.get("model") ?? "hybrid-v2";
      const data = resultSet.map((item) => ({ ...item, score: model === "dense-v1" ? item.score - .04 : item.score }));
      json(res, 200, { model, generatedAt: new Date().toISOString(), data });
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/assistant") {
      const input = await body(req);
      const query = String(input.message ?? "").trim().slice(0, 500);
      if (!query) return json(res, 400, { error: "A message is required." }), true;
      const lower = query.toLowerCase();
      let answer = `For “${query}”, inspect the top-ranked evidence and compare the precision/recall curve before changing the retrieval strategy.`;
      if (lower.includes("fast")) answer = "Defect taxonomy is fastest at 69 ms. It ranks fourth, so the latency gain comes with lower relevance confidence (0.78).";
      else if (lower.includes("precision") || lower.includes("recall")) answer = "Precision is strongest at K=1 (94%), while recall peaks at K=10 (95%). K=5 is the best balanced operating point in this illustrative evaluation.";
      else if (lower.includes("top") || lower.includes("explain")) answer = "Ayar optical engine ranks first because Thermal drift compensation is the strongest semantic match, with 0.94 confidence at 82 ms.";
      json(res, 200, { answer, evidence: [resultSet[0].document], generatedAt: new Date().toISOString() });
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/inquiries") {
      const input = await body(req);
      const name = String(input.name ?? "").trim().slice(0, 80);
      const email = String(input.email ?? "").trim().slice(0, 160);
      const brief = String(input.brief ?? "").trim().slice(0, 2000);
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || brief.length < 20) return json(res, 400, { error: "Provide a name, valid email, and a brief of at least 20 characters." }), true;
      const record = { id: crypto.randomUUID(), name, email, brief, createdAt: new Date().toISOString(), status: "received" };
      const directory = path.resolve("server/data");
      await fs.mkdir(directory, { recursive: true });
      await fs.appendFile(path.join(directory, "inquiries.ndjson"), `${JSON.stringify(record)}\n`, "utf8");
      json(res, 201, { id: record.id, status: record.status, message: "Transmission received." });
      return true;
    }
    json(res, 404, { error: "Unknown API route." });
    return true;
  } catch (error) {
    json(res, error?.message === "payload_too_large" ? 413 : 500, { error: "The service could not process this request." });
    return true;
  }
}

export function apiPlugin() {
  return { name: "portfolio-api", configureServer(server) { server.middlewares.use(async (req, res, next) => { if (!(await handleApi(req, res))) next(); }); } };
}
