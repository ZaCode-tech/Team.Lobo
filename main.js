/* Team Lobo · v3
   Cada bloco abaixo cuida de uma coisa só. Para trocar o WhatsApp, edite CONFIG. */
(() => {
  "use strict";

  const CONFIG = {
    whatsapp: "5511992890538", // WhatsApp para novos alunos (o mesmo do site atual)
    themeKey: "tl-theme",
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- WhatsApp: botões com data-wa abrem a conversa com mensagem pronta ---- */
  function initWhatsApp() {
    $$("[data-wa]").forEach((a) => {
      a.href = `https://api.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(a.dataset.wa)}`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  }

  /* ---- Tema claro/escuro, com transição circular quando o navegador suporta ---- */
  function initTheme() {
    const btn = $("#theme-toggle");
    if (!btn) return;

    const apply = (theme) => {
      root.dataset.theme = theme;
      try { localStorage.setItem(CONFIG.themeKey, theme); } catch (e) { /* modo privado */ }
    };

    btn.addEventListener("click", (e) => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      if (!document.startViewTransition || reduceMotion) return apply(next);

      const x = e.clientX, y = e.clientY;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(() => apply(next)).ready.then(() =>
        root.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 550, easing: "ease-in", pseudoElement: "::view-transition-new(root)" }
        )
      );
    });
  }

  /* ---- Cabeçalho: ganha fundo ao rolar; menu no celular ---- */
  function initHeader() {
    const header = $(".site-header");
    const menuBtn = $("#menu-btn");
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 24);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    const setMenu = (open) => {
      header.toggleAttribute("data-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    menuBtn.addEventListener("click", () => setMenu(!header.hasAttribute("data-open")));
    $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  }

  /* ---- Revelar elementos ao entrar na tela (com pequeno atraso em sequência) ---- */
  function initReveal() {
    const items = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    items.forEach((el) => {
      const siblings = $$(".reveal", el.parentElement);
      el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 4) * 0.08}s`);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---- Contadores: o número final já está no HTML; o script só anima a subida ---- */
  function initCounters() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target, end = Number(el.dataset.count), prefix = el.dataset.prefix || "";
        const t0 = performance.now(), dur = 1300;
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = prefix + Math.round(end * (1 - (1 - p) ** 3));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.8 });
    $$("[data-count]").forEach((el) => io.observe(el));
  }

  initWhatsApp();
  initTheme();
  initHeader();
  initReveal();
  initCounters();
})();
