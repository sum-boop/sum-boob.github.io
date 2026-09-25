/* ==========================================================================
   CCTV COMMAND CENTER — script.js

   Cursor (idle/armed/scanning/lock/boot/idle-dim) · Spotlight · Progress Bar
   Particles · Surveillance Clock · Card Tilt · About Image Loader ·
   Operations Data · Modal System · Contact Form (mailto) · Toast ·
   Scroll Reveal · Text Decode · Scroll-Spy · Keyboard & Focus Trap ·
   Mobile Nav Drawer · Boot Sequence · Career Footprint + Visual ·
   Operations Filter Bar

   No backend anywhere in this file. The contact form's only transport is a
   mailto: link — the honesty of that mechanism is part of the design, not
   a limitation to hide.
   ========================================================================== */
'use strict';

/* Enable JS-only progressive enhancements (reveal hiding etc.) */
document.documentElement.classList.add('js');

/* ==========================================================================
   0. ENVIRONMENT + UTILITIES
   ========================================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsFinePointer  = window.matchMedia('(pointer: fine)').matches;

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const CONTACT_EMAIL = 'sa8518430@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* requestIdleCallback isn't everywhere (Safari) — fall back to a short timeout */
const ridle = window.requestIdleCallback
  ? window.requestIdleCallback.bind(window)
  : (cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1);

/* Read a duration token off :root once, in ms, with a sane fallback if the
   variable is missing or set in an unexpected unit. */
const readDurationVar = (name, fallbackMs) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallbackMs;
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return fallbackMs;
  return raw.endsWith('s') && !raw.endsWith('ms') ? n * 1000 : n;
};

const DUR_REVEAL = readDurationVar('--duration-reveal', 1200);
const TERMINAL_LINE_DELAY = readDurationVar('--terminal-line-delay', 55);

/* Selectors that trigger the reticle "lock-on" (armed) state */
const HOVER_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  '[data-cursor-text]',
  '.op-card',
  '.tech-tag-span',
  '.nav-links a',
  '.feed-filter-btn'
].join(',');

/* Selectors that switch the cursor into text-caret mode */
const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"]';

/* Primary CTAs — the reticle "commits" here, distinct from a generic hover */
const LOCK_SELECTOR = '.btn-signal, .btn-hire, [data-cursor-lock]';

/* Topology / footprint markers — the reticle "reads" here */
const SCAN_SELECTOR = '.topo__node, .footprint__site, [data-cursor-scan]';

/* ==========================================================================
   1. CURSOR — four-layer reticle: glow, ring, dot, context label.
   Idle by default; armed on interactive elements; locked on primary CTAs;
   scanning on topology/footprint markers; hidden during boot; dimmed after
   a few seconds of stillness. Position is lerped here; CSS decides how
   each state looks.
   ========================================================================== */
(function initCursor() {
  const dot       = $('.cursor-dot');
  const ring      = $('.cursor-ring');
  const glow      = $('.cursor-glow');
  const label     = $('.cursor-label');
  const spotlight = $('.cursor-spotlight');

  if (!dot || !ring || !supportsFinePointer) return;

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX, ringY  = mouseY;
  let glowX  = mouseX, glowY  = mouseY;
  let rafId  = null;

  const RING_EASE = 0.18;
  const GLOW_EASE = 0.08;

  /* Idle-dim: rewards a still operator. Any movement resets the clock. */
  const IDLE_DIM_MS = 4000;
  let idleTimer = null;

  const armIdleTimer = () => {
    clearTimeout(idleTimer);
    document.body.classList.remove('cursor-idle-dim');
    idleTimer = setTimeout(() => {
      document.body.classList.add('cursor-idle-dim');
    }, IDLE_DIM_MS);
  };

  const onPointerMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top  = `${mouseY}px`;

    if (spotlight) {
      spotlight.style.setProperty('--mx', `${(mouseX / window.innerWidth)  * 100}%`);
      spotlight.style.setProperty('--my', `${(mouseY / window.innerHeight) * 100}%`);
      document.body.classList.add('spotlight-active');
    }

    armIdleTimer();
  };

  const tick = () => {
    ringX += (mouseX - ringX) * RING_EASE;
    ringY += (mouseY - ringY) * RING_EASE;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;

    if (label) {
      label.style.left = `${ringX}px`;
      label.style.top  = `${ringY}px`;
    }

    if (glow) {
      glowX += (mouseX - glowX) * GLOW_EASE;
      glowY += (mouseY - glowY) * GLOW_EASE;
      glow.style.left = `${glowX}px`;
      glow.style.top  = `${glowY}px`;
    }

    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener('mousemove', onPointerMove, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  });

  rafId = requestAnimationFrame(tick);
  armIdleTimer();

  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t.closest?.(HOVER_SELECTOR)) document.body.classList.add('cursor-hover');
    if (t.closest?.(TEXT_SELECTOR))  document.body.classList.add('cursor-text');
    if (t.closest?.(LOCK_SELECTOR))  document.body.classList.add('cursor-lock');
    if (t.closest?.(SCAN_SELECTOR))  document.body.classList.add('cursor-scanning');

    const labeled = t.closest?.('[data-cursor-text]');
    if (labeled && label) label.textContent = labeled.dataset.cursorText;
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const from = e.target;
    const to   = e.relatedTarget;

    const stillWithin = (selector) => {
      if (!from.closest?.(selector)) return true; /* wasn't in that state to begin with */
      return Boolean(to && to.closest?.(selector));
    };

    if (!stillWithin(HOVER_SELECTOR)) document.body.classList.remove('cursor-hover');
    if (!stillWithin(TEXT_SELECTOR))  document.body.classList.remove('cursor-text');
    if (!stillWithin(LOCK_SELECTOR))  document.body.classList.remove('cursor-lock');
    if (!stillWithin(SCAN_SELECTOR))  document.body.classList.remove('cursor-scanning');
  }, { passive: true });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-active'));

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

  window.addEventListener('beforeunload', () => clearTimeout(idleTimer));
})();

