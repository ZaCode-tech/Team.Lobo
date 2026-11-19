/* TEAM LOBO v7 — interações (JavaScript puro, sem dependências) */
(function () {
  "use strict";
  // WhatsApp de atendimento (o mesmo do seu script anterior). Troque aqui, se precisar.
  var WHATSAPP = "5521982814880";
  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.dataset.ready = "1"; // avisa o HTML que o script carregou (senão o conteúdo é liberado sozinho)
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

  /* 8. Letras cromadas: cada uma começa o brilho em um ponto diferente */
  $$(".chrome").forEach(function (el, i) { el.style.setProperty("--n", i % 5); });

  /* 9. Fotos da equipe: preto e branco; ganham cor ao parar na frente delas.
        Navegadores com animação por rolagem usam o CSS; os demais usam este observador. */
  if (!(window.CSS && CSS.supports("animation-timeline: view()")) || reduce) {
    var fo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("focus", e.isIntersecting); });
    }, { rootMargin: "-42% 0px -42% 0px" });
    $$(".person").forEach(function (p) { fo.observe(p); });
  }

  /* 10. Barra de supino (progresso) e faixa que acelera com a rolagem */
  var barbell = $(".barbell"), track = $(".track"), anim = null, rate = 1, lastY = scrollY, ticking = false;
  function progress() {
    var h = root.scrollHeight - innerHeight;
    barbell.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
  progress();
  if (!reduce && track) {
    (function loop() {
      var dy = Math.abs(scrollY - lastY); lastY = scrollY;
      rate += ((1 + Math.min(dy * 0.25, 8)) - rate) * 0.12;
      if (!anim && track.getAnimations) anim = track.getAnimations()[0];
      if (anim) anim.playbackRate = rate;
      requestAnimationFrame(loop);
    })();
  }

  /* 11. Cortina de entrada (uma vez por visita) */
  var intro = $(".intro");
  if (intro) {
    var seen = false;
    try { seen = sessionStorage.getItem("tl-intro"); sessionStorage.setItem("tl-intro", "1"); } catch (e) {}
    if (seen || reduce) intro.remove(); else setTimeout(function () { intro.remove(); }, 2700);
  }

  /* 12. Só com mouse: brilho no topo e cartões que inclinam com reflexo */
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    var hero = $(".hero");
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (e.clientX - r.left) + "px"); hero.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
    $$(".card").forEach(function (c) {
      c.classList.add("tilt");
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 5).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 6).toFixed(2) + "deg)";
        c.style.setProperty("--gx", x * 100 + "%"); c.style.setProperty("--gy", y * 100 + "%");
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
  }

  /* 13. Galeria: fotos em ordem aleatória, passando sozinhas (duas faixas em sentidos opostos) */
  var reel = $("[data-reel]"), list = (window.GALERIA || []).slice();
  if (reel && !list.length) { var gsec = $("#galeria"); if (gsec) gsec.hidden = true; }
  else if (reel) {
    var shuffle = function (a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    };
    var ratios = ["3/4", "1/1", "4/3", "4/5"];
    var order = shuffle(list); // ordem usada no visualizador

    var lb = document.createElement("dialog");
    lb.className = "lb";
    lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lbx" type="button" data-a="close" aria-label="Fechar">✕</button>' +
      '<button class="lbn prev" type="button" data-a="prev" aria-label="Foto anterior">‹</button>' +
      '<button class="lbn next" type="button" data-a="next" aria-label="Próxima foto">›</button>';
    document.body.appendChild(lb);
    var lbImg = $("img", lb), lbCap = $("figcaption", lb), cur = 0;
    function show(i) {
      cur = (i + order.length) % order.length;
      lbImg.src = order[cur].src; lbImg.alt = order[cur].alt || ""; lbCap.textContent = order[cur].alt || "";
    }
    function openLb(i) { show(i); if (lb.showModal) lb.showModal(); else lb.setAttribute("open", ""); }
    lb.addEventListener("click", function (e) {
      var a = e.target.dataset && e.target.dataset.a;
      if (a === "close" || e.target === lb) lb.close();
      else if (a === "prev") show(cur - 1);
      else if (a === "next") show(cur + 1);
    });
    lb.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
    var sx = 0;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    function makeTile(item, ratio, dup) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "tile"; b.style.aspectRatio = ratio;
      b.setAttribute("aria-label", "Ampliar: " + (item.alt || "foto"));
      if (item.fit) b.dataset.fit = item.fit;
      if (dup) { b.tabIndex = -1; b.setAttribute("aria-hidden", "true"); }
      var im = new Image();
      im.src = item.src; im.alt = item.alt || ""; im.loading = "lazy"; im.decoding = "async"; im.draggable = false;
      im.addEventListener("error", function () { b.style.display = "none"; }); // foto que não carrega some
      b.appendChild(im);
      b.addEventListener("click", function () { openLb(order.indexOf(item)); });
      return b;
    }
    function makeRow(items, rev) {
      var seq = [];
      while (seq.length < 8) seq = seq.concat(items);
      var rs = seq.map(function () { return ratios[Math.floor(Math.random() * ratios.length)]; });
      var row = document.createElement("div"), lane = document.createElement("div");
      row.className = "row" + (rev ? " rev" : ""); lane.className = "lane";
      lane.style.setProperty("--dur", seq.length * 7 + "s");
      [false, true].forEach(function (dup) { seq.forEach(function (it, i) { lane.appendChild(makeTile(it, rs[i], dup)); }); });
      row.appendChild(lane); reel.appendChild(row);
    }
    makeRow(shuffle(list), false);
    makeRow(shuffle(list), true);
    reel.addEventListener("touchstart", function () { reel.classList.add("touch"); }, { passive: true });
    reel.addEventListener("touchend", function () { setTimeout(function () { reel.classList.remove("touch"); }, 1500); }, { passive: true });
    new IntersectionObserver(function (es) { reel.classList.toggle("off", !es[0].isIntersecting); }).observe(reel);
  }

  /* 14. "Conte seu objetivo": monta a mensagem e abre o WhatsApp (nada é salvo) */
  var gf = $("#goalform");
  if (gf) gf.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(gf), nome = String(f.get("nome") || "").trim();
    var msg = "Olá, vim pelo site" + (nome ? ", meu nome é " + nome : "") + ". Meu objetivo é " + f.get("obj") +
      " e minha experiência com treino: " + f.get("exp") + ". Gostaria de agendar minha avaliação.";
    window.open("https://api.whatsapp.com/send?phone=" + WHATSAPP + "&text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  /* 15. Menu mostra em qual seção você está */
  var links = $$('.menu a[href^="#"]'), byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (l) { l.removeAttribute("aria-current"); }); // seções fora do menu apagam a marca
      var a = byId[e.target.id];
      if (a) a.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(function (sec) { spy.observe(sec); });

  /* 16. Antes e depois: só mostra itens com autorizado: true (use ?demo no endereço para ver um exemplo) */
  var baRail = $("[data-ba]"), baSec = $("#transformacoes");
  if (baRail) {
    var pares = (window.ANTES_DEPOIS || []).filter(function (x) { return x && x.autorizado === true && x.antes && x.depois; });
    if (!pares.length && /[?&]demo\b/.test(location.search)) {
      pares = [{ antes: "assets/galeria/lobo.webp", depois: "assets/galeria/lobo.webp", filtroAntes: "grayscale(1) brightness(.5) blur(1.5px)",
                 fit: "contain", nome: "Exemplo de como fica", detalhe: "Troque pelas fotos reais no config.js" }];
    }
    if (!pares.length) baSec.hidden = true;
    pares.forEach(function (it) {
      var fig = document.createElement("figure");
      fig.className = "ba card"; fig.style.setProperty("--pos", "50%");
      fig.innerHTML = '<div class="ba-stage"><img alt="Depois"><img class="ba-before" alt="Antes"><span class="ba-tag l">Antes</span><span class="ba-tag r">Depois</span>' +
        '<span class="ba-line"><i aria-hidden="true">↔</i></span><input type="range" min="0" max="100" value="50" aria-label="Arraste para comparar antes e depois"></div><figcaption></figcaption>';
      var stage = $(".ba-stage", fig), imgs = $$("img", fig), rg = $("input", fig), cap = $("figcaption", fig);
      imgs[0].src = it.depois; imgs[1].src = it.antes;
      if (it.filtroAntes) imgs[1].style.filter = it.filtroAntes;
      if (it.fit) stage.dataset.fit = it.fit;
      if (it.nome) { var b = document.createElement("b"); b.textContent = it.nome; cap.appendChild(b); }
      if (it.detalhe) cap.appendChild(document.createTextNode(it.detalhe));
      if (!it.nome && !it.detalhe) cap.remove();
      imgs.forEach(function (im) { im.addEventListener("error", function () { fig.remove(); if (!baRail.children.length) baSec.hidden = true; }); });
      var raf = 0, stopped = false;
      function setPos(v) { fig.style.setProperty("--pos", v + "%"); rg.value = v; }
      rg.addEventListener("input", function () { stopped = true; cancelAnimationFrame(raf); fig.style.setProperty("--pos", rg.value + "%"); });
      rg.addEventListener("pointerdown", function () { stopped = true; cancelAnimationFrame(raf); });
      // ao aparecer na tela, o controle balança uma vez para mostrar que dá para arrastar
      new IntersectionObserver(function (es, o) {
        if (!es[0].isIntersecting) return; o.disconnect();
        if (reduce) return;
        var t0 = performance.now();
        (function step(t) {
          if (stopped) return;
          var p = Math.min((t - t0) / 1800, 1);
          setPos((50 + Math.sin(p * Math.PI * 2) * 22).toFixed(1));
          if (p < 1) raf = requestAnimationFrame(step); else setPos(50);
        })(t0);
      }, { threshold: 0.6 }).observe(fig);
      baRail.appendChild(fig);
    });
  }

  /* 17. Vídeo no topo (liga e desliga em config.js; se falhar, o logo continua no lugar) */
  var V = (window.SITE || {}).videoHero, vbox = $(".plate .logo");
  var saver = navigator.connection && navigator.connection.saveData;
  if (V && V.ativo && V.src && vbox && !saver) {
    var plate = vbox.parentNode, vid = document.createElement("video"), manual = false;
    vid.muted = true; vid.defaultMuted = true; vid.loop = true; vid.playsInline = true;
    vid.preload = reduce ? "auto" : "metadata";
    vid.setAttribute("aria-label", V.descricao || "Vídeo da Team Lobo");
    if (V.poster) vid.poster = V.poster;
    vid.src = V.src;
    plate.classList.add("has-video");
    if (V.aspecto) plate.style.setProperty("--va", V.aspecto);
    vbox.appendChild(vid);
    var ctl = document.createElement("div"), pb = document.createElement("button");
    ctl.className = "vctl"; pb.type = "button";
    function label() { var on = !vid.paused; pb.textContent = on ? "❚❚" : "▶"; pb.setAttribute("aria-label", on ? "Pausar vídeo" : "Reproduzir vídeo"); }
    pb.addEventListener("click", function () { if (vid.paused) { manual = false; vid.play().catch(function () {}); } else { manual = true; vid.pause(); } });
    ["play", "pause"].forEach(function (ev) { vid.addEventListener(ev, label); });
    ctl.appendChild(pb);
    if (V.comSom) {
      var mb = document.createElement("button"); mb.type = "button";
      var lm = function () { mb.textContent = vid.muted ? "🔇" : "🔊"; mb.setAttribute("aria-label", vid.muted ? "Ligar o som" : "Desligar o som"); };
      mb.addEventListener("click", function () { vid.muted = !vid.muted; lm(); }); lm(); ctl.appendChild(mb);
    }
    vbox.appendChild(ctl); label();
    vid.addEventListener("loadeddata", function () { vbox.classList.add("playing"); });
    vid.addEventListener("error", function () { vid.remove(); ctl.remove(); plate.classList.remove("has-video"); vbox.classList.remove("playing"); });
    if (!reduce) new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !manual) vid.play().catch(function () {}); else vid.pause();
    }, { threshold: 0.25 }).observe(vbox);
  }
})();
