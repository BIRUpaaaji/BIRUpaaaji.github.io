/* ================================================
   Birat Portfolio — script.js
   Professional interactions & animations
   ================================================ */

// ===== Theme =====
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const saved = localStorage.getItem('theme') || 'dark';
setTheme(saved);

function setTheme(t) {
  html.setAttribute('data-theme', t);
  themeIcon.textContent = t === 'dark' ? '☀' : '☾';
  localStorage.setItem('theme', t);
}

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  snack(next === 'dark' ? 'Dark mode on' : 'Light mode on');
});

// ===== Nav scroll =====
const topnav = document.getElementById('topnav');
window.addEventListener('scroll', () => {
  topnav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== Hamburger =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Active nav link =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObs.observe(s));

// ===== Reveal =====
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObs.observe(el));

// Hero reveals immediately
requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
});

// ===== Counter animation =====
const counters = document.querySelectorAll('.metric-num');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach(c => counterObs.observe(c));

function countUp(el) {
  const end = +el.dataset.count;
  const dur = 1600;
  const t0 = performance.now();
  const raf = t => {
    const p = Math.min((t - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * end);
    if (p < 1) requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// ===== Skill bars =====
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(f => skillObs.observe(f));

// ===== Project filter =====
const filterBtns = document.querySelectorAll('.f-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectItems.forEach((item, i) => {
      const match = filter === 'all' || item.dataset.cat === filter;
      if (match) {
        item.classList.remove('hidden');
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.35s, transform 0.35s';
          item.style.opacity = '1';
          item.style.transform = 'none';
        }, i * 40 + 10);
      } else {
        item.style.opacity = '0';
        setTimeout(() => item.classList.add('hidden'), 300);
      }
    });
  });
});

// ===== Contact form =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', e => {
  e.preventDefault();

  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let valid = true;

  inputs.forEach(inp => {
    inp.classList.remove('error');
    if (!inp.value.trim()) { inp.classList.add('error'); valid = false; }
    if (inp.type === 'email' && inp.value && !/\S+@\S+\.\S+/.test(inp.value)) {
      inp.classList.add('error'); valid = false;
    }
  });

  if (!valid) { snack('Please fill in all required fields.'); return; }

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.6';

  setTimeout(() => {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    form.reset();
    formSuccess.classList.add('show');
    snack('Message sent successfully.');
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 1400);
});

form.querySelectorAll('input, textarea').forEach(f => {
  f.addEventListener('input', () => f.classList.remove('error'));
});

// ===== Snackbar =====
const snackEl = document.getElementById('snackbar');
let snackT;

function snack(msg) {
  clearTimeout(snackT);
  snackEl.textContent = msg;
  snackEl.classList.add('show');
  snackT = setTimeout(() => snackEl.classList.remove('show'), 3000);
}

// ===== Project item hover cursor indicator =====
projectItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.querySelector('.project-num').style.color = 'var(--accent)';
  });
  item.addEventListener('mouseleave', () => {
    item.querySelector('.project-num').style.color = '';
  });
});