/* ==========================================================================
   2. SCROLL PROGRESS BAR
   ========================================================================== */
(function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop  = doc.scrollTop || document.body.scrollTop;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const progress   = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    bar.style.width = `${progress}%`;
    bar.setAttribute('aria-valuenow', String(Math.round(progress)));
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();

/* ==========================================================================
   3. PARTICLE CONSTELLATION — hero monitor canvas

   FIX: the canvas can measure as zero-size if this runs before the grid's
   layout has fully settled (e.g. before web fonts swap in and reflow the
   hero). That leaves the box looking permanently dim/empty even though
   the loop is running. A ResizeObserver on the canvas's own container
   catches any later layout shift, and one extra resize after the window's
   `load` event catches the common font-swap case.
   ========================================================================== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const rootStyles = getComputedStyle(document.documentElement);

  const parseColor = (hex, fallback) => {
    const clean = (hex || '').trim().replace('#', '');
    if (!clean) return fallback;
    const n = parseInt(clean, 16);
    if (Number.isNaN(n)) return fallback;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };

  const DOT  = parseColor(rootStyles.getPropertyValue('--accent-cyan'),  { r: 0, g: 229, b: 255 });
  const LINE = parseColor(rootStyles.getPropertyValue('--accent-green'), { r: 0, g: 255, b: 156 });

  const MAX_DIST = 110;
  const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
  const COUNT = 46;

  let W = 0, H = 0, dpr = 1;
  let particles = [];
  let running = false;
  let rafId = null;
  let resizeTimer = null;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.6 + 0.7;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      if (this.x > W) { this.x = W; this.vx *= -1; }
      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      if (this.y > H) { this.y = H; this.vy *= -1; }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOT.r}, ${DOT.g}, ${DOT.b}, 0.7)`;
      ctx.fill();
    }
  }

  const seed = () => {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  };

  const frame = () => {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.step();
      p.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > MAX_DIST_SQ) continue;

        const dist  = Math.sqrt(d2);
        const alpha = (1 - dist / MAX_DIST) * 0.3;

        ctx.strokeStyle = `rgba(${LINE.r}, ${LINE.g}, ${LINE.b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    rafId = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  };

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); seed(); }, 180);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (canvas.dataset.inView !== 'false') start();
  });

  /* Pause when the hero is offscreen */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        canvas.dataset.inView = String(entry.isIntersecting);
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      });
    }, { threshold: 0 });
    io.observe(canvas);
  } else {
    start();
  }

  resize();
  seed();
  start();

  /* --- FIX: re-measure once layout has fully settled --------------- */
  window.addEventListener('load', () => { resize(); seed(); }, { once: true });

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); seed(); }, 180);
    });
    ro.observe(canvas.parentElement || canvas);
  }
})();

/* ==========================================================================
   4. SURVEILLANCE TIMESTAMP CLOCK (UTC + IST)
   Also drives the hero monitor's own timestamp badge and the footer's
   "LAST SYNC" readout, so the whole page agrees on one clock.
   ========================================================================== */
(function initSurveillanceClock() {
  let clockEl = document.getElementById('cctv-clock');

  if (!clockEl) {
    clockEl = document.createElement('div');
    clockEl.id = 'cctv-clock';
    clockEl.setAttribute('aria-hidden', 'true');
    clockEl.style.cssText = [
      'position:fixed',
      'top:calc(var(--header-height, 76px) + 14px)',
      'right:20px',
      'z-index:var(--z-overlay, 100)',
      'font-family:var(--font-mono, monospace)',
      'font-size:var(--fs-xs, 0.75rem)',
      'letter-spacing:var(--ls-wide, 0.04em)',
      'color:var(--accent-cyan, #00e5ff)',
      'text-shadow:var(--text-glow-cyan, 0 0 14px rgba(0, 229, 255, 0.45))',
      'background:var(--glass-bg, rgba(12, 14, 19, 0.55))',
      'border:1px solid var(--border-cyan, rgba(0, 229, 255, 0.28))',
      'border-radius:var(--radius-sm, 6px)',
      'padding:5px 12px',
      'pointer-events:none',
      'white-space:nowrap',
      'backdrop-filter:blur(10px)',
      '-webkit-backdrop-filter:blur(10px)',
      'transition:opacity 240ms ease'
    ].join(';') + ';';
    document.body.appendChild(clockEl);
  }

  const heroTimestamp = $('[data-live-timestamp]');
  const footerSync    = $('[data-live-sync]');

  const pad = (n) => String(n).padStart(2, '0');

  const update = () => {
    const now = new Date();
    const dateStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const utcStr  = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const istStr = `${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}:${pad(ist.getUTCSeconds())}`;

    clockEl.textContent = `● REC ${dateStr}  ·  UTC ${utcStr}  ·  IST ${istStr}`;

    if (heroTimestamp) heroTimestamp.textContent = `● ${dateStr} ${istStr}`;
    if (footerSync) footerSync.textContent = `${dateStr} ${istStr} IST`;
  };

  const syncVisibility = () => {
    clockEl.style.display = window.innerWidth < 720 ? 'none' : 'block';
  };

  const startTicking = () => {
    const delay = 1000 - (Date.now() % 1000);
    setTimeout(() => {
      update();
      setInterval(update, 1000);
    }, delay);
  };

  update();
  syncVisibility();
  startTicking();

  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  window.addEventListener('resize', syncVisibility, { passive: true });
})();

