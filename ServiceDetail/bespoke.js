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


/* =========================================================
   bespoke.js — ResinLux Studio
   Theme · Scroll Reveal · Carousel · Form
   ========================================================= */

(function () {
  'use strict';

  /* ── THEME ── */
  const saved = localStorage.getItem('rl-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute(
    'data-theme',
    saved || (prefersDark ? 'dark' : 'light')
  );

  /* ── SCROLL REVEAL ── */
  function initReveal() {
    const els = document.querySelectorAll(
      '.fade-up,.fade-down,.fade-left,.fade-right,.fade-in,.fade-out'
    );
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    els.forEach(el => io.observe(el));
  }

  /* ── HERO ENTRANCE ── */
  function heroEntrance() {
    setTimeout(() => {
      document.querySelectorAll(
        '.s-hero .fade-up,.s-hero .fade-down,.s-hero .fade-left,.s-hero .fade-right,.s-hero .fade-in'
      ).forEach(el => el.classList.add('revealed'));
    }, 120);
  }

  /* ── CAROUSEL ── */
  function initCarousel() {
    const track  = document.getElementById('carouselTrack');
    const dotsEl = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('cPrev');
    const nextBtn = document.getElementById('cNext');
    if (!track) return;

    const slides    = Array.from(track.querySelectorAll('.c-slide'));
    let current     = 0;
    let slidesPerView = getSlidesPerView();
    let maxIndex     = Math.max(0, slides.length - slidesPerView);

    function getSlidesPerView() {
      if (window.innerWidth <= 640)  return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    // Build dots
    function buildDots() {
      dotsEl.innerHTML = '';
      const dotCount = maxIndex + 1;
      for (let i = 0; i < dotCount; i++) {
        const d = document.createElement('button');
        d.className = 'cd-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', `Go to slide ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
      }
    }

    function updateDots() {
      dotsEl.querySelectorAll('.cd-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex));
      const slideW   = slides[0].offsetWidth + 24; // gap 1.5rem = 24px
      track.style.transform = `translateX(-${current * slideW}px)`;
      updateDots();
    }

    function prev() { goTo(current - 1); }
    function next() { goTo(current + 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Touch / swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        slidesPerView = getSlidesPerView();
        maxIndex = Math.max(0, slides.length - slidesPerView);
        current  = Math.min(current, maxIndex);
        buildDots();
        goTo(current);
      }, 200);
    });

    // Auto-play
    let autoplay = setInterval(() => {
      if (current >= maxIndex) goTo(0);
      else next();
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => {
        if (current >= maxIndex) goTo(0);
        else next();
      }, 5000);
    });

    buildDots();
    goTo(0);
  }

  /* ── ORDER FORM ── */
  function initForm() {
    const form    = document.getElementById('orderForm');
    const success = document.getElementById('orderSuccess');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('of-name');
      const email   = document.getElementById('of-email');
      const pkg     = document.getElementById('of-package');
      let valid = true;

      [name, email, pkg].forEach(el => {
        if (!el.value.trim() || (el.type === 'email' && !el.value.includes('@'))) {
          el.style.borderColor = '#e11d48';
          valid = false;
        } else {
          el.style.borderColor = '';
        }
      });

      if (!valid) return;
      form.style.display    = 'none';
      if (success) success.removeAttribute('hidden');
    });
  }

  /* ── PRICING CARD HOVER TILT ── */
  function initPricingTilt() {
    if (window.matchMedia('(hover:none)').matches) return;
    document.querySelectorAll('.price-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        const base = card.classList.contains('price-card--featured') ? 'scale(1.03)' : '';
        card.style.transform = `${base} translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = card.classList.contains('price-card--featured') ? 'scale(1.03)' : '';
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    heroEntrance();
    initReveal();
    initCarousel();
    initForm();
    initPricingTilt();
  });

})();
