/* Interações do site: WhatsApp, menu, título animado, revelação, contadores */
(function () {
  var WHATSAPP = "5511992890538"; // WhatsApp para novos alunos (o mesmo do site atual)
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  // Botões com data-wa abrem o WhatsApp com mensagem pronta
  $$("[data-wa]").forEach(function (a) {
    a.href = "https://api.whatsapp.com/send?phone=" + WHATSAPP + "&text=" + encodeURIComponent(a.dataset.wa);
    a.target = "_blank"; a.rel = "noopener noreferrer";
  });

  // Menu no celular
  var burger = document.querySelector(".burger"), menu = document.querySelector(".menu");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

  // Linha sob o cabeçalho ao rolar
  var top = document.querySelector(".top");
  var onScroll = function () { top.classList.toggle("scrolled", scrollY > 8); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Título do hero revelado palavra por palavra (o <em> mantém o estilo)
  var h1 = document.querySelector("[data-split]");
  if (h1 && !reduce) {
    var i = 0;
    h1.innerHTML = h1.innerHTML.replace(/(<em>)(.*?)(<\/em>)|([^<\s]+)/g, function (m, o, inner, c, word) {
      if (word) return '<span class="w" style="--i:' + (i++) + '"><span>' + word + "</span></span>";
      return o + inner.split(" ").map(function (w) { return '<span class="w" style="--i:' + (i++) + '"><span>' + w + "</span></span>"; }).join(" ") + c;
    });
  }

  // Revelação ao entrar na tela
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal]").forEach(function (el) { io.observe(el); });

  // Contadores
  var count = function (el) {
    var end = +el.dataset.count, pre = el.dataset.prefix || "";
    if (reduce) { el.textContent = pre + end; return; }
    var t0 = performance.now();
    (function tick(t) {
      var p = Math.min((t - t0) / 1400, 1);
      el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  };
  var co = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(function (el) { co.observe(el); });

  // Botão principal "puxa" levemente em direção ao cursor (só com mouse)
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
