import { promises as fs } from "node:fs";
import path from "node:path";
import { matchJob, profile, searchKnowledge } from "./knowledge.mjs";

const startedAt = Date.now();
const requests = new Map();
const resultSet = [
  {
    rank: 1,
    document: "Ayar optical engine",
    match: "Thermal drift compensation",
    score: 0.94,
    latency: 82,
  },
  {
    rank: 2,
    document: "Chiplet inspection guide",
    match: "Surface anomaly detection",
    score: 0.89,
    latency: 76,
  },
  {
    rank: 3,
    document: "Packaging specification",
    match: "Alignment tolerance",
    score: 0.84,
    latency: 91,
  },
  {
    rank: 4,
    document: "Defect taxonomy",
    match: "Edge fracture class",
    score: 0.78,
    latency: 69,
  },
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
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("invalid_json");
    error.code = "INVALID_JSON";
    throw error;
  }
}

function limited(req) {
  const key = req.socket.remoteAddress ?? "local";
  const now = Date.now();
  const history = (requests.get(key) ?? []).filter(
    (time) => now - time < 60_000,
  );
  history.push(now);
  requests.set(key, history);
  return history.length > 30;
}

export async function handleApi(req, res) {
  if (!req.url?.startsWith("/api/")) return false;
  if (limited(req))
    return (
      json(res, 429, { error: "Rate limit reached. Try again shortly." }),
      true
    );
  const url = new URL(req.url, "http://localhost");

  try {
    if (req.method === "GET" && url.pathname === "/api/status") {
      json(res, 200, {
        state: "nominal",
        node: "SK-ML-01",
        uptime: Math.floor((Date.now() - startedAt) / 1000),
        services: {
          retrieval: "online",
          assistant: "online",
          intake: "online",
          telemetry: "online",
          knowledge: "online",
        },
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    if (req.method === "GET" && url.pathname === "/api/retrieval") {
      const model = url.searchParams.get("model") ?? "hybrid-v2";
      const data = resultSet.map((item) => ({
        ...item,
        score: model === "dense-v1" ? item.score - 0.04 : item.score,
      }));
      json(res, 200, { model, generatedAt: new Date().toISOString(), data });
      return true;
    }
    if (req.method === "GET" && url.pathname === "/api/profile") {
      json(res, 200, {
        version: "2026.1",
        updatedAt: "2026-10-29",
        data: profile,
      });
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/search") {
      const input = await body(req);
      const query = String(input.query ?? "")
        .trim()
        .slice(0, 300);
      if (query.length < 2)
        return (
          json(res, 400, { error: "Search requires at least two characters." }),
          true
        );
      const results = searchKnowledge(query);
      json(res, 200, {
        query,
        count: results.length,
        results,
        generatedAt: new Date().toISOString(),
      });
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/job-match") {
      const input = await body(req);
      const description = String(input.description ?? "")
        .trim()
        .slice(0, 12000);
      if (description.length < 30)
        return (
          json(res, 400, {
            error: "Provide a job description of at least 30 characters.",
          }),
          true
        );
      json(res, 200, {
        ...matchJob(description),
        generatedAt: new Date().toISOString(),
      });
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/assistant") {
      const input = await body(req);
      const query = String(input.message ?? "")
        .trim()
        .slice(0, 500);
      if (!query)
        return (json(res, 400, { error: "A message is required." }), true);
      const lower = query.toLowerCase();
      let answer = `For “${query}”, inspect the top-ranked evidence and compare the precision/recall curve before changing the retrieval strategy.`;
      if (lower.includes("fast"))
        answer =
          "Defect taxonomy is fastest at 69 ms. It ranks fourth, so the latency gain comes with lower relevance confidence (0.78).";
      else if (lower.includes("precision") || lower.includes("recall"))
        answer =
          "Precision is strongest at K=1 (94%), while recall peaks at K=10 (95%). K=5 is the best balanced operating point in this illustrative evaluation.";
      else if (lower.includes("top") || lower.includes("explain"))
        answer =
          "Ayar optical engine ranks first because Thermal drift compensation is the strongest semantic match, with 0.94 confidence at 82 ms.";
      json(res, 200, {
        answer,
        evidence: [resultSet[0].document],
        generatedAt: new Date().toISOString(),
      });
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/vitals") {
      const input = await body(req);
      const record = {
        navigationMs: Math.max(
          0,
          Math.min(120000, Number(input.navigationMs) || 0),
        ),
        resourceKb: Math.max(
          0,
          Math.min(500000, Number(input.resourceKb) || 0),
        ),
        viewport: String(input.viewport ?? "unknown").slice(0, 24),
        reducedMotion: Boolean(input.reducedMotion),
        createdAt: new Date().toISOString(),
      };
      const directory = path.resolve("server/data");
      await fs.mkdir(directory, { recursive: true });
      await fs.appendFile(
        path.join(directory, "vitals.ndjson"),
        `${JSON.stringify(record)}\n`,
        "utf8",
      );
      json(res, 202, { status: "recorded" });
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/inquiries") {
      const input = await body(req);
      const name = String(input.name ?? "")
        .trim()
        .slice(0, 80);
      const email = String(input.email ?? "")
        .trim()
        .slice(0, 160);
      const brief = String(input.brief ?? "")
        .trim()
        .slice(0, 2000);
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || brief.length < 20)
        return (
          json(res, 400, {
            error:
              "Provide a name, valid email, and a brief of at least 20 characters.",
          }),
          true
        );
      const record = {
        id: crypto.randomUUID(),
        name,
        email,
        brief,
        createdAt: new Date().toISOString(),
        status: "received",
      };
      const directory = path.resolve("server/data");
      await fs.mkdir(directory, { recursive: true });
      await fs.appendFile(
        path.join(directory, "inquiries.ndjson"),
        `${JSON.stringify(record)}\n`,
        "utf8",
      );
      json(res, 201, {
        id: record.id,
        status: record.status,
        message: "Transmission received.",
      });
      return true;
    }
    json(res, 404, { error: "Unknown API route." });
    return true;
  } catch (error) {
    const status =
      error?.message === "payload_too_large"
        ? 413
        : error?.code === "INVALID_JSON"
          ? 400
          : 500;
    json(res, status, {
      error:
        status === 400
          ? "Request body must contain valid JSON."
          : "The service could not process this request.",
    });
    return true;
  }
}

export function apiPlugin() {
  return {
    name: "portfolio-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!(await handleApi(req, res))) next();
      });
    },
  };
}
