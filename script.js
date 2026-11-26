(function () {
  var d = document.documentElement;
  d.dataset.ready = "1";

  /* 1) Fallback automático de imagem (assets/img/ -> raiz ou URL externa) */
  document.querySelectorAll("img").forEach(function (img) {
    function handleErr() {
      var fb = img.dataset.fb;
      if (fb && !img.dataset.triedFb) {
        img.dataset.triedFb = "1";
        img.src = fb;
        return;
      }
      var p = img.closest(".ph");
      if (p) p.classList.add("miss");
    }
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) handleErr();
    else img.addEventListener("error", handleErr);
  });

  /* 2) Vídeo opcional no Hero */
  var vh = window.SITE && SITE.videoHero;
  var plate = document.querySelector(".plate");
  var logoBox = plate && plate.querySelector(".logo");
  if (vh && vh.ativo && vh.src && plate && logoBox) {
    var vid = document.createElement("video");
    vid.src = vh.src;
    if (vh.poster) vid.poster = vh.poster;
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.autoplay = true;
    vid.setAttribute("aria-label", vh.descricao || "Vídeo da Team Lobo");
    if (vh.aspecto) plate.style.setProperty("--va", vh.aspecto);
    vid.addEventListener("loadeddata", function () {
      plate.classList.add("has-video");
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    });
    vid.addEventListener("error", function () {
      plate.classList.remove("has-video");
      vid.remove();
    });
    logoBox.appendChild(vid);
    if (vh.comSom) {
      var snd = document.createElement("button");
      snd.type = "button";
      snd.className = "vctrl";
      snd.textContent = "SOM";
      snd.setAttribute("aria-label", "Ativar som do vídeo");
      snd.addEventListener("click", function () {
        vid.muted = !vid.muted;
        snd.textContent = vid.muted ? "SOM" : "MUDO";
        snd.setAttribute("aria-label", vid.muted ? "Ativar som do vídeo" : "Silenciar vídeo");
      });
      logoBox.appendChild(snd);
    }
  }

  /* 3) Antes e depois arrastável (quando configurado) */
  var baRail = document.querySelector("[data-ba]");
  var baSec = document.getElementById("transformacoes");
  var baList = (window.ANTES_DEPOIS || []).filter(function (x) { return x && x.antes && x.depois; });
  if (baRail && baList.length) {
    baList.forEach(function (item) {
      var fig = document.createElement("figure");
      fig.className = "ba";
      var box = document.createElement("div");
      box.className = "ba-box";
      var before = document.createElement("img");
      before.src = item.antes;
      before.alt = "Antes — " + (item.titulo || "aluno da Team Lobo");
      before.loading = "lazy";
      before.decoding = "async";
      var after = document.createElement("img");
      after.className = "ba-after";
      after.src = item.depois;
      after.alt = "Depois — " + (item.titulo || "aluno da Team Lobo");
      after.loading = "lazy";
      after.decoding = "async";
      var tL = document.createElement("span");
      tL.className = "ba-tag l";
      tL.textContent = "Antes";
      var tR = document.createElement("span");
      tR.className = "ba-tag r";
      tR.textContent = "Depois";
      var line = document.createElement("div");
      line.className = "ba-line";
      line.setAttribute("aria-hidden", "true");
      var knob = document.createElement("span");
      knob.className = "ba-knob";
      knob.textContent = "↔";
      line.appendChild(knob);
      var range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = "100";
      range.value = "50";
      range.setAttribute("aria-label", "Comparar antes e depois" + (item.titulo ? " de " + item.titulo : ""));
      function setPos(v) {
        v = Math.max(0, Math.min(100, v));
        range.value = String(v);
        box.style.setProperty("--pos", v + "%");
      }
      range.addEventListener("input", function () { setPos(+range.value); });
      box.addEventListener("pointerdown", function (e) {
        if (e.target === range) return;
        box.setPointerCapture(e.pointerId);
        function move(ev) {
          var r = box.getBoundingClientRect();
          setPos(((ev.clientX - r.left) / r.width) * 100);
        }
        move(e);
        box.addEventListener("pointermove", move);
        box.addEventListener("pointerup", function () { box.removeEventListener("pointermove", move); }, { once: true });
      });
      box.append(before, after, tL, tR, line, range);
      fig.appendChild(box);
      if (item.titulo || item.nota) {
        var cap = document.createElement("figcaption");
        if (item.titulo) {
          var b = document.createElement("b");
          b.textContent = item.titulo;
          cap.appendChild(b);
        }
        if (item.nota) cap.appendChild(document.createTextNode(item.nota));
        fig.appendChild(cap);
      }
      baRail.appendChild(fig);
    });
  } else if (baSec) {
    baSec.hidden = true;
  }

  /* 4) Links do WhatsApp */
  var WA = "https://wa.me/5521982297477?text=";
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = WA + encodeURIComponent(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  /* 5) Alternância de Tema */
  var tb = document.querySelector(".theme");
  if (tb) {
    tb.addEventListener("click", function () {
      var n = d.dataset.theme === "light" ? "dark" : "light";
      d.dataset.theme = n;
      try { localStorage.setItem("tl-theme", n); } catch (e) {}
    });
  }

  /* 6) Menu Mobile */
  var bg = document.querySelector(".burger");
  var mn = document.getElementById("menu");
  if (bg && mn) {
    bg.addEventListener("click", function () {
      var o = mn.classList.toggle("open");
      bg.setAttribute("aria-expanded", String(o));
    });
    mn.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mn.classList.remove("open");
        bg.setAttribute("aria-expanded", "false");
      });
    });
  }

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 7) Abertura discreta na primeira visita */
  var intro = document.querySelector(".intro");
  try {
    if (!reduce && intro && !sessionStorage.getItem("tl-in")) {
      sessionStorage.setItem("tl-in", "1");
      intro.classList.add("on");
      setTimeout(function () { intro.classList.remove("on"); }, 700);
    }
  } catch (e) {}

  /* 8) Barra de progresso + destaque no menu */
  var bar = document.querySelector(".barbell");
  var links = Array.from(document.querySelectorAll(".menu a"));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  function onScroll() {
    var h = d.scrollHeight - innerHeight;
    if (bar && h > 0) bar.style.setProperty("--p", String(Math.min(1, Math.max(0, scrollY / h))));
    var y = scrollY + innerHeight * 0.35;
    var cur = "";
    secs.forEach(function (s) { if (s.offsetTop <= y) cur = "#" + s.id; });
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === cur); });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 9) Revelação suave + contadores */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-count]").forEach(count);
      io.unobserve(e.target);
    });
  }, { threshold: 0.14 });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  function count(el) {
    var end = +el.dataset.count;
    var pre = el.dataset.prefix || "";
    if (reduce) { el.textContent = pre + end; return; }
    var t0 = performance.now();
    (function tick(now) {
      var p = Math.min(1, (now - t0) / 1100);
      el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* 10) Filtro de relatos */
  document.querySelectorAll(".fbtn[data-f]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".fbtn[data-f]").forEach(function (x) {
        x.setAttribute("aria-pressed", String(x === b));
      });
      var f = b.dataset.f;
      document.querySelectorAll(".story").forEach(function (c) {
        c.hidden = f !== "todos" && c.dataset.k !== f;
      });
    });
  });

  /* 11) Lightbox unificado (Alunos, Atletas e Galeria Geral) */
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Foto ampliada");
  lb.innerHTML = '<button type="button" aria-label="Fechar">×</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector("figcaption");
  var lastFocus = null;

  function openLb(item) {
    var img = item.querySelector("img");
    if (!img) return;
    lastFocus = document.activeElement;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    var capEl = item.querySelector("figcaption");
    var infoEl = item.querySelector(".scard-info");
    lbCap.textContent = capEl ? capEl.textContent : (infoEl ? infoEl.textContent : img.alt);
    lb.classList.add("on");
    lb.querySelector("button").focus();
  }
  function closeLb() {
    lb.classList.remove("on");
    if (lastFocus) lastFocus.focus();
  }
  lb.querySelector("button").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("on")) closeLb(); });

  document.addEventListener("click", function (e) {
    var target = e.target.closest(".reel figure, .scard");
    if (target) openLb(target);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var target = e.target.closest(".reel figure, .scard");
    if (target) {
      e.preventDefault();
      openLb(target);
    }
  });

  /* 12) Formulário de objetivo -> WhatsApp */
  var gf = document.getElementById("goalform");
  if (gf) {
    gf.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(gf);
      var nome = (fd.get("nome") || "").toString().trim();
      var msg = "Olá" + (nome ? ", sou " + nome : "") + ", vim pelo site. Meu objetivo é " + fd.get("obj") + " e " + fd.get("exp") + ".";
      window.open(WA + encodeURIComponent(msg), "_blank", "noopener,noreferrer");
    });
  }

  /* 13) Microinterações em dispositivos com mouse */
  if (!reduce && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll(".card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });

    if (plate) {
      plate.addEventListener("pointermove", function (e) {
        var r = plate.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        plate.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
        plate.style.setProperty("--ry", (x * 9).toFixed(2) + "deg");
      });
      plate.addEventListener("pointerleave", function () {
        plate.style.removeProperty("--rx");
        plate.style.removeProperty("--ry");
      });
    }

    document.querySelectorAll(".mag").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        b.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () {
        b.style.transform = "";
      });
    });
  }
})();
