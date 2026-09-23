/* ==========================================================================
   1. CYBER TRAILING CURSOR
   ========================================================================== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

if (cursorDot && cursorRing && supportsFinePointer) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot snaps exactly to the pointer — precise, zero-lag point of aim
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  function renderCursor() {
    // Ring eases toward the pointer — gives the reticle a "tracking" feel
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  document.querySelectorAll('a, button, .op-card, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   2. SCROLL PROGRESS
   ========================================================================== */
const progressBar = document.getElementById('progress-bar');

if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==========================================================================
   3. CONSTELLATION / MATRIX CANVAS PARTICLES
   ========================================================================== */
const canvas = document.getElementById('particles-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  // Pull live theme colors from the CSS custom properties instead of
  // hardcoding hex values, so the canvas always matches variables.css
  const rootStyles = getComputedStyle(document.documentElement);

  function hexToRgb(hex) {
    const clean = hex.trim().replace('#', '');
    const bigint = parseInt(clean, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  const dotColor = hexToRgb(rootStyles.getPropertyValue('--neon-cyan') || '#00e5ff');
  const lineColor = hexToRgb(rootStyles.getPropertyValue('--neon-violet') || '#9d4dff');

  function initCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', initCanvas, { passive: true });
  initCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = `rgba(${dotColor.r}, ${dotColor.g}, ${dotColor.b}, 0.6)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 50; i++) {
    particlesArray.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();

      for (let j = i; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${0.25 - dist / 480})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);
}

/* ==========================================================================
   4. 3D CARD TILT EFFECT
   ========================================================================== */
if (supportsFinePointer) {
  document.querySelectorAll('.op-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 12;
      const rotateY = (centerX - x) / 12;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   5. SURVEILLANCE TIMESTAMP CLOCK (UTC / IST)
   ========================================================================== */
function initSurveillanceClock() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let clockEl = document.getElementById('cctv-clock');
  if (!clockEl) {
    clockEl = document.createElement('div');
    clockEl.id = 'cctv-clock';
    clockEl.style.cssText = `
      position: fixed;
      top: calc(var(--header-height) + 14px);
      right: 20px;
      z-index: var(--z-overlay);
      font-family: var(--font-mono);
      font-size: var(--fs-xs);
      letter-spacing: var(--ls-wide);
      color: var(--neon-cyan);
      text-shadow: var(--text-glow-cyan);
      background: var(--glass-bg);
      border: 1px solid var(--border-cyan);
      border-radius: var(--radius-sm);
      padding: 5px 12px;
      pointer-events: none;
      white-space: nowrap;
    `;
    document.body.appendChild(clockEl);
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateClock() {
    const now = new Date();
    const utcH = pad(now.getUTCHours());
    const utcM = pad(now.getUTCMinutes());
    const utcS = pad(now.getUTCSeconds());

    // IST = UTC + 5:30, computed without mutating the base date
    const istMillis = now.getTime() + (5.5 * 60 * 60 * 1000);
    const ist = new Date(istMillis);
    const istH = pad(ist.getUTCHours());
    const istM = pad(ist.getUTCMinutes());
    const istS = pad(ist.getUTCSeconds());

    const dateStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;

    clockEl.textContent = `● REC ${dateStr}  UTC ${utcH}:${utcM}:${utcS}  /  IST ${istH}:${istM}:${istS}`;
  }

  function updateClockVisibility() {
    clockEl.style.display = window.innerWidth < 640 ? 'none' : 'block';
  }

  updateClock();
  updateClockVisibility();
  setInterval(updateClock, 1000);
  window.addEventListener('resize', updateClockVisibility, { passive: true });
}
initSurveillanceClock();

/* ==========================================================================
   6. PROJECT CATEGORY FILTER
   ========================================================================== */
function initProjectFilters() {
  const grid = document.querySelector('.operations-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.op-card'));
  if (!cards.length) return;

  // Derive each card's category from its existing feed badge text
  cards.forEach(card => {
    const badge = card.querySelector('.op-card-badge-span');
    card.dataset.category = badge ? badge.textContent.trim() : 'All';
  });

  const categories = ['All', ...new Set(cards.map(c => c.dataset.category))];

  const filterBar = document.createElement('div');
  filterBar.id = 'feed-filter-bar';
  filterBar.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: var(--space-lg);
  `;

  function setActiveButton(activeBtn) {
    filterBar.querySelectorAll('.feed-filter-btn').forEach(btn => {
      const isActive = btn === activeBtn;
      btn.style.borderColor = isActive ? 'var(--neon-cyan)' : 'var(--border-default)';
      btn.style.color = isActive ? 'var(--neon-cyan)' : 'var(--text-primary)';
      btn.style.boxShadow = isActive ? 'var(--glow-cyan-sm)' : 'none';
    });
  }

  function applyFilter(filter) {
    cards.forEach(card => {
      const match = filter === 'All' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      if (match) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92)';
        setTimeout(() => {
          if (card.dataset.category !== filter && filter !== 'All') {
            card.style.display = 'none';
          }
        }, 350);
      }
    });
  }

  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat;
    btn.dataset.filter = cat;
    btn.className = 'btn btn-glass feed-filter-btn';
    btn.style.padding = '0.5rem 1.2rem';
    btn.style.fontSize = 'var(--fs-xs)';
    filterBar.appendChild(btn);
    if (i === 0) setActiveButton(btn);
  });

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.feed-filter-btn');
    if (!btn) return;
    setActiveButton(btn);
    applyFilter(btn.dataset.filter);
  });

  grid.parentElement.insertBefore(filterBar, grid);
}
initProjectFilters();