/* ==========================================================================
   5. 3D CARD TILT — feed cards
   ========================================================================== */
(function initCardTilt() {
  if (!supportsFinePointer || prefersReducedMotion) return;

  $$('.op-card').forEach((card) => {
    let rect = null;

    const onEnter = () => { rect = card.getBoundingClientRect(); };

    const onMove = (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / rect.height) * -6;
      const rotY = ((x - cx) / rect.width)  *  6;
      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
    };

    const onLeave = () => { rect = null; card.style.transform = ''; };

    card.addEventListener('mouseenter', onEnter, { passive: true });
    card.addEventListener('mousemove',  onMove,  { passive: true });
    card.addEventListener('mouseleave', onLeave, { passive: true });
  });
})();

/* ==========================================================================
   5.1 ABOUT IMAGE LOADER — NEW

   FIX for the permanently-black About photo box: index.html puts a
   `.no-img` class on `.about-image-wrapper` to show the "acquiring
   signal" placeholder state, but nothing ever removed that class once
   the real photo loaded — so `.no-img img { opacity: 0 }` stayed in
   effect forever, regardless of whether the image ever arrived.

   This clears `.no-img` on load, and on error it clears it too (so the
   box doesn't sit in an endless loading animation) while flagging
   `.img-error` for anyone who wants to style that state later. It does
   NOT fix a missing photo file — if assets/sumit-monitoring-station.jpg
   was never uploaded to the deployed site, the box will still show a
   broken-image icon until a real photo is placed at that path.
   ========================================================================== */
(function initAboutImageLoader() {
  const wrapper = document.querySelector('.about-image-wrapper');
  const img = wrapper?.querySelector('img');
  if (!wrapper || !img) return;

  const reveal = () => wrapper.classList.remove('no-img');

  if (img.complete && img.naturalWidth > 0) {
    reveal();
  } else {
    img.addEventListener('load', reveal, { once: true });
    img.addEventListener('error', () => {
      wrapper.classList.remove('no-img');
      wrapper.classList.add('img-error');
      console.warn('[about-image] failed to load — upload the real photo to', img.src);
    }, { once: true });
  }
})();

/* ==========================================================================
   6. OPERATIONS DATA — the single source of truth for every deployment
   card and its modal briefing. Every fact here traces to the resume;
   nothing is invented. Gallery URLs are placeholders — swap in real
   deployment photography before launch.
   ========================================================================== */
const opData = {
  op1: {
    title: 'CP Plus Multi-Channel Surveillance',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    period: '2025 — Present',
    cameras: 32,
    status: 'active',
    category: 'Surveillance',
    img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200&auto=format&fit=crop',
    desc: 'Real-time monitoring across a 32-camera CP Plus array covering warehouse zones, dock areas, and perimeter. Responsible for playback investigation, footage archiving, and shrink prevention.',
    tags: ['CP Plus', 'Multi-Channel Monitoring', 'Playback & Archiving', 'Loss Prevention'],
    /* Placeholder frames — replace with real deployment photography. */
    gallery: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=500&auto=format&fit=crop'
    ]
  },
  op2: {
    title: 'Digital GIGO Gate Control & Data Terminal',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    period: '2025 — Present',
    cameras: 4,
    status: 'active',
    category: 'Gate Control',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    desc: 'High-density commercial vehicle logging for India\u2019s largest Flipkart hub. Gate-in/gate-out entry synchronization, driver credential checks, and 100% accurate MS Excel logging.',
    tags: ['GIGO Gate Entry', 'MS Excel', 'Vehicle Logs', 'Badge Verification'],
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=500&auto=format&fit=crop'
    ]
  },
  op3: {
    title: 'Loss Prevention & Shrink Control',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    period: '2025 — Present',
    cameras: null,
    status: 'active',
    category: 'Loss Prevention',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    desc: 'Continuous monitoring of high-value inventory zones, anomaly flagging, and coordinated escalation to shift managers. Zero-incident operational accuracy maintained across the current posting.',
    tags: ['Loss Prevention', 'Incident Flagging', 'Escalation Protocols', 'Site Coordination'],
    gallery: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=500&auto=format&fit=crop'
    ]
  },
  op4: {
    title: 'Incident Forensic Review',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    period: '2025 — Present',
    cameras: 32,
    status: 'active',
    category: 'Forensics',
    img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop',
    desc: 'Timestamped footage extraction, chain-of-custody documentation, and cross-camera timeline reconstruction for internal loss investigations.',
    tags: ['Footage Playback', 'Forensic Review', 'Chain of Custody', 'Reporting'],
    gallery: [
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop'
    ]
  },
  op5: {
    title: 'Perimeter & Dock Security',
    eyebrow: 'A.P. Securitas Pvt. Ltd. · Ekart Logistics',
    site: 'Ekart Logistics',
    period: '2023 — 2024',
    cameras: 12,
    status: 'past',
    category: 'Perimeter',
    img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1200&auto=format&fit=crop',
    desc: 'Perimeter monitoring, dock-movement verification, and patrol oversight at an Ekart Logistics facility. Coordinated with shift supervisors on access control and visitor verification.',
    tags: ['Perimeter Monitoring', 'Dock Verification', 'Patrol Oversight', 'Visitor Access'],
    gallery: [
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=500&auto=format&fit=crop'
    ]
  },
  op6: {
    title: 'Emergency Response Coordination',
    eyebrow: 'A.P. Securitas Pvt. Ltd. · Ekart Logistics',
    site: 'Ekart Logistics',
    period: '2023 — 2024',
    cameras: null,
    status: 'past',
    category: 'Emergency',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop',
    desc: 'Alarm-to-action dispatch, evacuation routing under live surveillance, fire safety inspections, and post-incident shift reporting.',
    tags: ['Fire Safety', 'First Aid', 'Emergency Escalation', 'Shift Reporting'],
    gallery: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=500&auto=format&fit=crop'
    ]
  }
};

