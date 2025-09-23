const aliveCards = document.querySelectorAll(".js-alive-glass");

aliveCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.setProperty("--glow-a", ".22"); // показати пляму
  });

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    card.style.setProperty("--glow-x", `${x}px`);
    card.style.setProperty("--glow-y", `${y}px`);

    // дуже легкий нахил (≈ ±4°)
    const tiltY = (y / r.height - 0.5) * -1;
    const tiltX = (x / r.width - 0.5) * 1;
    card.style.setProperty("--tiltX", `${tiltX}deg`);
    card.style.setProperty("--tiltY", `${tiltY}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--glow-a", "0"); // сховати пляму
    card.style.setProperty("--glow-x", "50%"); // повернути в центр
    card.style.setProperty("--glow-y", "50%");
    card.style.setProperty("--tiltX", "0deg"); // вирівняти нахил
    card.style.setProperty("--tiltY", "0deg");
  });
});

(() => {
  const root = document.querySelector(".testi");
  if (!root) return; // захист, якщо секції нема

  const track = root.querySelector(".testi__track");
  const slides = Array.from(root.querySelectorAll(".testi__slide"));
  const dotsWrap = root.querySelector(".testi__dots");

  const AUTOPLAY = 3000; // 3 c
  let i = 0;
  let timer = null; // <- зберігаємо єдиний таймер

  // --- dots
  slides.forEach((_, idx) => {
    const b = document.createElement("button");
    b.className = "testi__dot";
    b.type = "button";
    b.addEventListener("click", () => go(idx, true));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(root.querySelectorAll(".testi__dot"));

  function render() {
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
  }

  function go(n, user = false) {
    i = (n + slides.length) % slides.length;
    render();
    if (user) restart();
  }

  function next() {
    go(i + 1);
  }

  function start() {
    if (timer) return; // <- не даємо стартувати вдруге
    timer = setInterval(next, AUTOPLAY);
  }
  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }
  function restart() {
    stop();
    start();
  }

  // Пауза при наведенні/фокусі
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  // Пауза, коли вкладка не активна
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  // (необов’язково) свайп — якщо ще смикається, просто прибери цей блок
  let x0 = null;
  track.addEventListener("pointerdown", (e) => {
    x0 = e.clientX;
    track.setPointerCapture(e.pointerId);
    stop();
  });
  track.addEventListener("pointerup", (e) => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true);
    start();
    x0 = null;
  });

  // init
  render();
  start();
})();
// Before/After slider
document.querySelectorAll(".ba").forEach((el) => {
  const range = el.querySelector(".ba__range");
  const set = (v) => el.style.setProperty("--p", `${v}%`);
  set(range.value || 50);

  range.addEventListener("input", (e) => set(e.target.value));

  // покращення для клавіатури
  range.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      range.stepDown();
      range.dispatchEvent(new Event("input"));
    }
    if (e.key === "ArrowRight") {
      range.stepUp();
      range.dispatchEvent(new Event("input"));
    }
  });
});
