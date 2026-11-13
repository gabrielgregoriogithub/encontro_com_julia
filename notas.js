(function () {
  const QUANTIDADE = 14;
  const SIMBOLOS = ['♪', '♫', '♩', '♬'];
  const CORES = ['#ff2a4d', '#3ff0ff', '#39ff88', '#ffb347'];

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const aleatorio = (min, max) => min + Math.random() * (max - min);
  const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

  for (let i = 0; i < QUANTIDADE; i++) {
    const nota = document.createElement('span');
    const duracao = aleatorio(9, 18);
    nota.className = 'nota';
    nota.textContent = sortear(SIMBOLOS);
    nota.setAttribute('aria-hidden', 'true');
    nota.style.color = sortear(CORES);
    nota.style.left = aleatorio(0, 100) + 'vw';
    nota.style.scale = aleatorio(0.7, 1.4);
    nota.style.animationDuration = duracao + 's';
    nota.style.animationDelay = -aleatorio(0, duracao) + 's';
    nota.style.setProperty('--deriva', aleatorio(-90, 90) + 'px');
    nota.style.setProperty('--giro', aleatorio(-40, 40) + 'deg');
    document.body.append(nota);
  }
})();
