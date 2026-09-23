// ============================================================
// SANZCREATIVE.AI — Clean, lightweight interactions
// NO external animation library. NO cursor tracking. NO lag.
// Just clean scroll reveals, portfolio filter, counters, and form.
// ============================================================

// ---- Hard safety net: all [data-in] visible within 2.5s no matter what ----
setTimeout(() => {
  document.querySelectorAll('[data-in]').forEach((el) => {
    el.classList.add('revealed');
  });
}, 2500);

// ---- Scroll-triggered reveals via IntersectionObserver ----
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Stagger children that share a parent
      const parent = entry.target.parentElement;
      const siblings = parent.querySelectorAll('[data-in]');
      siblings.forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 60);
      });
      revealIO.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

document.querySelectorAll('[data-in]').forEach((el) => revealIO.observe(el));

// ---- Scroll-spy navigation ----
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const spySections = Array.from(navLinks).map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if (navLinks.length && spySections.length) {
  const spyIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach((link) => link.classList.toggle('nav-active', link.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  spySections.forEach((section) => spyIO.observe(section));
}

// ---- Mobile nav ----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
  navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navMenu.classList.remove('open')));
}

// ---- Portfolio filter ----
const filterTabs = document.getElementById('filterTabs');
const portfolioGrid = document.getElementById('portfolioGrid');
if (filterTabs && portfolioGrid) {
  const cards = portfolioGrid.querySelectorAll('.portfolio-card');
  filterTabs.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const cats = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.classList.toggle('hidden-filter', !show);
      });
    });
  });
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
    const duration = 1400;
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
    processSteps.forEach((step) => {
      step.classList.toggle('active', visible >= step.offsetTop);
    });
  }
  window.addEventListener('scroll', updateProcessFill, { passive: true });
  updateProcessFill();
}

// ---- Copy-to-clipboard on email ----
document.querySelectorAll('.contact-links a[href^="mailto:"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const value = link.href.replace('mailto:', '');
    navigator.clipboard.writeText(value).then(() => {
      const original = link.textContent;
      link.textContent = '✓ Copied!';
      link.classList.add('copied');
      setTimeout(() => { link.textContent = original; link.classList.remove('copied'); }, 1600);
    }).catch(() => { window.location.href = link.href; });
  });
});

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
      const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(leadForm) });
      if (res.ok) {
        formStatus.textContent = "✓ Thanks — we'll get back to you the same day.";
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