/* ==========================================================================
   7. INTERACTIVE MODALS & WORKING "HIRE ME" FORM
   ========================================================================== */
const opData = {
  op1: {
    title: "CP Plus Multi-Channel Surveillance Network",
    img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1000&auto=format&fit=crop",
    desc: "Configured and actively monitored CP Plus multi-channel camera arrays across high-density logistics hubs. Responsible for live feeds, footage archiving, playback investigation during incidents, and preventing stock shrinkage across warehouse zones."
  },
  op2: {
    title: "Digital GIGO Gate & Data Entry Terminal",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    desc: "Managed high-density commercial vehicle logging and Goods-In/Goods-Out (GIGO) gate control for Flipkart's Kalash Mega Hub. Performed real-time MS Excel data entry, driver ID audits, dock allocation, and material gate pass clearance with zero operational error."
  },
  op3: {
    title: "PSARA Compliance & Emergency Safety Protocols",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    desc: "Enforced strict compliance with Private Security Agencies Regulation Act (PSARA) protocols. Conducted fire extinguisher inspections, led emergency evacuation drills, performed security badge audits, and maintained daily shift logs for management review."
  }
};

function openOpModal(opKey) {
  const data = opData[opKey];
  if (!data) return;

  const html = `
    <img src="${data.img}" class="modal-img" alt="${data.title}" />
    <h2 class="modal-title">${data.title}</h2>
    <p class="modal-body-text">${data.desc}</p>
    <button class="btn btn-hire" onclick="openHireModal()">
      <i class="fa-solid fa-paper-plane"></i> <span class="btn-text-span">Discuss Deployment Offer</span>
    </button>
  `;

  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-backdrop').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openHireModal() {
  const html = `
    <div style="text-align: center; margin-bottom: 1.8rem;">
      <span class="section-tag-span">Deployment Enquiry</span>
      <h2 class="modal-title" style="margin-top: 0.4rem;">Hire <span class="highlight-span">Sumit Anand</span></h2>
      <p style="color: var(--text-muted); font-size: 0.95rem;">Deploy a CCTV Operator & Gate Control Specialist to your hub.</p>
    </div>

    <form onsubmit="handleHireSubmit(event)">
      <div class="form-field">
        <input type="text" id="hire-name" class="form-input" placeholder=" " required />
        <label for="hire-name" class="form-label">Your Name / Organization</label>
      </div>

      <div class="form-field">
        <input type="email" id="hire-email" class="form-input" placeholder=" " required />
        <label for="hire-email" class="form-label">Work Email</label>
      </div>

      <div class="form-field">
        <input type="text" id="hire-role" class="form-input" placeholder=" " />
        <label for="hire-role" class="form-label">Role Title / Location (e.g. CCTV Lead - Mega Hub)</label>
      </div>

      <div class="form-field">
        <textarea id="hire-msg" class="form-input" placeholder=" " required></textarea>
        <label for="hire-msg" class="form-label">Shift Details & Offer Note</label>
      </div>

      <button type="submit" class="btn btn-hire" style="width: 100%; justify-content: center;">
        <i class="fa-solid fa-bolt"></i> <span class="btn-text-span">Submit Employment Proposal</span>
      </button>
    </form>
  `;

  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-backdrop').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function closeModalOnBackdrop(e) {
  if (e.target.id === 'modal-backdrop') closeModal();
}

/* ==========================================================================
   8. FORM SUBMISSION HANDLERS
   ========================================================================== */
function handleHireSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('hire-name').value;
  const email = document.getElementById('hire-email').value;
  const role = document.getElementById('hire-role').value;
  const msg = document.getElementById('hire-msg').value;

  const mailtoSubject = encodeURIComponent(`Hire Proposal for Sumit Anand: ${role || 'Security Specialist'}`);
  const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRole/Location: ${role}\n\nNote:\n${msg}`);

  window.location.href = `mailto:sa8518430@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  closeModal();
  showToast("Opening email application to send proposal!");
}

function handleDirectMessage(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const msg = document.getElementById('contact-message').value;

  const mailtoSubject = encodeURIComponent(`Portfolio Message from ${name}`);
  const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);

  window.location.href = `mailto:sa8518430@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
  e.target.reset();
  showToast("Briefing pre-filled in your email application!");
}

function showToast(msg) {
  const toast = document.getElementById('toast-popup');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ==========================================================================
   9. SCROLL REVEAL OBSERVER
   ========================================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ==========================================================================
   10. KEYBOARD SHORTCUTS
   ========================================================================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop && backdrop.classList.contains('active')) {
      closeModal();
    }
  }
});
        
