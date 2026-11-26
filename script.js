  /* 13. Galeria Interativa Palco 3D + Lightbox */
  var scCenter = $("#sc-center"), list = (window.GALERIA || []).slice();
  if (scCenter && list.length) {
    var catNames = { palco: "Palco & Títulos", evolucao: "Antes & Depois", bastidores: "Bastidores & Equipe" };
    var filtered = list.slice(), idx = 0;
    var mainImg = $("#sc-main-img"), leftImg = $("#sc-left img"), rightImg = $("#sc-right img");
    var scBadge = $("#sc-badge"), scCaption = $("#sc-caption"), scCount = $("#sc-count");
    var thumbsWrap = $("#sc-thumbs");

    // Lightbox em tela cheia
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
        b.type = "button"; b.className = "sc-thumb";
        b.setAttribute("aria-label", "Ver foto " + (i + 1));
        var im = new Image(); im.src = it.src; im.alt = ""; im.loading = "lazy";
        b.appendChild(im);
        b.addEventListener("click", function () { renderStage(i); });
        thumbsWrap.appendChild(b);
      });
    }

    function openLb() {
      var it = filtered[idx];
      if (!it) return;
      lbImg.src = it.src; lbImg.alt = it.alt || ""; lbCap.textContent = it.alt || "";
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    }

    $("#sc-prev").addEventListener("click", function () { renderStage(idx - 1); });
    $("#sc-next").addEventListener("click", function () { renderStage(idx + 1); });
    scCenter.addEventListener("click", openLb);
    scCenter.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(); } });

    // Swipe no Palco 3D
    var stageEl = $("#sc-stage"), stX = 0;
    stageEl.addEventListener("touchstart", function (e) { stX = e.touches[0].clientX; }, { passive: true });
    stageEl.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - stX;
      if (Math.abs(dx) > 40) renderStage(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Filtros por categoria
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

  /* 19. Slides interativos no card 3D do Hero + Partículas metálicas */
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
      }, 180);
      $$("button", hDots).forEach(function (d, k) { d.setAttribute("aria-selected", k === sIdx ? "true" : "false"); });
    }
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Destaque " + (i + 1));
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

  var canvas = $("#hero-particles");
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d"), pts = [];
    function resizeC() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeC();
    addEventListener("resize", resizeC, { passive: true });
    for (var p = 0; p < 34; p++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.7,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.15,
        a: Math.random() * 0.5 + 0.2
      });
    }
    (function drawPts() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var isLight = root.dataset.theme === "light";
      pts.forEach(function (pt) {
        pt.x += pt.vx; pt.y += pt.vy;
        if (pt.y < -10) { pt.y = canvas.height + 10; pt.x = Math.random() * canvas.width; }
        if (pt.x < -10) pt.x = canvas.width + 10;
        if (pt.x > canvas.width + 10) pt.x = -10;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? "rgba(10,12,15," + pt.a + ")" : "rgba(226,231,238," + pt.a + ")";
        ctx.fill();
      });
      requestAnimationFrame(drawPts);
    })();
  }
