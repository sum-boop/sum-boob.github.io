    /* ==========================================================================
       1. CYBER TRAILING CURSOR
       ========================================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('a, button, .op-card, .glass-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* ==========================================================================
       2. SCROLL PROGRESS
       ========================================================================== */
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      document.getElementById('progress-bar').style.width = `${progress}%`;
    });

    /* ==========================================================================
       3. CONSTELLATION / MATRIX CANVAS PARTICLES
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function initCanvas() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', initCanvas);
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
        ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
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
            ctx.strokeStyle = `rgba(176, 38, 255, ${0.25 - dist/480})`;
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
    animateParticles();

    /* ==========================================================================
       4. 3D CARD TILT EFFECT
       ========================================================================== */
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
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });

    /* ==========================================================================
       5. INTERACTIVE MODALS & WORKING "HIRE ME" FORM
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

    // ADVANCED WORKING HIRE ME MODAL
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
       6. FORM SUBMISSION HANDLERS
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
       7. SCROLL REVEAL OBSERVER
       ========================================================================== */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
