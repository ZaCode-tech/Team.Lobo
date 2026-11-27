/* TEAM LOBO v11 — GSAP + ScrollTrigger, Cards 3D, Campo dos Alunos e Pílula Inteligente */
(function () {
  "use strict";
  var WHATSAPP = "5521982814880";
  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.dataset.ready = "1";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function waUrl(text) {
    return "https://api.whatsapp.com/send?phone=" + WHATSAPP + "&text=" + encodeURIComponent(text);
  }

  /* 1. Links de WhatsApp */
  $$("[data-wa]").forEach(function (a) {
    a.href = waUrl(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  /* 2. Tema Claro / Escuro */
  var themeBtn = $(".theme");
  var metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem("tl-theme", t); } catch (e) {}
    if (themeBtn) themeBtn.setAttribute("aria-label", t === "dark" ? "Mudar para o modo claro" : "Mudar para o modo escuro");
    if (metaTheme) metaTheme.setAttribute("content", t === "dark" ? "#0B0C0E" : "#F2F3F5");
  }
  applyTheme(root.dataset.theme || "dark");
  if (themeBtn) {
    themeBtn.addEventListener("click", function (e) {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      if (!document.startViewTransition || reduce) return applyTheme(next);
      var x = e.clientX, y = e.clientY;
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(function () { applyTheme(next); }).ready.then(function () {
        root.animate(
          { clipPath: ["circle(0 at " + x + "px " + y + "px)", "circle(" + r + "px at " + x + "px " + y + "px)"] },
          { duration: 600, easing: "ease-in", pseudoElement: "::view-transition-new(root)" }
        );
      });
    });
  }

  /* 3. Menu mobile */
  var burger = $(".burger"), menu = $(".menu"), top = $(".top");
  if (burger && menu) {
    burger.addEventListener("click", function () { burger.setAttribute("aria-expanded", menu.classList.toggle("open")); });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  /* 4. Fallback de imagens */
  $$(".ph img").forEach(function (img) {
    var step = 0;
    function fail() {
      if (step === 0 && img.dataset.fb) { step = 1; img.src = img.dataset.fb; }
      else img.parentNode.classList.add("noimg");
    }
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* 5. Revelação ao rolar & Contadores (+2.4K) */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: "0px 0px -4% 0px" });
  $$(".rv").forEach(function (el) { io.observe(el); });

  function count(el) {
    var end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || "0", 10);
    var pre = el.dataset.prefix || "", suf = el.dataset.suffix || "", t0 = performance.now();
    if (reduce) { el.textContent = pre + end.toFixed(dec) + suf; return; }
    (function tick(t) {
      var p = Math.min((t - t0) / 1500, 1);
      var val = end * (1 - Math.pow(1 - p, 3));
      el.textContent = pre + (dec ? val.toFixed(dec) : Math.round(val)) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var co = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(function (el) { co.observe(el); });

  /* 6. Botões Magnéticos */
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    $$(".mag").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 + "px," + (e.clientY - r.top - r.height / 2) * 0.26 + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* 7. Cards 3D Interativos (3D Tilt + Reflexo Especular Prateado/Vermelho) */
  function attachTilt(el) {
    if (reduce) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      var y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      el.style.transform = "perspective(1000px) rotateX(" + ((0.5 - y) * 6).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 7).toFixed(2) + "deg)";
      el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  }
  $$(".tilt").forEach(attachTilt);

  /* 8. Modal Lightbox Compartilhado (Alunos + Galeria) */
  var lb = document.createElement("dialog");
  lb.className = "lb";
  lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lbx" type="button" data-a="close" aria-label="Fechar">✕</button>' +
    '<button class="lbn prev" type="button" data-a="prev" aria-label="Anterior">‹</button>' +
    '<button class="lbn next" type="button" data-a="next" aria-label="Próxima">›</button>';
  document.body.appendChild(lb);
  var lbImg = $("img", lb), lbCap = $("figcaption", lb), lbItems = [], lbIdx = 0;

  function showLb(i) {
    if (!lbItems.length) return;
    lbIdx = (i + lbItems.length) % lbItems.length;
    var it = lbItems[lbIdx];
    lbImg.src = it.src;
    lbImg.alt = it.alt || it.title || "";
    lbCap.textContent = it.alt || it.title || "";
  }
  function openLb(items, index) {
    lbItems = items;
    showLb(index);
    if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
  }
  lb.addEventListener("click", function (e) {
    var a = e.target.dataset && e.target.dataset.a;
    if (a === "close" || e.target === lb) lb.close();
    else if (a === "prev") showLb(lbIdx - 1);
    else if (a === "next") showLb(lbIdx + 1);
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") showLb(lbIdx - 1);
    if (e.key === "ArrowRight") showLb(lbIdx + 1);
  });

  /* 9. Campo dos Alunos: Animação contínua com peso maior para Competidores */
  var stream = $("#student-stream"), streamWrap = $("#student-stream-wrap");
  var alunos = (window.ALUNOS_DESTAQUE || []).slice();
  function renderStudentStream(cat) {
    if (!stream || !alunos.length) return;
    var filtered = cat === "todos" ? alunos : alunos.filter(function (a) { return a.tier === cat; });
    stream.innerHTML = "";
    var loopList = filtered.concat(filtered);
    loopList.forEach(function (item, idx) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "st-card " + (item.tier || "");
      card.setAttribute("aria-label", item.title || "Ver evolução de aluno");
      if (idx >= filtered.length) { card.tabIndex = -1; card.setAttribute("aria-hidden", "true"); }
      card.innerHTML = '<img src="' + item.src + '" alt="' + (item.title || "") + '" loading="lazy" decoding="async">' +
        '<div class="st-overlay"><span class="st-badge">' + (item.badge || "Team Lobo") + '</span><span class="st-title">' + (item.title || "") + '</span></div>';
      card.addEventListener("click", function () { openLb(filtered, idx % filtered.length); });
      stream.appendChild(card);
    });
  }
  if (stream) {
    renderStudentStream("todos");
    $$("#student-filters .fbtn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("#student-filters .fbtn").forEach(function (b) { b.setAttribute("aria-pressed", b === btn); });
        renderStudentStream(btn.dataset.st);
      });
    });
    if (streamWrap) {
      streamWrap.addEventListener("touchstart", function () { streamWrap.classList.add("paused"); }, { passive: true });
      streamWrap.addEventListener("touchend", function () { setTimeout(function () { streamWrap.classList.remove("paused"); }, 1800); }, { passive: true });
    }
  }

  /* 10. Pilares Expansíveis 3D */
  $$("[data-expandable]").forEach(function (card) {
    function toggle() {
      var open = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", String(!open));
      var badge = $(".pillar-toggle", card);
      if (badge) badge.textContent = !open ? "− Fechar" : "+ Detalhes";
    }
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });

  /* 11. Filtro dos relatos */
  $$("#resultados .fbtn").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("#resultados .fbtn").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      $$(".story").forEach(function (s) { s.hidden = b.dataset.f !== "todos" && s.dataset.k !== b.dataset.f; });
    });
  });

  /* 12. Galeria de Evolução & Resultados (Grid Interativo + Filtros) */
  var galGrid = $("#gal-grid"), galList = (window.GALERIA || []).slice();
  function renderGallery(cat) {
    if (!galGrid) return;
    var items = cat === "todos" ? galList : galList.filter(function (g) { return g.cat === cat; });
    galGrid.innerHTML = "";
    items.forEach(function (it, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gal-item tilt";
      if (it.fit) btn.dataset.fit = it.fit;
      btn.setAttribute("aria-label", "Ampliar: " + (it.alt || "foto"));
      btn.innerHTML = '<img src="' + it.src + '" alt="' + (it.alt || "") + '" loading="lazy" decoding="async"><span class="gal-cap">' + (it.alt || "") + '</span>';
      btn.addEventListener("click", function () { openLb(items, i); });
      attachTilt(btn);
      galGrid.appendChild(btn);
    });
  }
  if (galGrid && galList.length) {
    renderGallery("todos");
    $$("#gal-filters .fbtn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("#gal-filters .fbtn").forEach(function (b) { b.setAttribute("aria-pressed", b === btn); });
        renderGallery(btn.dataset.cat);
      });
    });
  }

  /* 13. Slides Interativos do Sid Lobo no Card 3D do Hero */
  var slides = ((window.SITE || {}).heroSlides || []).slice();
  var hImg = $("#hero-slide-img"), hTag = $("#hero-hud-tag"), hDots = $("#hero-hud-dots");
  if (slides.length && hImg && hDots && !((window.SITE || {}).videoHero || {}).ativo) {
    var sIdx = 0, sTimer = null;
    function setSlide(i) {
      sIdx = (i + slides.length) % slides.length;
      hImg.style.opacity = "0.25";
      setTimeout(function () {
        hImg.src = slides[sIdx].src;
        hTag.textContent = slides[sIdx].tag;
        hImg.style.opacity = "1";
      }, 160);
      $$("button", hDots).forEach(function (d, k) { d.setAttribute("aria-selected", k === sIdx ? "true" : "false"); });
    }
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Foto " + (i + 1));
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.addEventListener("click", function (e) { e.stopPropagation(); setSlide(i); resetAuto(); });
      hDots.appendChild(dot);
    });
    function resetAuto() {
      clearInterval(sTimer);
      if (!reduce) sTimer = setInterval(function () { setSlide(sIdx + 1); }, 4200);
    }
    resetAuto();
  }

  /* 14. Interação 3D no Card Principal do Hero */
  var plateEl = $("#hero-plate"), logoBox = $("#hero-stage");
  if (!reduce && plateEl && logoBox) {
    plateEl.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = plateEl.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      logoBox.style.transform = "rotateX(" + ((0.5 - y) * 12).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 14).toFixed(2) + "deg)";
    });
    plateEl.addEventListener("pointerleave", function () { logoBox.style.transform = ""; });
  }

  /* 15. Barra de progresso & Pílula Flutuante Inteligente de WhatsApp */
  var barbell = $(".barbell"), waPill = $("#wa-pill"), waLabel = $("#wa-label"), ticking = false;
  function onScrollFrame() {
    if (top) top.classList.toggle("sc", scrollY > 8);
    if (barbell) {
      var h = root.scrollHeight - innerHeight;
      barbell.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
    }
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); } }, { passive: true });
  onScrollFrame();

  var waContexts = {
    topo: { label: "Tirar dúvidas com Sid Lobo", msg: "Olá, vim pelo site e gostaria de tirar dúvidas com Sid Lobo." },
    autoridade: { label: "Conhecer o método →", msg: "Olá, vim pelo site e quero conhecer a consultoria da Team Lobo." },
    alunos: { label: "Quero competir ou evoluir →", msg: "Olá, vim pelo site, vi os alunos e atletas e quero começar minha evolução!" },
    metodo: { label: "Montar meu protocolo →", msg: "Olá, vim pelo site e quero um protocolo individualizado de treino e dieta." },
    resultados: { label: "Quero transformar meu físico →", msg: "Olá, vim pelo site, vi os relatos e quero transformar meu físico!" },
    lideranca: { label: "Treinar com Sid Lobo →", msg: "Olá, vim pelo site e gostaria de iniciar minha consultoria com Sid Lobo." },
    galeria: { label: "Quero esse resultado →", msg: "Olá, vim pelo site, vi a galeria de resultados e quero esse resultado para mim!" },
    planos: { label: "Garantir minha vaga →", msg: "Olá, vim pelo site e quero escolher um plano da Team Lobo." },
    contato: { label: "Agendar avaliação agora →", msg: "Olá, vim pelo site e gostaria de agendar minha avaliação." }
  };

  var links = $$('.menu a[href^="#"]'), byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (l) { l.removeAttribute("aria-current"); });
      if (byId[id]) byId[id].setAttribute("aria-current", "true");
      if (waPill && waLabel && waContexts[id]) {
        waLabel.textContent = waContexts[id].label;
        waPill.href = waUrl(waContexts[id].msg);
      }
    });
  }, { rootMargin: "-40% 0px -45% 0px" });
  $$("main section[id]").forEach(function (sec) { spy.observe(sec); });

  /* 16. Formulário de objetivo */
  var gf = $("#goalform");
  if (gf) {
    gf.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(gf), nome = String(f.get("nome") || "").trim();
      var msg = "Olá, vim pelo site" + (nome ? ", meu nome é " + nome : "") + ". Meu objetivo é " + f.get("obj") +
        " e minha experiência com treino: " + f.get("exp") + ". Gostaria de agendar minha avaliação.";
      window.open(waUrl(msg), "_blank", "noopener");
    });
  }

  /* 17. Cortina de entrada */
  var intro = $(".intro");
  if (intro) {
    var seen = false;
    try { seen = sessionStorage.getItem("tl-intro"); sessionStorage.setItem("tl-intro", "1"); } catch (e) {}
    if (seen || reduce) intro.remove();
    else setTimeout(function () { intro.remove(); }, 2700);
  }

  /* 18. Vídeo no topo (quando ativo em config.js) */
  var V = (window.SITE || {}).videoHero, vbox = $("#hero-stage");
  var saver = navigator.connection && navigator.connection.saveData;
  if (V && V.ativo && V.src && vbox && !saver) {
    var plate = vbox.parentNode, vid = document.createElement("video"), manual = false;
    vid.muted = true; vid.defaultMuted = true; vid.loop = true; vid.playsInline = true;
    vid.preload = reduce ? "auto" : "metadata";
    if (V.poster) vid.poster = V.poster;
    vid.src = V.src;
    plate.classList.add("has-video");
    vbox.appendChild(vid);
    var ctl = document.createElement("div"), pb = document.createElement("button");
    ctl.className = "vctl"; pb.type = "button";
    function label() { var on = !vid.paused; pb.textContent = on ? "❚❚" : "▶"; }
    pb.addEventListener("click", function () { if (vid.paused) { manual = false; vid.play().catch(function () {}); } else { manual = true; vid.pause(); } });
    ["play", "pause"].forEach(function (ev) { vid.addEventListener(ev, label); });
    ctl.appendChild(pb);
    vbox.appendChild(ctl); label();
    vid.addEventListener("loadeddata", function () { vbox.classList.add("playing"); });
    if (!reduce) new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !manual) vid.play().catch(function () {}); else vid.pause();
    }, { threshold: 0.25 }).observe(vbox);
  }

  /* 19. Coreografia GSAP + ScrollTrigger (Staggered Hero + Parallax Lobo) */
  if (!reduce && window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    var h1 = $("[data-split]");
    if (h1) {
      h1.innerHTML = h1.innerHTML.replace(/(<span[^>]*>)(.*?)(<\/span>)|([^<\s]+)/g, function (_, open, inner, close, word) {
        if (word) return '<span class="w"><span>' + word + "</span></span>";
        return open + inner.split(" ").map(function (w) { return '<span class="w"><span>' + w + "</span></span>"; }).join(" ") + close;
      });
      gsap.from(".hero-title .w > span", {
        yPercent: 110,
        opacity: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15
      });
    }
    if (window.ScrollTrigger) {
      gsap.to(".wolf-layer-back", {
        y: 75,
        rotation: 8,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
      });
      gsap.to(".wolf-layer-front", {
        y: -45,
        scale: 1.06,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
      });
    }
  }
})();
