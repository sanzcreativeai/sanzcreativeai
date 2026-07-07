// ---------- Falling icons (generic: video, design, marketing, web) ----------
const ICONS = [
  // camera / video
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/></svg>`,
  // play button
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/></svg>`,
  // layers / design
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>`,
  // megaphone / marketing
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10v4h4l6 4V6l-6 4H3z"/><path d="M17 9a4 4 0 010 6"/></svg>`,
  // globe / website
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z"/></svg>`,
  // pen / branding
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
];

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
