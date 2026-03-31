/* ============================================================
   index2.js — ResinCraft Studio
   Order:
     1. Init
     2. Navbar: theme, RTL, scroll-shrink, click-dropdowns, hamburger
     3. Footer: newsletter form
     4. Homepage: scroll-reveal, counter animation
     5. WhatsApp: panel open/close, dismiss widget
============================================================ */

/* =========================
   1. INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  initTheme();
  initRTL();
  initNavScroll();
  initDropdowns();
  initHamburger();
  initFooter();
  initScrollReveal();
  initCounters();
  initWhatsApp();

  // Re-run icons after lucide loads
  if (typeof lucide === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
    s.onload = () => lucide.createIcons();
    document.head.appendChild(s);
  }
});

/* =========================
   2. NAVBAR
========================= */

/* --- Theme --- */
function initTheme() {
  const saved   = localStorage.getItem('rc-theme');
  const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme   = saved || (prefDark ? 'dark' : 'light');
  applyTheme(theme);

  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', () => {
    const cur  = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('rc-theme', theme);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* --- RTL --- */
function initRTL() {
  const saved = localStorage.getItem('rc-dir');
  if (saved) {
    applyDir(saved);
  }

  // Desktop RTL button
  const btn = document.getElementById('rtlToggle');
  if (btn) btn.addEventListener('click', toggleDir);

  // Drawer RTL button
  const drawerBtn = document.getElementById('drawerRtlBtn');
  if (drawerBtn) drawerBtn.addEventListener('click', () => {
    toggleDir();
    // Close drawer after toggling
    closeDrawer();
  });
}

function toggleDir() {
  const cur = document.documentElement.getAttribute('dir') || 'ltr';
  applyDir(cur === 'rtl' ? 'ltr' : 'rtl');
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('rc-dir', dir);
  // Update drawer RTL button label
  const lbl = document.querySelector('.rtl-label');
  if (lbl) lbl.textContent = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
  // Refresh icons (RTL arrow may need re-render)
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* --- Scroll Shrink --- */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 70);
  }, { passive: true });
}

