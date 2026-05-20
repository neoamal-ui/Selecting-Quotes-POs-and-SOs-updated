// Vercel serverless proxy.
// Env:
//   GITHUB_FEEDBACK_TOKEN, GITHUB_FEEDBACK_REPO        (GitHub issues)
//   REDIS_URL                                          (Vercel Redis — annotation store)
//   BLOB_READ_WRITE_TOKEN                              (Vercel Blob — screenshots)
//
// Actions:
//   GitHub:      create-issue, add-comment, ensure-label, upload-screenshot (legacy)
//   Redis:       save-annotation, list-annotations, delete-annotation
//   Blob:        upload-blob

import { put } from "@vercel/blob";
import { createClient } from "redis";

const GH = "https://api.github.com";

function ghHeaders() {
  return {
    Authorization: "Bearer " + process.env.GITHUB_FEEDBACK_TOKEN,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// ─── Redis (node-redis, reused across invocations) ────────────
async function redis() {
  if (!process.env.REDIS_URL) throw new Error("Redis not configured");
  let c = globalThis.__fbRedis;
  if (c && c.isOpen) return c;
  c = createClient({ url: process.env.REDIS_URL });
  c.on("error", (e) => console.error("[redis]", e.message));
  await c.connect();
  globalThis.__fbRedis = c;
  return c;
}

const kvKey = (project) => `fb:annotations:${project || "default"}`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { action, ...params } = req.body || {};

  try {
    switch (action) {
      // ── Redis: annotations ─────────────────────────────────
      case "save-annotation": {
        const { project, annotation } = params;
        if (!annotation?.id) return res.status(400).json({ error: "annotation.id required" });
        const c = await redis();
        await c.hSet(kvKey(project), annotation.id, JSON.stringify({ ...annotation, updatedAt: Date.now() }));
        return res.json({ ok: true });
      }

      case "list-annotations": {
        const { project } = params;
        const c = await redis();
        const map = await c.hGetAll(kvKey(project));
        const items = Object.values(map || {}).map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
        items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        return res.json({ items });
      }

      case "delete-annotation": {
        const { project, id } = params;
        const c = await redis();
        await c.hDel(kvKey(project), id);
        return res.json({ ok: true });
      }

      // ── Blob: screenshots ──────────────────────────────────
      case "upload-blob": {
        if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ error: "Blob not configured" });
        const { filename, content } = params; // content = base64
        const buf = Buffer.from(content, "base64");
        const blob = await put(`feedback/${filename}`, buf, {
          access: "public",
          contentType: "image/png",
          token: process.env.BLOB_READ_WRITE_TOKEN,
          addRandomSuffix: true,
        });
        return res.json({ url: blob.url });
      }

      // ── GitHub (unchanged) ─────────────────────────────────
      case "create-issue":
      case "add-comment":
      case "ensure-label":
      case "upload-screenshot": {
        const token = process.env.GITHUB_FEEDBACK_TOKEN;
        const repo = process.env.GITHUB_FEEDBACK_REPO;
        if (!token || !repo) return res.status(500).json({ error: "GitHub not configured" });
        const [owner, repoName] = repo.split("/");

        if (action === "create-issue") {
          const r = await fetch(`${GH}/repos/${owner}/${repoName}/issues`, {
            method: "POST", headers: ghHeaders(),
            body: JSON.stringify({ title: params.title, body: params.body, labels: params.labels }),
          });
          if (!r.ok) return res.status(r.status).json({ error: await r.text() });
          const issue = await r.json();
          return res.json({ number: issue.number, url: issue.html_url });
        }
        if (action === "add-comment") {
          const r = await fetch(`${GH}/repos/${owner}/${repoName}/issues/${params.issueNumber}/comments`, {
            method: "POST", headers: ghHeaders(),
            body: JSON.stringify({ body: params.body }),
          });
          if (!r.ok) return res.status(r.status).json({ error: await r.text() });
          return res.json({ ok: true });
        }
        if (action === "ensure-label") {
          await fetch(`${GH}/repos/${owner}/${repoName}/labels`, {
            method: "POST", headers: ghHeaders(),
            body: JSON.stringify({ name: params.name, color: params.color }),
          });
          return res.json({ ok: true });
        }
        if (action === "upload-screenshot") {
          // Legacy path: upload to GitHub orphan branch. Prefer upload-blob.
          const branch = "feedback-assets";
          const path = `screenshots/${params.filename}`;
          const branchRes = await fetch(`${GH}/repos/${owner}/${repoName}/git/ref/heads/${branch}`, { headers: ghHeaders() });
          if (!branchRes.ok) {
            const treeRes = await fetch(`${GH}/repos/${owner}/${repoName}/git/trees`, {
              method: "POST", headers: ghHeaders(),
              body: JSON.stringify({ tree: [{ path: ".gitkeep", mode: "100644", type: "blob", content: "feedback screenshots" }] }),
            });
            if (!treeRes.ok) return res.status(500).json({ error: "Failed to create tree" });
            const tree = await treeRes.json();
            const commitRes = await fetch(`${GH}/repos/${owner}/${repoName}/git/commits`, {
              method: "POST", headers: ghHeaders(),
              body: JSON.stringify({ message: "init feedback assets", tree: tree.sha, parents: [] }),
            });
            if (!commitRes.ok) return res.status(500).json({ error: "Failed to create commit" });
            const commit = await commitRes.json();
            const refRes = await fetch(`${GH}/repos/${owner}/${repoName}/git/refs`, {
              method: "POST", headers: ghHeaders(),
              body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
            });
            if (!refRes.ok) return res.status(500).json({ error: "Failed to create branch" });
          }
          const r = await fetch(`${GH}/repos/${owner}/${repoName}/contents/${path}`, {
            method: "PUT", headers: ghHeaders(),
            body: JSON.stringify({ message: `screenshot: ${params.filename}`, content: params.content, branch }),
          });
          if (!r.ok) return res.status(r.status).json({ error: "Upload failed" });
          const data = await r.json();
          return res.json({ url: data.content.download_url });
        }
        break;
      }

      default:
        return res.status(400).json({ error: "Unknown action: " + action });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
