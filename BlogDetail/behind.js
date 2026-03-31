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


/* ========================================
   BEHIND THE STUDIO — Blog Detail JS
   ======================================== */

/* Theme persist */
(function () {
  var saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll Reveal ── */
  var revealEls = document.querySelectorAll(
    '.fade-up,.fade-down,.fade-left,.fade-right,.fade-in,.fade-out'
  );
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObs.observe(el); });

  /* ── Stat counters ── */
  function animateCounter(el, target, dur) {
    var val = 0;
    var step = target / (dur / 16);
    function tick() {
      val = Math.min(val + step, target);
      el.textContent = Math.round(val);
      if (val < target) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('.stat__num[data-target]');
  var cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.target, 10), 1400);
        cntObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { cntObs.observe(el); });

  /* ── Carousel ── */
  function initCarousel(trackId, prevId, nextId, dotsId) {
    var track   = document.getElementById(trackId);
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    var dotsWrap = document.getElementById(dotsId);
    if (!track) return;

    var slides  = Array.from(track.querySelectorAll('.carousel__slide'));
    var current = 0;
    var autoTimer;

    function visible() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 640)  return 2;
      return 1;
    }
    function maxIdx() { return Math.max(0, slides.length - visible()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      var total = maxIdx() + 1;
      for (var i = 0; i < total; i++) {
        (function (i) {
          var d = document.createElement('button');
          d.className = 'carousel__dot' + (i === 0 ? ' active' : '');
          d.setAttribute('aria-label', 'Slide ' + (i + 1));
          d.addEventListener('click', function () { goTo(i); resetAuto(); });
          dotsWrap.appendChild(d);
        })(i);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.carousel__dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIdx()));
      var w = slides[0].getBoundingClientRect().width;
      track.style.transform = 'translateX(-' + (current * w) + 'px)';
      updateDots();
    }

    function next() { goTo(current >= maxIdx() ? 0 : current + 1); }
    function prev() { goTo(current <= 0 ? maxIdx() : current - 1); }

    function startAuto() { autoTimer = setInterval(next, 4200); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    nextBtn.addEventListener('click', function () { next(); resetAuto(); });
    prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

    var tx = 0;
    track.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    });

    window.addEventListener('resize', function () { buildDots(); goTo(current); });
    buildDots();
    startAuto();
  }

  initCarousel('momentsTrack', 'momentsPrev', 'momentsNext', 'momentsDots');

  /* ── Studio Visit Form Validation ── */
  var form        = document.getElementById('visitForm');
  var formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  var fields = {
    name:   { el: document.getElementById('v-name'),   err: document.getElementById('err-name') },
    email:  { el: document.getElementById('v-email'),  err: document.getElementById('err-email') },
    phone:  { el: document.getElementById('v-phone'),  err: document.getElementById('err-phone') },
    date:   { el: document.getElementById('v-date'),   err: document.getElementById('err-date') },
    reason: { el: document.getElementById('v-reason'), err: document.getElementById('err-reason') },
    agree:  { el: document.getElementById('v-agree'),  err: document.getElementById('err-agree') }
  };

  function clearErr(f) {
    if (f.el) f.el.classList.remove('error');
    if (f.err) f.err.textContent = '';
  }
  function showErr(f, msg) {
    if (f.el) f.el.classList.add('error');
    if (f.err) f.err.textContent = msg;
  }

  Object.values(fields).forEach(function (f) {
    if (f.el) {
      f.el.addEventListener('input',  function () { clearErr(f); });
      f.el.addEventListener('change', function () { clearErr(f); });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    /* Name */
    if (!fields.name.el.value.trim()) {
      showErr(fields.name, 'Please enter your full name.'); ok = false;
    } else { clearErr(fields.name); }

    /* Email */
    var emailVal = fields.email.el.value.trim();
    var emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      showErr(fields.email, 'Please enter your email address.'); ok = false;
    } else if (!emailRe.test(emailVal)) {
      showErr(fields.email, 'Please enter a valid email address.'); ok = false;
    } else { clearErr(fields.email); }

    /* Phone */
    var phoneVal = fields.phone.el.value.trim();
    if (!phoneVal) {
      showErr(fields.phone, 'Please enter your phone number.'); ok = false;
    } else if (phoneVal.replace(/[\s\-\+\(\)]/g, '').length < 7) {
      showErr(fields.phone, 'Please enter a valid phone number.'); ok = false;
    } else { clearErr(fields.phone); }

    /* Date — must be present and in the future */
    var dateVal = fields.date.el.value;
    if (!dateVal) {
      showErr(fields.date, 'Please select a preferred visit date.'); ok = false;
    } else if (new Date(dateVal) <= new Date()) {
      showErr(fields.date, 'Please choose a future date.'); ok = false;
    } else { clearErr(fields.date); }

    /* Reason */
    if (!fields.reason.el.value) {
      showErr(fields.reason, 'Please select the purpose of your visit.'); ok = false;
    } else { clearErr(fields.reason); }

    /* Agree */
    if (!fields.agree.el.checked) {
      showErr(fields.agree, 'Please agree to our data policy to continue.'); ok = false;
    } else { clearErr(fields.agree); }

    if (!ok) {
      var firstErr = form.querySelector('.error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* Success */
    form.style.display = 'none';
    formSuccess.hidden = false;
  });

});
