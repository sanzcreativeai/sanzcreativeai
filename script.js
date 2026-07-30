// ============================================================
// SANZCREATIVE.AI — Premium interactions
// Motion library loaded via CDN. Falls back gracefully if it fails.
// ============================================================
const hasMotion = typeof window.Motion !== 'undefined';
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- HARD SAFETY NET: guarantees content is never permanently invisible ----
setTimeout(() => {
  document.querySelectorAll('[data-in]').forEach((el) => {
    if (getComputedStyle(el).opacity === '0') {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
}, 2500);

if (!hasMotion) {
  document.querySelectorAll('[data-in]').forEach((el) => { el.style.opacity = '1'; });
} else {
  const { animate, inView, stagger } = window.Motion;
  const EASE = [0.16, 1, 0.3, 1];

  // ---- Hero entrance ----
  const heroEls = document.querySelectorAll('[data-hero]');
  if (heroEls.length) {
    animate(heroEls, { opacity: [0, 1], y: [26, 0] }, { duration: 0.7, delay: stagger(0.12, { startDelay: 0.1 }), ease: EASE });
  }
  const heroScene = document.querySelector('[data-hero-scene]');
  if (heroScene) {
    animate(heroScene, { opacity: [0, 1], y: [40, 0], scale: [0.96, 1] }, { duration: 0.9, delay: 0.5, ease: EASE });
  }

  // ---- Staggered scroll reveals, grouped by parent container ----
  const groups = new Map();
  document.querySelectorAll('[data-in]:not([data-hero])').forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach((items, container) => {
    inView(container, () => {
      animate(items, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, delay: stagger(0.08), ease: EASE });
    }, { margin: '0px 0px -10% 0px' });
  });
}

// ---- Text-independent: cursor spotlight ----
const spotlight = document.getElementById('spotlight');
if (spotlight && matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--x', (e.clientX / window.innerWidth) * 100 + '%');
    spotlight.style.setProperty('--y', (e.clientY / window.innerHeight) * 100 + '%');
  });
}

// ---- Custom cursor dot + lagging ring ----
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
if (cursorDot && cursorRing && matchMedia('(hover: hover)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  (function loop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .glass').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}

// ---- Aurora field: subtle mouse-reactive parallax (own layer, no conflicts) ----
const auroraField = document.getElementById('auroraField');
if (auroraField && matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    auroraField.style.transform = `translate(${nx * -24}px, ${ny * -20}px)`;
  });
}

// ---- Magnetic buttons ----
document.querySelectorAll('.magnetic').forEach((btn) => {
  const label = btn.querySelector('span');
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    if (label) label.style.transform = `translate(${x * 0.1}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    if (label) label.style.transform = '';
  });
});

// ---- 3D tilt on cards (no continuous CSS transform animations on these, safe) ----
if (matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
  const tiltSelector = '.work-visual, .behind-card, .bento-item, .price-card, .faq-item, .stat-card, .hero-scene-frame';
  document.querySelectorAll(tiltSelector).forEach((el) => {
    el.style.transformStyle = 'preserve-3d';
    let rafId = null;
    el.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(py * -8).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
        rafId = null;
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
  navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navMenu.classList.remove('open')));
}

// ---- Animated counters ----
const counters = document.querySelectorAll('.counter');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const divide = parseInt(el.dataset.divide || '1', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = suffix ? (current / divide).toFixed(1) + suffix : Math.round(current).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = suffix ? (target / divide).toFixed(1) + suffix : target.toLocaleString('en-IN');
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach((el) => counterIO.observe(el));

// ---- Process timeline scroll-fill ----
const processTimeline = document.getElementById('processTimeline');
const processFill = document.getElementById('processFill');
const processSteps = document.querySelectorAll('[data-step]');
if (processTimeline && processFill) {
  function updateProcessFill() {
    const rect = processTimeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(viewportH * 0.65 - rect.top, 0), total);
    const pct = Math.min((visible / total) * 100, 100);
    processFill.style.height = pct + '%';
    processSteps.forEach((step, i) => {
      const stepTop = step.offsetTop;
      step.classList.toggle('active', (visible) >= stepTop);
    });
  }
  window.addEventListener('scroll', updateProcessFill, { passive: true });
  window.addEventListener('resize', updateProcessFill);
  updateProcessFill();
}

// ---- Lead form (Formspree) ----
const leadForm = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');
if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (leadForm._gotcha && leadForm._gotcha.checked) return;

    const endpoint = leadForm.action;
    const submitBtn = leadForm.querySelector('.form-submit');
    const submitLabel = submitBtn.querySelector('span');
    const originalLabel = submitLabel.textContent;
    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(leadForm),
      });
      if (res.ok) {
        formStatus.textContent = "Thanks — we'll get back to you the same day.";
        formStatus.className = 'form-status success';
        leadForm.reset();
      } else {
        const data = await res.json().catch(() => null);
        const msg = data?.errors?.map((er) => er.message).join(', ');
        formStatus.textContent = msg || 'Something went wrong. Please try again.';
        formStatus.className = 'form-status error';
      }
    } catch (err) {
      formStatus.textContent = 'Network error. Please try again.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = originalLabel;
    }
  });
}
