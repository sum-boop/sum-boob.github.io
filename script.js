/* ==========================================================================
   CCTV COMMAND CENTER — script.js
   Cursor · Spotlight · Clock · Particles · Tilt · Filters · Modals · Forms ·
   Toast · Scroll Reveals · Text Decode · Scroll-Spy · Keyboard
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

/* Selectors that trigger the reticle "lock-on" state */
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

/* ==========================================================================
   1. CURSOR — four-layer reticle: glow, ring, dot, context label
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

  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t.closest?.(HOVER_SELECTOR)) document.body.classList.add('cursor-hover');
    if (t.closest?.(TEXT_SELECTOR))  document.body.classList.add('cursor-text');

    const labeled = t.closest?.('[data-cursor-text]');
    if (labeled && label) label.textContent = labeled.dataset.cursorText;
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const from = e.target;
    const to   = e.relatedTarget;

    if (from.closest?.(HOVER_SELECTOR)) {
      const still = to && to.closest?.(HOVER_SELECTOR);
      if (!still) document.body.classList.remove('cursor-hover');
    }
    if (from.closest?.(TEXT_SELECTOR)) {
      const still = to && to.closest?.(TEXT_SELECTOR);
      if (!still) document.body.classList.remove('cursor-text');
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-active'));

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
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
})();

/* ==========================================================================
   4. SURVEILLANCE TIMESTAMP CLOCK (UTC + IST)
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

  const pad = (n) => String(n).padStart(2, '0');

  const update = () => {
    const now = new Date();
    const dateStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const utcStr  = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const istStr = `${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}:${pad(ist.getUTCSeconds())}`;

    clockEl.textContent = `● REC ${dateStr}  ·  UTC ${utcStr}  ·  IST ${istStr}`;
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

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseleave', onLeave);
  });
})();

/* ==========================================================================
   6. PROJECT CATEGORY FILTER BAR
   ========================================================================== */
(function initProjectFilters() {
  const grid = $('.operations-grid');
  if (!grid) return;

  const cards = $$('.op-card', grid);
  if (!cards.length) return;

  const CATEGORY_BY_OP = {
    op1: 'Surveillance',
    op2: 'Gate Control',
    op3: 'Compliance',
    op4: 'Forensics',
    op5: 'Perimeter',
    op6: 'Emergency'
  };

  const getOpKey = (card) => {
    const attr = card.getAttribute('onclick') || '';
    const m = attr.match(/openOpModal\(\s*['"]?(\w+)['"]?\s*\)/);
    return m ? m[1] : null;
  };

  cards.forEach((card) => {
    const key = getOpKey(card);
    card.dataset.category = (key && CATEGORY_BY_OP[key]) || 'Other';
  });

  const categories = ['All', ...new Set(cards.map((c) => c.dataset.category))];

  const bar = document.createElement('div');
  bar.id = 'feed-filter-bar';
  bar.className = 'feed-filter-bar';
  bar.setAttribute('role', 'tablist');
  bar.setAttribute('aria-label', 'Filter feed deployments');
  bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:var(--space-lg);';

  const setActive = (activeBtn) => {
    $$('.feed-filter-btn', bar).forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.style.borderColor = isActive ? 'var(--accent-cyan)'  : 'var(--border-default)';
      btn.style.color       = isActive ? 'var(--accent-cyan)'  : 'var(--text-primary)';
      btn.style.boxShadow   = isActive ? 'var(--glow-cyan-sm)' : 'none';
      btn.setAttribute('aria-selected', String(isActive));
      btn.classList.toggle('is-active', isActive);
    });
  };

  let hideTimer = null;

  const applyFilter = (filter) => {
    /* Cancel any pending "hide" from a previous filter change */
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }

    cards.forEach((card) => {
      card.style.transition = 'opacity 320ms ease, transform 320ms ease';
      const match = filter === 'All' || card.dataset.category === filter;

      if (match) {
        card.style.display = '';
        void card.offsetWidth; /* force reflow so the fade-in always runs */
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
    btn.setAttribute('aria-selected', 'false');
    btn.style.padding = '0.5rem 1.2rem';
    btn.style.fontSize = 'var(--fs-xs)';
    bar.appendChild(btn);
    if (i === 0) setActive(btn);
  });

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.feed-filter-btn');
    if (!btn) return;
    setActive(btn);
    applyFilter(btn.dataset.filter);
  });

  grid.parentElement.insertBefore(bar, grid);
})();

