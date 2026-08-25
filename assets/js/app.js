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

  // ====== Mobile Navigation Toggle ======
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("open");
      mobileNav.classList.toggle("open");
      document.body.style.overflow = mobileNav.classList.contains("open") ? "hidden" : "";
    });
    mobileNav.addEventListener("click", (e) => {
      if (e.target === mobileNav) {
        menuBtn.classList.remove("open");
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  // ====== Scroll Reveal Animation (IntersectionObserver) ======
  const revealElements = document.querySelectorAll(".section, .quick-card, .card, .banner, .section-head h2");
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for siblings
        const delay = entry.target.classList.contains("quick-card") 
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100 
          : 0;
        
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // ====== Navbar Shadow on Scroll ======
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    let lastScrollY = 0;
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        topbar.classList.add("scrolled");
      } else {
        topbar.classList.remove("scrolled");
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // ====== 3D Card Tilt Effect ======
  document.querySelectorAll(".quick-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    });
  });

  // ====== Smooth Counter Animation ======
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Observe counters
  document.querySelectorAll("[data-count]").forEach(el => {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(el, parseInt(el.dataset.count));
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    countObserver.observe(el);
  });

  // ====== Parallax Hero Background ======
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (scrolled < heroHeight) {
        const parallaxOffset = scrolled * 0.3;
        hero.querySelectorAll(".hero-bg").forEach(bg => {
          bg.style.transform = `translateY(${parallaxOffset}px) scale(${1 + scrolled * 0.0002})`;
        });
      }
    }, { passive: true });
  }

  // ====== Smooth Scroll for Internal Links ======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ====== Cursor Glow Effect (Desktop Only) ======
  if (window.matchMedia("(pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      glow.style.left = glowX + "px";
      glow.style.top = glowY + "px";
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ====== Page Transition System ======
  const transEl = document.createElement("div");
  transEl.className = "page-transition";
  transEl.innerHTML = `
    <div class="curtain curtain-1"></div>
    <div class="curtain curtain-2"></div>
    <div class="curtain curtain-3"></div>
    <div class="logo-ring"></div>
    <div class="logo-ring logo-ring-2"></div>
    <img class="transit-logo" src="assets/azizLogo.png" alt="">
  `;
  document.body.appendChild(transEl);

  // Fix logo path for subpages
  const logoImg = transEl.querySelector(".transit-logo");
  if (logoImg) {
    logoImg.onerror = () => {
      logoImg.src = "assets/azizLogo.png";
      logoImg.onerror = () => { logoImg.style.display = "none"; };
    };
  }

  // On page load: if we arrived via transition, play the silky exit
  if (sessionStorage.getItem("pageTransition") === "active") {
    sessionStorage.removeItem("pageTransition");
    transEl.classList.add("active");
    requestAnimationFrame(() => {
      setTimeout(() => {
        transEl.classList.add("exit");
        setTimeout(() => {
          transEl.classList.remove("active", "exit");
        }, 1000);
      }, 200);
    });
  }

  // Intercept internal link clicks for smooth transition
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    
    const href = link.getAttribute("href");
    if (!href) return;
    
    // Skip external links, anchors, javascript:, mailto:, tel:, new tabs
    if (link.target === "_blank" || 
        link.target === "_new" ||
        href.startsWith("http") || 
        href.startsWith("#") || 
        href.startsWith("mailto:") || 
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Internal navigation - play luxurious transition
    e.preventDefault();
    
    // Close mobile nav if open
    if (mobileNav && mobileNav.classList.contains("open")) {
      menuBtn.classList.remove("open");
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    }

    sessionStorage.setItem("pageTransition", "active");
    
    // Play silky curtain wipe in
    transEl.classList.add("active");
    transEl.style.pointerEvents = "all";
    
    // Navigate after the curtain fully covers the screen
    setTimeout(() => {
      window.location.href = href;
    }, 900);
  });
});
