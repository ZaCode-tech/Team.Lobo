/* TEAM LOBO v4 — interações (JavaScript puro, sem dependências) */
(function () {
  "use strict";
  // WhatsApp de atendimento (o mesmo do seu script anterior). Troque aqui, se precisar.
  var WHATSAPP = "5521982814880";
  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* 1. Links de WhatsApp com mensagem pronta */
  $$("[data-wa]").forEach(function (a) {
    a.href = "https://api.whatsapp.com/send?phone=" + WHATSAPP + "&text=" + encodeURIComponent(a.dataset.wa);
    a.target = "_blank"; a.rel = "noopener noreferrer";
  });

  /* 2. Tema claro/escuro (lembra a escolha; revelação circular quando o navegador permite) */
  var themeBtn = $(".theme");
  function applyTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem("tl-theme", t); } catch (e) {}
    themeBtn.setAttribute("aria-label", t === "dark" ? "Mudar para o modo claro" : "Mudar para o modo escuro");
  }
  applyTheme(root.dataset.theme || "dark");
  themeBtn.addEventListener("click", function (e) {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    if (!document.startViewTransition || reduce) return applyTheme(next);
    var x = e.clientX, y = e.clientY, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(function () { applyTheme(next); }).ready.then(function () {
      root.animate({ clipPath: ["circle(0 at " + x + "px " + y + "px)", "circle(" + r + "px at " + x + "px " + y + "px)"] },
        { duration: 600, easing: "ease-in", pseudoElement: "::view-transition-new(root)" });
    });
  });

  /* 3. Menu do celular e linha sob o cabeçalho */
  var burger = $(".burger"), menu = $(".menu"), top = $(".top");
  burger.addEventListener("click", function () { burger.setAttribute("aria-expanded", menu.classList.toggle("open")); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
  var onScroll = function () { top.classList.toggle("sc", scrollY > 8); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* 4. Imagens com plano B: arquivo local -> site oficial -> monograma (nunca fica em branco) */
  $$(".ph img").forEach(function (img) {
    var step = 0;
    function fail() {
      if (step === 0 && img.dataset.fb) { step = 1; img.src = img.dataset.fb; }
      else img.parentNode.classList.add("noimg");
    }
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* 5. Revelação ao rolar e contadores */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  $$(".rv").forEach(function (el) { io.observe(el); });
  function count(el) {
    var end = +el.dataset.count, pre = el.dataset.prefix || "", t0 = performance.now();
    if (reduce) { el.textContent = pre + end; return; }
    (function tick(t) {
      var p = Math.min((t - t0) / 1400, 1);
      el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var co = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(function (el) { co.observe(el); });

  /* 6. Filtro dos relatos */
  $$(".fbtn").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".fbtn").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      $$(".story").forEach(function (s) { s.hidden = b.dataset.f !== "todos" && s.dataset.k !== b.dataset.f; });
    });
  });

  /* 7. Botões principais "puxam" o cursor (só com mouse) */
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    $$(".mag").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 + "px," + (e.clientY - r.top - r.height / 2) * 0.28 + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }
})();