/* ==========================================================================
   7. MODAL SYSTEM — universal briefing window
   Works with any .modal-backdrop in the DOM (e.g. #hire-modal, #op-modal).
   If none exist, one is built on demand.
   ========================================================================== */
let __lastFocusedEl = null;

function ensureModalBackdrop() {
  let backdrop = document.getElementById('modal-backdrop');
  if (backdrop) return backdrop;

  backdrop = document.createElement('div');
  backdrop.id = 'modal-backdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.addEventListener('click', closeModalOnBackdrop);
  backdrop.innerHTML = `
    <div class="modal-window">
      <button type="button" class="modal-close-btn" aria-label="Close" onclick="closeModal()">×</button>
      <div id="modal-content"></div>
    </div>
  `;
  document.body.appendChild(backdrop);
  return backdrop;
}

function openModal(target) {
  let backdrop = null;

  if (target instanceof Element) backdrop = target;
  else if (typeof target === 'string') backdrop = document.getElementById(target);
  if (!backdrop) backdrop = document.getElementById('modal-backdrop') || ensureModalBackdrop();

  if (!backdrop) return;

  __lastFocusedEl = document.activeElement;

  backdrop.classList.add('active');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = backdrop.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function closeModal(target) {
  let backdrop = null;

  if (target instanceof Element) backdrop = target;
  else if (typeof target === 'string') backdrop = document.getElementById(target);
  else backdrop = document.querySelector('.modal-backdrop.active');

  if (!backdrop) return;

  backdrop.classList.remove('active');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (__lastFocusedEl && typeof __lastFocusedEl.focus === 'function') {
    __lastFocusedEl.focus({ preventScroll: true });
    __lastFocusedEl = null;
  }
}

function closeModalOnBackdrop(e) {
  if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
    closeModal(e.target);
  }
}

function closeHireModal() { closeModal(document.getElementById('hire-modal')); }
function closeOpModal()   { closeModal(document.getElementById('op-modal'));   }

/* --- Project briefing data -------------------------------------- */
const opData = {
  op1: {
    title: 'CP Plus Multi-Channel Surveillance Network',
    img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200&auto=format&fit=crop',
    desc: 'Configured and actively monitored CP Plus multi-channel camera arrays across high-density logistics hubs. Owned live feeds, footage archiving, playback investigation during incidents, and shrink prevention across every warehouse zone.'
  },
  op2: {
    title: 'Digital GIGO Gate Control & Data Terminal',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    desc: 'Managed high-density commercial vehicle logging and Goods-In / Goods-Out gate control for the Flipkart Kalash Mega Hub. Executed real-time Excel data entry, driver ID audits, dock allocation, and material gate-pass clearance with zero operational error.'
  },
  op3: {
    title: 'PSARA Compliance & Emergency Safety Protocols',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    desc: 'Enforced strict compliance with the Private Security Agencies Regulation Act (PSARA). Ran fire-extinguisher inspections, led emergency evacuation drills, performed badge audits, and produced daily shift reports for management review.'
  },
  op4: {
    title: 'Incident Forensic Review & Footage Reconstruction',
    img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop',
    desc: 'Extracted time-stamped footage across multi-camera arrays, documented chain-of-custody for evidentiary review, and reconstructed incident timelines to support loss investigations and disciplinary actions.'
  },
  op5: {
    title: 'Perimeter & Dock Security Operations',
    img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1200&auto=format&fit=crop',
    desc: 'Coordinated dock-movement verification against inbound / outbound manifests, supervised patrol schedules, and escalated perimeter-breach events with clear reporting to shift command.'
  },
  op6: {
    title: 'Emergency Response Coordination Center',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop',
    desc: 'Operated alarm-to-action dispatch under live surveillance coverage, routed evacuation paths using camera intelligence, and produced post-incident command-center reports used for compliance audits.'
  }
};

