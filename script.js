/* ==========================================================================
   CCTV COMMAND CENTER — script.js
   Cursor · Spotlight · Clock · Particles · Tilt · Filters · Modals
   Scroll Reveals · Scroll-Spy · Keyboard
   ========================================================================== */
'use strict';

/* ==========================================================================
   0. ENVIRONMENT + UTILITIES
   ========================================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsFinePointer  = window.matchMedia('(pointer: fine)').matches;

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const CONTACT_EMAIL = 'sa8518430@gmail.com';

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
  const dot   = $('.cursor-dot');
  const ring  = $('.cursor-ring');
  const glow  = $('.cursor-glow');
  const label = $('.cursor-label');
  const spotlight = $('.cursor-spotlight');
  if (!dot || !ring || !supportsFinePointer) return;

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX, ringY  = mouseY;
  let glowX  = mouseX, glowY  = mouseY;
  let rafId  = null;

  const RING_EASE = 0.18;
  const GLOW_EASE = 0.08; /* trails further behind for depth */

  /* Dot (and the spotlight) snap to the pointer with zero lag */
  const onPointerMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top  = `${mouseY}px`;

    if (spotlight) {
      spotlight.style.setProperty('--mx', `${(mouseX / window.innerWidth) * 100}%`);
      spotlight.style.setProperty('--my', `${(mouseY / window.innerHeight) * 100}%`);
      document.body.classList.add('spotlight-active');
    }
  };

  /* Ring and glow ease toward the pointer at different rates for depth */
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

  /* Pause the render loop when the tab is hidden to save cycles */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  });

  rafId = requestAnimationFrame(tick);

  /* --- State classes + contextual label text -------------------- */
  document.addEventListener('mouseover', (e) => {
    const target = e.target;

    if (target.closest?.(HOVER_SELECTOR)) document.body.classList.add('cursor-hover');
    if (target.closest?.(TEXT_SELECTOR))  document.body.classList.add('cursor-text');

    const labeled = target.closest?.('[data-cursor-text]');
    if (labeled && label) label.textContent = labeled.dataset.cursorText;
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const from = e.target;
    const to   = e.relatedTarget;

    if (from.closest?.(HOVER_SELECTOR)) {
      const stillInside = to && to.closest?.(HOVER_SELECTOR);
      if (!stillInside) document.body.classList.remove('cursor-hover');
    }

    if (from.closest?.(TEXT_SELECTOR)) {
      const stillInside = to && to.closest?.(TEXT_SELECTOR);
      if (!stillInside) document.body.classList.remove('cursor-text');
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
    bar.setAttribute('aria-valuenow', Math.round(progress));
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

  /* Pull live theme colors from CSS custom properties */
  const rootStyles = getComputedStyle(document.documentElement);
  const parseColor = (hex, fallback) => {
    const clean = (hex || '').trim().replace('#', '');
    if (!clean) return fallback;
    const n = parseInt(clean, 16);
    if (Number.isNaN(n)) return fallback;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };

  const DOT  = parseColor(rootStyles.getPropertyValue('--accent-cyan'),  { r: 0,   g: 229, b: 255 });
  const LINE = parseColor(rootStyles.getPropertyValue('--accent-green'), { r: 0,   g: 255, b: 156 });

  const MAX_DIST = 110;
  const COUNT    = 46;

  let W = 0, H = 0, dpr = 1;
  let particles = [];

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
        if (d2 > MAX_DIST * MAX_DIST) continue;

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

    requestAnimationFrame(frame);
  };

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); seed(); }, 180);
  }, { passive: true });

  resize();
  seed();
  requestAnimationFrame(frame);
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
    clockEl.style.cssText = `
      position: fixed;
      top: calc(var(--header-height, 76px) + 14px);
      right: 20px;
      z-index: var(--z-overlay, 100);
      font-family: var(--font-mono, monospace);
      font-size: var(--fs-xs, 0.75rem);
      letter-spacing: var(--ls-wide, 0.04em);
      color: var(--accent-cyan, #00e5ff);
      text-shadow: var(--text-glow-cyan, 0 0 14px rgba(0, 229, 255, 0.45));
      background: var(--glass-bg, rgba(12, 14, 19, 0.55));
      border: 1px solid var(--border-cyan, rgba(0, 229, 255, 0.28));
      border-radius: var(--radius-sm, 6px);
      padding: 5px 12px;
      pointer-events: none;
      white-space: nowrap;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: opacity 240ms ease;
    `;
    document.body.appendChild(clockEl);
  }

  const pad = (n) => String(n).padStart(2, '0');

  const update = () => {
    const now = new Date();
    const dateStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const utcStr  = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

    /* IST = UTC + 5h 30m, derived from the UTC timestamp to stay TZ-agnostic */
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const istStr = `${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}:${pad(ist.getUTCSeconds())}`;

    clockEl.textContent = `● REC ${dateStr}  ·  UTC ${utcStr}  ·  IST ${istStr}`;
  };

  const syncVisibility = () => {
    clockEl.style.display = window.innerWidth < 720 ? 'none' : 'block';
  };

  /* Align the first tick to the next full second, then run a clean 1 Hz interval */
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
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
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
  bar.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: var(--space-lg);
  `;

  const setActive = (activeBtn) => {
    $$('.feed-filter-btn', bar).forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.style.borderColor = isActive ? 'var(--accent-cyan)'   : 'var(--border-default)';
      btn.style.color       = isActive ? 'var(--accent-cyan)'   : 'var(--text-primary)';
      btn.style.boxShadow   = isActive ? 'var(--glow-cyan-sm)'  : 'none';
      btn.setAttribute('aria-selected', String(isActive));
    });
  };

  const applyFilter = (filter) => {
    cards.forEach((card) => {
      const match = filter === 'All' || card.dataset.category === filter;
      card.style.transition = 'opacity 320ms ease, transform 320ms ease';

      if (match) {
        card.style.display = '';
        void card.offsetWidth; /* force reflow so the transition always runs */
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.94)';
        window.setTimeout(() => {
          if (card.dataset.category !== filter && filter !== 'All') {
            card.style.display = 'none';
          }
        }, 340);
      }
    });
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
   ========================================================================== */
let __lastFocusedEl = null;

function openModal(html) {
  const backdrop = document.getElementById('modal-backdrop');
  const content  = document.getElementById('modal-content');
  if (!backdrop || !content) return;

  __lastFocusedEl = document.activeElement;

  content.innerHTML = html;
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = backdrop.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (!backdrop) return;

  backdrop.classList.remove('active');
  document.body.style.overflow = '';

  if (__lastFocusedEl && typeof __lastFocusedEl.focus === 'function') {
    __lastFocusedEl.focus({ preventScroll: true });
    __lastFocusedEl = null;
  }
}

function closeModalOnBackdrop(e) {
  if (e.target && e.target.id === 'modal-backdrop') closeModal();
}

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

  openModal(`
    <img class="modal-img" src="${data.img}" alt="${data.title}" loading="lazy" decoding="async" />
    <h2 class="modal-title">${data.title}</h2>
    <p class="modal-body-text">${data.desc}</p>
    <button type="button" class="btn btn-hire" onclick="openHireModal()">
      <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
      <span>Discuss Deployment Offer</span>
    </button>
  `);
}

function openHireModal() {
  openModal(`
    <div style="text-align:center;margin-bottom:1.8rem;">
      <span class="section-tag-span">Deployment Enquiry</span>
      <h2 class="modal-title" style="margin-top:0.4rem;">
        Hire <span class="highlight-span">Sumit Anand</span>
      </h2>
      <p style="color:var(--text-muted);font-size:var(--fs-sm);margin-top:0.35rem;">
        Deploy a CCTV Operator &amp; Gate Control Specialist to your hub.
      </p>
    </div>

    <form onsubmit="handleHireSubmit(event)" novalidate>
      <div class="form-field">
        <input type="text" id="hire-name" class="form-input" placeholder=" " autocomplete="name" required />
        <label for="hire-name" class="form-label">Your Name / Organization</label>
      </div>

      <div class="form-field">
        <input type="email" id="hire-email" class="form-input" placeholder=" " autocomplete="email" required />
        <label for="hire-email" class="form-label">Work Email</label>
      </div>

      <div class="form-field">
        <input type="text" id="hire-role" class="form-input" placeholder=" " />
        <label for="hire-role" class="form-label">Role Title / Location</label>
      </div>

      <div class="form-field">
        <textarea id="hire-msg" class="form-input" placeholder=" " required></textarea>
        <label for="hire-msg" class="form-label">Shift Details &amp; Offer Note</label>
      </div>

      <button type="submit" class="btn btn-hire" style="width:100%;justify-content:center;">
        <i class="fa-solid fa-bolt" aria-hidden="true"></i>
        <span>Submit Employment Proposal</span>
      </button>
    </form>
  `);
}

/* ==========================================================================
   8. FORM SUBMISSION HANDLERS
   ========================================================================== */
function handleHireSubmit(e) {
  e.preventDefault();
  const name = $('#hire-name')?.value ?? '';
  const email = $('#hire-email')?.value ?? '';
  const role = $('#hire-role')?.value ?? '';
  const msg = $('#hire-msg')?.value ?? '';

  const subject = encodeURIComponent(`Hire Proposal for Sumit Anand: ${role || 'Security Specialist'}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRole/Location: ${role}\n\nNote:\n${msg}`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  closeModal();
  showToast('Opening your email client to send the proposal…');
}

function handleDirectMessage(e) {
  e.preventDefault();
  const name = $('#contact-name')?.value ?? '';
  const email = $('#contact-email')?.value ?? '';
  const msg = $('#contact-message')?.value ?? '';

  const subject = encodeURIComponent(`Portfolio Message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  e.target.reset();
  showToast('Briefing pre-filled in your email client — check outgoing mail.');
}

