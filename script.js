/* console easter egg */
(function () {
  if (window.__amanGreeted) return;
  window.__amanGreeted = true;
  const big = "color:#f5c842;font:700 14px/1.4 monospace";
  const dim = "color:#888;font:400 12px/1.5 monospace";
  const link = "color:#4ea1ff;font:600 12px/1.5 monospace;text-decoration:underline";
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

/* theme toggle */
const themeBtn = document.getElementById("themeToggle");
const mqDark = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "dark" || set === "light") return set;
  return mqDark.matches ? "dark" : "light";
}
function applyTheme(theme, persist) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeBtn) themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
  if (persist) {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }
}
if (themeBtn) {
  themeBtn.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next, true);
  });
}
mqDark.addEventListener("change", (e) => {
  let stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch {}
  if (stored !== "dark" && stored !== "light") {
    applyTheme(e.matches ? "dark" : "light", false);
  }
});

/* feature detection */
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* cursor — desktop + non-reduced-motion only */
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");

if (!isTouch && !reducedMotion) {
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });
  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();

  document
    .querySelectorAll("a,button,.wcard,.sk,.exp-item,.edu-item")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("big");
        ring.classList.add("big");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("big");
        ring.classList.remove("big");
      });
    });
} else {
  cursor.style.display = "none";
  ring.style.display = "none";
  document.documentElement.classList.add("no-custom-cursor");
}

/* nav scroll */
window.addEventListener("scroll", () => {
  document
    .getElementById("mainNav")
    .classList.toggle("scrolled", window.scrollY > 40);
});

/* active nav — single observer */
const navAs = document.querySelectorAll(".nav-links a[data-section]");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAs.forEach((a) =>
          a.classList.toggle("active", a.dataset.section === entry.target.id),
        );
      }
    });
  },
  { threshold: 0.35 },
);
document.querySelectorAll("section[id]").forEach((s) => navObserver.observe(s));

/* hamburger / mobile menu */
const ham = document.getElementById("hamburger");
const mob = document.getElementById("mobileMenu");

function setMenu(open) {
  ham.classList.toggle("open", open);
  mob.classList.toggle("open", open);
  ham.setAttribute("aria-expanded", String(open));
  mob.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
}

ham.addEventListener("click", () => setMenu(!ham.classList.contains("open")));

document.querySelectorAll("[data-mobile-link]").forEach((a) => {
  a.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ham.classList.contains("open")) setMenu(false);
});

/* scroll reveal — respect reduced-motion */
if (reducedMotion) {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("visible"));
} else {
  const ro = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          ro.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));
}

/* contact form (Formspree async submit) */
const cfForm = document.querySelector(".contact-form");
const cfStatus = document.getElementById("cfStatus");
if (cfForm) {
  cfForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const action = cfForm.getAttribute("action");
    if (!action || action.includes("YOUR_FORM_ID")) {
      cfStatus.textContent =
        "Form not configured yet — please email me directly.";
      cfStatus.className = "cf-status error";
      return;
    }
    const submitBtn = cfForm.querySelector("button[type=submit]");
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    cfStatus.textContent = "";
    cfStatus.className = "cf-status";
    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(cfForm),
      });
      if (res.ok) {
        cfStatus.textContent = "Thanks — message received. I'll reply soon.";
        cfStatus.className = "cf-status success";
        cfForm.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        cfStatus.textContent =
          data.errors?.[0]?.message ||
          "Something went wrong. Try email instead.";
        cfStatus.className = "cf-status error";
      }
    } catch {
      cfStatus.textContent = "Network error. Try email instead.";
      cfStatus.className = "cf-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}

/* footer signature — draw on first intersection */
(function () {
  const sig = document.querySelector(".footer-signature");
  if (!sig) return;
  if (reducedMotion) {
    sig.classList.add("drawn");
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          sig.classList.add("drawn");
          io.disconnect();
        }
      });
    },
    { threshold: 0.5 },
  );
  io.observe(sig);
})();

/* per-section anchor links — hover reveals link icon, click copies URL */
(function () {
  const sections = document.querySelectorAll("section[id]");
  if (!sections.length) return;
  const ICON =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>';

  let toast = null;
  let toastT = 0;
  function flash(msg) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "kbd-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  async function copyUrl(id) {
    const url = location.origin + location.pathname + "#" + id;
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }

  sections.forEach((sec) => {
    const id = sec.id;
    const h = sec.querySelector("h2");
    if (!h || h.querySelector(".section-anchor")) return;
    const a = document.createElement("a");
    a.className = "section-anchor";
    a.href = "#" + id;
    a.setAttribute("aria-label", "Copy link to " + id + " section");
    a.innerHTML = ICON;
    a.addEventListener("click", async (e) => {
      e.preventDefault();
      const ok = await copyUrl(id);
      flash(ok ? "Link copied" : "#" + id);
      history.replaceState(null, "", "#" + id);
    });
    h.appendChild(document.createTextNode(" "));
    h.appendChild(a);
  });
})();

