/* Interactions: reveals, nav, feature tabs, step cycle, testimonials. */
(function () {
  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- sticky nav: subtle hide on scroll down, show on up ---- */
  const nav = document.getElementById('nav');
  const header = document.querySelector('.site-header');
  const howSec = document.getElementById('how');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (nav) {
      // keep nav visible while a mega-menu is open or within How-it-works
      let keep = document.querySelector('.mega.open') != null;
      if (!keep && howSec) { const r = howSec.getBoundingClientRect(); keep = r.top < 80 && r.bottom > 140; }
      if (!keep && y > 120 && y > lastY) nav.style.transform = 'translateY(-130%)';
      else nav.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });

  /* ---- mega-menu ---- */
  (function megaMenu() {
    const items = [...document.querySelectorAll('.nav-item[data-menu]')];
    const megas = {
      platform: document.getElementById('mega-platform'),
      solutions: document.getElementById('mega-solutions'),
      resources: document.getElementById('mega-resources')
    };
    if (!items.length) return;
    // portal megas to <body> so they escape the header/hero stacking context
    Object.values(megas).forEach(el => el && document.body.appendChild(el));

    const navEl = document.getElementById('nav');
    function place(name) {
      const m = megas[name]; if (!m) return;
      const navRect = navEl.getBoundingClientRect();
      const trigger = document.querySelector('.nav-item[data-menu="' + name + '"]');
      const tRect = trigger.getBoundingClientRect();
      m.style.top = navRect.bottom + 'px';
      const w = m.offsetWidth || 620;
      let left = tRect.left - 14;
      left = Math.min(left, window.innerWidth - w - 16);
      left = Math.max(16, left);
      m.style.left = left + 'px';
    }

    let closeTimer, current = null;
    function open(name) {
      clearTimeout(closeTimer);
      current = name;
      place(name);
      Object.entries(megas).forEach(([k, el]) => el && el.classList.toggle('open', k === name));
      items.forEach(it => it.classList.toggle('open', it.dataset.menu === name));
    }
    function close() {
      current = null;
      Object.values(megas).forEach(el => el && el.classList.remove('open'));
      items.forEach(it => it.classList.remove('open'));
    }
    function scheduleClose() { closeTimer = setTimeout(close, 150); }

    items.forEach(it => {
      const name = it.dataset.menu;
      it.addEventListener('mouseenter', () => open(name));
      it.addEventListener('mouseleave', scheduleClose);
      const btn = it.querySelector('.nav-link');
      btn && btn.addEventListener('click', (e) => { e.preventDefault(); current === name ? close() : open(name); });
    });
    Object.values(megas).forEach(el => {
      if (!el) return;
      el.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      el.addEventListener('mouseleave', scheduleClose);
    });

    // Platform: left domain hover switches right pane
    const platform = megas.platform;
    if (platform) {
      const domains = [...platform.querySelectorAll('.mega-domain')];
      const panes = [...platform.querySelectorAll('.mega-pane')];
      domains.forEach(d => {
        const act = () => {
          domains.forEach(x => x.classList.toggle('active', x === d));
          panes.forEach(p => p.classList.toggle('active', p.dataset.pane === d.dataset.domain));
        };
        d.addEventListener('mouseenter', act);
        d.addEventListener('focus', act);
      });
    }

    addEventListener('scroll', () => { if (current) close(); }, { passive: true });
    addEventListener('resize', () => { if (current) place(current); }, { passive: true });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  })();

  /* ---- smooth anchor scroll (offset for nav) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '#top') return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 96, behavior: 'smooth' }); }
    });
  });

  /* ---- feature tabs <-> rows ---- */
  const tabs = [...document.querySelectorAll('.feature-tab')];
  const rows = tabs.map(t => document.getElementById(t.dataset.target));
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const el = document.getElementById(tab.dataset.target);
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 130, behavior: 'smooth' });
  }));
  // Pick the row crossing a reference line just below the sticky tabs.
  // Robust for tall rows / short viewports / landing directly on the section.
  let tabRaf = 0;
  function syncTabs() {
    tabRaf = 0;
    const line = innerHeight * 0.42;
    let active = 0;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r) continue;
      const rect = r.getBoundingClientRect();
      if (rect.top <= line) active = i;   // last row whose top has passed the line
    }
    tabs.forEach((t, k) => t.classList.toggle('active', k === active));
  }
  addEventListener('scroll', () => { if (!tabRaf) tabRaf = requestAnimationFrame(syncTabs); }, { passive: true });
  addEventListener('resize', syncTabs, { passive: true });
  syncTabs();

  /* ---- how-it-works: scroll-linked exploded-layers reveal ---- */
  const howScroll = document.getElementById('howScroll');
  const steps = [...document.querySelectorAll('#howSteps .step')];
  const layersWrap = document.getElementById('howLayers');
  if (howScroll && layersWrap) {
    const lyrs = [...layersWrap.querySelectorAll('.lyr')];
    const core = document.getElementById('howCore');
    const coreIcs = core ? [...core.querySelectorAll('.core-ic')] : [];
    const N = lyrs.length;
    const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = (t) => t * t * (3 - 2 * t);
    let curStep = -1, ticking = false;

    function render() {
      ticking = false;
      const rect = howScroll.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = clamp(-rect.top / (total || 1), 0, 1);

      // active step (4 equal bands)
      const idx = clamp(Math.floor(p * N), 0, N - 1);
      if (idx !== curStep) {
        curStep = idx;
        steps.forEach((s, i) => s.classList.toggle('active', i === idx));
        coreIcs.forEach((ic) => ic.classList.toggle('active', +ic.dataset.step === idx));
      }
      // which layer this step maps to (step0 -> top layer, step3 -> bottom)
      const activeLayer = N - 1 - idx;

      // bottom-anchored stack that lifts upward as it expands
      const gap = lerp(7, 50, smooth(p));
      const groupShift = -gap * (N - 1) / 2;   // keep stack vertically centered in view
      layersWrap.style.transform = `translate(-50%,-50%) translateZ(${groupShift}px)`;

      lyrs.forEach((el) => {
        const i = +el.dataset.i;               // 0 bottom .. N-1 top
        const isActive = i === activeLayer;
        const z = i * gap + (isActive ? 16 : 0);   // active layer rises above the stack
        el.style.transform = `translateZ(${z}px)`;
        el.classList.toggle('is-active', isActive);
        // reveal top-first: top always on; each lower layer reveals one step later
        let op = 1;
        if (i !== N - 1) {
          const start = (N - 1 - i) * 0.25 - 0.02;
          op = clamp((p - start) / 0.16, 0, 1);
        }
        el.style.opacity = op;
      });

      if (core) core.style.transform = `translate(-50%,-50%) translateZ(${(N - 1) * gap + 24}px)`;
    }

    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(render); } }, { passive: true });
    addEventListener('resize', render);
    render();

    // clicking a step scrolls to that band
    steps.forEach((s, i) => s.addEventListener('click', () => {
      const rect = howScroll.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const target = rect.top + scrollY + total * ((i + 0.5) / N);
      window.scrollTo({ top: target, behavior: 'smooth' });
    }));
  }

  /* ---- testimonials ---- */
  const TM = [
    { q: ['Thanks to Develocity, we\u2019ve been able to ', 'reduce our build times by 50%', ', freeing up valuable developer time and resources for other critical tasks.'],
      name: 'Lann YeCunn', role: 'Staff Engineering Manager @ Meta' },
    { q: ['Our agents now ship with confidence \u2014 Develocity ', 'cut flaky-test triage from hours to minutes', ' across thousands of daily pipelines.'],
      name: 'Priya Natarajan', role: 'Director of Developer Platforms @ Robinhood' },
    { q: ['Every artifact is signed, traced, and policy-checked. We ', 'passed our last audit in days, not weeks', ', with evidence generated automatically.'],
      name: 'Marcus Feldt', role: 'VP Engineering, Trust & Compliance @ Salesforce' },
    { q: ['As AI raised our change volume 4x, Develocity kept ', 'feedback loops fast and CI costs flat', ' \u2014 no extra headcount required.'],
      name: 'Elena Brooks', role: 'Head of Build Engineering @ Dyson' },
    { q: ['Develocity gave our agents real delivery context, so they ', 'fix the right thing the first time', ' instead of guessing.'],
      name: 'Sho Tanaka', role: 'Principal Engineer, Platform @ Fitbit' }
  ];
  const logos = [...document.querySelectorAll('.tm-logo')];
  const body = document.getElementById('tmBody');
  const qEl = body && body.querySelector('.tm-quote');
  const nameEl = body && body.querySelector('.tm-author');
  const roleEl = body && body.querySelector('.tm-role');
  function showTM(i) {
    const d = TM[i]; if (!d) return;
    body.style.opacity = 0;
    setTimeout(() => {
      qEl.innerHTML = '\u201c' + d.q[0] + '<span class="hl">' + d.q[1] + '</span>' + d.q[2] + '\u201d';
      nameEl.textContent = d.name; roleEl.textContent = d.role;
      body.style.opacity = 1;
    }, 200);
    logos.forEach((l, k) => l.classList.toggle('active', k === i));
  }
  logos.forEach((l, i) => l.addEventListener('click', () => showTM(i)));

  /* ---- observability bar chart hover tooltip ---- */
  const syncChart = document.getElementById('syncChart');
  const tip = document.getElementById('syncTip');
  if (syncChart && tip) {
    const tipH = tip.querySelector('.sync-tip-h');
    const fTime = tip.querySelector('[data-f="time"]');
    const fStatus = tip.querySelector('[data-f="status"]');
    const fReason = tip.querySelector('[data-f="reason"]');
    const bars = [...syncChart.querySelectorAll('.sync-bar')];
    bars.forEach((bar) => {
      bar.addEventListener('mouseenter', () => {
        const warn = bar.dataset.warn === '1';
        tipH.innerHTML = warn
          ? 'Invalid Requests:&nbsp; ' + bar.dataset.inv + ' <span class="warn">\u26A0</span>'
          : 'Active Sessions:&nbsp; ' + bar.dataset.val;
        fTime.textContent = bar.dataset.time;
        fStatus.textContent = warn ? 'Blocked' : 'Healthy';
        fReason.textContent = warn ? 'Rate Limited' : 'Nominal';
        // position above the bar, clamped within the chart
        const cx = bar.offsetLeft + bar.offsetWidth / 2;
        const half = tip.offsetWidth / 2;
        const clamped = Math.max(half + 4, Math.min(syncChart.clientWidth - half - 4, cx));
        tip.style.left = clamped + 'px';
        tip.style.top = (bar.offsetTop - 12) + 'px';
        tip.classList.add('on');
      });
      bar.addEventListener('mouseleave', () => tip.classList.remove('on'));
    });
  }
})();
