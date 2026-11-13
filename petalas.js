(function () {
  const QUANTIDADE = 14;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const aleatorio = (min, max) => min + Math.random() * (max - min);

  for (let i = 0; i < QUANTIDADE; i++) {
    const petala = document.createElement('span');
    const duracao = aleatorio(9, 18);
    petala.className = 'petala';
    petala.setAttribute('aria-hidden', 'true');
    petala.style.left = aleatorio(0, 100) + 'vw';
    petala.style.scale = aleatorio(0.6, 1.15);
    petala.style.animationDuration = duracao + 's';
    petala.style.animationDelay = -aleatorio(0, duracao) + 's';
    petala.style.setProperty('--deriva', aleatorio(-90, 90) + 'px');
    petala.style.setProperty('--giro', aleatorio(240, 720) + 'deg');
    document.body.append(petala);
  }
})();
