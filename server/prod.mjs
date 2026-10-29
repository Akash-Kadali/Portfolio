import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { handleApi } from "./api.mjs";

const root = path.resolve("dist");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mjs": "text/javascript" };
const server = createServer(async (req, res) => {
  if (await handleApi(req, res)) return;
  let file = path.join(root, decodeURIComponent(new URL(req.url, "http://localhost").pathname));
  try { if (statSync(file).isDirectory()) file = path.join(file, "index.html"); } catch { file = path.join(root, "index.html"); }
  res.setHeader("content-type", types[path.extname(file)] ?? "application/octet-stream");
  createReadStream(file).on("error", () => { res.statusCode = 404; res.end("Not found"); }).pipe(res);
});
server.listen(Number(process.env.PORT ?? 4173), () => console.log(`Portfolio intelligence server listening on http://127.0.0.1:${process.env.PORT ?? 4173}`));