/* --- Click-based Dropdowns (Desktop) --- */
function initDropdowns() {
  const toggles = document.querySelectorAll('.nav-dropdown-toggle');

  toggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.target;
      const panel    = document.getElementById(targetId);
      if (!panel) return;

      const isOpen = panel.classList.contains('dd-visible');

      // Close all open dropdowns first
      closeAllDropdowns();

      if (!isOpen) {
        panel.classList.add('dd-visible');
        btn.classList.add('dd-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', closeAllDropdowns);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // Keep open when clicking inside dropdown
  document.querySelectorAll('.nav-dropdown').forEach(dd => {
    dd.addEventListener('click', (e) => e.stopPropagation());
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.nav-dropdown.dd-visible').forEach(dd => {
    dd.classList.remove('dd-visible');
  });
  document.querySelectorAll('.nav-dropdown-toggle.dd-open').forEach(btn => {
    btn.classList.remove('dd-open');
    btn.setAttribute('aria-expanded', 'false');
  });
}

/* --- Hamburger & Drawer --- */
function initHamburger() {
  const hambBtn       = document.getElementById('hamburgerBtn');
  const drawer        = document.getElementById('navDrawer');
  const overlay       = document.getElementById('drawerOverlay');
  const closeBtn      = document.getElementById('drawerClose');
  const accordions    = document.querySelectorAll('.drawer-accordion');

  if (!hambBtn || !drawer) return;

  hambBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Accordion sub-menus inside drawer
  accordions.forEach(btn => {
    btn.addEventListener('click', () => {
      const subId = btn.dataset.sub;
      const sub   = document.getElementById(subId);
      if (!sub) return;

      const isOpen = sub.classList.contains('sub-open');

      // Close other open subs
      document.querySelectorAll('.drawer-sub.sub-open').forEach(s => s.classList.remove('sub-open'));
      document.querySelectorAll('.drawer-accordion.acc-open').forEach(b => b.classList.remove('acc-open'));

      if (!isOpen) {
        sub.classList.add('sub-open');
        btn.classList.add('acc-open');
      }
    });
  });

  // Close drawer links (smooth scroll + close)
  drawer.querySelectorAll('.drawer-sub-link, .drawer-link:not(.drawer-accordion)').forEach(link => {
    link.addEventListener('click', () => closeDrawer());
  });
}

function openDrawer() {
  const hambBtn = document.getElementById('hamburgerBtn');
  const drawer  = document.getElementById('navDrawer');
  const overlay = document.getElementById('drawerOverlay');

  hambBtn.classList.add('is-open');
  hambBtn.setAttribute('aria-expanded', 'true');
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  const hambBtn = document.getElementById('hamburgerBtn');
  const drawer  = document.getElementById('navDrawer');
  const overlay = document.getElementById('drawerOverlay');

  if (!drawer) return;
  hambBtn.classList.remove('is-open');
  hambBtn.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* =========================
   3. FOOTER
========================= */
function initFooter() {
  const form    = document.getElementById('footerNl');
  const success = document.getElementById('nlSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
}


/* =========================
   5. WHATSAPP
========================= */
function initWhatsApp() {
  const widget     = document.getElementById('waWidget');
  const fab        = document.getElementById('waFab');
  const panel      = document.getElementById('waPanel');
  const panelClose = document.getElementById('waPanelClose');
  const dismissBtn = document.getElementById('waDismiss');

  if (!widget || !fab) return;

  // Auto-open after 6s (once per session)
  if (!sessionStorage.getItem('wa-auto-opened')) {
    setTimeout(() => {
      openWaPanel();
      sessionStorage.setItem('wa-auto-opened', '1');
    }, 6000);
  }

  // FAB click: toggle panel
  fab.addEventListener('click', () => {
    const isOpen = panel.classList.contains('is-open');
    isOpen ? closeWaPanel() : openWaPanel();
  });

  // Panel header X: close panel only
  if (panelClose) panelClose.addEventListener('click', closeWaPanel);

  // Dismiss btn: close panel AND hide entire widget
  if (dismissBtn) dismissBtn.addEventListener('click', () => {
    closeWaPanel();
    // Fade out widget
    widget.style.transition = 'opacity 0.4s ease';
    widget.style.opacity = '0';
    setTimeout(() => {
      widget.style.display = 'none';
    }, 400);
    sessionStorage.setItem('wa-dismissed', '1');
  });

  // If previously dismissed in this session, hide it
  if (sessionStorage.getItem('wa-dismissed')) {
    widget.style.display = 'none';
  }
}

function openWaPanel() {
  const fab   = document.getElementById('waFab');
  const panel = document.getElementById('waPanel');
  if (!panel) return;
  panel.classList.add('is-open');
  fab.classList.add('panel-open');
}

function closeWaPanel() {
  const fab   = document.getElementById('waFab');
  const panel = document.getElementById('waPanel');
  if (!panel) return;
  panel.classList.remove('is-open');
  fab.classList.remove('panel-open');
}


/* ============================================
   BLOG.JS — ResinLux Studio Blog Page
   Order: Theme → Scroll Reveal → Counters → Form
============================================ */

'use strict';

/* ===== THEME ===== */
(function () {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll(
  '.fade-up, .fade-down, .fade-left, .fade-right, .fade-in, .fade-out'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ===== STAT COUNTERS ===== */
const countEls = document.querySelectorAll('.count[data-target]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const step = Math.ceil(target / (duration / 16));
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = target >= 1000
          ? (current / 1000).toFixed(current < target ? 1 : 0) + 'k'
          : current;
        if (current >= target) clearInterval(timer);
      }, 16);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

countEls.forEach((el) => counterObserver.observe(el));

/* ===== BAR RISE (trending chart) ===== */
const bars = document.querySelectorAll('.bar-rise');
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        barObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 }
);
bars.forEach((b) => {
  b.style.animationPlayState = 'paused';
  barObserver.observe(b);
});

/* ===== DRAW LINE (trending chart) ===== */
const lines = document.querySelectorAll('.draw-line');
const lineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        lineObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 }
);
lines.forEach((l) => {
  l.style.animationPlayState = 'paused';
  lineObserver.observe(l);
});

/* ===== NEWSLETTER FORM VALIDATION ===== */
const nlForm = document.getElementById('nlForm');
const nlSuccess = document.getElementById('nlSuccess');

if (nlForm) {
  nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameEl  = document.getElementById('nlName');
    const emailEl = document.getElementById('nlEmail');
    const nameErr  = document.getElementById('nlNameErr');
    const emailErr = document.getElementById('nlEmailErr');

    // Reset
    [nameEl, emailEl].forEach((el) => el.classList.remove('error'));
    nameErr.textContent = '';
    emailErr.textContent = '';

    // Name
    if (!nameEl.value.trim()) {
      nameEl.classList.add('error');
      nameErr.textContent = 'Please enter your first name.';
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailEl.value.trim()) {
      emailEl.classList.add('error');
      emailErr.textContent = 'Please enter your email address.';
      valid = false;
    } else if (!emailRegex.test(emailEl.value.trim())) {
      emailEl.classList.add('error');
      emailErr.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    if (!valid) {
      // Scroll to first error
      const firstErr = nlForm.querySelector('.error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Success
    nlForm.hidden = true;
    nlSuccess.hidden = false;
  });

  // Real-time clear
  ['nlName', 'nlEmail'].forEach((id) => {
    const el = document.getElementById(id);
    const err = document.getElementById(id + 'Err');
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        if (err) err.textContent = '';
      });
    }
  });
}

/* ===== VIDEO PLAY BTN (placeholder) ===== */
const playBtn = document.querySelector('.play-btn');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    // Replace with actual video modal / embed logic
    alert('Video player — integrate your preferred embed here.');
  });
}
