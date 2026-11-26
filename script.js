/* TEAM LOBO v10 — Interações, Tema, Galeria 3D e Pílula Inteligente */
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

  /* 1. Links de WhatsApp com mensagem pronta */
  $$("[data-wa]").forEach(function (a) {
    a.href = waUrl(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  /* 2. Tema claro/escuro funcional com atualização de meta theme-color */
  var themeBtn = $(".theme");
  var metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem("tl-theme", t); } catch (e) {}
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", t === "dark" ? "Mudar para o modo claro" : "Mudar para o modo escuro");
    }
    if (metaTheme) {
      metaTheme.setAttribute("content", t === "dark" ? "#0B0C0E" : "#F3F4F2");
    }
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

  /* 3. Menu mobile e borda do cabeçalho */
  var burger = $(".burger"), menu = $(".menu"), top = $(".top");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 4. Imagens com plano B */
  $$(".ph img").forEach(function (img) {
    var step = 0;
    function fail() {
      if (step === 0 && img.dataset.fb) {
        step = 1;
        img.src = img.dataset.fb;
      } else {
        img.parentNode.classList.add("noimg");
      }
    }
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* 5. Revelação ao rolar e contadores */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
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
    es.forEach(function (e) {
      if (e.isIntersecting) {
        count(e.target);
        co.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(function (el) { co.observe(el); });

  /* 6. Filtro dos relatos */
  $$("#resultados .fbtn").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("#resultados .fbtn").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      $$(".story").forEach(function (s) { s.hidden = b.dataset.f !== "todos" && s.dataset.k !== b.dataset.f; });
    });
  });

  /* 7. Botões magnéticos no desktop */
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    $$(".mag").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 + "px," + (e.clientY - r.top - r.height / 2) * 0.28 + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* 8. Brilho escalonado nos títulos metálicos */
  $$(".chrome").forEach(function (el, i) { el.style.setProperty("--n", i % 5); });

  /* 9. Foco nas fotos da equipe */
  var fo = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("focus", e.isIntersecting); });
  }, { rootMargin: "-42% 0px -42% 0px" });
  $$(".person").forEach(function (p) { fo.observe(p); });

  /* 10. Barra de progresso, cabeçalho e Pílula Flutuante Inteligente de WhatsApp */
  var barbell = $(".barbell"), track = $(".track"), anim = null, rate = 1, lastY = scrollY, ticking = false;
  var waPill = $("#wa-pill"), waLabel = $("#wa-label");

  function onScrollFrame() {
    if (top) top.classList.toggle("sc", scrollY > 8);
    if (waPill) waPill.classList.toggle("visible", scrollY > 220);
    if (barbell) {
      var h = root.scrollHeight - innerHeight;
      barbell.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
    }
    ticking = false;
  }
  addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });
  onScrollFrame();

  if (!reduce && track) {
    (function loop() {
      var dy = Math.abs(scrollY - lastY);
      lastY = scrollY;
      rate += ((1 + Math.min(dy * 0.25, 8)) - rate) * 0.12;
      if (!anim && track.getAnimations) anim = track.getAnimations()[0];
      if (anim) anim.playbackRate = rate;
      requestAnimationFrame(loop);
    })();
  }

  /* Contexto dinâmico da Pílula de WhatsApp por seção */
  var waContexts = {
    metodo: {
      label: "Conhecer o protocolo →",
      msg: "Olá, vim pelo site e gostaria de conhecer o protocolo de treino e dieta."
    },
    resultados: {
      label: "Quero transformar meu físico →",
      msg: "Olá, vim pelo site, vi os resultados dos alunos e quero transformar meu físico!"
    },
    transformacoes: {
      label: "Quero transformar meu físico →",
      msg: "Olá, vim pelo site, vi as transformações e quero iniciar meu acompanhamento!"
    },
    lideranca: {
      label: "Treinar com o Sid Lobo →",
      msg: "Olá, vim pelo site e gostaria de iniciar minha consultoria com o Sid Lobo."
    },
    equipe: {
      label: "Falar com a equipe →",
      msg: "Olá, vim pelo site e gostaria de saber mais sobre o acompanhamento multidisciplinar."
    },
    galeria: {
      label: "Quero evoluir meu shape →",
      msg: "Olá, vim pelo site e gostaria de agendar minha avaliação física."
    },
    jornada: {
      label: "Começar minha avaliação →",
      msg: "Olá, vim pelo site e quero dar o primeiro passo na minha avaliação."
    },
    planos: {
      label: "Garantir minha vaga →",
      msg: "Olá, vim pelo site e quero saber mais sobre os planos da Team Lobo."
    },
    duvidas: {
      label: "Tirar dúvida no WhatsApp →",
      msg: "Olá, vim pelo site e gostaria de tirar uma dúvida antes de começar."
    },
    objetivo: {
      label: "Agendar avaliação agora →",
      msg: "Olá, vim pelo site e gostaria de agendar minha avaliação."
    },
    contato: {
      label: "Falar no WhatsApp →",
      msg: "Olá, vim pelo site e gostaria de agendar minha avaliação."
    }
  };

  /* 11. Cortina de entrada */
  var intro = $(".intro");
  if (intro) {
    var seen = false;
    try { seen = sessionStorage.getItem("tl-intro"); sessionStorage.setItem("tl-intro", "1"); } catch (e) {}
    if (seen || reduce) intro.remove();
    else setTimeout(function () { intro.remove(); }, 2700);
  }

  /* 12. Spotlight do cursor e inclinação 3D nos cards */
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    var hero = $(".hero");
    if (hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
        hero.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    }
    $$(".card").forEach(function (c) {
      c.classList.add("tilt");
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 4).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 5).toFixed(2) + "deg)";
        c.style.setProperty("--gx", x * 100 + "%");
        c.style.setProperty("--gy", y * 100 + "%");
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
  }

  /* 13. Galeria Interativa Palco 3D + Lightbox */
  var scCenter = $("#sc-center"), list = (window.GALERIA || []).slice();
  if (scCenter && list.length) {
    var catNames = { palco: "Palco & Títulos", evolucao: "Antes & Depois", bastidores: "Bastidores & Equipe" };
    var filtered = list.slice(), idx = 0;
    var mainImg = $("#sc-main-img"), leftImg = $("#sc-left img"), rightImg = $("#sc-right img");
    var scBadge = $("#sc-badge"), scCaption = $("#sc-caption"), scCount = $("#sc-count");
    var thumbsWrap = $("#sc-thumbs");

    var lb = document.createElement("dialog");
    lb.className = "lb";
    lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lbx" type="button" data-a="close" aria-label="Fechar">✕</button>' +
      '<button class="lbn prev" type="button" data-a="prev" aria-label="Foto anterior">‹</button>' +
      '<button class="lbn next" type="button" data-a="next" aria-label="Próxima foto">›</button>';
    document.body.appendChild(lb);
    var lbImg = $("img", lb), lbCap = $("figcaption", lb);

    function renderStage(newIdx) {
      if (!filtered.length) return;
      idx = (newIdx + filtered.length) % filtered.length;
      var curItem = filtered[idx];
      var prevItem = filtered[(idx - 1 + filtered.length) % filtered.length];
      var nextItem = filtered[(idx + 1) % filtered.length];

      mainImg.src = curItem.src;
      mainImg.alt = curItem.alt || "";
      mainImg.style.objectFit = curItem.fit || "cover";
      leftImg.src = prevItem.src;
      rightImg.src = nextItem.src;

      scBadge.textContent = catNames[curItem.cat] || "Team Lobo";
      scCaption.textContent = curItem.alt || "";
      scCount.textContent = (idx + 1) + " / " + filtered.length;

      $$(".sc-thumb", thumbsWrap).forEach(function (t, i) {
        t.setAttribute("aria-current", i === idx ? "true" : "false");
        if (i === idx) t.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    }

    function buildThumbs() {
      thumbsWrap.innerHTML = "";
      filtered.forEach(function (it, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "sc-thumb";
        b.setAttribute("aria-label", "Ver foto " + (i + 1));
        var im = new Image();
        im.src = it.src;
        im.alt = "";
        im.loading = "lazy";
        b.appendChild(im);
        b.addEventListener("click", function () { renderStage(i); });
        thumbsWrap.appendChild(b);
      });
    }

    function openLb() {
      var it = filtered[idx];
      if (!it) return;
      lbImg.src = it.src;
      lbImg.alt = it.alt || "";
      lbCap.textContent = it.alt || "";
      if (lb.showModal) lb.showModal();
      else lb.setAttribute("open", "");
    }

    $("#sc-prev").addEventListener("click", function () { renderStage(idx - 1); });
    $("#sc-next").addEventListener("click", function () { renderStage(idx + 1); });
    scCenter.addEventListener("click", openLb);
    scCenter.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(); }
    });

    var stageEl = $("#sc-stage"), stX = 0;
    stageEl.addEventListener("touchstart", function (e) { stX = e.touches[0].clientX; }, { passive: true });
    stageEl.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - stX;
      if (Math.abs(dx) > 40) renderStage(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    $$("#gal-filters .fbtn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("#gal-filters .fbtn").forEach(function (b) { b.setAttribute("aria-pressed", b === btn); });
        var cat = btn.dataset.cat;
        filtered = cat === "todos" ? list.slice() : list.filter(function (x) { return x.cat === cat; });
        buildThumbs();
        renderStage(0);
      });
    });

    lb.addEventListener("click", function (e) {
      var a = e.target.dataset && e.target.dataset.a;
      if (a === "close" || e.target === lb) lb.close();
      else if (a === "prev") { renderStage(idx - 1); openLb(); }
      else if (a === "next") { renderStage(idx + 1); openLb(); }
    });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { renderStage(idx - 1); openLb(); }
      if (e.key === "ArrowRight") { renderStage(idx + 1); openLb(); }
    });

    buildThumbs();
    renderStage(0);
  }

  /* 14. Conte seu objetivo */
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

  /* 15. Menu ativo + atualização dinâmica da Pílula Flutuante de WhatsApp */
  var links = $$('.menu a[href^="#"]'), byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (l) { l.removeAttribute("aria-current"); });
      var a = byId[id];
      if (a) a.setAttribute("aria-current", "true");

      if (waPill && waLabel && waContexts[id]) {
        waLabel.textContent = waContexts[id].label;
        waPill.href = waUrl(waContexts[id].msg);
      }
    });
  }, { rootMargin: "-40% 0px -45% 0px" });
  $$("main section[id]").forEach(function (sec) { spy.observe(sec); });

  /* 16. Antes e depois */
  var baRail = $("[data-ba]"), baSec = $("#transformacoes");
  if (baRail && baSec) {
    var pares = (window.ANTES_DEPOIS || []).filter(function (x) { return x && x.autorizado === true && x.antes && x.depois; });
    if (!pares.length && /[?&]demo\b/.test(location.search)) {
      pares = [{ antes: "assets/teamlobo.jpg", depois: "assets/teamlobo.jpg", filtroAntes: "grayscale(1) brightness(.5) blur(1.5px)",
                 fit: "contain", nome: "Exemplo de como fica", detalhe: "Troque pelas fotos reais no config.js" }];
    }
    if (!pares.length) baSec.hidden = true;
    pares.forEach(function (it) {
      var fig = document.createElement("figure");
      fig.className = "ba card";
      fig.style.setProperty("--pos", "50%");
      fig.innerHTML = '<div class="ba-stage"><img alt="Depois"><img class="ba-before" alt="Antes"><span class="ba-tag l">Antes</span><span class="ba-tag r">Depois</span>' +
        '<span class="ba-line"><i aria-hidden="true">↔</i></span><input type="range" min="0" max="100" value="50" aria-label="Arraste para comparar antes e depois"></div><figcaption></figcaption>';
      var stage = $(".ba-stage", fig), imgs = $$("img", fig), rg = $("input", fig), cap = $("figcaption", fig);
      imgs[0].src = it.depois;
      imgs[1].src = it.antes;
      if (it.filtroAntes) imgs[1].style.filter = it.filtroAntes;
      if (it.fit) stage.dataset.fit = it.fit;
      if (it.nome) { var b = document.createElement("b"); b.textContent = it.nome; cap.appendChild(b); }
      if (it.detalhe) cap.appendChild(document.createTextNode(it.detalhe));
      if (!it.nome && !it.detalhe) cap.remove();
      imgs.forEach(function (im) {
        im.addEventListener("error", function () {
          fig.remove();
          if (!baRail.children.length) baSec.hidden = true;
        });
      });
      var raf = 0, stopped = false;
      function setPos(v) { fig.style.setProperty("--pos", v + "%"); rg.value = v; }
      rg.addEventListener("input", function () { stopped = true; cancelAnimationFrame(raf); fig.style.setProperty("--pos", rg.value + "%"); });
      rg.addEventListener("pointerdown", function () { stopped = true; cancelAnimationFrame(raf); });
      new IntersectionObserver(function (es, o) {
        if (!es[0].isIntersecting) return;
        o.disconnect();
        if (reduce) return;
        var t0 = performance.now();
        (function step(t) {
          if (stopped) return;
          var p = Math.min((t - t0) / 1800, 1);
          setPos((50 + Math.sin(p * Math.PI * 2) * 22).toFixed(1));
          if (p < 1) raf = requestAnimationFrame(step);
          else setPos(50);
        })(t0);
      }, { threshold: 0.6 }).observe(fig);
      baRail.appendChild(fig);
    });
  }

  /* 17. Vídeo no topo */
  var V = (window.SITE || {}).videoHero, vbox = $(".plate .logo");
  var saver = navigator.connection && navigator.connection.saveData;
  if (V && V.ativo && V.src && vbox && !saver) {
    var plate = vbox.parentNode, vid = document.createElement("video"), manual = false;
    vid.muted = true;
    vid.defaultMuted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.preload = reduce ? "auto" : "metadata";
    vid.setAttribute("aria-label", V.descricao || "Vídeo da Team Lobo");
    if (V.poster) vid.poster = V.poster;
    vid.src = V.src;
    plate.classList.add("has-video");
    if (V.aspecto) plate.style.setProperty("--va", V.aspecto);
    vbox.appendChild(vid);
    var ctl = document.createElement("div"), pb = document.createElement("button");
    ctl.className = "vctl";
    pb.type = "button";
    function label() {
      var on = !vid.paused;
      pb.textContent = on ? "❚❚" : "▶";
      pb.setAttribute("aria-label", on ? "Pausar vídeo" : "Reproduzir vídeo");
    }
    pb.addEventListener("click", function () {
      if (vid.paused) { manual = false; vid.play().catch(function () {}); }
      else { manual = true; vid.pause(); }
    });
    ["play", "pause"].forEach(function (ev) { vid.addEventListener(ev, label); });
    ctl.appendChild(pb);
    if (V.comSom) {
      var mb = document.createElement("button");
      mb.type = "button";
      var lm = function () {
        mb.textContent = vid.muted ? "🔇" : "🔊";
        mb.setAttribute("aria-label", vid.muted ? "Ligar o som" : "Desligar o som");
      };
      mb.addEventListener("click", function () { vid.muted = !vid.muted; lm(); });
      lm();
      ctl.appendChild(mb);
    }
    vbox.appendChild(ctl);
    label();
    vid.addEventListener("loadeddata", function () { vbox.classList.add("playing"); });
    vid.addEventListener("error", function () {
      vid.remove();
      ctl.remove();
      plate.classList.remove("has-video");
      vbox.classList.remove("playing");
    });
    if (!reduce) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !manual) vid.play().catch(function () {});
        else vid.pause();
      }, { threshold: 0.25 }).observe(vbox);
    }
  }

  /* 18. Interação 3D no card principal do Hero */
  var plateEl = $(".plate"), logoBox = $(".plate .logo");
  if (!reduce && plateEl && logoBox) {
    function tiltPlate(clientX, clientY) {
      var r = plateEl.getBoundingClientRect();
      var x = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      var y = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
      var rx = ((0.5 - y) * 14).toFixed(2);
      var ry = ((x - 0.5) * 16).toFixed(2);
      logoBox.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale3d(1.02,1.02,1.02)";
      logoBox.style.setProperty("--px", (x * 100).toFixed(1) + "%");
      logoBox.style.setProperty("--py", (y * 100).toFixed(1) + "%");
    }
    function resetPlate() {
      plateEl.classList.remove("touching");
      logoBox.style.transform = "";
    }
    plateEl.addEventListener("pointermove", function (e) {
      if (e.pointerType === "mouse") tiltPlate(e.clientX, e.clientY);
    });
    plateEl.addEventListener("pointerleave", resetPlate);
    plateEl.addEventListener("touchstart", function (e) {
      plateEl.classList.add("touching");
      if (e.touches[0]) tiltPlate(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    plateEl.addEventListener("touchmove", function (e) {
      if (e.touches[0]) tiltPlate(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    plateEl.addEventListener("touchend", resetPlate, { passive: true });
  }
})();