/* ==========================================================================
   7. MODAL SYSTEM — a single briefing window, two things it can show.
   #modal's markup (from index.html) is the op-briefing template. The hire
   channel reuses the same window rather than a second overlay: its
   template is swapped in on demand and the original is restored the next
   time an operations card opens. Either way, close controls stay simple —
   every dismiss control just carries [data-modal-close].
   ========================================================================== */
let __lastFocusedEl = null;

const modalBackdrop = document.getElementById('modal');
const modalWindow   = modalBackdrop ? modalBackdrop.querySelector('[data-modal-window]') : null;
const OP_MODAL_TEMPLATE = modalWindow ? modalWindow.innerHTML : '';

function getFocusable(container) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])', container)
    .filter((el) => el.offsetParent !== null || el === document.activeElement);
}

function ensureModalBackdrop() {
  if (modalBackdrop) return modalBackdrop;

  const backdrop = document.createElement('div');
  backdrop.id = 'modal-fallback';
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `
    <div class="modal-window" data-modal-window>
      <button type="button" class="btn-icon modal-close-btn" data-modal-close aria-label="Close">×</button>
      <div id="modal-fallback-content"></div>
    </div>
  `;
  document.body.appendChild(backdrop);
  return backdrop;
}

function openModal(target) {
  const backdrop = (target instanceof Element ? target : document.getElementById(target))
    || modalBackdrop
    || ensureModalBackdrop();

  if (!backdrop) return;

  __lastFocusedEl = document.activeElement;

  backdrop.classList.add('active');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const focusables = getFocusable(backdrop);
  (focusables[0] || backdrop.querySelector('[data-modal-close]'))?.focus({ preventScroll: true });
}

function closeModal(target) {
  const backdrop = (target instanceof Element ? target : document.getElementById(target))
    || document.querySelector('.modal-backdrop.active');

  if (!backdrop) return;

  backdrop.classList.remove('active');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (__lastFocusedEl && typeof __lastFocusedEl.focus === 'function') {
    __lastFocusedEl.focus({ preventScroll: true });
    __lastFocusedEl = null;
  }
}

function closeModalOnBackdrop(e) {
  const backdrop = e.currentTarget;
  if (e.target === backdrop) closeModal(backdrop);
}

if (modalBackdrop) modalBackdrop.addEventListener('click', closeModalOnBackdrop);

document.addEventListener('click', (e) => {
  const closer = e.target.closest?.('[data-modal-close]');
  if (closer) closeModal(closer.closest('.modal-backdrop'));
});

function renderGallery(container, images, altPrefix) {
  if (!container) return;
  container.innerHTML = images
    .map((src, i) => `
      <button type="button" class="gallery-thumb" aria-label="View frame ${i + 1} of ${altPrefix}">
        <img src="${src}" alt="" loading="lazy" decoding="async" width="300" height="225" />
      </button>
    `)
    .join('');
}

function openOpModal(key) {
  const data = opData[key];
  if (!data) {
    console.warn(`[openOpModal] no briefing found for "${key}"`);
    return;
  }
  if (!modalBackdrop || !modalWindow) return;

  if (modalWindow.dataset.mode !== 'op') {
    modalWindow.innerHTML = OP_MODAL_TEMPLATE;
    modalWindow.dataset.mode = 'op';
  }

  const eyebrow  = modalWindow.querySelector('[data-modal-eyebrow]');
  const title    = modalWindow.querySelector('[data-modal-title]');
  const img      = modalWindow.querySelector('[data-modal-img]');
  const site     = modalWindow.querySelector('[data-modal-site]');
  const duration = modalWindow.querySelector('[data-modal-duration]');
  const cameras  = modalWindow.querySelector('[data-modal-cameras]');
  const body     = modalWindow.querySelector('[data-modal-body]');
  const gallery  = modalWindow.querySelector('[data-modal-gallery]');

  if (eyebrow)  eyebrow.textContent  = data.eyebrow;
  if (title)    title.textContent    = data.title;
  if (img) {
    img.src = data.img;
    img.alt = `${data.title} — ${data.site}`;
  }
  if (site)     site.textContent     = data.site;
  if (duration) duration.textContent = data.period;
  if (cameras)  cameras.textContent  = data.cameras != null ? String(data.cameras) : '—';
  if (body)     body.textContent     = data.desc;

  renderGallery(gallery, data.gallery, data.title);

  let tagRow = modalWindow.querySelector('.modal-tags');
  if (!tagRow) {
    tagRow = document.createElement('ul');
    tagRow.className = 'modal-tags tech-tags';
    tagRow.setAttribute('role', 'list');
    body?.insertAdjacentElement('afterend', tagRow);
  }
  tagRow.innerHTML = data.tags.map((t) => `<li class="tech-tag-span">${t}</li>`).join('');

  openModal(modalBackdrop);
}

