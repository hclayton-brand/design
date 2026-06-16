/* CTA — animated halftone dot-matrix field.
   Squares whose size/brightness form a soft glowing arc that drifts
   slowly. Monochrome, no gradients-as-fill. Respects reduced-motion. */
(function () {
  const host = document.getElementById('ctaBg');
  if (!host) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'cta-dots';
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  let raf = 0, t = 0;
  const GAP = 13;

  function resize() {
    const r = host.getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) { draw(true); } else { cancelAnimationFrame(raf); loop(); }
  }

  function field(nx, ny, time) {
    // soft arc glow anchored low-center, slowly breathing + drifting
    const cx = 0.5 + 0.06 * Math.sin(time * 0.4);
    const cy = 1.08 + 0.04 * Math.cos(time * 0.33);
    const dx = (nx - cx), dy = (ny - cy) * 1.35;
    const d = Math.sqrt(dx * dx + dy * dy);
    const radius = 0.62 + 0.05 * Math.sin(time * 0.5);
    let v = 1 - d / radius;                  // 1 at center .. 0 at edge
    if (v < 0) v = 0;
    // a gentle traveling wave across the field for life
    v *= 0.78 + 0.22 * Math.sin(nx * 9 + ny * 5 - time * 1.6);
    return v;
  }

  function draw(stat) {
    ctx.clearRect(0, 0, W, H);
    const time = stat ? 1.2 : t;
    for (let x = GAP / 2; x < W; x += GAP) {
      for (let y = GAP / 2; y < H; y += GAP) {
        const v = field(x / W, y / H, time);
        if (v <= 0.02) continue;
        const s = 1 + v * 3.2;               // square size grows with intensity
        const a = 0.05 + v * 0.5;            // brightness
        ctx.fillStyle = `rgba(216,219,224,${a})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
  }

  function loop() {
    t += 0.016;
    draw(false);
    raf = requestAnimationFrame(loop);
  }

  let to;
  addEventListener('resize', () => { clearTimeout(to); to = setTimeout(resize, 150); }, { passive: true });
  resize();
  setTimeout(resize, 350);
})();