/* keyboard shortcuts: ? toggles chatbot, "g" + key jumps to section */
(function () {
  const targets = {
    h: "#hero",
    e: "#experience",
    w: "#work",
    s: "#skills",
    a: "#about",
    c: "#contact",
  };
  let leader = false;
  let leaderT = 0;
  let toast = null;
  let toastT = 0;

  function isTyping(el) {
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      el.isContentEditable
    );
  }

  function showToast(msg, ms) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "kbd-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.innerHTML = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), ms || 1400);
  }

  function jumpTo(sel) {
    const t = document.querySelector(sel);
    if (!t) return;
    t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
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
        e.preventDefault();
        jumpTo(targets[k]);
        showToast("→ " + targets[k].replace("#", ""), 900);
      }
      leader = false;
      clearTimeout(leaderT);
      return;
    }

    if (e.key === "g") {
      leader = true;
      showToast(
        "<b>g</b> then <b>h</b> home · <b>e</b> exp · <b>w</b> work · <b>s</b> skills · <b>a</b> about · <b>c</b> contact",
        2200,
      );
      clearTimeout(leaderT);
      leaderT = setTimeout(() => (leader = false), 1500);
    }
  });
})();

/* copy-email button */
(function () {
  const btn = document.getElementById("copyEmailBtn");
  if (!btn) return;
  const label = btn.querySelector(".btn-copy-label");
  const original = label ? label.textContent : "Copy email";
  let resetT = 0;

  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  btn.addEventListener("click", async () => {
    const email = btn.getAttribute("data-email") || "";
    const ok = await copy(email);
    btn.classList.toggle("copied", ok);
    if (label) label.textContent = ok ? "Copied!" : "Press Ctrl+C";
    clearTimeout(resetT);
    resetT = setTimeout(() => {
      btn.classList.remove("copied");
      if (label) label.textContent = original;
    }, 1800);
  });
})();

/* chatbot */
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
      if (!opened) {
        opened = true;
        addBot(
          "Hi! I'm Aman's assistant. Ask me about his work, skills, or how to get in touch.",
        );
      }
      setTimeout(() => input.focus(), 220);
    }
  }

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  function addMsg(text, who) {
    const el = document.createElement("div");
    el.className = "cb-msg cb-msg-" + who;
    el.textContent = text;
    log.appendChild(el);
    scrollLog();
    return el;
  }
  function addUser(t) {
    return addMsg(t, "user");
  }
  function addBot(t) {
    return addMsg(t, "bot");
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "cb-msg cb-msg-bot cb-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(el);
    scrollLog();
    return el;
  }

  function reply(q) {
    const s = q.toLowerCase();
    if (/\b(hi|hello|hey|yo|hola)\b/.test(s))
      return "Hey! What would you like to know about Aman?";
    if (/(litmus|current|where.*work|now|company|employ)/.test(s))
      return "Aman is a Senior Software Engineer at Litmus7 since September 2024, working on commerce experiences for global brands.";
    if (/(under armour|a\/?b|ab test|optimi[sz]e|experiment)/.test(s))
      return "At Litmus7 he leads A/B testing for Under Armour — designing experiments, building variants, and shipping winning experiences.";
    if (/(costrategix|ad.?serv|previous)/.test(s))
      return "Before Litmus7 he was at Costrategix building an ad-serving platform — campaigns, targeting, and reporting dashboards.";
    if (/(experience|years|how long|senior)/.test(s))
      return "6+ years building production React apps — from ad tech to large-scale e-commerce.";
    if (/(skill|tech|stack|tools|language)/.test(s))
      return "React, JavaScript (ES6+), Redux, Redux-Saga, Material UI, HTML/CSS, REST APIs, Git. Comfortable across the full frontend lifecycle.";
    if (/(project|work|portfolio|case stud)/.test(s))
      return "Selected work: A/B testing for Under Armour (Litmus7), Ad-Serving Platform (Costrategix), and the projects in the Selected Work section above.";
    if (/(contact|email|reach|hire|talk|message)/.test(s))
      return "Email amanraj_78@yahoo.in or use the contact form below. He replies within a day.";
    if (/(phone|call|number)/.test(s)) return "Phone: +91 70160 56459.";
    if (/(resume|cv|download)/.test(s))
      return "There's a Download Resume button at the top of the page.";
    if (/(github|code|repo)/.test(s)) return "GitHub: github.com/amanpsharma";
    if (/(linkedin|profile)/.test(s))
      return "LinkedIn: linkedin.com/in/amanpsharma";
    if (/(location|where.*based|city|country|bangalore|india)/.test(s))
      return "Based in Sarjapur, Bangalore, India — open to remote and hybrid roles.";
    if (/(education|degree|college|mca|study)/.test(s))
      return "MCA from Gujarat Technological University.";
    if (/(available|freelance|open|hir(e|ing))/.test(s))
      return "Open to interesting full-time and freelance frontend opportunities. Drop a message via the contact form.";
    if (/(thank|thanks|cheers|cool|nice|great)/.test(s))
      return "Anytime! Anything else you'd like to know?";
    if (/(who|about|tell me)/.test(s))
      return "Aman Sharma — Senior Software Engineer at Litmus7. 6+ years in React, building polished, performant interfaces.";
    return "Try asking about his role, skills, projects, or how to get in touch. The suggestions above are a good start.";
  }

  function ask(q) {
    if (!q) return;
    addUser(q);
    if (suggest) suggest.style.display = "none";
    const t = showTyping();
    const delay = 450 + Math.min(900, q.length * 18);
    setTimeout(() => {
      t.remove();
      addBot(reply(q));
    }, delay);
  }

  fab.addEventListener("click", () =>
    setOpen(!panel.classList.contains("open")),
  );
  if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = "";
    ask(v);
  });

  if (suggest) {
    suggest.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-q]");
      if (!b) return;
      ask(b.getAttribute("data-q"));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) setOpen(false);
  });
})();

/* smooth anchor scroll */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href === "#" || href.length < 2) return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  });
});
