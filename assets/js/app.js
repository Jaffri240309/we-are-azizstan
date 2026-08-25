const SC = (() => {
  async function getJSON(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`โหลดไฟล์ไม่สำเร็จ: ${path}`);
    return res.json();
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function qs(sel) { return document.querySelector(sel); }

  function newsCard(item) {
    const tags = (item.tags || []).slice(0, 4).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    return `
      <article class="card">
        <div class="meta">
          <span class="pill">${escapeHtml(item.category || "ทั่วไป")}</span>
          <span>${escapeHtml(item.date || "")}</span>
        </div>
        <h3>${escapeHtml(item.title || "")}</h3>
        <p>${escapeHtml(item.summary || "")}</p>
        <div class="tags">${tags}</div>
        <div style="margin-top:12px">
          <a class="btn" href="news.html?id=${encodeURIComponent(item.id)}">อ่านต่อ</a>
        </div>
      </article>
    `;
  }

  function newsDetail(item) {
    const tags = (item.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    return `
      <div class="panel">
        <div class="meta">
          <span class="pill">${escapeHtml(item.category || "ทั่วไป")}</span>
          <span>${escapeHtml(item.date || "")}</span>
        </div>
        <h1 style="margin:10px 0 8px">${escapeHtml(item.title || "")}</h1>
        <p class="lead">${escapeHtml(item.summary || "")}</p>
        <div class="tags">${tags}</div>
        <div style="margin-top:14px; color:rgba(232,238,252,.8)">
          ${escapeHtml(item.content || "")}
        </div>
      </div>
    `;
  }

  function getParam(name) {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

  async function initTop(config) {
    // Announcement
    const bar = qs("#announce");
    if (bar && config?.announcement?.enabled) {
      qs("#announceText").innerHTML = `<strong>ประกาศด่วน:</strong> ${escapeHtml(config.announcement.text)}`;
      const a = qs("#announceLink");
      a.textContent = config.announcement.linkText || "ดูรายละเอียด";
      a.href = config.announcement.linkUrl || "news.html";
      bar.style.display = "block";
    }

    // Social (optional)
    const lineA = qs("#socialLine");
    const fbA = qs("#socialFb");
    const igA = qs("#socialIg");
    const emA = qs("#socialEmail");
    if (lineA) lineA.href = config?.social?.line || "#";
    if (fbA) fbA.href = config?.social?.facebook || "#";
    if (igA) igA.href = config?.social?.instagram || "#";
    if (emA) emA.href = config?.social?.email || "mailto:contact@example.com";

    // Forms
    const f = config?.forms || {};
    const setLink = (id, url) => { const el = qs(id); if (el) el.href = url || "https://forms.google.com"; };
    setLink("#formIdea", f.idea);
    setLink("#formRepair", f.repair);
    setLink("#formComplaint", f.complaint);
    setLink("#formCoordinate", f.coordinate);
  }

  async function renderLatestNews(selector, limit = 6) {
    const el = qs(selector);
    if (!el) return;
    try {
      const items = await getJSON("data/news.json");
      items.sort((a,b) => (b.date||"").localeCompare(a.date||""));
      el.innerHTML = items.slice(0, limit).map(newsCard).join("");
    } catch (e) {
      el.innerHTML = `<div class="card"><h3>โหลดข่าวไม่สำเร็จ</h3><p>${escapeHtml(e.message)}</p></div>`;
    }
  }

  async function renderNewsList(listSelector, query = "") {
    const el = qs(listSelector);
    if (!el) return;
    const q = query.trim().toLowerCase();
    try {
      const items = await getJSON("data/news.json");
      items.sort((a,b) => (b.date||"").localeCompare(a.date||""));
      const filtered = !q ? items : items.filter(it => {
        const hay = [
          it.title, it.summary, it.content, it.category,
          ...(it.tags||[])
        ].join(" ").toLowerCase();
        return hay.includes(q);
      });
      el.innerHTML = filtered.map(newsCard).join("") || `<div class="card"><h3>ไม่พบข่าว</h3><p>ลองเปลี่ยนคำค้นหา</p></div>`;
    } catch (e) {
      el.innerHTML = `<div class="card"><h3>โหลดข่าวไม่สำเร็จ</h3><p>${escapeHtml(e.message)}</p></div>`;
    }
  }

  async function renderNewsDetail(selector) {
    const el = qs(selector);
    if (!el) return;
    const id = getParam("id");
    try {
      const items = await getJSON("data/news.json");
      const item = items.find(x => x.id === id) || items.sort((a,b)=> (b.date||"").localeCompare(a.date||""))[0];
      el.innerHTML = newsDetail(item);
    } catch (e) {
      el.innerHTML = `<div class="card"><h3>โหลดข่าวไม่สำเร็จ</h3><p>${escapeHtml(e.message)}</p></div>`;
    }
  }

  async function bootCommon() {
    try {
      const config = await getJSON("data/site-config.json");
      await initTop(config);
      const y = qs("#year");
      if (y) y.textContent = String(new Date().getFullYear());
    } catch {
      // ignore
    }
  }

  return {
    bootCommon,
    renderLatestNews,
    renderNewsList,
    renderNewsDetail
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  SC.bootCommon();
});
