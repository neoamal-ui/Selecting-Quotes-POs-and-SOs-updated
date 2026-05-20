/**
 * Prototype Feedback Overlay → Vercel KV + Blob (+ GitHub on submit)
 *
 * Figma-style: rectangles stay on the page, comments live in a right sidebar.
 * Annotations persist to Vercel KV so other reviewers see them across browsers.
 *
 * Usage:
 *   <script src="feedback-overlay.js"
 *     data-api-endpoint="/api/feedback"
 *     data-reviewer-name="Sarah"
 *     data-project-name="checkout-flow-v3"
 *   ></script>
 *
 * Hotkey: Shift+C or click floating button
 */
(function () {
  "use strict";

  // ─── Config ───────────────────────────────────────────────────
  const scriptTag = document.currentScript;
  const cfg = Object.assign(
    { apiEndpoint: "/api/feedback", reviewerName: "", projectName: "default" },
    window.__FEEDBACK_CONFIG__ || {},
    scriptTag ? {
      apiEndpoint: scriptTag.getAttribute("data-api-endpoint") || "/api/feedback",
      reviewerName: scriptTag.getAttribute("data-reviewer-name") || "",
      projectName: scriptTag.getAttribute("data-project-name") || "default",
    } : {}
  );
  if (!cfg.reviewerName) cfg.reviewerName = localStorage.getItem("__fb_reviewer") || "";

  const Z = 2147483647;
  const ATTR = "data-feedback-overlay";
  const SIDEBAR_W = 340;
  const POLL_MS = 5000;

  // ─── State ────────────────────────────────────────────────────
  // annotation: { id, project, rect{x,y,w,h}, pageScrollY, comment, title, priority, author, createdAt, updatedAt, screenshotUrl, _frame, _card, _localDirty }
  let annotations = [];
  let mode = "idle"; // idle | drawing
  let drawStart = null;
  let html2canvasLib = null;
  let sidebarOpen = false;
  let pollTimer = null;
  let hoveredId = null;

  // ─── Helpers ──────────────────────────────────────────────────
  function mk(tag, styles, attrs) {
    const e = document.createElement(tag);
    if (styles) Object.assign(e.style, styles);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    e.setAttribute(ATTR, "1");
    return e;
  }
  function isFb(n) { while (n) { if (n.getAttribute && n.getAttribute(ATTR)) return true; n = n.parentElement; } return false; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad2(n) { return String(n).padStart(2, "0"); }
  function timestamp() { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}_${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`; }
  function slug(s) { return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30); }
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  async function api(action, params) {
    const res = await fetch(cfg.apiEndpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...params }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || "API error: " + res.status);
    }
    return res.json();
  }

  // ─── FAB ──────────────────────────────────────────────────────
  const fab = mk("button", {
    position: "fixed", bottom: "20px", right: "20px", zIndex: Z - 3,
    height: "36px", padding: "0 14px 0 10px", borderRadius: "10px", border: "none",
    background: "#1a1a18", color: "#fff", cursor: "pointer",
    fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif",
    fontSize: "12px", fontWeight: "600", letterSpacing: "-0.01em",
    display: "flex", alignItems: "center", gap: "6px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.16), 0 1px 4px rgba(0,0,0,0.08)",
    transition: "transform 160ms cubic-bezier(0.23,1,0.32,1), background 120ms ease, opacity 200ms ease, right 220ms cubic-bezier(0.23,1,0.32,1)",
  });
  function fabLabel() {
    const n = annotations.length;
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> '
      + (n ? `Comments (${n})` : "Comment")
      + ' <span style="font-size:10px;opacity:0.5;margin-left:2px">⇧C</span>';
  }
  fab.innerHTML = fabLabel();
  fab.onmouseenter = () => fab.style.background = "#2a2a28";
  fab.onmouseleave = () => fab.style.background = "#1a1a18";
  fab.onclick = () => toggleSidebar();

  // ─── Sidebar ──────────────────────────────────────────────────
  const sidebar = mk("aside", {
    position: "fixed", top: "0", right: "0", bottom: "0", width: SIDEBAR_W + "px",
    zIndex: Z - 2, background: "#fafaf7", borderLeft: "1px solid #e8e7e2",
    boxShadow: "-8px 0 32px rgba(0,0,0,0.06)",
    fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif",
    display: "flex", flexDirection: "column",
    transform: "translateX(100%)", transition: "transform 260ms cubic-bezier(0.23,1,0.32,1)",
  });

  const sidebarHeader = mk("div", {
    padding: "14px 16px", borderBottom: "1px solid #e8e7e2",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#fff",
  });
  sidebarHeader.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:13px;font-weight:600;color:#1a1a18">Comments</span>
      <span id="__fb-count" style="font-size:11px;color:#8c8b86;background:#f0efea;padding:2px 7px;border-radius:10px;font-weight:500">0</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <button id="__fb-new" title="New comment (Shift+C)" style="font-size:11px;font-weight:600;padding:5px 10px;border-radius:7px;border:none;background:#1a1a18;color:#fff;cursor:pointer;font-family:inherit">+ New</button>
      <button id="__fb-close" title="Close" style="font-size:14px;color:#8c8b86;background:none;border:none;cursor:pointer;padding:2px 6px;line-height:1">✕</button>
    </div>
  `;

  const sidebarBody = mk("div", {
    flex: "1", overflowY: "auto", padding: "8px 10px 10px",
  });

  const sidebarEmpty = mk("div", {
    padding: "24px 16px", textAlign: "center",
    fontSize: "12px", color: "#8c8b86", lineHeight: "1.5",
  });
  sidebarEmpty.innerHTML = `
    <div style="font-size:24px;margin-bottom:8px;opacity:0.4">💬</div>
    <div style="font-weight:600;color:#4a4a46;margin-bottom:4px">No comments yet</div>
    <div>Click <b>+ New</b> or press <b>Shift+C</b><br/>to draw a selection and comment.</div>
  `;

  const sidebarFooter = mk("div", {
    padding: "10px 12px", borderTop: "1px solid #e8e7e2", background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
  });
  sidebarFooter.innerHTML = `
    <span id="__fb-reviewer" style="font-size:11px;color:#8c8b86;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
    <button id="__fb-submit-gh" style="font-size:11px;font-weight:600;padding:6px 11px;border-radius:7px;border:1px solid #e0dfda;background:#fff;color:#1a1a18;cursor:pointer;font-family:inherit;flex-shrink:0">Send to GitHub</button>
  `;

  sidebar.appendChild(sidebarHeader);
  sidebar.appendChild(sidebarBody);
  sidebar.appendChild(sidebarFooter);

  // ─── Draw layer ───────────────────────────────────────────────
  const drawLayer = mk("div", {
    position: "fixed", inset: "0", zIndex: Z - 1,
    cursor: "crosshair", display: "none", background: "rgba(0,0,0,0.02)",
  });
  const drawHint = mk("div", {
    position: "fixed", top: "12px", left: "50%",
    transform: "translateX(-50%)", zIndex: Z,
    background: "#1a1a18", color: "#fff",
    fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif",
    fontSize: "12px", fontWeight: "500", padding: "6px 12px",
    borderRadius: "8px", display: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
  });
  drawHint.textContent = "Drag to select an area · Esc to cancel";
  const drawRect = mk("div", {
    position: "fixed", zIndex: Z - 1,
    border: "2px solid #3b82f6", borderRadius: "4px",
    background: "rgba(59,130,246,0.08)",
    display: "none", pointerEvents: "none",
  });

  // ─── Toast ────────────────────────────────────────────────────
  const toast = mk("div", {
    position: "fixed", bottom: "20px", left: "50%",
    transform: "translateX(-50%) translateY(12px)", zIndex: Z,
    fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif",
    fontSize: "13px", fontWeight: "600", padding: "10px 20px",
    borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
    opacity: "0", transition: "opacity 200ms ease, transform 200ms cubic-bezier(0.23,1,0.32,1)",
    pointerEvents: "none",
  });
  let toastUrl = null;
  function showToast(msg, isError, url) {
    toast.textContent = msg;
    toast.style.background = isError ? "#991b1b" : "#166534";
    toast.style.color = "#fff";
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
    toast.style.pointerEvents = url ? "auto" : "none";
    toastUrl = url || null;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(12px)";
      toastUrl = null;
    }, 5000);
  }
  toast.onclick = () => { if (toastUrl) window.open(toastUrl, "_blank"); };

  // ─── Sidebar toggle ───────────────────────────────────────────
  function openSidebar() {
    if (sidebarOpen) return;
    sidebarOpen = true;
    sidebar.style.transform = "translateX(0)";
    fab.style.right = (SIDEBAR_W + 20) + "px";
    startPolling();
    refreshFromKV();
  }
  function closeSidebar() {
    if (!sidebarOpen) return;
    sidebarOpen = false;
    sidebar.style.transform = "translateX(100%)";
    fab.style.right = "20px";
    stopPolling();
  }
  function toggleSidebar() { sidebarOpen ? closeSidebar() : openSidebar(); }

  // ─── Draw mode ────────────────────────────────────────────────
  function enterDrawMode() {
    if (mode === "drawing") return;
    if (!sidebarOpen) openSidebar();
    if (!cfg.reviewerName) {
      const name = prompt("Your name (shown on comments):");
      if (!name) return;
      cfg.reviewerName = name.trim();
      localStorage.setItem("__fb_reviewer", cfg.reviewerName);
      renderReviewer();
    }
    mode = "drawing";
    drawLayer.style.display = "block";
    drawHint.style.display = "block";
  }
  function exitDrawMode() {
    mode = "idle";
    drawLayer.style.display = "none";
    drawHint.style.display = "none";
    drawRect.style.display = "none";
    drawStart = null;
  }

  drawLayer.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    drawStart = { x: e.clientX, y: e.clientY };
    drawRect.style.left = e.clientX + "px";
    drawRect.style.top = e.clientY + "px";
    drawRect.style.width = "0px"; drawRect.style.height = "0px";
    drawRect.style.display = "block";
  });
  drawLayer.addEventListener("mousemove", (e) => {
    if (!drawStart) return;
    const x = Math.min(drawStart.x, e.clientX), y = Math.min(drawStart.y, e.clientY);
    const w = Math.abs(e.clientX - drawStart.x), h = Math.abs(e.clientY - drawStart.y);
    drawRect.style.left = x + "px"; drawRect.style.top = y + "px";
    drawRect.style.width = w + "px"; drawRect.style.height = h + "px";
  });
  drawLayer.addEventListener("mouseup", (e) => {
    if (!drawStart) return;
    const x = Math.min(drawStart.x, e.clientX), y = Math.min(drawStart.y, e.clientY);
    const w = Math.abs(e.clientX - drawStart.x), h = Math.abs(e.clientY - drawStart.y);
    drawStart = null;
    drawRect.style.display = "none";
    exitDrawMode();
    if (w < 20 || h < 20) return;
    createAnnotation({ x, y, w, h });
  });

  // ─── Annotation lifecycle ─────────────────────────────────────
  async function createAnnotation(rect) {
    const ann = {
      id: uid(),
      project: cfg.projectName,
      rect, // client coords
      pageScrollY: window.scrollY, pageScrollX: window.scrollX,
      viewportW: window.innerWidth, viewportH: window.innerHeight,
      title: "", comment: "", priority: "medium",
      author: cfg.reviewerName, page: window.location.pathname,
      createdAt: Date.now(), updatedAt: Date.now(),
      screenshotUrl: null, _localDirty: true,
    };
    annotations.push(ann);
    render();
    focusCard(ann.id);
    saveAnnotation(ann);
    // Capture screenshot async
    captureAndUpload(ann).catch(err => console.warn("[feedback] screenshot failed:", err.message));
  }

  function focusCard(id) {
    const c = document.querySelector(`[data-fb-card="${id}"]`);
    if (!c) return;
    const ta = c.querySelector("[data-field=title]");
    if (ta) ta.focus();
    c.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function saveAnnotation(ann) {
    try {
      const payload = { ...ann };
      delete payload._frame; delete payload._card; delete payload._localDirty;
      await api("save-annotation", { project: cfg.projectName, annotation: payload });
      ann._localDirty = false;
    } catch (err) {
      console.warn("[feedback] save failed:", err.message);
    }
  }

  async function deleteAnnotation(id) {
    const idx = annotations.findIndex(a => a.id === id);
    if (idx < 0) return;
    annotations.splice(idx, 1);
    render();
    try { await api("delete-annotation", { project: cfg.projectName, id }); }
    catch (err) { console.warn("[feedback] delete failed:", err.message); }
  }

  // ─── KV sync ──────────────────────────────────────────────────
  async function refreshFromKV() {
    try {
      const { items } = await api("list-annotations", { project: cfg.projectName });
      mergeRemote(items || []);
    } catch (err) {
      // KV might not be configured — quiet
    }
  }
  function mergeRemote(remote) {
    const byId = new Map(annotations.map(a => [a.id, a]));
    remote.forEach(r => {
      const local = byId.get(r.id);
      if (!local) {
        annotations.push({ ...r, _localDirty: false });
      } else if (!local._localDirty && (r.updatedAt || 0) > (local.updatedAt || 0)) {
        Object.assign(local, r, { _frame: local._frame, _card: local._card });
      }
    });
    // Drop locally-held ones that disappeared remotely (deleted elsewhere)
    const remoteIds = new Set(remote.map(r => r.id));
    for (let i = annotations.length - 1; i >= 0; i--) {
      const a = annotations[i];
      if (!remoteIds.has(a.id) && !a._localDirty && a.createdAt < Date.now() - 10000) {
        annotations.splice(i, 1);
      }
    }
    render();
  }
  function startPolling() {
    if (pollTimer) return;
    pollTimer = setInterval(() => { if (sidebarOpen && document.visibilityState === "visible") refreshFromKV(); }, POLL_MS);
  }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  // ─── Screenshot → Blob ────────────────────────────────────────
  function loadH2C() {
    if (html2canvasLib) return Promise.resolve(html2canvasLib);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = () => { html2canvasLib = window.html2canvas; resolve(html2canvasLib); };
      s.onerror = () => reject(new Error("Failed to load html2canvas"));
      document.head.appendChild(s);
    });
  }
  async function captureRect(rect) {
    const h2c = await loadH2C();
    const overlays = document.querySelectorAll(`[${ATTR}]`);
    overlays.forEach(el => el._prevVis = el.style.visibility);
    overlays.forEach(el => el.style.visibility = "hidden");
    await new Promise(r => requestAnimationFrame(r));
    const canvas = await h2c(document.body, {
      useCORS: true, logging: false, scale: window.devicePixelRatio || 2,
      backgroundColor: null,
      width: window.innerWidth, height: window.innerHeight,
      x: window.scrollX, y: window.scrollY,
      windowWidth: window.innerWidth, windowHeight: window.innerHeight,
    });
    overlays.forEach(el => el.style.visibility = el._prevVis || "");
    const dpr = window.devicePixelRatio || 2;
    const crop = document.createElement("canvas");
    crop.width = rect.w * dpr; crop.height = rect.h * dpr;
    crop.getContext("2d").drawImage(canvas, rect.x * dpr, rect.y * dpr, rect.w * dpr, rect.h * dpr, 0, 0, rect.w * dpr, rect.h * dpr);
    return crop.toDataURL("image/png").split(",")[1];
  }
  async function captureAndUpload(ann) {
    const base64 = await captureRect(ann.rect);
    const filename = `${timestamp()}_${slug(ann.title || "feedback")}.png`;
    try {
      const { url } = await api("upload-blob", { filename, content: base64 });
      ann.screenshotUrl = url; ann.updatedAt = Date.now();
      saveAnnotation(ann);
      render();
    } catch (err) {
      console.warn("[feedback] blob upload failed:", err.message);
    }
  }

  // ─── Render ───────────────────────────────────────────────────
  function renderReviewer() {
    const el = document.getElementById("__fb-reviewer");
    if (el) el.textContent = cfg.reviewerName ? `as ${cfg.reviewerName}` : "(set name when commenting)";
  }

  function render() {
    // Sort by createdAt
    annotations.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    // ── Rects ──
    const liveIds = new Set(annotations.map(a => a.id));
    // Remove orphaned frames
    document.querySelectorAll(`[data-fb-frame]`).forEach(el => {
      const id = el.getAttribute("data-fb-frame");
      if (!liveIds.has(id)) el.remove();
    });

    annotations.forEach((ann, i) => {
      const num = i + 1;
      if (!ann._frame) ann._frame = buildFrame(ann);
      const x = ann.rect.x, y = ann.rect.y;
      ann._frame.style.left = x + "px"; ann._frame.style.top = y + "px";
      ann._frame.style.width = ann.rect.w + "px"; ann._frame.style.height = ann.rect.h + "px";
      const badge = ann._frame.querySelector("[data-role=badge]");
      if (badge) badge.textContent = num;
      const isHovered = hoveredId === ann.id;
      ann._frame.style.borderColor = isHovered ? "#1d4ed8" : "#3b82f6";
      ann._frame.style.boxShadow = isHovered ? "0 0 0 4px rgba(59,130,246,0.2)" : "none";
    });

    // ── Sidebar list ──
    const count = document.getElementById("__fb-count");
    if (count) count.textContent = String(annotations.length);

    // Clear + rebuild
    Array.from(sidebarBody.children).forEach(c => c.remove());
    if (annotations.length === 0) {
      sidebarBody.appendChild(sidebarEmpty);
    } else {
      annotations.forEach((ann, i) => {
        const card = buildCard(ann, i + 1);
        ann._card = card;
        sidebarBody.appendChild(card);
      });
    }

    fab.innerHTML = fabLabel();
  }

  function buildFrame(ann) {
    const frame = mk("div", {
      position: "fixed",
      zIndex: Z - 3,
      border: "2px solid #3b82f6", borderRadius: "6px",
      background: "rgba(59,130,246,0.04)",
      transition: "border-color 120ms ease, box-shadow 160ms ease",
      pointerEvents: "auto", cursor: "pointer",
    }, { "data-fb-frame": ann.id });

    const badge = mk("div", {
      position: "absolute", top: "-10px", left: "-10px",
      width: "22px", height: "22px", borderRadius: "50%",
      background: "#3b82f6", color: "#fff",
      fontSize: "11px", fontWeight: "700",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif",
      boxShadow: "0 2px 6px rgba(59,130,246,0.3)",
      pointerEvents: "none",
    }, { "data-role": "badge" });
    frame.appendChild(badge);

    // Resize handles
    const edges = [
      { cursor: "nw-resize", top: "-4px", left: "-4px", width: "10px", height: "10px" },
      { cursor: "n-resize",  top: "-4px", left: "10px", right: "10px", height: "6px" },
      { cursor: "ne-resize", top: "-4px", right: "-4px", width: "10px", height: "10px" },
      { cursor: "e-resize",  top: "10px", right: "-4px", bottom: "10px", width: "6px" },
      { cursor: "se-resize", bottom: "-4px", right: "-4px", width: "10px", height: "10px" },
      { cursor: "s-resize",  bottom: "-4px", left: "10px", right: "10px", height: "6px" },
      { cursor: "sw-resize", bottom: "-4px", left: "-4px", width: "10px", height: "10px" },
      { cursor: "w-resize",  top: "10px", left: "-4px", bottom: "10px", width: "6px" },
    ];
    const names = ["nw","n","ne","e","se","s","sw","w"];
    edges.forEach((style, i) => {
      const h = mk("div", { position: "absolute", ...style, cursor: style.cursor, background: "transparent", zIndex: "2" });
      h.addEventListener("mousedown", (e) => { e.stopPropagation(); e.preventDefault(); startResize(ann.id, names[i], e); });
      frame.appendChild(h);
    });

    frame.addEventListener("mouseenter", () => { hoveredId = ann.id; render(); scrollCardIntoView(ann.id); });
    frame.addEventListener("mouseleave", () => { hoveredId = null; render(); });
    frame.addEventListener("click", (e) => { if (e.target === frame || e.target === badge) focusCard(ann.id); });

    document.body.appendChild(frame);
    return frame;
  }

  function scrollCardIntoView(id) {
    const c = document.querySelector(`[data-fb-card="${id}"]`);
    if (c) c.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function scrollRectIntoView(ann) {
    const top = ann.rect.y;
    if (top < 0 || top > window.innerHeight) {
      window.scrollTo({ top: (ann.pageScrollY || 0) + top - 120, behavior: "smooth" });
    }
  }

  function buildCard(ann, num) {
    const mine = ann.author === cfg.reviewerName;
    const card = mk("div", {
      background: "#fff", borderRadius: "10px",
      border: hoveredId === ann.id ? "1px solid #3b82f6" : "1px solid #e8e7e2",
      boxShadow: hoveredId === ann.id ? "0 4px 14px rgba(59,130,246,0.12)" : "0 1px 2px rgba(0,0,0,0.03)",
      padding: "10px 12px", marginBottom: "8px",
      transition: "border-color 120ms ease, box-shadow 160ms ease",
      cursor: "pointer",
    }, { "data-fb-card": ann.id });

    const priBtn = (p, label, active) =>
      `<button data-p="${p}" style="font-size:10px;font-weight:600;padding:3px 8px;border-radius:5px;border:1px solid ${active ? "#1a1a18" : "#e0dfda"};background:${active ? "#1a1a18" : "#fff"};color:${active ? "#fff" : "#8c8b86"};cursor:pointer">${label}</button>`;

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${num}</div>
        <input data-field="title" value="${(ann.title || "").replace(/"/g, "&quot;")}" placeholder="Issue title…" ${mine ? "" : "readonly"} style="all:unset;flex:1;font-size:13px;font-weight:600;color:#1a1a18;font-family:inherit;min-width:0;" />
        ${mine ? `<button data-action="remove" title="Delete" style="font-size:11px;color:#b0afa9;background:none;border:none;cursor:pointer;padding:2px 4px">✕</button>` : ""}
      </div>
      <div style="margin-bottom:6px">
        <textarea data-field="comment" rows="2" placeholder="Describe the issue…" ${mine ? "" : "readonly"} style="all:unset;display:block;width:100%;font-size:12px;color:#4a4a46;line-height:1.5;resize:none;font-family:inherit;box-sizing:border-box;min-height:32px;max-height:120px;white-space:pre-wrap">${(ann.comment || "").replace(/</g, "&lt;")}</textarea>
      </div>
      ${ann.screenshotUrl ? `<a href="${ann.screenshotUrl}" target="_blank" rel="noopener" style="display:block;margin-bottom:8px"><img src="${ann.screenshotUrl}" style="width:100%;border-radius:6px;border:1px solid #e8e7e2;display:block" /></a>` : ""}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div data-field="priority" style="display:flex;gap:4px;${mine ? "" : "pointer-events:none;opacity:0.6"}">
          ${priBtn("low", "Low", ann.priority === "low")}
          ${priBtn("medium", "Med", ann.priority === "medium")}
          ${priBtn("high", "High", ann.priority === "high")}
        </div>
        <div style="font-size:10px;color:#b0afa9;text-align:right;line-height:1.3">
          ${(ann.author || "Anon").slice(0, 18)}<br/>
          <span style="color:#c8c7c2">${timeAgo(ann.updatedAt || ann.createdAt)}</span>
        </div>
      </div>
    `;

    // Hover linking
    card.addEventListener("mouseenter", () => { hoveredId = ann.id; render(); scrollRectIntoView(ann); });
    card.addEventListener("mouseleave", () => { hoveredId = null; render(); });

    if (mine) {
      const titleEl = card.querySelector("[data-field=title]");
      const commentEl = card.querySelector("[data-field=comment]");
      const saveDebounced = debounce(() => saveAnnotation(ann), 600);
      titleEl.addEventListener("input", (e) => { ann.title = e.target.value; ann.updatedAt = Date.now(); ann._localDirty = true; saveDebounced(); });
      commentEl.addEventListener("input", (e) => { ann.comment = e.target.value; ann.updatedAt = Date.now(); ann._localDirty = true; saveDebounced(); });
      commentEl.addEventListener("blur", () => { if (ann._localDirty) saveAnnotation(ann); });
      titleEl.addEventListener("blur", () => { if (ann._localDirty) saveAnnotation(ann); });

      card.querySelectorAll("[data-p]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          ann.priority = btn.getAttribute("data-p");
          ann.updatedAt = Date.now();
          ann._localDirty = true;
          saveAnnotation(ann);
          render();
        });
      });

      const rm = card.querySelector("[data-action=remove]");
      if (rm) rm.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm("Delete this comment?")) return;
        deleteAnnotation(ann.id);
      });
    }

    return card;
  }

  function timeAgo(t) {
    if (!t) return "";
    const s = Math.floor((Date.now() - t) / 1000);
    if (s < 10) return "just now";
    if (s < 60) return s + "s ago";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    return Math.floor(s / 86400) + "d ago";
  }

  // ─── Resize ───────────────────────────────────────────────────
  function startResize(id, edge, startEvent) {
    const ann = annotations.find(a => a.id === id);
    if (!ann) return;
    if (ann.author && ann.author !== cfg.reviewerName) return; // only own
    const orig = { ...ann.rect };
    const sx = startEvent.clientX, sy = startEvent.clientY;
    function onMove(e) {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      let { x, y, w, h } = orig;
      if (edge.includes("w")) { x += dx; w -= dx; }
      if (edge.includes("e")) { w += dx; }
      if (edge.includes("n")) { y += dy; h -= dy; }
      if (edge.includes("s")) { h += dy; }
      if (w < 40) { if (edge.includes("w")) x = orig.x + orig.w - 40; w = 40; }
      if (h < 30) { if (edge.includes("n")) y = orig.y + orig.h - 30; h = 30; }
      ann.rect = { x, y, w, h };
      ann.updatedAt = Date.now();
      ann._localDirty = true;
      ann._frame.style.left = x + "px"; ann._frame.style.top = y + "px";
      ann._frame.style.width = w + "px"; ann._frame.style.height = h + "px";
    }
    const saveDebounced = debounce(() => saveAnnotation(ann), 400);
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      saveDebounced();
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  // ─── GitHub submit ────────────────────────────────────────────
  async function submitToGitHub() {
    const toSubmit = annotations.filter(a => (a.comment || "").trim());
    if (toSubmit.length === 0) { showToast("No comments to submit", true); return; }
    const btn = document.getElementById("__fb-submit-gh");
    const origLabel = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    try {
      const project = cfg.projectName || "prototype";
      const page = window.location.pathname || "/";
      const now = new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
      const vw = window.innerWidth + " × " + window.innerHeight;
      const bodyFor = (a) => [
        `### ${a.title || "Comment"} — ${a.author || "Anon"}`,
        "", a.comment, "",
        a.screenshotUrl ? `![Screenshot](${a.screenshotUrl})` : "",
        "",
        `<sub>Selection: ${Math.round(a.rect.w)}×${Math.round(a.rect.h)}px at (${Math.round(a.rect.x)}, ${Math.round(a.rect.y)}) · Priority: ${a.priority} · ${new Date(a.createdAt).toLocaleString()}</sub>`,
      ].filter(Boolean).join("\n");

      const firstBody = [
        `## Feedback on \`${page}\``,
        "", `**Project:** ${project}`, `**Viewport:** ${vw}`, `**Timestamp:** ${now}`, "",
        "---", "", bodyFor(toSubmit[0]),
      ].join("\n");

      const highestPriority = toSubmit.some(a => a.priority === "high") ? "high" : toSubmit.some(a => a.priority === "medium") ? "medium" : "low";
      const labels = ["feedback", "priority:" + highestPriority, "prototype:" + slug(project)];
      const title = toSubmit.length === 1
        ? `💬 [${project}] ${toSubmit[0].title || "Feedback on " + page}`
        : `💬 [${project}] ${toSubmit.length} comments on ${page}`;

      for (const l of labels) {
        try { await api("ensure-label", { name: l, color: "7057ff" }); } catch {}
      }
      const issue = await api("create-issue", { title, body: firstBody, labels });
      for (let i = 1; i < toSubmit.length; i++) {
        await api("add-comment", { issueNumber: issue.number, body: bodyFor(toSubmit[i]) });
      }
      showToast(`Issue #${issue.number} created ✓`, false, issue.url);
    } catch (err) {
      showToast(err.message || "Submit failed", true);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = origLabel || "Send to GitHub"; }
    }
  }

  // ─── Key handlers ─────────────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (mode === "drawing") exitDrawMode();
    }
    if (e.key === "C" && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (document.activeElement?.isContentEditable) return;
      e.preventDefault();
      enterDrawMode();
    }
  });

  // ─── Mount ────────────────────────────────────────────────────
  document.body.appendChild(drawLayer);
  document.body.appendChild(drawRect);
  document.body.appendChild(drawHint);
  document.body.appendChild(sidebar);
  document.body.appendChild(toast);
  document.body.appendChild(fab);

  // Wire sidebar header buttons (deferred — elements exist once appended)
  setTimeout(() => {
    document.getElementById("__fb-new")?.addEventListener("click", (e) => { e.stopPropagation(); enterDrawMode(); });
    document.getElementById("__fb-close")?.addEventListener("click", (e) => { e.stopPropagation(); closeSidebar(); });
    document.getElementById("__fb-submit-gh")?.addEventListener("click", (e) => { e.stopPropagation(); submitToGitHub(); });
    renderReviewer();
  }, 0);

  // Initial load
  refreshFromKV();

  console.log("%c[feedback-overlay]%c Ready — Shift+C or click Comment button", "color:#7057ff;font-weight:bold", "color:inherit");
})();
