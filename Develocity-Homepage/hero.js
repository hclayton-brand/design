/* Hero background animations. Mode driven by <html data-hero>. */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  let nodes = [], particles = [], raf = 0, t = 0, mode = 'network';
  let mx = 0.5, my = 0.4;

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#1ec9f2';
  }
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    nodes = []; particles = [];
    if (mode === 'spotlight' || mode === 'systemmap') return;
    // grid of square nodes, biased to the right side of the hero
    const gap = 74;
    for (let x = gap * 0.5; x < W + gap; x += gap) {
      for (let y = gap * 0.4; y < H + gap; y += gap) {
        // density falls off toward the left (where the headline sits)
        const fx = x / W;
        if (fx < 0.42 && Math.random() > fx * 1.6) continue;
        nodes.push({
          x: x + (Math.random() - 0.5) * 26,
          y: y + (Math.random() - 0.5) * 26,
          s: 5 + Math.random() * 9,
          ph: Math.random() * Math.PI * 2,
          hub: false
        });
      }
    }
    // pick a hub node on the right
    const right = nodes.filter(n => n.x > W * 0.55 && n.y < H * 0.6);
    if (right.length) { const h = right[Math.floor(Math.random() * right.length)]; h.hub = true; h.s = 16; }
    // precompute neighbour links for hub
    const hub = nodes.find(n => n.hub);
    if (hub) {
      hub.links = nodes
        .map(n => ({ n, d: Math.hypot(n.x - hub.x, n.y - hub.y) }))
        .filter(o => o.d > 10 && o.d < 360)
        .sort((a, b) => a.d - b.d).slice(0, 9).map(o => o.n);
    }
    if (mode === 'flow') {
      for (let i = 0; i < 46; i++) particles.push(spawn());
    }
  }

  function spawn() {
    const hub = nodes.find(n => n.hub) || { x: W * 0.7, y: H * 0.4 };
    const edge = Math.random();
    let x, y;
    if (edge < 0.5) { x = Math.random() * W; y = Math.random() < 0.5 ? -10 : H + 10; }
    else { x = Math.random() < 0.5 ? -10 : W + 10; y = Math.random() * H; }
    return { x, y, tx: hub.x, ty: hub.y, sp: 0.0024 + Math.random() * 0.004, p: 0 };
  }

  function draw() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    if (mode === 'systemmap') return;
    if (mode === 'spotlight') { raf = requestAnimationFrame(draw); return; }
    const ac = accent();
    const hub = nodes.find(n => n.hub);

    // faint links from hub
    if (hub && hub.links) {
      ctx.lineWidth = 1;
      hub.links.forEach((n, i) => {
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + 0.02 * Math.sin(t + i)})`;
        ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(n.x, n.y); ctx.stroke();
      });
    }

    // nodes
    nodes.forEach(n => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.9 + n.ph);
      if (n.hub) {
        const g = 14 + pulse * 4;
        ctx.fillStyle = `rgba(150,150,60,${0.5 + pulse * 0.4})`;
        ctx.shadowColor = 'rgba(170,170,70,0.6)'; ctx.shadowBlur = 22;
        rr(n.x - g / 2, n.y - g / 2, g, g, 3); ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = `rgba(255,255,255,${0.03 + pulse * 0.045})`;
        rr(n.x - n.s / 2, n.y - n.s / 2, n.s, n.s, 2); ctx.fill();
      }
    });

    // flow particles
    if (mode === 'flow') {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.p += p.sp;
        if (p.p >= 1) { particles[i] = spawn(); continue; }
        const x = p.x + (p.tx - p.x) * ease(p.p);
        const y = p.y + (p.ty - p.y) * ease(p.p);
        ctx.fillStyle = ac;
        ctx.globalAlpha = Math.sin(p.p * Math.PI) * 0.9;
        ctx.shadowColor = ac; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
    }
    raf = requestAnimationFrame(draw);
  }

  function ease(x) { return x * x * (3 - 2 * x); }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function setMode(m) {
    mode = m || 'network';
    cancelAnimationFrame(raf);
    build();
    if (reduce) { ctx.clearRect(0, 0, W, H); draw(); cancelAnimationFrame(raf); drawStatic(); }
    else draw();
  }
  function drawStatic() {
    // one static frame for reduced-motion
    const tmp = t; t = 1.2; ctx.clearRect(0, 0, W, H);
    const hub = nodes.find(n => n.hub);
    if (hub && hub.links) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      hub.links.forEach(n => { ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(n.x, n.y); ctx.stroke(); }); }
    nodes.forEach(n => { ctx.fillStyle = n.hub ? 'rgba(150,150,60,0.7)' : 'rgba(255,255,255,0.06)';
      const s = n.hub ? 16 : n.s; rr(n.x - s / 2, n.y - s / 2, s, s, 2); ctx.fill(); });
    t = tmp;
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('tweakchange', (e) => {
    if (e.detail && e.detail.hero) { document.documentElement.dataset.hero = e.detail.hero; setMode(e.detail.hero); }
    if (e.detail && e.detail.accent) build();
  });

  resize();
  setMode(document.documentElement.dataset.hero || 'network');
  window.__setHeroMode = setMode;
})();