function openHireModal() {
  if (!modalBackdrop || !modalWindow) return;

  modalWindow.innerHTML = `
    <div class="modal-header">
      <div>
        <p class="modal-eyebrow">// Request Deployment</p>
        <h2 class="modal-title" id="modal-title">Open a Channel with Sumit</h2>
      </div>
      <button type="button" class="btn-icon modal-close-btn" data-modal-close aria-label="Close">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>

    <p class="modal-body-text">
      Available for CCTV operations, surveillance shifts, and gate-control roles across
      logistics and industrial facilities in Haryana / NCR.
    </p>

    <form class="contact-form" id="hire-form" novalidate>
      <div class="form-success" role="status" aria-live="polite" hidden>
        <span class="status-badge live"><span class="pulse-dot-span online"></span> Sent</span>
        <span>Thanks. Your email client is opening — if it doesn't, copy your message and send it to
          <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.
        </span>
      </div>

      <div class="form-field--inline">
        <div class="form-field">
          <input class="form-input" type="text" id="hm-name" name="name" autocomplete="name" placeholder=" " required />
          <label class="form-label" for="hm-name">Name</label>
        </div>
        <div class="form-field">
          <input class="form-input" type="email" id="hm-email" name="email" autocomplete="email" placeholder=" " required />
          <label class="form-label" for="hm-email">Email</label>
        </div>
      </div>

      <div class="form-field">
        <input class="form-input" type="text" id="hm-org" name="organization" autocomplete="organization" placeholder=" " />
        <label class="form-label" for="hm-org">Company / Organization</label>
      </div>

      <div class="form-field">
        <textarea class="form-input form-textarea" id="hm-message" name="message" placeholder=" " required></textarea>
        <label class="form-label" for="hm-message">Message</label>
      </div>

      <button type="submit" class="btn-signal" data-cursor-text="Send">
        <span>Transmit Request</span>
      </button>

      <p class="form-help">Or reach out directly: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
    </form>
  `;
  modalWindow.dataset.mode = 'hire';

  attachContactFormHandler($('#hire-form', modalWindow));
  openModal(modalBackdrop);
}

function closeHireModal() { closeModal(modalBackdrop); }
function closeOpModal()   { closeModal(modalBackdrop); }

document.addEventListener('click', (e) => {
  const card = e.target.closest?.('[data-modal-id]');
  if (card) { openOpModal(card.dataset.modalId); return; }

  const hireTrigger = e.target.closest?.('[data-open-hire]');
  if (hireTrigger) openHireModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest?.('[data-modal-id]');
  if (card && card.tagName !== 'BUTTON' && card.getAttribute('role') === 'button') {
    e.preventDefault();
    openOpModal(card.dataset.modalId);
  }
});

window.openHireModal  = openHireModal;
window.openOpModal    = openOpModal;
window.closeModal     = closeModal;
window.closeHireModal = closeHireModal;
window.closeOpModal   = closeOpModal;

/* ==========================================================================
   8. CONTACT FORM — frontend-only submission. mailto: is the transport.
   No backend, no third-party service, and the success message says so.
   One handler serves both the page's own Contact section and the hire
   modal's copy of the same form.
   ========================================================================== */
function ensureFieldError(input) {
  const id = `${input.id}-error`;
  let err = document.getElementById(id);
  if (!err) {
    err = document.createElement('p');
    err.id = id;
    err.className = 'form-error';
    err.hidden = true;
    input.insertAdjacentElement('afterend', err);
  }
  return err;
}

function setFieldError(input, message) {
  const err = ensureFieldError(input);
  if (message) {
    err.textContent = message;
    err.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', err.id);
    input.closest('.form-field')?.classList.add('has-error');
  } else {
    err.hidden = true;
    input.removeAttribute('aria-invalid');
    input.closest('.form-field')?.classList.remove('has-error');
  }
}

function validateContactForm(form) {
  const name    = form.querySelector('[name="name"]');
  const email   = form.querySelector('[name="email"]');
  const message = form.querySelector('[name="message"]');

  let valid = true;

  if (!name.value.trim() || name.value.trim().length < 2) {
    setFieldError(name, 'Enter your name (2 characters or more).');
    valid = false;
  } else {
    setFieldError(name, null);
  }

  if (!EMAIL_RE.test(email.value.trim())) {
    setFieldError(email, 'Enter a valid email address.');
    valid = false;
  } else {
    setFieldError(email, null);
  }

  if (!message.value.trim() || message.value.trim().length < 10) {
    setFieldError(message, 'Say a little more (10 characters or more).');
    valid = false;
  } else {
    setFieldError(message, null);
  }

  return valid;
}

