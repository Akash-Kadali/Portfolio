import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { handleApi } from "./api.mjs";

const root = path.resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mjs": "text/javascript",
};
const server = createServer(async (req, res) => {
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("referrer-policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader(
    "content-security-policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  );
  if (await handleApi(req, res)) return;
  let file = path.join(
    root,
    decodeURIComponent(new URL(req.url, "http://localhost").pathname),
  );
  try {
    if (statSync(file).isDirectory()) file = path.join(file, "index.html");
  } catch {
    file = path.join(root, "index.html");
  }
  const extension = path.extname(file);
  res.setHeader("content-type", types[extension] ?? "application/octet-stream");
  res.setHeader(
    "cache-control",
    extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  );
  if (req.method === "HEAD") return res.end();
  createReadStream(file)
    .on("error", () => {
      res.statusCode = 404;
      res.end("Not found");
    })
    .pipe(res);
});
server.listen(Number(process.env.PORT ?? 4173), () =>
  console.log(
    `Portfolio intelligence server listening on http://127.0.0.1:${process.env.PORT ?? 4173}`,
  ),
);
