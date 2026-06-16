/* Integrations background: dotted world map (left & right bands) + grid. */
(function () {
  const host = document.getElementById('intBg');
  if (!host) return;
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const blinkWrap = document.createElement('div');
  blinkWrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  host.appendChild(blinkWrap);
  let W, H, dpr = Math.min(2, window.devicePixelRatio || 1);

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#1ec9f2';
  }

  // ---- coarse world-map silhouette as ellipse "blobs" on a 64x28 grid ----
  // [col, row, radiusX, radiusY]
  const GRID_W = 64, GRID_H = 28;
  const BLOBS = [
    // North America
    [10,3,5,2],[8,5,5,2.5],[12,8,4,2.5],[15,10,2.5,2],[16.5,11.5,1.5,1.5],
    // Greenland
    [25,2,2,1.5],
    // South America
    [21,15,2,1.6],[22,18,3,3],[21,21,2.2,2.5],[20,24,1.1,2],
    // Europe
    [33,5,3,1.8],[31,7,1.6,1.4],[35,4,2,1.4],
    // Africa
    [34,10,4,2],[35,13,4,2.6],[36,16,3,2.2],[36.5,19,2,2],
    // Middle East
    [41,9,2.4,1.8],
    // Asia
    [50,4,9,2],[47,6,6,1.8],[52,8,5,1.8],[45,11,3,1.8],[52,12,3,1.8],
    // Japan
    [56.5,7,1,1.6],
    // Indonesia / SE Asia
    [53,15,3.2,1.4],
    // Australia
    [55.5,20,4,2.4],
    // New Zealand
    [61,22.5,1,1.4],
  ];
  // precompute land cells
  const land = [];
  for (let r = 0; r < GRID_H; r++) {
    for (let c = 0; c < GRID_W; c++) {
      let hit = false;
      for (const [bc, br, rx, ry] of BLOBS) {
        const dx = (c - bc) / rx, dy = (r - br) / ry;
        if (dx * dx + dy * dy <= 1) { hit = true; break; }
      }
      if (hit) land.push([c, r]);
    }
  }

  function smooth(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  function draw() {
    const r = host.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // faint structural grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 96) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 96) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // dotted world map, full width, masked to left & right bands
    const cell = W / GRID_W;
    const mapH = GRID_H * cell;
    const offY = (H - mapH) / 2;
    const ac = accent();
    let accN = 0;
    const accents = [];

    for (const [c, rr] of land) {
      const x = c * cell + cell / 2;
      const y = offY + rr * cell + cell / 2;
      const fx = x / W;
      const edge = Math.min(fx, 1 - fx);             // 0 at edges, .5 at center
      const band = 1 - smooth(0.16, 0.40, edge);     // 1 near edges -> 0 toward center
      if (band <= 0.02) continue;
      const vfade = 1 - Math.min(1, Math.abs(y / H - 0.5) * 1.7);
      if (vfade <= 0) continue;
      const a = (0.16 + 0.34 * band) * vfade;
      ctx.fillStyle = `rgba(213,216,221,${a})`;
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2.4, 2.4);
      // collect a few accent nodes near the edges (rendered as blinking DOM dots)
      if (band > 0.6 && vfade > 0.6 && (c * 7 + rr * 13) % 17 === 0 && accN < 8) {
        accents.push([Math.round(x), Math.round(y)]);
        accN++;
      }
    }

    // render blinking accent dots as DOM elements
    blinkWrap.innerHTML = '';
    accents.forEach(([x, y], i) => {
      const s = document.createElement('span');
      s.className = 'int-blink';
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.background = '#8A5CFF'; s.style.boxShadow = '0 0 8px #8A5CFF';
      s.style.animationDelay = (i * 0.37).toFixed(2) + 's';
      blinkWrap.appendChild(s);
    });
  }

  let to;
  window.addEventListener('resize', () => { clearTimeout(to); to = setTimeout(draw, 150); }, { passive: true });
  window.addEventListener('tweakchange', (e) => { if (e.detail && e.detail.accent) draw(); });
  draw();
  setTimeout(draw, 400);
})();