function buildMailtoHref(form) {
  const name    = form.querySelector('[name="name"]')?.value.trim() || '';
  const email   = form.querySelector('[name="email"]')?.value.trim() || '';
  const org     = form.querySelector('[name="organization"]')?.value.trim() || '';
  const message = form.querySelector('[name="message"]')?.value.trim() || '';

  const subject = `Portfolio contact from ${name}`;
  const bodyLines = [
    message,
    '',
    `— ${name}`,
    email,
    org ? org : null
  ].filter(Boolean);

  const body = bodyLines.join('\n');

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function attachContactFormHandler(form) {
  if (!form || form.dataset.wired === 'true') return;
  form.dataset.wired = 'true';

  const submitBtn = form.querySelector('button[type="submit"]');
  const successEl = form.querySelector('.form-success');
  const fieldEls  = $$('.form-field, .form-field--inline', form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateContactForm(form)) return;

    const originalLabel = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting…</span>';
    }

    /* Frontend-only submission — mailto: is the transport. No backend,
       no third-party service. */
    setTimeout(() => {
      const href = buildMailtoHref(form);
      window.location.href = href;

      fieldEls.forEach((el) => { el.hidden = true; });
      if (submitBtn) submitBtn.hidden = true;
      if (successEl) successEl.hidden = false;

      showToastImpl({ type: 'success', title: 'Channel opened', message: 'Channel opened.' });

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    }, 900);
  });
}

attachContactFormHandler($('#contact .contact-form'));

/* ==========================================================================
   9. TOAST SYSTEM — small glass notices, bottom-right. Confirms; never
   interrupts. Capped at three on screen at once.
   ========================================================================== */
function showToastImpl({ type = 'info', title = '', message = '', duration = 4200 } = {}) {
  const container = $('.toast-container');
  if (!container) return;

  while (container.children.length >= 3) {
    container.removeChild(container.firstElementChild);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', type === 'alert' ? 'alert' : 'status');
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true"></span>
    <div class="toast-content">
      ${title ? `<p class="toast-label">${title}</p>` : ''}
      <p class="toast-body">${message}</p>
    </div>
    <button type="button" class="toast-close" aria-label="Dismiss notification">×</button>
  `;

  container.appendChild(toast);

  const dismiss = () => {
    if (prefersReducedMotion) {
      toast.remove();
      return;
    }
    toast.classList.add('exit');
    toast.classList.remove('enter');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 700);
  };

  toast.querySelector('.toast-close')?.addEventListener('click', dismiss);

  if (prefersReducedMotion) {
    setTimeout(dismiss, duration);
    return;
  }

  toast.classList.add('enter');
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.remove('enter')));
  setTimeout(dismiss, duration);
}

window.showToast = showToastImpl;

/* ==========================================================================
   10. SCROLL REVEAL SYSTEM
   ========================================================================== */
(function initScrollReveal() {
  const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scan, .reveal-decode, .reveal-stagger, .reveal--mask';
  const targets = $$(REVEAL_SELECTOR);
  if (!targets.length) return;

  $$('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--stagger-index', String(i));
    });
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   11. TEXT DECODE — a scramble-to-resolve reveal for headline text.
   ========================================================================== */
(function initTextDecode() {
  const targets = $$('.reveal-decode');
  if (!targets.length) return;

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const CHARSET = '!@#$%^&*()_+-=<>[]{}/\\|~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];

  function collectTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) {
      if (n.textContent.trim().length) nodes.push(n);
    }
    return nodes;
  }

  function decode(el) {
    if (el.dataset.decoded === 'true') return;
    el.dataset.decoded = 'true';

    const nodes = collectTextNodes(el).map((node) => ({
      node,
      final: node.textContent,
      current: node.textContent.split('').map(() => ' ')
    }));

    const totalChars = nodes.reduce((sum, n) => sum + n.final.length, 0);
    if (!totalChars) return;

    const start = performance.now();
    let rafId = null;

    const paint = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DUR_REVEAL, 1);
      const resolvedCount = Math.floor(progress * totalChars);

      let counted = 0;
      nodes.forEach(({ node, final, current }) => {
        for (let i = 0; i < final.length; i++) {
          const globalIndex = counted + i;
          if (globalIndex < resolvedCount) {
            current[i] = final[i];
          } else if (final[i] === ' ') {
            current[i] = ' ';
          } else {
            current[i] = randChar();
          }
        }
        node.textContent = current.join('');
        counted += final.length;
      });

      if (progress < 1) {
        rafId = requestAnimationFrame(paint);
      } else {
        nodes.forEach(({ node, final }) => { node.textContent = final; });
      }
    };

    const onVisibility = () => {
      if (document.hidden && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        nodes.forEach(({ node, final }) => { node.textContent = final; });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    rafId = requestAnimationFrame(paint);
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(decode);
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      decode(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  targets.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   12. SCROLL-SPY
   ========================================================================== */
(function initScrollSpy() {
  const sections = $$('main > section[id]');
  const navLinks = $$('a[href^="#"]', document.querySelector('.nav-links') || document);
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const linkFor = (id) => navLinks.filter((a) => a.getAttribute('href') === `#${id}`);

  let queued = false;
  let currentId = null;

  const applyCurrent = (id) => {
    if (id === currentId) return;
    currentId = id;
    navLinks.forEach((a) => a.classList.remove('is-current'));
    linkFor(id).forEach((a) => a.classList.add('is-current'));
  };

  const io = new IntersectionObserver((entries) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) applyCurrent(visible[0].target.id);
      queued = false;
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((s) => io.observe(s));
})();

