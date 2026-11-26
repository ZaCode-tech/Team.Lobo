/* CONFIGURAÇÕES DO SITE — edite aqui, sem mexer no resto do código. */

/* 1) VÍDEO NO TOPO (no lugar do logo).
   Para ligar: troque ativo para true e coloque o arquivo em assets/video/.
   Se estiver desligado, ou se o vídeo não carregar, o site mostra o logo normalmente. */
window.SITE = {
  videoHero: {
    ativo: false,
    src: "assets/video/hero.mp4",
    poster: "assets/video/hero.jpg",
    aspecto: "4/5",
    descricao: "Treino da Team Lobo",
    comSom: false
  }
};

/* 2) CAMPO DOS ALUNOS & ATLETAS (Animação contínua + peso maior para competidores).
   Mantém os nomes originais dos arquivos em assets/img/ com fallback automático na raiz. */
window.ALUNOS_SHOWCASE = [
  /* --- ATLETAS DE FISICULTURISMO (peso: "competidor" -> cards maiores em destaque) --- */
  {
    src: "assets/img/412891.jpg",
    fb: "412891.jpg",
    peso: "competidor",
    categoria: "Campeão · BRAFF",
    titulo: "Atleta Campeão #065",
    detalhe: "Preparação competitiva com Sid Lobo"
  },
  {
    src: "assets/img/412888.jpg",
    fb: "412888.jpg",
    peso: "competidor",
    categoria: "Campeão · BRAFF",
    titulo: "Atleta Campeão #084",
    detalhe: "Troféu e medalha no palco"
  },
  {
    src: "assets/img/412894.jpg",
    fb: "412894.jpg",
    peso: "competidor",
    categoria: "Estadual WBBF RJ",
    titulo: "Atleta Campeão WBBF",
    detalhe: "Campeonato Estadual de Fisiculturismo"
  },
  {
    src: "assets/img/412885.jpg",
    fb: "412885.jpg",
    peso: "competidor",
    categoria: "Pódio · BRAFF",
    titulo: "Atleta Campeão #080",
    detalhe: "Condicionamento de palco Team Lobo"
  },
  {
    src: "assets/img/412877.jpg",
    fb: "412877.jpg",
    peso: "competidor",
    categoria: "Estreantes · #576",
    titulo: "Atleta Estreante Premiado",
    detalhe: "Duplo pódio sob comando de Sid Lobo"
  },
  {
    src: "assets/img/412875.jpg",
    fb: "412875.jpg",
    peso: "competidor",
    categoria: "Esquadrão Team Lobo",
    titulo: "Time Completo nos Bastidores",
    detalhe: "Atletas preparados para o palco"
  },

  /* --- EMAGRECIMENTO & RECOMPOSIÇÃO CORPORAL (peso: "evolucao") --- */
  {
    src: "assets/img/412863.jpg",
    fb: "412863.jpg",
    peso: "evolucao",
    categoria: "Emagrecimento & Definição",
    titulo: "Evolução Feminina",
    detalhe: "Redução de medidas e definição abdominal"
  },
  {
    src: "assets/img/412865.jpg",
    fb: "412865.jpg",
    peso: "evolucao",
    categoria: "Recomposição Corporal",
    titulo: "Secagem & Hipertrofia",
    detalhe: "Perda de gordura com ganho de densidade"
  },
  {
    src: "assets/img/412898.jpg",
    fb: "412898.jpg",
    peso: "evolucao",
    categoria: "Hipertrofia & Estética",
    titulo: "Evolução de Shape",
    detalhe: "Definição muscular e volume"
  },
  {
    src: "assets/img/412881.jpg",
    fb: "412881.jpg",
    peso: "evolucao",
    categoria: "União & Disciplina",
    titulo: "Alcateia Team Lobo",
    detalhe: "Compromisso marcado na pele"
  }
];

/* 3) FOTOS DO HEAD COACH SID LOBO (Mosaico de conquistas + galeria) */
window.SID_FOTOS = [
  {
    src: "assets/img/412859.jpg",
    fb: "412859.jpg",
    titulo: "Campeão no Palco BRAFF",
    detalhe: "Troféu e medalha oficial #141"
  },
  {
    src: "assets/img/412840.jpg",
    fb: "412840.jpg",
    titulo: "Cultura Clássica · Campeão",
    detalhe: "Consagração nos palcos do Rio de Janeiro"
  },
  {
    src: "assets/img/412848.jpg",
    fb: "412848.jpg",
    titulo: "Pose Clássica de Palco",
    detalhe: "Simetria, condicionamento e controle"
  },
  {
    src: "assets/img/412851.jpg",
    fb: "412851.jpg",
    titulo: "Head Coach & CEO",
    detalhe: "Ensaio oficial Team Lobo"
  },
  {
    src: "assets/img/412853.jpg",
    fb: "412853.jpg",
    titulo: "Uniforme Oficial Team Lobo",
    detalhe: "Identidade de quem treina com propósito"
  }
];

/* 4) ANTES E DEPOIS INTERATIVO (Comparador arrastável opcional) */
window.ANTES_DEPOIS = [];
