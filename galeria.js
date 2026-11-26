/* GALERIA E CAMPO DOS ALUNOS — carrega automaticamente as fotos reais da Team Lobo */
(function () {
  var fotosGerais = [
    ["412891.jpg", "Campeão #065 e Sid Lobo · BRAFF"],
    ["412888.jpg", "Campeão #084 com troféu e medalha"],
    ["412894.jpg", "Campeonato Estadual WBBF RJ"],
    ["412885.jpg", "Campeão #080 · Pódio BRAFF"],
    ["412877.jpg", "Estreantes · Duplo pódio #576"],
    ["412875.jpg", "Esquadrão de atletas Team Lobo"],
    ["412859.jpg", "Sid Lobo campeão no palco BRAFF"],
    ["412840.jpg", "Sid Lobo · Troféu e medalha"],
    ["412848.jpg", "Sid Lobo · Pose clássica"],
    ["412851.jpg", "Sid Lobo · Head Coach e CEO"],
    ["412853.jpg", "Uniforme oficial Team Lobo"],
    ["412863.jpg", "Evolução real · Emagrecimento e definição"],
    ["412865.jpg", "Evolução real · Recomposição corporal"],
    ["412898.jpg", "Evolução real · Hipertrofia e estética"],
    ["412881.jpg", "Alcateia Team Lobo · União e disciplina"]
  ];

  function montarGaleria() {
    var box = document.querySelector("[data-reel]");
    if (!box) return;
    var meio = Math.ceil(fotosGerais.length / 2);
    var linhas = [fotosGerais.slice(0, meio), fotosGerais.slice(meio)];

    linhas.forEach(function (lista, idx) {
      var row = document.createElement("div");
      row.className = "row" + (idx ? " rev" : "");
      var strip = document.createElement("div");
      strip.className = "strip";

      [lista, lista].forEach(function (bloco, dup) {
        bloco.forEach(function (item) {
          var fig = document.createElement("figure");
          if (dup) fig.setAttribute("aria-hidden", "true");
          else {
            fig.tabIndex = 0;
            fig.setAttribute("role", "button");
            fig.setAttribute("aria-label", "Ampliar: " + item[1]);
          }
          var img = document.createElement("img");
          img.src = "assets/img/" + item[0];
          img.dataset.fb = item[0];
          img.alt = dup ? "" : item[1];
          img.loading = "lazy";
          img.decoding = "async";
          img.onerror = function () {
            if (img.dataset.fb && img.src.indexOf("assets/img/") !== -1) {
              img.src = img.dataset.fb;
              return;
            }
            fig.remove();
          };
          var cap = document.createElement("figcaption");
          cap.textContent = item[1];
          fig.append(img, cap);
          strip.appendChild(fig);
        });
      });

      row.appendChild(strip);
      box.appendChild(row);
    });
  }

  function montarCampoAlunos() {
    var stage = document.querySelector("[data-students]");
    var dados = window.ALUNOS_SHOWCASE || [];
    if (!stage || !dados.length) return;

    function renderizar(filtro) {
      stage.innerHTML = "";
      var atletas = dados.filter(function (a) { return a.peso === "competidor"; });
      var evolucoes = dados.filter(function (a) { return a.peso !== "competidor"; });

      var grupos = [];
      if (filtro === "todos") {
        grupos.push({
          titulo: "Atletas de Fisiculturismo & Palco",
          sub: "Preparação competitiva · Destaque principal",
          lista: atletas,
          rev: false,
          dur: "42s"
        });
        grupos.push({
          titulo: "Emagrecimento, Secagem & Shape",
          sub: "Consultoria estética e recomposição corporal",
          lista: evolucoes,
          rev: true,
          dur: "38s"
        });
      } else if (filtro === "competidor") {
        grupos.push({
          titulo: "Atletas de Fisiculturismo & Palco",
          sub: "Campeões e competidores sob comando de Sid Lobo",
          lista: atletas,
          rev: false,
          dur: "42s"
        });
      } else {
        grupos.push({
          titulo: "Emagrecimento, Secagem & Shape",
          sub: "Resultados reais de quem segue o protocolo",
          lista: evolucoes,
          rev: false,
          dur: "38s"
        });
      }

      grupos.forEach(function (g) {
        if (!g.lista.length) return;
        var wrap = document.createElement("div");
        wrap.className = "s-row-wrap";

        var label = document.createElement("div");
        label.className = "s-row-label";
        label.innerHTML = "<span>" + g.titulo + "</span><small>" + g.sub + "</small>";
        wrap.appendChild(label);

        var marquee = document.createElement("div");
        marquee.className = "s-marquee" + (g.rev ? " rev" : "");
        marquee.style.setProperty("--dur", g.dur);

        var track = document.createElement("div");
        track.className = "s-track";

        [g.lista, g.lista].forEach(function (bloco, dup) {
          bloco.forEach(function (item) {
            var isComp = item.peso === "competidor";
            var card = document.createElement("article");
            card.className = "scard " + (isComp ? "is-comp" : "is-evo");
            if (dup) {
              card.setAttribute("aria-hidden", "true");
            } else {
              card.tabIndex = 0;
              card.setAttribute("role", "button");
              card.setAttribute("aria-label", "Ampliar: " + item.titulo + " — " + item.detalhe);
            }

            var img = document.createElement("img");
            img.src = item.src;
            img.dataset.fb = item.fb || "";
            img.alt = dup ? "" : (item.titulo + " — " + item.detalhe);
            img.loading = "lazy";
            img.decoding = "async";
            img.onerror = function () {
              if (img.dataset.fb && img.src !== img.dataset.fb) {
                img.src = img.dataset.fb;
                return;
              }
              card.remove();
            };

            var ov = document.createElement("div");
            ov.className = "scard-ov";
            ov.innerHTML =
              '<span class="scard-badge">' + item.categoria + "</span>" +
              '<div class="scard-info"><b>' + item.titulo + "</b><span>" + item.detalhe + "</span></div>";

            card.append(img, ov);
            track.appendChild(card);
          });
        });

        marquee.appendChild(track);
        wrap.appendChild(marquee);
        stage.appendChild(wrap);
      });
    }

    renderizar("todos");

    document.querySelectorAll(".s-filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".s-filter").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        renderizar(btn.dataset.sf || "todos");
      });
    });
  }

  function montarMosaicoSid() {
    var strip = document.querySelector("[data-sid-strip]");
    var mainBox = document.querySelector(".sid-main");
    var fotos = window.SID_FOTOS || [];
    if (!strip || !mainBox || !fotos.length) return;

    var mainImg = mainBox.querySelector("img");
    var mainCap = mainBox.querySelector(".sid-cap");

    fotos.slice(0, 4).forEach(function (f, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sid-thumb" + (i === 0 ? " on" : "");
      btn.setAttribute("aria-label", "Ver foto: " + f.titulo);

      var img = document.createElement("img");
      img.src = f.src;
      img.dataset.fb = f.fb || "";
      img.alt = f.titulo;
      img.loading = "lazy";
      img.onerror = function () {
        if (img.dataset.fb && img.src !== img.dataset.fb) {
          img.src = img.dataset.fb;
          return;
        }
        btn.remove();
      };

      btn.appendChild(img);
      btn.addEventListener("click", function () {
        strip.querySelectorAll(".sid-thumb").forEach(function (t) { t.classList.remove("on"); });
        btn.classList.add("on");
        if (mainImg) {
          mainImg.src = f.src;
          mainImg.dataset.fb = f.fb || "";
          mainImg.alt = f.titulo + " — " + f.detalhe;
        }
        if (mainCap) mainCap.textContent = f.titulo + " · " + f.detalhe;
      });

      strip.appendChild(btn);
    });
  }

  montarCampoAlunos();
  montarMosaicoSid();
  montarGaleria();
})();
