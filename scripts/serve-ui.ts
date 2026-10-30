import { join, extname } from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";

const PORT = Number(process.env.PORT) || 3333;
const EXAMPLES_DIR = join(import.meta.dir, "..", "examples");
const UI_DIR = join(EXAMPLES_DIR, "reference-ui");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  fetch(req) {
    const url = new URL(req.url);
    const pathname = decodeURIComponent(url.pathname);

    // Root redirect to /reference-ui/
    if (pathname === "/") {
      return Response.redirect("/reference-ui/", 302);
    }
    if (pathname === "/reference-ui" || pathname === "/reference-ui/") {
      const indexPath = join(UI_DIR, "index.html");
      return new Response(readFileSync(indexPath), {
        headers: { "Content-Type": "text/html; charset=utf-8", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Resolve file path: try EXAMPLES_DIR, UI_DIR, or reference-ui prefix
    let filePath = join(EXAMPLES_DIR, pathname);
    if (pathname.startsWith("/reference-ui/")) {
      const rel = pathname.replace(/^\/reference-ui\//, "");
      filePath = join(UI_DIR, rel);
    } else if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      const altPath = join(UI_DIR, pathname);
      if (existsSync(altPath) && !statSync(altPath).isDirectory()) {
        filePath = altPath;
      }
    }

    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      return new Response("404 Not Found", { status: 404 });
    }

    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileBytes = readFileSync(filePath);

    return new Response(fileBytes, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  },
});

console.log(`[HGD Headless UI Server] Running at http://localhost:${server.port}/`);
console.log(`[HGD Headless UI Server] Network access: http://127.0.0.1:${server.port}/`);
