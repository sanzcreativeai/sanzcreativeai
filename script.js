// ---------- Animated counters (Results section) ----------
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
      el.textContent = suffix
        ? (current / divide).toFixed(1) + suffix
        : Math.round(current).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
      else {
        el.textContent = suffix ? (target / divide).toFixed(1) + suffix : target.toLocaleString('en-IN');
      }
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach((el) => counterIO.observe(el));


// ---------- Lead form (Formspree) ----------
const leadForm = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');
if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (leadForm._gotcha && leadForm._gotcha.checked) return; // spam bot caught

    const endpoint = leadForm.action;
    if (!endpoint || endpoint.includes('YOUR_FORMSPREE_ENDPOINT')) {
      formStatus.textContent = 'Form not connected yet — add your Formspree endpoint.';
      formStatus.className = 'form-status error';
      return;
    }

    const submitBtn = leadForm.querySelector('.lead-submit');
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

// ---------- Shared icon set (digital marketing themed) ----------
const ICONS = [
  // trending up / growth
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>`,
  // target / ad targeting
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  // megaphone / marketing
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10v4h4l6 4V6l-6 4H3z"/><path d="M17 9a4 4 0 010 6"/></svg>`,
  // hashtag
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 9h14M5 15h14M10 4L7 20M17 4l-3 16"/></svg>`,
  // heart / engagement
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-9.5-8.8C.9 8 2.3 4.5 5.8 4a5 5 0 016.2 2.3A5 5 0 0118.2 4c3.5.5 4.9 4 3.3 7.2C19 15.6 12 20 12 20z"/></svg>`,
  // chat bubble / comments
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H8l-4 4V5z"/></svg>`,
  // share arrow
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M16 6l-4-4-4 4M12 2v14"/></svg>`,
  // play button / video
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/></svg>`,
  // globe / website
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z"/></svg>`,
  // layers / design
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>`,
  // pen / branding
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  // camera
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/></svg>`,
];

// ---------- Floating decorative icons (Tools + Results sections) ----------
document.querySelectorAll('[data-float]').forEach((container) => {
  const count = window.innerWidth < 700 ? 6 : 12;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'float-icon';
    el.innerHTML = ICONS[Math.floor(Math.random() * ICONS.length)];
    const size = 20 + Math.random() * 26;
    el.style.left = Math.random() * 96 + '%';
    el.style.top = Math.random() * 82 + '%';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.animationDuration = 3.5 + Math.random() * 3 + 's';
    el.style.animationDelay = (Math.random() * -5) + 's';
    container.appendChild(el);
  }
});

// ---------- Falling icons (generic: video, design, marketing, web) ----------
const rainContainer = document.getElementById('iconRain');
if (rainContainer) {
  const COUNT = window.innerWidth < 700 ? 10 : 20;
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'falling-icon';
    el.innerHTML = ICONS[i % ICONS.length];
    const size = 18 + Math.random() * 22;
    const left = Math.random() * 100;
    const duration = 14 + Math.random() * 12;
    const delay = Math.random() * -20;
    const opacity = (0.12 + Math.random() * 0.22).toFixed(2);
    const spin = (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 220);
    el.style.left = left + '%';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.setProperty('--icon-op', opacity);
    el.style.setProperty('--spin', spin + 'deg');
    el.style.animationDuration = `${duration}s, ${3 + Math.random() * 3}s`;
    el.style.animationDelay = `${delay}s, ${Math.random() * 2}s`;
    rainContainer.appendChild(el);
  }
}

// ---------- Custom cursor (dot + lagging ring) ----------
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
  document.querySelectorAll('a, button, .card, .work').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}

// ---------- Magnetic buttons ----------
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

// ---------- Scroll parallax depth (floating layers drift at different speeds) ----------
const parallaxLayers = document.querySelectorAll('[data-float], .icon-rain');
let lastScrollY = window.scrollY;
let ticking = false;
function applyParallax() {
  parallaxLayers.forEach((layer, i) => {
    const speed = 0.06 + (i % 3) * 0.04;
    layer.style.transform = `translateY(${lastScrollY * speed * -0.15}px)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(applyParallax);
    ticking = true;
  }
}, { passive: true });

// ---------- Hero scene widget (cycling work illustrations) ----------
const sceneWidget = document.getElementById('sceneWidget');
if (sceneWidget) {
  const scenes = sceneWidget.querySelectorAll('.scene');
  const dots = sceneWidget.querySelectorAll('.scene-dot');
  let sceneIndex = 0;
  let sceneTimer;

  function showScene(i) {
    sceneIndex = i;
    scenes.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  function startSceneCycle() {
    sceneTimer = setInterval(() => showScene((sceneIndex + 1) % scenes.length), 4200);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showScene(i);
      clearInterval(sceneTimer);
      startSceneCycle();
    });
  });

  showScene(0);
  startSceneCycle();
}

// ---------- Whole-page mouse-reactive ambient layer ----------
const ambientBlobs = document.getElementById('ambientBlobs');
if (ambientBlobs && matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    ambientBlobs.style.transform = `translate(${nx * -26}px, ${ny * -22}px)`;
  });
}

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'vivid';
    const next = current === 'vivid' ? 'midnight' : 'vivid';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sanz-theme', next);
  });
}

// ---------- Cursor spotlight (hero glow follows mouse) ----------
const spotlight = document.getElementById('spotlight');
if (spotlight && matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    spotlight.style.setProperty('--x', x + '%');
    spotlight.style.setProperty('--y', y + '%');
  });
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// ---------- Portfolio tilt ----------
const works = document.querySelectorAll('.work');
if (matchMedia('(hover: hover)').matches) {
  works.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
  });
}

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('active', open);
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ---------- Header background on scroll ----------
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) header.style.background = 'rgba(18, 15, 27, 0.95)';
  else header.style.background = '';
});
