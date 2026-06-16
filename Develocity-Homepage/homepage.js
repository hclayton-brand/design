/* Homepage interactions. */
(function () {
  /* expandable capability chips ("+N more") */
  document.querySelectorAll('.chip-more').forEach((btn) => {
    const targetId = btn.getAttribute('data-target');
    const extra = targetId && document.getElementById(targetId);
    if (!extra) return;
    btn.addEventListener('click', () => {
      const open = !extra.hidden;
      if (open) { extra.hidden = true; btn.textContent = btn.dataset.label; }
      else { extra.hidden = false; btn.textContent = 'Show less ‹'; }
    });
  });

  /* Why-now vertical stepper: rail item -> description + product panel */
  const rail = document.querySelector('.stepper .srail');
  if (rail) {
    const items = [...rail.querySelectorAll('.srail-item')];
    const descs = [...document.querySelectorAll('.sdesc-panel')];
    const vizes = [...document.querySelectorAll('.sviz-panel')];
    const byStep = (list, id) => list.find((el) => el.dataset.step === id);

    function activate(id) {
      items.forEach((it) => it.classList.toggle('active', it.dataset.step === id));
      descs.forEach((d) => d.classList.toggle('active', d.dataset.step === id));
      vizes.forEach((v) => v.classList.toggle('active', v.dataset.step === id));
    }
    items.forEach((it) => {
      it.addEventListener('click', () => activate(it.dataset.step));
      it.addEventListener('mouseenter', () => activate(it.dataset.step));
    });
  }

  /* sviz tab strip: pure visual toggle within the active panel */
  document.querySelectorAll('.sviz-panel').forEach((panel) => {
    const tabs = [...panel.querySelectorAll('.sviz-tab')];
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('on', t === tab));
    }));
  });

  /* section eyebrow pills: trigger entrance animation on scroll into view */
  document.querySelectorAll('.section-pill').forEach(function (pill) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.8 });
    io.observe(pill);
  });

  /* video reveal: scroll-driven perspective unfold */
  (function () {
    const section    = document.getElementById('heroSection');
    const frame      = document.getElementById('vrevFrame');
    const glare      = document.getElementById('vrevGlare');
    const proofHero  = document.getElementById('proofHero');
    if (!section || !frame) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const smooth = (t) => t * t * (3 - 2 * t);
    let raf = 0;

    function update() {
      raf = 0;
      const rect  = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p     = Math.max(0, Math.min(1, -rect.top / total));
      const e     = smooth(p);

      frame.style.transform = `rotateX(${(60 * (1 - e)).toFixed(2)}deg)`;
      if (glare) glare.style.opacity = (1 - e).toFixed(3);

      /* proof bar: visible on load, slides away as frame unfolds */
      if (proofHero) {
        const slide = Math.min(1, p / 0.45); /* starts immediately, done by p=0.45 */
        const ty    = smooth(slide) * 260;
        proofHero.style.transform = `translateY(${ty.toFixed(1)}px)`;
      }
    }

    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
  })();

  /* pixel escape: subtle 4px squares drifting from frame edges */
  (function () {
    const canvas = document.getElementById('vrevPixels');
    const frame  = document.getElementById('vrevFrame');
    if (!canvas || !frame) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx   = canvas.getContext('2d');
    const PX    = 4;
    const CELL  = 7;
    const COUNT = 32;
    const ACC   = [150, 81, 255];
    const COOL  = [210, 218, 245];
    const BLUE  = [170, 190, 255];

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    addEventListener('resize', resize, { passive: true });

    function spawnParticle() {
      const cr = canvas.getBoundingClientRect();
      const fr = frame.getBoundingClientRect();
      const fx = fr.left - cr.left;
      const fy = fr.top  - cr.top;
      const fw = fr.width;
      const fh = fr.height;

      const perim = fw + 2 * fh;
      const t     = Math.random() * perim;
      let x, y;
      if      (t < fw)      { x = fx + t;  y = fy; }
      else if (t < fw + fh) { x = fx + fw; y = fy + (t - fw); }
      else                  { x = fx;       y = fy + (t - fw - fh); }

      x = Math.floor(x / CELL) * CELL; /* snap to pixel grid */

      const isAccent = Math.random() < 0.25;
      const color    = isAccent ? ACC : (Math.random() < 0.5 ? COOL : BLUE);
      const maxAlpha = isAccent ? 0.28 + Math.random() * 0.22 : 0.12 + Math.random() * 0.12;

      return {
        x, y,
        vy:       0.12 + Math.random() * 0.28,
        vx:       (Math.random() - 0.5) * 0.15,
        color,
        maxAlpha,
        alpha:    0,
        rising:   true,
        riseRate: 0.004 + Math.random() * 0.006,
        fallRate: 0.002 + Math.random() * 0.003,
      };
    }

    /* pre-age so field is already populated on load */
    const particles = Array.from({ length: COUNT }, () => {
      const p       = spawnParticle();
      const age     = Math.random() * 300;
      const riseTicks = p.maxAlpha / p.riseRate;
      p.y -= p.vy * age;
      p.x += p.vx * age;
      if (age < riseTicks) {
        p.alpha  = p.riseRate * age;
        p.rising = true;
      } else {
        p.alpha  = Math.max(0, p.maxAlpha - p.fallRate * (age - riseTicks));
        p.rising = false;
      }
      return p;
    });

    (function tick() {
      requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.vy;
        p.x += p.vx;
        if (p.rising) {
          p.alpha += p.riseRate;
          if (p.alpha >= p.maxAlpha) { p.alpha = p.maxAlpha; p.rising = false; }
        } else {
          p.alpha -= p.fallRate;
        }
        if (p.alpha <= 0 || p.y < -PX) { particles[i] = spawnParticle(); continue; }
        const [r, g, b] = p.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha.toFixed(3)})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), PX, PX);
      }
    }());
  })();
})();
