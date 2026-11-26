/* CONFIGURAÇÕES DO SITE — edite aqui, sem mexer no resto do código. */

/* 1) VÍDEO NO TOPO (no lugar do logo).
   Para ligar: troque ativo para true e coloque o arquivo em assets/video/ (veja o LEIA-ME.txt de lá).
   Se estiver desligado, ou se o vídeo não carregar, o site mostra o logo normalmente. */
window.SITE = {
  videoHero: {
    ativo: false,
    src: "assets/video/hero.mp4",
    poster: "assets/video/hero.jpg",   // imagem que aparece antes do vídeo carregar (opcional)
    aspecto: "4/5",                    // "4/5" vertical, "1/1" quadrado, "16/10" horizontal
    descricao: "Treino da Team Lobo",  // texto para leitores de tela
    comSom: false                      // true mostra um botão para ligar o som (o vídeo sempre começa mudo)
  }
};

/* 2) ANTES E DEPOIS.
   Só aparecem os itens com autorizado: true. Marque assim somente depois de ter a autorização escrita da pessoa.
   Use fotos com o mesmo enquadramento e a mesma luz, uma de cada lado.
   Para ver como fica sem fotos reais, abra o site com ?demo no final do endereço. */
window.ANTES_DEPOIS = [
  // { antes: "assets/antes-depois/aluno1-antes.jpg", depois: "assets/antes-depois/aluno1-depois.jpg",
  //   nome: "Aluno Team Lobo", detalhe: "Resultado em 6 meses", autorizado: true },
];