/* ==========================================================================
   13. MOBILE NAVIGATION DRAWER
   ========================================================================== */
(function initNavDrawer() {
  const toggle   = $('.nav-toggle');
  const drawer   = document.getElementById('nav-drawer');
  const backdrop = $('[data-nav-backdrop]');
  if (!toggle || !drawer) return;

  const open = () => {
    drawer.classList.add('is-open');
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop?.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    getFocusable(drawer)[0]?.focus({ preventScroll: true });
  };

  const close = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('inert', '');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop?.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) close();
    else open();
  });

  $('[data-nav-close]', drawer)?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  $$('a', drawer).forEach((a) => a.addEventListener('click', close));

  window.__closeNavDrawer = close;
  window.__navDrawerIsOpen = () => drawer.classList.contains('is-open');
})();

/* ==========================================================================
   14. KEYBOARD & FOCUS TRAP
   ========================================================================== */
(function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-backdrop.active');
      if (openModalEl) { closeModal(openModalEl); return; }

      if (window.__navDrawerIsOpen?.()) { window.__closeNavDrawer?.(); return; }

      const boot = document.getElementById('boot-overlay');
      if (boot && !boot.classList.contains('is-done')) window.__skipBoot?.();
      return;
    }

    if (e.key === 'Enter') {
      const boot = document.getElementById('boot-overlay');
      if (boot && document.activeElement?.closest('#boot-overlay') === boot && !boot.classList.contains('is-done')) {
        window.__skipBoot?.();
      }
    }

    if (e.key === 'Tab') {
      const openModalEl = document.querySelector('.modal-backdrop.active');
      if (!openModalEl) return;

      const focusables = getFocusable(openModalEl);
      if (!focusables.length) return;

      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

/* ==========================================================================
   15. BOOT SEQUENCE CONTROLLER
   ========================================================================== */
(function initBoot() {
  const boot = document.getElementById('boot-overlay');
  if (!boot) { document.body.classList.remove('is-loading'); return; }

  const params = new URLSearchParams(window.location.search);
  const alreadySeen = sessionStorage.getItem('boot-seen') === '1';
  const skipRequested = params.get('skipboot') === '1';

  const finish = () => {
    document.body.classList.remove('cursor-boot', 'is-loading');
    boot.remove();
    sessionStorage.setItem('boot-seen', '1');
  };

  if (prefersReducedMotion || alreadySeen || skipRequested) {
    finish();
    return;
  }

  document.body.classList.add('cursor-boot');

  const lines = $$('.boot-line', boot);
  const progressEl = $('.boot-progress', boot);
  const skipBtn = $('[data-boot-skip]', boot);

  let finished = false;

  const fadeOutAndFinish = () => {
    if (finished) return;
    finished = true;
    boot.classList.add('boot-fade-out', 'is-done');
    setTimeout(() => {
      finish();
      showToastImpl({ type: 'info', title: 'System Online', message: 'Welcome, Operator. All channels nominal.' });
    }, readDurationVar('--duration-slower', 900));
  };

  const setProgress = (fraction) => {
    if (!progressEl) return;
    const width = 20;
    const filled = Math.round(width * fraction);
    const pct = Math.round(fraction * 100);
    progressEl.innerHTML = `<span class="boot-progress-fill">${'█'.repeat(filled)}</span>${'░'.repeat(width - filled)} ${pct}%`;
  };

  lines.forEach((line, i) => {
    setTimeout(() => {
      line.style.opacity = '1';
      setProgress((i + 1) / lines.length);
    }, TERMINAL_LINE_DELAY * 4 * i);
  });

  const totalTime = TERMINAL_LINE_DELAY * 4 * lines.length + 600;
  const holdTimer = setTimeout(fadeOutAndFinish, totalTime);

  const skipNow = () => {
    clearTimeout(holdTimer);
    fadeOutAndFinish();
  };

  skipBtn?.addEventListener('click', skipNow);
  window.__skipBoot = skipNow;
})();

/* ==========================================================================
   16. CAREER FOOTPRINT / TOPOLOGY COORDINATOR

   FIX: the "footprint:ready" dispatch now happens on a macrotask
   (setTimeout 0) instead of synchronously. Previously it fired the
   instant this IIFE ran — before section 16.1 below had even registered
   its listener — so the event was dispatched into an empty room and the
   map visual never got its data.
   ========================================================================== */
(function initFootprint() {
  const dataEl = document.getElementById('sites-data');
  if (!dataEl) return;

  let sites = [];
  try {
    sites = JSON.parse(dataEl.textContent);
  } catch (err) {
    console.warn('[footprint] could not parse #sites-data', err);
    return;
  }

  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('footprint:ready', { detail: { sites } }));
  }, 0);

  const panel   = $('[data-footprint-panel]');
  const nameEl  = $('[data-footprint-name]', panel || document);
  const roleEl  = $('[data-footprint-role]', panel || document);
  const periodEl = $('[data-footprint-period]', panel || document);
  const camerasEl = $('[data-footprint-cameras]', panel || document);
  const statusEl = $('[data-topo-status]');

  const showSite = (site) => {
    if (!site) return;
    if (nameEl) nameEl.textContent = site.name;
    if (roleEl) roleEl.textContent = site.role;
    if (periodEl) periodEl.textContent = site.period;
    if (camerasEl) camerasEl.textContent = `${site.cameras} cameras`;
  };

  showSite(sites.find((s) => s.status === 'active') || sites[0]);

  if (sites.length > 1) {
    let index = 0;
    setInterval(() => {
      index = (index + 1) % sites.length;
      showSite(sites[index]);
    }, 6000);
  }

  const linkCount = Math.max(sites.length - 1, 0);
  if (statusEl) {
    const tick = () => {
      const latency = 3 + Math.floor(Math.random() * 7);
      statusEl.textContent = `NODES: ${sites.length} · LINKS: ${linkCount} · LATENCY: ${latency}ms`;
    };
    tick();
    setInterval(tick, 4000);
  }
})();