function openOpModal(key) {
  const data = opData[key];
  if (!data) return;

  const modalEl = document.getElementById('op-modal');

  if (modalEl) {
    const imgEl    = document.getElementById('op-modal-img');
    const titleEl  = document.getElementById('op-modal-title');
    const bodyEl   = document.getElementById('op-modal-body');
    const pointsEl = document.getElementById('op-modal-points');

    if (imgEl)   { imgEl.src = data.img; imgEl.alt = data.title; }
    if (titleEl) { titleEl.textContent = data.title; }
    if (bodyEl)  { bodyEl.textContent  = data.desc; }
    if (pointsEl) { pointsEl.innerHTML = ''; }

    openModal(modalEl);
    return;
  }

  /* Fallback: build a generic modal window on demand */
  const backdrop = ensureModalBackdrop();
  const content  = backdrop.querySelector('#modal-content');
  if (!content) return;

  content.innerHTML = `
    <img class="modal-img" src="${data.img}" alt="${data.title}" loading="lazy" decoding="async" />
    <h2 class="modal-title" id="op-modal-title">${data.title}</h2>
    <p class="modal-body-text">${data.desc}</p>
    <button type="button" class="btn btn-hire" onclick="openHireModal()">
      <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
      <span>Discuss Deployment Offer</span>
    </button>
  `;

  openModal(backdrop);
}

function openHireModal() {
  const modalEl = document.getElementById('hire-modal');

  if (modalEl) {
    openModal(modalEl);
    return;
  }

  const backdrop = ensureModalBackdrop();
  const content  = backdrop.querySelector('#modal-content');
  if (!content) return;

  content.innerHTML = `
    <h2 class="modal-title" id="hire-modal-title">Request a Deployment Briefing</h2>
    <p class="modal-body-text">Share the operation and I'll respond with availability, shift preferences, and a short plan for coverage. Typical response window: under 24 hours.</p>
    <form class="modal-form" onsubmit="handleHireSubmit(event)" novalidate>
      <div class="form-field">
        <input type="text" id="hire-name" name="name" class="form-input" placeholder=" " autocomplete="name" required />
        <label for="hire-name" class="form-label">Full Name</label>
      </div>
      <div class="form-field">
        <input type="email" id="hire-email" name="email" class="form-input" placeholder=" " autocomplete="email" required />
        <label for="hire-email" class="form-label">Work Email</label>
      </div>
      <div class="form-field">
        <input type="text" id="hire-org" name="organization" class="form-input" placeholder=" " autocomplete="organization" />
        <label for="hire-org" class="form-label">Organization / Role</label>
      </div>
      <div class="form-field">
        <textarea id="hire-message" name="message" class="form-input" placeholder=" " rows="4"></textarea>
        <label for="hire-message" class="form-label">Briefing Notes</label>
      </div>
      <button type="submit" class="btn btn-hire">
        <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
        <span>Transmit Request</span>
      </button>
    </form>
  `;

  openModal(backdrop);
}

/* Focus trap + Escape handling for modals */
document.addEventListener('keydown', (e) => {
  const activeBackdrop = document.querySelector('.modal-backdrop.active');

  if (e.key === 'Escape') {
    if (activeBackdrop) closeModal(activeBackdrop);
    return;
  }

  if (e.key !== 'Tab' || !activeBackdrop) return;

  const focusables = activeBackdrop.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;

  const first = focusables[0];
  const last  = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
});

/* Wire backdrop clicks on any pre-existing modals */
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
    closeModal(e.target);
  }
});

/* ==========================================================================
   8. FORMS + TOAST
   ========================================================================== */
let __toastTimer = null;

