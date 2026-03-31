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


/* =======================================
   RESIN TIPS & TRICKS — Blog Detail JS
   ======================================= */

/* ── Theme ── */
(function () {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll(
    '.fade-up, .fade-down, .fade-left, .fade-right, .fade-in, .fade-out'
  );

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ── Stat counters (hero) ── */
  function animateCounter(el, target, duration) {
    var start = 0;
    var step = target / (duration / 16);
    var raf;
    function tick() {
      start = Math.min(start + step, target);
      el.textContent = Math.round(start);
      if (start < target) { raf = requestAnimationFrame(tick); }
    }
    raf = requestAnimationFrame(tick);
  }

  var counterEls = document.querySelectorAll('.stat__num[data-target]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        animateCounter(el, parseInt(el.dataset.target, 10), 1200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(function (el) { counterObserver.observe(el); });

  /* ── Carousel (Techniques) ── */
  function initCarousel(trackId, prevId, nextId, dotsId) {
    var track = document.getElementById(trackId);
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    var dotsContainer = document.getElementById(dotsId);
    if (!track) return;

    var slides = track.querySelectorAll('.carousel__slide');
    var currentIndex = 0;
    var visibleCount = getVisible();
    var autoPlay;

    function getVisible() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    }

    function totalSlides() { return slides.length; }

    function maxIndex() { return Math.max(0, totalSlides() - getVisible()); }

    function buildDots() {
      dotsContainer.innerHTML = '';
      var count = maxIndex() + 1;
      for (var i = 0; i < count; i++) {
        (function (i) {
          var dot = document.createElement('button');
          dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function () { goTo(i); });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    function updateDots() {
      var dots = dotsContainer.querySelectorAll('.carousel__dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      visibleCount = getVisible();
      currentIndex = Math.max(0, Math.min(index, maxIndex()));
      var slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
      updateDots();
    }

    function next() { goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1); }
    function prev() { goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1); }

    nextBtn.addEventListener('click', function () { next(); resetAuto(); });
    prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

    function startAuto() { autoPlay = setInterval(next, 4000); }
    function resetAuto() { clearInterval(autoPlay); startAuto(); }

    /* Touch swipe */
    var touchStart = 0;
    track.addEventListener('touchstart', function (e) { touchStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
      if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
    });

    /* Resize */
    window.addEventListener('resize', function () { buildDots(); goTo(currentIndex); });

    buildDots();
    startAuto();
  }

  initCarousel('techniquesTrack', 'techniquesPrev', 'techniquesNext', 'techniquesDots');

  /* ── Mistake Accordion ── */
  var accordion = document.getElementById('mistakeAccordion');
  if (accordion) {
    accordion.querySelectorAll('.mistake-item__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        /* Close all */
        accordion.querySelectorAll('.mistake-item__btn').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
        });
        accordion.querySelectorAll('.mistake-item__body').forEach(function (body) {
          body.classList.remove('open');
        });
        /* Open clicked if it was closed */
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          btn.nextElementSibling.classList.add('open');
        }
      });
    });
  }

  /* ── Subscribe Form Validation ── */
  var form = document.getElementById('subscribeForm');
  var formCard = document.getElementById('formCard');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    var fields = {
      name: { el: document.getElementById('sub-name'), err: document.getElementById('err-name') },
      email: { el: document.getElementById('sub-email'), err: document.getElementById('err-email') },
      level: { el: document.getElementById('sub-level'), err: document.getElementById('err-level') },
      agree: { el: document.getElementById('sub-agree'), err: document.getElementById('err-agree') }
    };

    function clearError(field) {
      field.el.classList.remove('error');
      field.err.textContent = '';
    }

    function showError(field, msg) {
      field.el.classList.add('error');
      field.err.textContent = msg;
    }

    Object.values(fields).forEach(function (f) {
      f.el.addEventListener('input', function () { clearError(f); });
      f.el.addEventListener('change', function () { clearError(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      /* Name */
      if (!fields.name.el.value.trim()) {
        showError(fields.name, 'Please enter your full name.');
        valid = false;
      } else { clearError(fields.name); }

      /* Email */
      var emailVal = fields.email.el.value.trim();
      var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showError(fields.email, 'Please enter your email address.');
        valid = false;
      } else if (!emailReg.test(emailVal)) {
        showError(fields.email, 'Please enter a valid email address.');
        valid = false;
      } else { clearError(fields.email); }

      /* Level */
      if (!fields.level.el.value) {
        showError(fields.level, 'Please select your experience level.');
        valid = false;
      } else { clearError(fields.level); }

      /* Agree */
      if (!fields.agree.el.checked) {
        showError(fields.agree, 'You must agree to receive emails to subscribe.');
        valid = false;
      } else { clearError(fields.agree); }

      if (!valid) {
        /* Scroll to first error */
        var firstError = form.querySelector('.error');
        if (firstError) { firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }

      /* Success */
      form.style.display = 'none';
      formSuccess.hidden = false;
    });
  }

});
