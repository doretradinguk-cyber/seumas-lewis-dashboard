export function startRain(canvas, enabled) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let frame,
    last = 0,
    cols = [],
    w = 0,
    h = 0;
  function resize() {
    w = innerWidth;
    h = innerHeight;
    const d = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = w * d;
    canvas.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    cols = Array.from(
      { length: Math.ceil(w / 34) },
      () => (Math.random() * h) / 22,
    );
  }
  function draw(t) {
    frame = requestAnimationFrame(draw);
    if (t - last < 80) return;
    last = t;
    ctx.fillStyle = "rgba(4,14,12,.09)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = "12px monospace";
    cols.forEach((y, i) => {
      ctx.fillStyle = i % 4 === 0 ? "#37d5a0" : "#126753";
      ctx.fillText("01∆+<>:□"[Math.floor(Math.random() * 8)], i * 34, y * 22);
      cols[i] += 0.42;
      if (y * 22 > h && Math.random() > 0.98) cols[i] = -8;
    });
  }
  function update() {
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, w, h);
    if (enabled() && !reduce.matches && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  resize();
  update();
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", update);
  reduce.addEventListener("change", update);
  return update;
}
