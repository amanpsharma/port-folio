/* ===========================================================
   Aman Sharma — modern redesign · script.js
   =========================================================== */

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;

/* -------------- Console easter egg -------------- */
(function () {
  if (window.__amanGreeted) return;
  window.__amanGreeted = true;
  const big = "color:#fff52f;font:700 14px/1.4 monospace";
  const dim = "color:#888;font:400 12px/1.5 monospace";
  const link = "color:#6b5dff;font:600 12px/1.5 monospace;text-decoration:underline";
  console.log(
    "%c   ___                          \n  / _ \\               Aman      \n / /_\\ \\ _ __ ___   __ _ _ __   \n |  _  || '_ ` _ \\ / _` | '_ \\  \n | | | || | | | | | (_| | | | | \n \\_| |_/|_| |_| |_|\\__,_|_| |_| \n%c\nSenior Software Engineer · Litmus7\nReact, JavaScript, and shipped products.\n",
    big,
    dim,
  );
  console.log(
    "%cFound a bug or want to hire me?\n%c→ amanraj_78@yahoo.in",
    dim,
    link,
  );
})();

/* -------------- Theme toggle (with View Transitions) -------------- */
(function () {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const mq = matchMedia("(prefers-color-scheme: dark)");

  function current() {
    const set = document.documentElement.getAttribute("data-theme");
    if (set === "dark" || set === "light") return set;
    return mq.matches ? "dark" : "light";
  }
  function apply(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    if (persist) try { localStorage.setItem("theme", theme); } catch {}
  }
  btn.setAttribute("aria-pressed", String(current() === "dark"));

  btn.addEventListener("click", (e) => {
    const next = current() === "dark" ? "light" : "dark";
    if (document.startViewTransition && !reduced) {
      document.startViewTransition(() => apply(next, true));
    } else {
      apply(next, true);
    }
  });

  mq.addEventListener("change", (e) => {
    let stored = null;
    try { stored = localStorage.getItem("theme"); } catch {}
    if (stored !== "dark" && stored !== "light") apply(e.matches ? "dark" : "light", false);
  });
})();

