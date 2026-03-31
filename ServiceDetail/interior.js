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
   installations.js — ResinLux Studio
   Theme · Scroll Reveal · Carousel · Form Validation
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
    }, { threshold: 0.13 });
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
    const track   = document.getElementById('carouselTrack');
    const dotsEl  = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('cPrev');
    const nextBtn = document.getElementById('cNext');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.c-slide'));
    let current = 0;

    function getSPV() {
      if (window.innerWidth <= 640)  return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    let spv = getSPV();
    let maxIndex = Math.max(0, slides.length - spv);

    function buildDots() {
      dotsEl.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const d = document.createElement('button');
        d.className = 'cd-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
      }
    }

    function updateDots() {
      dotsEl.querySelectorAll('.cd-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(i) {
      current = Math.max(0, Math.min(i, maxIndex));
      const slideW = slides[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * slideW}px)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        spv = getSPV();
        maxIndex = Math.max(0, slides.length - spv);
        current  = Math.min(current, maxIndex);
        buildDots();
        goTo(current);
      }, 200);
    });

    let ap = setInterval(() => goTo(current >= maxIndex ? 0 : current + 1), 5500);
    track.addEventListener('mouseenter', () => clearInterval(ap));
    track.addEventListener('mouseleave', () => {
      ap = setInterval(() => goTo(current >= maxIndex ? 0 : current + 1), 5500);
    });

    buildDots();
    goTo(0);
  }

  /* ── FORM VALIDATION ── */
  function initForm() {
    const form    = document.getElementById('instForm');
    const success = document.getElementById('instSuccess');
    if (!form) return;

    function setError(inputId, errId, msg) {
      const el  = document.getElementById(inputId);
      const err = document.getElementById(errId);
      if (!el || !err) return;
      if (msg) {
        el.classList.add('is-error');
        err.textContent = msg;
        return false;
      }
      el.classList.remove('is-error');
      err.textContent = '';
      return true;
    }

    form.querySelectorAll('input, select, textarea').forEach(el => {
      ['input', 'change'].forEach(ev => {
        el.addEventListener(ev, () => {
          el.classList.remove('is-error');
          const errEl = document.getElementById(el.id + '-err');
          if (errEl) errEl.textContent = '';
        });
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      /* Name */
      const name = document.getElementById('if-name');
      if (!name.value.trim()) {
        setError('if-name', 'if-name-err', 'Please enter your full name.');
        valid = false;
      } else { setError('if-name', 'if-name-err', ''); }

      /* Email */
      const email = document.getElementById('if-email');
      if (!email.value.trim()) {
        setError('if-email', 'if-email-err', 'Please enter your email address.');
        valid = false;
      } else if (!emailRx.test(email.value)) {
        setError('if-email', 'if-email-err', 'Please enter a valid email address.');
        valid = false;
      } else { setError('if-email', 'if-email-err', ''); }

      /* Phone */
      const phone = document.getElementById('if-phone');
      if (!phone.value.trim()) {
        setError('if-phone', 'if-phone-err', 'Please enter a contact phone number.');
        valid = false;
      } else { setError('if-phone', 'if-phone-err', ''); }

      /* Project Type */
      const type = document.getElementById('if-type');
      if (!type.value) {
        setError('if-type', 'if-type-err', 'Please select a project type.');
        valid = false;
      } else { setError('if-type', 'if-type-err', ''); }

      /* Sector */
      const sector = document.getElementById('if-sector');
      if (!sector.value) {
        setError('if-sector', 'if-sector-err', 'Please select a space type.');
        valid = false;
      } else { setError('if-sector', 'if-sector-err', ''); }

      /* Location */
      const location = document.getElementById('if-location');
      if (!location.value.trim() || location.value.trim().length < 3) {
        setError('if-location', 'if-location-err', 'Please enter your location or postcode.');
        valid = false;
      } else { setError('if-location', 'if-location-err', ''); }

      /* Brief */
      const brief = document.getElementById('if-brief');
      if (!brief.value.trim() || brief.value.trim().length < 20) {
        setError('if-brief', 'if-brief-err', 'Please describe your project (at least 20 characters).');
        valid = false;
      } else { setError('if-brief', 'if-brief-err', ''); }

      /* Agree */
      const agree    = document.getElementById('if-agree');
      const agreeErr = document.getElementById('if-agree-err');
      if (!agree.checked) {
        if (agreeErr) agreeErr.textContent = 'You must agree to be contacted to submit this enquiry.';
        valid = false;
      } else {
        if (agreeErr) agreeErr.textContent = '';
      }

      if (!valid) {
        const firstErr = form.querySelector('.is-error');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      form.style.display = 'none';
      if (success) success.removeAttribute('hidden');
    });
  }

  /* ── PRICING TILT ── */
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