function showToast(message) {
  const toast = document.getElementById('toast-popup');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => toast.classList.remove('show'), 3600);
}

/* ==========================================================================
   9. SCROLL REVEALS — staggered, animate-once
   ========================================================================== */
(function initScrollReveal() {
  const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-scan, .reveal-decode';

  /* Stagger direct children of any [data-stagger] container so they
     cascade in rather than firing together */
  $$('[data-stagger]').forEach((group) => {
    $$(REVEAL_SELECTOR, group)
      .filter((el) => el.parentElement === group)
      .forEach((child, i) => { child.style.transitionDelay = `${i * 90}ms`; });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target); /* animate once, then stop watching */
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  $$(REVEAL_SELECTOR).forEach((el) => observer.observe(el));
})();

/* ==========================================================================
   10. SCROLL-SPY NAVIGATION
   ========================================================================== */
(function initScrollSpy() {
  const navLinks = $$('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  const sectionMap = new Map();
  navLinks.forEach((link) => {
    const section = $(link.getAttribute('href'));
    if (section) sectionMap.set(section, link);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = sectionMap.get(entry.target);
      if (!link || !entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.remove('is-current'));
      link.classList.add('is-current');
    });
  }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });

  sectionMap.forEach((_link, section) => observer.observe(section));
})();

/* ==========================================================================
   11. KEYBOARD SUPPORT
   ========================================================================== */
(function initKeyboardSupport() {
  /* Enter / Space activates elements styled as buttons but not
     implemented as native <button>/<a> — the feed cards */
  $$('[role="button"]').forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  /* Escape closes an open modal from anywhere on the page */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop && backdrop.classList.contains('active')) closeModal();
  });
})();