/* ==========================================================================
   16.1 FOOTPRINT VISUAL — NEW

   FIX for the empty/black Career Footprint box: nothing was ever drawn
   inside `.footprint-map` — only the surrounding CSS frame (badge, faint
   grid) existed. This is not a 3D globe (deliberately out of scope), but
   a light canvas node-map: one core (the operator), one node per site,
   linked by a soft pulse. It listens for `footprint:ready` (section 16)
   so the site data has a single source of truth.
   ========================================================================== */
(function initFootprintVisual() {
  const mapEl = document.querySelector('.footprint-map');
  if (!mapEl) return;

  window.addEventListener('footprint:ready', (e) => {
    const sites = e.detail?.sites || [];
    if (!sites.length) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;';
    mapEl.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const cyan  = (styles.getPropertyValue('--accent-cyan')  || '#00e5ff').trim();
    const green = (styles.getPropertyValue('--accent-green') || '#00ff9c').trim();
    const core  = (styles.getPropertyValue('--topo-core-color') || '#eafcff').trim();

    let W = 0, H = 0, dpr = 1;

    const resize = () => {
      const rect = mapEl.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const start = performance.now();

    const draw = (now) => {
      if (!W || !H) resize();
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H * 0.38;
      const pulse = prefersReducedMotion ? 1 : 0.6 + 0.4 * Math.sin((now - start) / 900);

      /* links: core → each site */
      sites.forEach((site, i) => {
        const x = W * (i === 0 ? 0.28 : 0.72);
        const y = H * 0.62;
        ctx.strokeStyle = site.status === 'active'
          ? `rgba(0, 229, 255, ${(0.25 + 0.35 * pulse).toFixed(2)})`
          : 'rgba(0, 229, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      /* core node — the operator console */
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.shadowColor = cyan;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      /* one node per site */
      sites.forEach((site, i) => {
        const x = W * (i === 0 ? 0.28 : 0.72);
        const y = H * 0.62;
        const active = site.status === 'active';
        const r = active ? 4 + pulse * 1.5 : 3;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = active ? cyan : green;
        ctx.shadowColor = active ? cyan : 'transparent';
        ctx.shadowBlur = active ? 10 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (!prefersReducedMotion) requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', () => resize(), { passive: true });
    requestAnimationFrame(draw);
  }, { once: true });
})();

/* ==========================================================================
   17. OPERATIONS FILTER BAR
   ========================================================================== */
ridle(() => {
  const grid = $('.operations-grid');
  if (!grid) return;

  const cards = $$('[data-modal-id]', grid);
  if (!cards.length) return;

  cards.forEach((card) => {
    const entry = opData[card.dataset.modalId];
    card.dataset.category = entry?.category || 'Other';
  });

  const categories = ['All', ...new Set(cards.map((c) => c.dataset.category))];

  const bar = document.createElement('div');
  bar.id = 'feed-filter-bar';
  bar.className = 'feed-filter-bar';
  bar.setAttribute('role', 'tablist');
  bar.setAttribute('aria-label', 'Filter feed deployments');
  bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:var(--space-lg);';

  const buttons = [];

  const setActive = (activeBtn) => {
    buttons.forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });
    activeBtn.focus();
  };

  let hideTimer = null;

  const applyFilter = (filter) => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }

    cards.forEach((card) => {
      card.style.transition = 'opacity 320ms ease, transform 320ms ease';
      const match = filter === 'All' || card.dataset.category === filter;

      if (match) {
        card.style.display = '';
        void card.offsetWidth;
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.94)';
      }
    });

    hideTimer = window.setTimeout(() => {
      cards.forEach((card) => {
        const match = filter === 'All' || card.dataset.category === filter;
        if (!match) card.style.display = 'none';
      });
      hideTimer = null;
    }, 340);
  };

  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat;
    btn.dataset.filter = cat;
    btn.className = 'btn btn-glass feed-filter-btn';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(i === 0));
    btn.tabIndex = i === 0 ? 0 : -1;
    btn.style.padding = '0.5rem 1.2rem';
    btn.style.fontSize = 'var(--fs-xs)';
    buttons.push(btn);
    bar.appendChild(btn);
  });

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.feed-filter-btn');
    if (!btn) return;
    setActive(btn);
    applyFilter(btn.dataset.filter);
  });

  bar.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();

    const current = buttons.indexOf(document.activeElement);
    let next = current;

    if (e.key === 'ArrowRight') next = (current + 1) % buttons.length;
    if (e.key === 'ArrowLeft')  next = (current - 1 + buttons.length) % buttons.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End')  next = buttons.length - 1;

    setActive(buttons[next]);
    applyFilter(buttons[next].dataset.filter);
  });

  grid.parentElement.insertBefore(bar, grid);
});
