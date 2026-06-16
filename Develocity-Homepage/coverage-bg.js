/* Universal Coverage — dotted world-map + grid + telemetry nodes.
   Procedural continents on a dot grid, faded at the center so the
   content card reads cleanly. Pure infrastructure aesthetic: no glows,
   no gradients, no particles. */
(function () {
  const host = document.getElementById('covBg');
  if (!host) return;
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  let nodes = [], raf = 0, t = 0;

  // continents in normalized map space (x: 0..1 = lon, y: 0..1 = lat)
  const LAND = [
    [0.19, 0.33, 0.11, 0.17],   // N America
    [0.25, 0.50, 0.028, 0.06],  // C America
    [0.28, 0.66, 0.055, 0.17],  // S America
    [0.33, 0.15, 0.03, 0.05],   // Greenland
    [0.50, 0.27, 0.05, 0.07],   // Europe
    [0.54, 0.57, 0.075, 0.17],  // Africa
    [0.72, 0.31, 0.17, 0.15],   // Asia
    [0.665, 0.45, 0.04, 0.06],  // India
    [0.77, 0.50, 0.05, 0.05],   // SE Asia
    [0.83, 0.72, 0.06, 0.055],  // Australia
  ];

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#1ec9f2';
  }
  function onLand(nx, ny) {
    for (const [cx, cy, rx, ry] of LAND) {
      const v = ((nx - cx) / rx) ** 2 + ((ny - cy) / ry) ** 2;
      if (v < 1) return 1 - v; // depth into landmass (0 edge .. 1 center)
    }
    return -1;
  }
  // hash noise for stable per-cell dropout
  function hash(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }
  // horizontal visibility: hidden behind the centered content card
  function edgeVis(nx) {
    const d = Math.abs(nx - 0.5);
    if (d < 0.19) return 0;
    if (d > 0.27) return 1;
    return (d - 0.19) / 0.08;
  }

  function build() {
    nodes = [];
    const gap = 11;
    const candidates = [];
    for (let x = gap; x < W; x += gap) {
      for (let y = gap; y < H; y += gap) {
        const nx = x / W, ny = y / H;
        const depth = onLand(nx, ny);
        if (depth < 0) continue;
        const vis = edgeVis(nx);
        if (vis <= 0) continue;
        // vertical fade near top/bottom edges
        const vy = Math.min(1, Math.min(ny, 1 - ny) / 0.12);
        const n = hash(Math.round(x / gap), Math.round(y / gap));
        if (n > 0.32 + depth * 0.5) continue;        // organic density
        const a = (0.10 + depth * 0.16) * vis * vy;
        candidates.push({ x, y, a });
      }
    }
    // a few bright telemetry nodes on land (deterministic-ish pick)
    const picks = [];
    for (let i = 0; i < candidates.length && picks.length < 9; i++) {
      const c = candidates[(i * 47) % candidates.length];
      if (c && c.a > 0.16 && hash(c.x, c.y * 3) > 0.86) picks.push(c);
    }
    nodes = picks.map((c, i) => ({ x: c.x, y: c.y, ph: i * 1.3 }));
    window.__covDots = candidates;
  }

  function resize() {
    const r = host.getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    drawStatic();
    if (!reduce) { cancelAnimationFrame(raf); loop(); }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    // large architecture grid
    const cell = 104;
    ctx.strokeStyle = 'rgba(255,255,255,0.038)';
    ctx.lineWidth = 1;
    for (let x = (W % cell) / 2; x < W; x += cell) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (let y = (H % cell) / 2; y < H; y += cell) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
    // land dots
    const dots = window.__covDots || [];
    for (const d of dots) { ctx.fillStyle = `rgba(206,210,216,${d.a})`; ctx.fillRect(d.x, d.y, 2, 2); }
  }

  function loop() {
    t += 0.016;
    drawStatic();
    const ac = accent();
    for (const n of nodes) {
      const cx = n.x, cy = n.y;
      // expanding telemetry ring (0..1 sawtooth, staggered per node)
      const ring = ((t * 0.5 + n.ph) % 1);
      const rr = 3 + ring * 13;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = ac;
      ctx.globalAlpha = (1 - ring) * 0.5;
      ctx.lineWidth = 1;
      ctx.stroke();
      // pulsing core dot
      const pulse = 0.55 + 0.45 * Math.sin(t * 2.4 + n.ph * 2.1);
      const size = 3 + pulse * 1.8;
      ctx.fillStyle = ac;
      ctx.globalAlpha = 0.55 + 0.45 * pulse;
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(loop);
  }

  let to;
  addEventListener('resize', () => { clearTimeout(to); to = setTimeout(resize, 150); }, { passive: true });
  addEventListener('tweakchange', () => { /* accent re-read each frame */ });
  resize();
  setTimeout(resize, 350);
})();
