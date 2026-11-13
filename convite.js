(function () {
  const MARGEM = 14;
  const FOLGA_OBSTACULO = 16;
  const DISTANCIA_MINIMA = 90;
  const TENTATIVAS = 60;
  const ESCALA_MAXIMA_SIM = 1.3;
  const CRESCIMENTO_SIM = 0.05;
  const ESPERA_SIM_MS = 850;
  const CORACOES = 22;

  const SIMBOLOS = ['♥︎', '♥︎', '♪', '♫'];
  const CORES = ['#ff2a4d', '#3ff0ff', '#ff7a93'];

  const DICAS = [
    'Tem certeza?',
    'Esse "não" saiu meio desafinado.',
    'Pensa mais um pouquinho.',
    'O botão do sim está ficando maior. Coincidência?',
    'Já escolhi até a música pra gente cantar.',
  ];

  const nao = document.getElementById('nao');
  const sim = document.getElementById('sim');
  const titulo = document.getElementById('titulo');
  const dica = document.getElementById('dica');
  const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let deslocamento = { x: 0, y: 0 };
  let cliques = 0;

  const aleatorio = (min, max) => min + Math.random() * (max - min);

  const sobrepoe = (a, b) =>
    a.left < b.right + FOLGA_OBSTACULO &&
    a.right > b.left - FOLGA_OBSTACULO &&
    a.top < b.bottom + FOLGA_OBSTACULO &&
    a.bottom > b.top - FOLGA_OBSTACULO;

  function aplicarDeslocamento(novo) {
    deslocamento = novo;
    nao.style.setProperty('--x', novo.x + 'px');
    nao.style.setProperty('--y', novo.y + 'px');
  }

  // Sorteia um lugar visível, longe do atual e sem cobrir o título nem o "Sim".
  function novoDeslocamento() {
    const atual = nao.getBoundingClientRect();
    const origem = { left: atual.left - deslocamento.x, top: atual.top - deslocamento.y };
    const obstaculos = [sim.getBoundingClientRect(), titulo.getBoundingClientRect()];
    const limiteX = innerWidth - atual.width - MARGEM;
    const limiteY = innerHeight - atual.height - MARGEM;
    let candidato = { left: MARGEM, top: MARGEM };

    for (let i = 0; i < TENTATIVAS; i++) {
      const left = aleatorio(MARGEM, limiteX);
      const top = aleatorio(MARGEM, limiteY);
      const caixa = { left, top, right: left + atual.width, bottom: top + atual.height };
      const longe = Math.hypot(left - atual.left, top - atual.top) >= DISTANCIA_MINIMA;

      if (longe && !obstaculos.some((obstaculo) => sobrepoe(caixa, obstaculo))) {
        candidato = { left, top };
        break;
      }
    }

    return { x: candidato.left - origem.left, y: candidato.top - origem.top };
  }

  function comemorar() {
    const { left, top, width, height } = sim.getBoundingClientRect();

    for (let i = 0; i < CORACOES; i++) {
      const coracao = document.createElement('span');
      const angulo = aleatorio(0, Math.PI * 2);
      const alcance = aleatorio(70, 300);
      coracao.className = 'coracao';
      coracao.textContent = SIMBOLOS[i % SIMBOLOS.length];
      coracao.style.color = CORES[i % CORES.length];
      coracao.style.left = left + width / 2 + 'px';
      coracao.style.top = top + height / 2 + 'px';
      coracao.style.fontSize = aleatorio(16, 38) + 'px';
      document.body.append(coracao);
      coracao.animate(
        [
          { transform: 'translate(-50%, -50%) scale(.4)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(angulo) * alcance}px), calc(-50% + ${Math.sin(angulo) * alcance}px)) scale(1)`,
            opacity: 0,
          },
        ],
        { duration: ESPERA_SIM_MS, easing: 'cubic-bezier(.15, .7, .3, 1)', fill: 'forwards' }
      ).onfinish = () => coracao.remove();
    }
  }

  nao.addEventListener('click', () => {
    aplicarDeslocamento(novoDeslocamento());
    dica.textContent = DICAS[cliques % DICAS.length];
    cliques += 1;
    sim.style.setProperty('--escala', Math.min(1 + cliques * CRESCIMENTO_SIM, ESCALA_MAXIMA_SIM));
  });

  sim.addEventListener('click', (evento) => {
    if (movimentoReduzido) return;
    evento.preventDefault();
    comemorar();
    setTimeout(() => { location.href = sim.href; }, ESPERA_SIM_MS);
  });

  // O layout muda ao girar a tela: devolve o "Não" ao lugar para ele não ficar fora dela.
  addEventListener('resize', () => aplicarDeslocamento({ x: 0, y: 0 }));
})();