function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast-popup';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span id="toast-message"></span>';
    document.body.appendChild(toast);
  }

  const msgEl = toast.querySelector('#toast-message');
  if (msgEl) msgEl.textContent = message;

  const iconEl = toast.querySelector('i');
  if (iconEl) {
    iconEl.className = type === 'error'
      ? 'fa-solid fa-circle-exclamation'
      : 'fa-solid fa-circle-check';
    iconEl.setAttribute('aria-hidden', 'true');
  }

  toast.classList.remove('show');
  void toast.offsetWidth; /* restart transition cleanly */
  toast.classList.add('show');

  clearTimeout(__toastTimer);
  __toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

/* --- Validation helpers ----------------------------------------- */
function clearFormErrors(form) {
  if (!form) return;
  form.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
  form.querySelectorAll('.form-error').forEach((el) => { el.textContent = ''; });
}

function markInvalid(field, message) {
  if (!field) return;
  field.setAttribute('aria-invalid', 'true');
  const describedBy = field.getAttribute('aria-describedby');
  if (describedBy) {
    const errEl = document.getElementById(describedBy);
    if (errEl) errEl.textContent = message || 'This field is required.';
  }
}

/* --- Main contact form ------------------------------------------ */
function handleDirectMessage(event) {
  event.preventDefault();

  const form = event.target;
  if (!form) return;

  const nameEl  = form.querySelector('#contact-name');
  const emailEl = form.querySelector('#contact-email');
  const msgEl   = form.querySelector('#contact-message');
  const statusEl = form.querySelector('.form-status');

  const name    = nameEl  ? nameEl.value.trim()  : '';
  const email   = emailEl ? emailEl.value.trim() : '';
  const message = msgEl   ? msgEl.value.trim()   : '';

  clearFormErrors(form);

  let firstInvalid = null;

  if (!name) {
    markInvalid(nameEl, 'Please enter your name.');
    firstInvalid = firstInvalid || nameEl;
  }
  if (!email || !EMAIL_RE.test(email)) {
    markInvalid(emailEl, 'Please enter a valid email address.');
    firstInvalid = firstInvalid || emailEl;
  }
  if (!message || message.length < 10) {
    markInvalid(msgEl, 'Please describe the mission in at least 10 characters.');
    firstInvalid = firstInvalid || msgEl;
  }

  if (firstInvalid) {
    if (statusEl) {
      statusEl.textContent = 'Transmission blocked — please review highlighted fields.';
      statusEl.classList.remove('success');
      statusEl.classList.add('error');
    }
    firstInvalid.focus();
    return;
  }

  const subject = `Deployment Briefing — ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;

  if (statusEl) {
    statusEl.textContent = 'Channel open. Your mail client is ready to transmit.';
    statusEl.classList.remove('error');
    statusEl.classList.add('success');
  }

  showToast('Briefing ready to send.', 'success');
  form.reset();
}

/* --- Hire modal form -------------------------------------------- */
function handleHireSubmit(event) {
  event.preventDefault();

  const form = event.target;
  if (!form) return;

  const nameEl  = form.querySelector('#hire-name');
  const emailEl = form.querySelector('#hire-email');
  const orgEl   = form.querySelector('#hire-org');
  const msgEl   = form.querySelector('#hire-message');

  const name    = nameEl  ? nameEl.value.trim()  : '';
  const email   = emailEl ? emailEl.value.trim() : '';
  const org     = orgEl   ? orgEl.value.trim()   : '';
  const message = msgEl   ? msgEl.value.trim()   : '';

  if (!name) {
    if (nameEl) nameEl.focus();
    showToast('Full name is required.', 'error');
    return;
  }
  if (!email || !EMAIL_RE.test(email)) {
    if (emailEl) emailEl.focus();
    showToast('A valid work email is required.', 'error');
    return;
  }

  const subject = `Deployment Briefing Request — ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\nOrganization / Role: ${org}\n\nBriefing Notes:\n${message}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;

  closeModal(document.getElementById('hire-modal'));
  showToast('Request ready to send.', 'success');
  form.reset();
}