/* -------------- Custom cursor -------------- */
(function () {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;
  if (isTouch || reduced) {
    dot.style.display = ring.style.display = "none";
    return;
  }
  document.documentElement.classList.add("has-cursor");
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
  function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`; requestAnimationFrame(loop); }
  loop();
  const interactive = "a, button, [data-magnet], .card, .sk, input, textarea";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactive)) { dot.classList.add("big"); ring.classList.add("big"); }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactive)) { dot.classList.remove("big"); ring.classList.remove("big"); }
  });
})();

/* -------------- Nav scroll state -------------- */
(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
})();

/* -------------- Active nav highlight -------------- */
(function () {
  const links = document.querySelectorAll(".nav-links a[href^='#']");
  if (!links.length) return;
  const map = new Map();
  links.forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove("active"));
        const a = map.get(e.target);
        if (a) a.classList.add("active");
      }
    });
  }, { threshold: 0.4 });
  map.forEach((_, sec) => obs.observe(sec));
})();

/* -------------- Mobile menu -------------- */
(function () {
  const ham = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if (!ham || !menu) return;
  function set(open) {
    ham.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    ham.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  ham.addEventListener("click", () => set(!ham.classList.contains("open")));
  document.querySelectorAll("[data-mobile-link]").forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && ham.classList.contains("open")) set(false); });
})();

/* -------------- Reveal on scroll (with stagger) -------------- */
(function () {
  if (reduced) {
    document.querySelectorAll("[data-stagger], .reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (e.target.hasAttribute("data-stagger")) {
            [...e.target.children].forEach((c, i) => c.style.setProperty("--i", i));
          }
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll("[data-stagger], .reveal").forEach((el) => obs.observe(el));
})();

/* -------------- Magnetic buttons -------------- */
(function () {
  if (isTouch || reduced) return;
  const els = document.querySelectorAll("[data-magnet]");
  els.forEach((el) => {
    let raf = 0;
    const strength = el.tagName === "A" && el.classList.contains("btn-icon-link") ? 0.45 : 0.3;
    el.addEventListener("mousemove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    });
    el.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    });
  });
})();

/* -------------- Card 3D tilt + spotlight -------------- */
(function () {
  if (isTouch || reduced) return;
  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach((card) => {
    let raf = 0;
    card.addEventListener("mousemove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -6;
        const ry = ((x / r.width) - 0.5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
      });
    });
    card.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  });
})();

/* -------------- Count-up stat numbers -------------- */
(function () {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        if (reduced) { el.textContent = target; obs.unobserve(el); return; }
        const dur = 1200;
        const start = performance.now();
        function tick(t) {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  els.forEach((el) => obs.observe(el));
})();

/* -------------- Bangalore live clock (hero + footer) -------------- */
(function () {
  const a = document.getElementById("locTime");
  const b = document.getElementById("footClock");
  if (!a && !b) return;
  function fmt(d, withSec) {
    const opts = { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" };
    if (withSec) opts.second = "2-digit";
    return new Intl.DateTimeFormat("en-GB", opts).format(d);
  }
  function tick() {
    const d = new Date();
    if (a) a.textContent = fmt(d, false);
    if (b) b.textContent = fmt(d, true);
  }
  tick();
  setInterval(tick, 1000);
  const y = document.getElementById("footYear");
  if (y) y.textContent = String(new Date().getFullYear());
})();

/* -------------- Footer signature draw -------------- */
(function () {
  const sig = document.querySelector(".footer-sig");
  if (!sig) return;
  if (reduced) { sig.classList.add("drawn"); return; }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { sig.classList.add("drawn"); obs.disconnect(); }
      });
    },
    { threshold: 0.5 },
  );
  obs.observe(sig);
})();

/* -------------- Contact form (Formspree async) -------------- */
(function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("cfStatus");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const action = form.getAttribute("action");
    if (!action || action.includes("YOUR_FORM_ID")) {
      status.textContent = "Form not configured yet — please email me directly.";
      status.className = "ff-status error";
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    const orig = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = "<span>Sending…</span>";
    status.textContent = ""; status.className = "ff-status";
    try {
      const res = await fetch(action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      if (res.ok) {
        status.textContent = "Thanks — message received. I'll reply soon.";
        status.className = "ff-status success";
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        status.textContent = data.errors?.[0]?.message || "Something went wrong. Try email instead.";
        status.className = "ff-status error";
      }
    } catch {
      status.textContent = "Network error. Try email instead.";
      status.className = "ff-status error";
    } finally {
      btn.disabled = false; btn.innerHTML = orig;
    }
  });
})();

/* -------------- Copy email button -------------- */
(function () {
  const btn = document.getElementById("copyEmailBtn");
  if (!btn) return;
  const label = btn.querySelector(".contact-copy-label");
  const original = label ? label.textContent : "Copy";
  let resetT = 0;
  async function copy(t) {
    try { if (navigator.clipboard && isSecureContext) { await navigator.clipboard.writeText(t); return true; } } catch {}
    try {
      const ta = document.createElement("textarea");
      ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch { return false; }
  }
  btn.addEventListener("click", async () => {
    const ok = await copy(btn.dataset.email || "");
    btn.classList.toggle("copied", ok);
    if (label) label.textContent = ok ? "Copied!" : "Press Ctrl+C";
    clearTimeout(resetT);
    resetT = setTimeout(() => { btn.classList.remove("copied"); if (label) label.textContent = original; }, 1800);
  });
})();

/* -------------- Smooth anchor scroll -------------- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      const t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  });
})();

/* -------------- Keyboard shortcuts -------------- */
(function () {
  const targets = { h: "#hero", w: "#work", e: "#experience", s: "#skills", a: "#about", c: "#contact" };
  let leader = false, leaderT = 0;
  let toast = null, toastT = 0;
  function isTyping(el) { if (!el) return false; const t = (el.tagName || "").toLowerCase(); return t === "input" || t === "textarea" || el.isContentEditable; }
  function flash(msg, ms) {
    if (!toast) { toast = document.createElement("div"); toast.className = "kbd-toast"; toast.setAttribute("role", "status"); document.body.appendChild(toast); }
    toast.innerHTML = msg; toast.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("show"), ms || 1400);
  }
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isTyping(e.target)) return;
    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      const fab = document.getElementById("cbFab");
      if (fab) fab.click();
      return;
    }
    if (leader) {
      const k = e.key.toLowerCase();
      if (targets[k]) {
        const el = document.querySelector(targets[k]);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); flash("→ " + targets[k].replace("#", ""), 900); }
      }
      leader = false; clearTimeout(leaderT); return;
    }
    if (e.key === "g") {
      leader = true;
      flash("<b>g</b> then <b>h</b> home · <b>e</b> exp · <b>w</b> work · <b>s</b> skills · <b>a</b> about · <b>c</b> contact", 2200);
      clearTimeout(leaderT); leaderT = setTimeout(() => (leader = false), 1500);
    }
  });
})();

/* kbd toast styles via JS-injected style */
(function () {
  const css = `
.kbd-toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,12px);background:rgba(8,9,10,0.94);color:#fff;border:1px solid rgba(255,255,255,0.08);font:500 13px/1.4 ui-sans-serif,system-ui;padding:10px 18px;border-radius:999px;box-shadow:0 12px 36px rgba(0,0,0,0.4);opacity:0;pointer-events:none;z-index:9999;transition:opacity 200ms ease,transform 200ms ease;max-width:min(560px,calc(100vw - 32px));text-align:center}
.kbd-toast b{color:#fff52f;font-weight:700;background:rgba(255,255,255,0.08);padding:1px 6px;border-radius:4px;margin:0 1px}
.kbd-toast.show{opacity:1;transform:translate(-50%,0)}
[data-theme="light"] .kbd-toast{background:#08090a}
`;
  const s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
})();

/* -------------- Chatbot -------------- */
(function () {
  const fab = document.getElementById("cbFab");
  const panel = document.getElementById("cbPanel");
  const closeBtn = document.getElementById("cbClose");
  const log = document.getElementById("cbLog");
  const form = document.getElementById("cbForm");
  const input = document.getElementById("cbInput");
  const suggest = document.getElementById("cbSuggest");
  if (!fab || !panel || !form || !input || !log) return;

  let opened = false;
  function setOpen(open) {
    panel.classList.toggle("open", open);
    fab.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    if (open) {
      if (!opened) { opened = true; addBot("Hi! I'm Aman's assistant. Ask me about his work, skills, or how to get in touch."); }
      setTimeout(() => input.focus(), 220);
    }
  }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function addMsg(t, who) { const el = document.createElement("div"); el.className = "cb-msg cb-msg-" + who; el.textContent = t; log.appendChild(el); scroll(); return el; }
  function addUser(t) { return addMsg(t, "user"); }
  function addBot(t) { return addMsg(t, "bot"); }
  function showTyping() { const el = document.createElement("div"); el.className = "cb-msg cb-msg-bot cb-typing"; el.innerHTML = "<span></span><span></span><span></span>"; log.appendChild(el); scroll(); return el; }

  function reply(q) {
    const s = q.toLowerCase();
    if (/\b(hi|hello|hey|yo|hola)\b/.test(s)) return "Hey! What would you like to know about Aman?";
    if (/(litmus|current|where.*work|now|company|employ)/.test(s)) return "Aman is a Senior Software Engineer at Litmus7 since September 2024, working on commerce experiences for global brands.";
    if (/(under armour|a\/?b|ab test|optimi[sz]e|experiment)/.test(s)) return "At Litmus7 he leads A/B testing for Under Armour — designing experiments, building variants, and shipping winning experiences.";
    if (/(costrategix|ad.?serv|previous)/.test(s)) return "Before Litmus7 he was at Costrategix building an ad-serving platform — campaigns, targeting, and reporting dashboards.";
    if (/(experience|years|how long|senior)/.test(s)) return "6+ years building production React apps — from ad tech to large-scale e-commerce.";
    if (/(skill|tech|stack|tools|language)/.test(s)) return "React, JavaScript (ES6+), Redux, Redux-Saga, Material UI, HTML/CSS, REST APIs, Git. Comfortable across the full frontend lifecycle.";
    if (/(project|work|portfolio|case stud)/.test(s)) return "Selected work: A/B testing for Under Armour (Litmus7), Ad-Serving Platform (Costrategix), and the projects in the Selected Work section above.";
    if (/(contact|email|reach|hire|talk|message)/.test(s)) return "Email amanraj_78@yahoo.in or use the contact form below. He replies within a day.";
    if (/(phone|call|number)/.test(s)) return "Phone: +91 70160 56459.";
    if (/(resume|cv|download)/.test(s)) return "Drop me an email and I'll send a fresh PDF.";
    if (/(github|code|repo)/.test(s)) return "GitHub: github.com/amanpsharma";
    if (/(linkedin|profile)/.test(s)) return "LinkedIn: linkedin.com/in/amanpsharma";
    if (/(location|where.*based|city|country|bangalore|india)/.test(s)) return "Based in Sarjapur, Bangalore, India — open to remote and hybrid roles.";
    if (/(education|degree|college|mca|study)/.test(s)) return "MCA from Gujarat Technological University.";
    if (/(available|freelance|open|hir(e|ing))/.test(s)) return "Open to interesting full-time and freelance frontend opportunities. Drop a message via the contact form.";
    if (/(thank|thanks|cheers|cool|nice|great)/.test(s)) return "Anytime! Anything else you'd like to know?";
    if (/(who|about|tell me)/.test(s)) return "Aman Sharma — Senior Software Engineer at Litmus7. 6+ years in React, building polished, performant interfaces.";
    return "Try asking about his role, skills, projects, or how to get in touch. The suggestions above are a good start.";
  }

  function ask(q) {
    if (!q) return;
    addUser(q);
    if (suggest) suggest.style.display = "none";
    const t = showTyping();
    const delay = 450 + Math.min(900, q.length * 18);
    setTimeout(() => { t.remove(); addBot(reply(q)); }, delay);
  }

  fab.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
  if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; input.value = ""; ask(v); });
  if (suggest) suggest.addEventListener("click", (e) => { const b = e.target.closest("button[data-q]"); if (!b) return; ask(b.getAttribute("data-q")); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) setOpen(false); });
})();
