/* Birat Thakali Portfolio — script.js */

// Theme
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

setTheme(localStorage.getItem('theme') || 'dark');
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

// Nav scroll
const topnav = document.getElementById('topnav');
window.addEventListener('scroll', () => {
  topnav.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// Active nav
const navLinks = document.querySelectorAll('.nav-link');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section').forEach(s => sectionObs.observe(s));

// Reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
});

// Counters
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.metric-num').forEach(c => counterObs.observe(c));

function countUp(el) {
  const end = +el.dataset.count;
  const dur = 1500;
  const t0 = performance.now();
  const raf = t => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * end);
    if (p < 1) requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// Skill bars
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; skillObs.unobserve(e.target); }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-fill').forEach(f => skillObs.observe(f));

// Contact form
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('input[required],textarea[required]').forEach(inp => {
    inp.classList.remove('error');
    if (!inp.value.trim()) { inp.classList.add('error'); valid = false; }
    if (inp.type === 'email' && inp.value && !/\S+@\S+\.\S+/.test(inp.value)) { inp.classList.add('error'); valid = false; }
  });
  if (!valid) { snack('Please fill in all required fields.'); return; }

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '.6';

  setTimeout(() => {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    form.reset();
    formSuccess.classList.add('show');
    snack('Message sent successfully.');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});

form.querySelectorAll('input,textarea').forEach(f => f.addEventListener('input', () => f.classList.remove('error')));

// Snackbar
const snackEl = document.getElementById('snackbar');
let snackT;
function snack(msg) {
  clearTimeout(snackT);
  snackEl.textContent = msg;
  snackEl.classList.add('show');
  snackT = setTimeout(() => snackEl.classList.remove('show'), 3000);
}

// Project item hover accent on number
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('mouseenter', () => item.querySelector('.project-num').style.color = 'var(--accent)');
  item.addEventListener('mouseleave', () => item.querySelector('.project-num').style.color = '');
});