/* Clear aria-invalid as the user corrects a field */
document.addEventListener('input', (e) => {
  const field = e.target;
  if (!field || !field.getAttribute) return;
  if (field.getAttribute('aria-invalid') === 'true') {
    field.removeAttribute('aria-invalid');
    const describedBy = field.getAttribute('aria-describedby');
    if (describedBy) {
      const errEl = document.getElementById(describedBy);
      if (errEl) errEl.textContent = '';
    }
  }
}, { passive: true });

/* ==========================================================================
   9. SCROLL REVEALS
   ========================================================================== */
(function initScrollReveals() {
  const targets = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-scan, .reveal--left, .reveal--right, .reveal--scale');
  if (!targets.length) return;

  /* Assign stagger delays to children of [data-stagger] containers */
  $$('[data-stagger]').forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${Math.min(i * 90, 600)}ms`);
    });
  });

  const showAll = () => targets.forEach((el) => el.classList.add('is-visible'));

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px'
  });

  targets.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   10. TEXT DECODE — .reveal-decode headings
   Animates text nodes only, so child markup (e.g. <em>) is preserved.
   ========================================================================== */
(function initTextDecode() {
  const headings = $$('.reveal-decode');
  if (!headings.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_<>';
  const DURATION = 900;

  const decode = (el) => {
    /* Snapshot every non-empty text node inside the heading */
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) {
      if (n.nodeValue && n.nodeValue.length) {
        nodes.push({ node: n, original: n.nodeValue });
      }
    }
    if (!nodes.length) return;

    const totalChars = nodes.reduce((sum, { original }) => sum + original.length, 0);
    const accessibleText = nodes.map(({ original }) => original).join('');

    /* Preserve the true accessible name while the visual animates */
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', accessibleText);

    const startTime = performance.now();

    const frame = (now) => {
      const t = Math.min((now - startTime) / DURATION, 1);
      let budget = Math.floor(t * totalChars);

      for (let i = 0; i < nodes.length; i++) {
        const { node, original } = nodes[i];
        let out = '';

        for (let k = 0; k < original.length; k++) {
          const ch = original[k];

          if (budget > 0) {
            out += ch;
            budget--;
          } else if (ch === ' ' || ch === '\n' || ch === '\t') {
            out += ch;
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        node.nodeValue = out;
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].node.nodeValue = nodes[i].original;
        }
      }
    };

    requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      decode(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  headings.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   11. SCROLL-SPY + NAV
   ========================================================================== */
(function initScrollSpy() {
  const sections = ['hero', 'about', 'operations', 'experience', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = $$('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) linkMap.set(href.slice(1), a);
  });

  if (!('IntersectionObserver' in window)) return;

  const setCurrent = (id) => {
    navLinks.forEach((a) => {
      a.classList.remove('is-current');
      a.removeAttribute('aria-current');
    });
    const link = linkMap.get(id);
    if (link) {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'true');
    }
  };

  const io = new IntersectionObserver((entries) => {
    /* Pick the entry closest to the middle of the viewport */
    const visible = entries.filter((e) => e.isIntersecting);
    if (!visible.length) return;
    visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    setCurrent(visible[0].target.id);
  }, {
    rootMargin: '-45% 0px -50% 0px',
    threshold: [0, 0.25, 0.5, 1]
  });

  sections.forEach((s) => io.observe(s));
})();

/* Nav scrolled state */
(function initNavScrolled() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let ticking = false;

  const update = () => {
    if (window.scrollY > 20) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();

/* Smooth in-page anchor scrolling with header offset + focus management */
(function initAnchorScroll() {
  const cssHeaderHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
    10
  );
  const headerOffset = Number.isFinite(cssHeaderHeight) ? cssHeaderHeight : 76;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });

    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    const delay = prefersReducedMotion ? 0 : 450;
    setTimeout(() => target.focus({ preventScroll: true }), delay);

    history.pushState(null, '', href);
  });
})();

/* ==========================================================================
   12. KEYBOARD — card activation, plus Escape handled with modals above
   ========================================================================== */
(function initKeyboardCards() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    const card = e.target.closest?.('.op-card[role="button"]');
    if (!card) return;

    if (e.key === ' ') e.preventDefault();
    card.click();
  });
})();
