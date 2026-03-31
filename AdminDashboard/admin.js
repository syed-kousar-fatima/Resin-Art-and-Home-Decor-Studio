/* ============================================
   ADMIN DASHBOARD — JavaScript
   ResinLux Studio
   ============================================ */

/* Theme */
(function () {
  var t = localStorage.getItem('adminTheme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ====== SECTION SWITCHING ====== */
  var navItems    = document.querySelectorAll('.adm-nav__item');
  var sections    = document.querySelectorAll('.adm-section');
  var topbarSub   = document.getElementById('topbarSub');

  window.switchSection = function (sectionId) {
    sections.forEach(function (s) { s.classList.remove('active'); });
    navItems.forEach(function (n) { n.classList.remove('active'); });
    var target = document.getElementById('sec-' + sectionId);
    if (target) target.classList.add('active');
    var navItem = document.querySelector('[data-section="' + sectionId + '"]');
    if (navItem) {
      navItem.classList.add('active');
      if (topbarSub) topbarSub.textContent = navItem.dataset.title || '';
    }
    closeSidebar();
    closeAllDropdowns();
    // Re-trigger animations
    if (target) {
      var animEls = target.querySelectorAll('.fade-up,.fade-left,.fade-right,.fade-in');
      animEls.forEach(function (el) {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = '';
      });
    }
  };

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      switchSection(item.dataset.section);
    });
  });

  /* ====== SIDEBAR ====== */
  var sidebar    = document.getElementById('admSidebar');
  var hamburger  = document.getElementById('admHamburger');
  var sideClose  = document.getElementById('sidebarClose');
  var overlay    = document.getElementById('admOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  if (sideClose) sideClose.addEventListener('click', closeSidebar);
  if (overlay)   overlay.addEventListener('click', closeSidebar);

  /* ====== THEME TOGGLE ====== */
  var themeBtn = document.getElementById('admThemeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next    = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('adminTheme', next);
      // Update appearance tab
      document.querySelectorAll('.theme-opt').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.themeOpt === next);
      });
    });
  }
  document.querySelectorAll('.theme-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.dataset.themeOpt;
      document.documentElement.setAttribute('data-theme', val);
      localStorage.setItem('adminTheme', val);
      document.querySelectorAll('.theme-opt').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
    });
  });

  /* ====== DROPDOWNS ====== */
  function closeAllDropdowns() {
    document.querySelectorAll('.adm-dropdown').forEach(function (d) { d.classList.remove('open'); });
  }
  function toggleDropdown(dropdown, btn) {
    var isOpen = dropdown.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      dropdown.classList.add('open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }
  var notifBtn = document.getElementById('notifBtn');
  var notifDD  = document.getElementById('notifDropdown');
  if (notifBtn) notifBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown(notifDD, notifBtn); });

  var profileBtn = document.getElementById('profileBtn');
  var profileDD  = document.getElementById('profileDropdown');
  if (profileBtn) profileBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown(profileDD, profileBtn); });

  document.addEventListener('click', closeAllDropdowns);
  document.querySelectorAll('.adm-dropdown').forEach(function (d) { d.addEventListener('click', function (e) { e.stopPropagation(); }); });

  /* Mark all notifications read */
  var markAllBtn = document.getElementById('markAllBtn');
  if (markAllBtn) markAllBtn.addEventListener('click', function () {
    document.querySelectorAll('.adm-notif-item.unread').forEach(function (el) { el.classList.remove('unread'); });
    var badge = document.getElementById('notifCount');
    if (badge) badge.textContent = '0';
    markAllBtn.textContent = 'All read';
  });

  /* ====== LOGOUT MODAL ====== */
  var logoutModal    = document.getElementById('logoutModal');
  var cancelLogout   = document.getElementById('cancelLogout');
  var confirmLogout  = document.getElementById('confirmLogout');
  var modalBackdrop  = document.getElementById('modalBackdrop');
  function openLogout() { if (logoutModal) { logoutModal.classList.add('open'); closeAllDropdowns(); } }
  function closeLogout() { if (logoutModal) logoutModal.classList.remove('open'); }
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', openLogout);
  var profileLogoutBtn = document.getElementById('profileLogoutBtn');
  if (profileLogoutBtn) profileLogoutBtn.addEventListener('click', function (e) { e.preventDefault(); openLogout(); });
  if (cancelLogout)  cancelLogout.addEventListener('click', closeLogout);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeLogout);
  if (confirmLogout) confirmLogout.addEventListener('click', function () {
    confirmLogout.textContent = 'Logging out...';
    setTimeout(function () {
      closeLogout();
      confirmLogout.textContent = 'Yes, Logout';
      alert('You have been logged out. Redirecting to login page...');
    }, 1200);
  });

  /* ====== KPI COUNTERS ====== */
  function countUp(el, target, prefix, suffix, dur) {
    prefix = prefix || ''; suffix = suffix || '';
    var val = 0, step = target / (dur / 16);
    function tick() {
      val = Math.min(val + step, target);
      el.textContent = prefix + Math.round(val).toLocaleString() + suffix;
      if (val < target) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var kpiRevenue  = document.getElementById('kpiRevenue');
  var kpiOrders   = document.getElementById('kpiOrders');
  var kpiUsers    = document.getElementById('kpiUsers');
  var kpiMessages = document.getElementById('kpiMessages');
  setTimeout(function () {
    if (kpiRevenue)  countUp(kpiRevenue, 8420, '\u00a3', '', 1400);
    if (kpiOrders)   countUp(kpiOrders, 47, '', '', 900);
    if (kpiUsers)    countUp(kpiUsers, 142, '', '', 1100);
    if (kpiMessages) countUp(kpiMessages, 12, '', '', 800);
  }, 300);

  /* ====== REVENUE BAR CHART ====== */
  function drawBarChart() {
    var svg = document.getElementById('revenueChart');
    if (!svg) return;
    var data = [
      { month: 'Oct', val: 5800 },
      { month: 'Nov', val: 7200 },
      { month: 'Dec', val: 9400 },
      { month: 'Jan', val: 6100 },
      { month: 'Feb', val: 7800 },
      { month: 'Mar', val: 8420 }
    ];
    var W = 520, H = 180, padL = 40, padB = 30, padT = 15, padR = 20;
    var chartW = W - padL - padR;
    var chartH = H - padB - padT;
    var maxVal = Math.max.apply(null, data.map(function (d) { return d.val; }));
    var barW = chartW / data.length * 0.5;
    var gap  = chartW / data.length;
    var html = '';
    // Grid lines
    for (var g = 0; g <= 4; g++) {
      var y = padT + (chartH / 4) * g;
      var v = Math.round(maxVal * (1 - g / 4));
      html += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="rgba(147,51,234,0.08)" stroke-width="1"/>';
      html += '<text x="' + (padL - 4) + '" y="' + (y + 4) + '" text-anchor="end" fill="var(--text-muted)" font-size="9">' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) + '</text>';
    }
    // Bars
    data.forEach(function (d, i) {
      var bH = (d.val / maxVal) * chartH;
      var x  = padL + gap * i + (gap - barW) / 2;
      var y  = padT + chartH - bH;
      var isLast = i === data.length - 1;
      html += '<rect class="chart-bar" x="' + x + '" y="' + (padT + chartH) + '" width="' + barW + '" height="0" rx="4" fill="' + (isLast ? 'var(--primary)' : 'rgba(147,51,234,0.35)') + '">';
      html += '<animate attributeName="y" from="' + (padT + chartH) + '" to="' + y + '" dur="0.8s" begin="' + (i * 0.1) + 's" fill="freeze" calcMode="spline" keySplines="0.34 1.56 0.64 1"/>';
      html += '<animate attributeName="height" from="0" to="' + bH + '" dur="0.8s" begin="' + (i * 0.1) + 's" fill="freeze" calcMode="spline" keySplines="0.34 1.56 0.64 1"/>';
      html += '</rect>';
      html += '<text x="' + (x + barW / 2) + '" y="' + (H - 8) + '" text-anchor="middle" fill="var(--text-muted)" font-size="10">' + d.month + '</text>';
      html += '<text x="' + (x + barW / 2) + '" y="' + (y - 5) + '" text-anchor="middle" fill="' + (isLast ? 'var(--primary)' : 'var(--text-muted)') + '" font-size="9" font-weight="' + (isLast ? '700' : '400') + '">' + (d.val >= 1000 ? '\u00a3' + (d.val / 1000).toFixed(1) + 'k' : '\u00a3' + d.val) + '</text>';
    });
    svg.innerHTML = html;
  }

  /* ====== DONUT CHART ====== */
  function drawDonut() {
    var svg = document.getElementById('donutChart');
    var legend = document.getElementById('donutLegend');
    if (!svg || !legend) return;
    var data = [
      { label: 'Commissions', val: 38, color: 'var(--primary)' },
      { label: 'Workshops',   val: 22, color: 'var(--secondary)' },
      { label: 'River Tables',val: 18, color: 'var(--amber)' },
      { label: 'Gifting',     val: 14, color: '#16a34a' },
      { label: 'Jewellery',   val: 8,  color: '#e53e3e' }
    ];
    var total = data.reduce(function (s, d) { return s + d.val; }, 0);
    var cx = 100, cy = 100, r = 70, ri = 46;
    var startAngle = -Math.PI / 2;
    var html = '';
    data.forEach(function (d) {
      var angle = (d.val / total) * Math.PI * 2;
      var endAngle = startAngle + angle;
      var x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
      var x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle);
      var ix1 = cx + ri * Math.cos(endAngle), iy1 = cy + ri * Math.sin(endAngle);
      var ix2 = cx + ri * Math.cos(startAngle), iy2 = cy + ri * Math.sin(startAngle);
      var large = angle > Math.PI ? 1 : 0;
      html += '<path d="M' + x1 + ' ' + y1 + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 + ' L' + ix1 + ' ' + iy1 + ' A' + ri + ' ' + ri + ' 0 ' + large + ' 0 ' + ix2 + ' ' + iy2 + ' Z" fill="' + d.color + '" opacity="0.85" style="transition:opacity 0.2s;cursor:pointer;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85"/>';
      startAngle = endAngle;
    });
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (ri - 6) + '" fill="var(--bg-card)"/>';
    html += '<text x="' + cx + '" y="' + (cy - 5) + '" text-anchor="middle" fill="var(--text)" font-size="11" font-weight="700">' + total + '%</text>';
    html += '<text x="' + cx + '" y="' + (cy + 10) + '" text-anchor="middle" fill="var(--text-muted)" font-size="8">Covered</text>';
    svg.innerHTML = html;
    legend.innerHTML = data.map(function (d) {
      return '<div class="donut-legend-item"><span class="donut-legend-dot" style="background:' + d.color + '"></span>' + d.label + ' (' + d.val + '%)</div>';
    }).join('');
  }

  /* ====== LINE CHART (Reports) ====== */
  function drawLineChart() {
    var svg = document.getElementById('lineChart');
    if (!svg) return;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var revenue = [5200,6100,7400,6800,8200,7600,9100,8800,10200,9600,11400,12840];
    var orders  = [18,22,28,24,30,27,35,33,41,38,45,52];
    var W = 760, H = 200, padL = 50, padB = 30, padT = 20, padR = 20;
    var chartW = W - padL - padR;
    var chartH = H - padB - padT;
    var maxR = Math.max.apply(null, revenue);
    var maxO = Math.max.apply(null, orders);
    var html = '';
    // Grid
    for (var g = 0; g <= 4; g++) {
      var y = padT + (chartH / 4) * g;
      html += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="rgba(147,51,234,0.08)" stroke-width="1"/>';
      html += '<text x="' + (padL - 5) + '" y="' + (y + 4) + '" text-anchor="end" fill="var(--text-muted)" font-size="9">' + (Math.round(maxR * (1 - g / 4) / 1000)) + 'k</text>';
    }
    // Points and lines
    var rPoints = revenue.map(function (v, i) {
      var x = padL + (i / (months.length - 1)) * chartW;
      var y = padT + chartH - (v / maxR) * chartH;
      return { x: x, y: y };
    });
    var oPoints = orders.map(function (v, i) {
      var x = padL + (i / (months.length - 1)) * chartW;
      var y = padT + chartH - (v / maxO) * chartH;
      return { x: x, y: y };
    });
    // Revenue area
    var areaPath = 'M' + rPoints.map(function (p) { return p.x + ' ' + p.y; }).join(' L') + ' L' + (W - padR) + ' ' + (padT + chartH) + ' L' + padL + ' ' + (padT + chartH) + ' Z';
    html += '<path d="' + areaPath + '" fill="var(--primary)" opacity="0.07"/>';
    // Revenue line
    var revLine = 'M' + rPoints.map(function (p) { return p.x + ' ' + p.y; }).join(' L');
    var lineLen = rPoints.reduce(function (acc, p, i) { if (i === 0) return 0; var pp = rPoints[i - 1]; return acc + Math.sqrt(Math.pow(p.x - pp.x, 2) + Math.pow(p.y - pp.y, 2)); }, 0);
    html += '<path d="' + revLine + '" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="' + lineLen + '" stroke-dashoffset="' + lineLen + '"><animate attributeName="stroke-dashoffset" from="' + lineLen + '" to="0" dur="1.5s" fill="freeze"/></path>';
    // Orders line
    var ordLine = 'M' + oPoints.map(function (p) { return p.x + ' ' + p.y; }).join(' L');
    html += '<path d="' + ordLine + '" fill="none" stroke="var(--secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="' + lineLen + '" stroke-dashoffset="' + lineLen + '" opacity="0.7"><animate attributeName="stroke-dashoffset" from="' + lineLen + '" to="0" dur="1.5s" begin="0.2s" fill="freeze"/></path>';
    // Points
    rPoints.forEach(function (p, i) {
      html += '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" fill="var(--primary)" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="' + (1.2 + i * 0.05) + 's" fill="freeze"/></circle>';
    });
    // Month labels
    months.forEach(function (m, i) {
      var x = padL + (i / (months.length - 1)) * chartW;
      html += '<text x="' + x + '" y="' + (H - 6) + '" text-anchor="middle" fill="var(--text-muted)" font-size="9">' + m + '</text>';
    });
    svg.innerHTML = html;
  }

  /* ====== CONTENT TABS ====== */
  var contentTabsWrap = document.getElementById('contentTabs');
  if (contentTabsWrap) {
    contentTabsWrap.querySelectorAll('.ctab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        contentTabsWrap.querySelectorAll('.ctab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.ctab-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('ctab-' + tab.dataset.ctab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ====== SETTINGS TABS ====== */
  var settingsTabsWrap = document.getElementById('settingsTabs');
  if (settingsTabsWrap) {
    settingsTabsWrap.querySelectorAll('.stab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        settingsTabsWrap.querySelectorAll('.stab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.stab-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('stab-' + tab.dataset.stab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ====== USER TABLE FILTER ====== */
  var roleTabs = document.getElementById('roleTabs');
  if (roleTabs) {
    roleTabs.querySelectorAll('.role-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        roleTabs.querySelectorAll('.role-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var role = tab.dataset.role;
        document.querySelectorAll('#usersTableBody tr').forEach(function (row) {
          row.style.display = (role === 'all' || row.dataset.role === role) ? '' : 'none';
        });
      });
    });
  }

  /* User search */
  var userSearch = document.getElementById('userSearch');
  if (userSearch) {
    userSearch.addEventListener('input', function () {
      var q = userSearch.value.toLowerCase();
      document.querySelectorAll('#usersTableBody tr').forEach(function (row) {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  /* ====== ORDER TABLE FILTER ====== */
  var orderTabs = document.getElementById('orderTabs');
  if (orderTabs) {
    orderTabs.querySelectorAll('.role-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        orderTabs.querySelectorAll('.role-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var status = tab.dataset.ostatus;
        document.querySelectorAll('#ordersTableBody tr').forEach(function (row) {
          row.style.display = (status === 'all' || row.dataset.ostatus === status) ? '' : 'none';
        });
      });
    });
  }

  /* Order search */
  var orderSearch = document.getElementById('orderSearch');
  if (orderSearch) {
    orderSearch.addEventListener('input', function () {
      var q = orderSearch.value.toLowerCase();
      document.querySelectorAll('#ordersTableBody tr').forEach(function (row) {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  /* ====== MESSAGES ====== */
  var msgData = {
    1: { name: 'Emily Knox', email: 'emily.k@email.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=44&q=80', subject: 'Re: Coaster Order #RL-2847', time: 'Saturday, 28 March 2026 at 09:40 AM', body: '<p>Hi there!</p><p>I wanted to follow up on my order for the Ocean Wave Coasters (Order #RL-2847). I placed the order on 28th March and I\'m wondering when I might expect delivery?</p><p>Also, would it be possible to include a personalised message card with the order? They\'re a gift for my sister\'s birthday.</p><p>Thank you so much for your help!</p><p>Best wishes,<br/>Emily</p>' },
    2: { name: 'Marcus Bell', email: 'marcus.b@email.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=44&q=80', subject: 'River Table Oak — Colour Consultation', time: 'Saturday, 28 March 2026 at 09:22 AM', body: '<p>Hi Priya,</p><p>The oak slab has arrived from the timber yard and it looks absolutely stunning. I\'m thinking deep teal and midnight blue for the resin river — similar to what we discussed in the initial consultation.</p><p>Can we schedule a colour consultation call this week? I\'m available Tuesday or Thursday afternoon.</p><p>Best,<br/>Marcus</p>' },
    3: { name: 'David Martin', email: 'david.m@email.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=44&q=80', subject: 'Corporate Gift Order — Annual Conference', time: 'Saturday, 28 March 2026 at 08:55 AM', body: '<p>Hello,</p><p>I\'m reaching out on behalf of Nexus Design Ltd regarding a corporate gift order for our annual conference in May. We\'d need approximately 12 personalised resin pieces — coasters or small desk art — with our company logo and brand colours (navy and gold).</p><p>Could you provide a quote and lead time? Budget is approximately \u00a3500 total.</p><p>Kind regards,<br/>David Martin<br/>Events Manager, Nexus Design Ltd</p>' },
    4: { name: 'Layla Hassan', email: 'layla.h@email.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=44&q=80', subject: 'Thank You — Beautiful Pendant!', time: 'Saturday, 28 March 2026 at 06:30 AM', body: '<p>Hi there,</p><p>I just wanted to send a quick thank you for the absolutely beautiful botanical pendant I received yesterday. The quality is exceptional and the botanical inclusions are perfectly preserved.</p><p>I\'ve received so many compliments already! I\'ll definitely be ordering again — perhaps a matching pair of earrings next time.</p><p>Warmly,<br/>Layla</p>' },
    5: { name: 'Sofia Reyes', email: 'sofia.r@email.com', avatar: null, subject: 'Studio Visit Enquiry — Bespoke Commission', time: 'Friday, 27 March 2026 at 04:15 PM', body: '<p>Dear ResinLux Team,</p><p>I would love to book a studio visit to discuss a bespoke commission for my new home. I\'m looking for a large-format abstract piece for my living room — approximately 90 x 60cm — in earthy tones with gold accents.</p><p>Would it be possible to visit the studio on a Saturday morning? I\'m available most weekends in April.</p><p>Looking forward to hearing from you,<br/>Sofia</p>' },
    6: { name: 'Tom Nguyen', email: 'tom.n@email.com', avatar: null, subject: 'Feature Wall Panels — Project Complete!', time: 'Thursday, 26 March 2026 at 11:45 AM', body: '<p>Hi Priya and the team,</p><p>I just wanted to share the wonderful feedback from our hotel clients regarding the feature wall panels. They genuinely exceeded all expectations — the clients were speechless when they first saw the installation.</p><p>We will definitely be recommending ResinLux for all future interior projects. Already have two enquiries lined up that I\'ll forward your way.</p><p>Thank you for the exceptional work!</p><p>Best,<br/>Tom</p>' }
  };

  window.openMessage = function (id) {
    var d = msgData[id];
    if (!d) return;
    document.querySelectorAll('.msg-item').forEach(function (el) { el.classList.remove('active'); });
    var item = document.querySelector('[data-msg="' + id + '"]');
    if (item) {
      item.classList.add('active');
      item.classList.remove('unread');
      var dot = item.querySelector('.msg-unread-dot');
      if (dot) dot.remove();
    }
    var av = document.getElementById('mvAvatar');
    if (av) { if (d.avatar) { av.src = d.avatar; av.style.display = 'block'; } else { av.style.display = 'none'; } }
    var nm = document.getElementById('mvName'); if (nm) nm.textContent = d.name;
    var em = document.getElementById('mvEmail'); if (em) em.textContent = d.email;
    var sb = document.getElementById('mvSubject'); if (sb) sb.textContent = d.subject;
    var ti = document.getElementById('mvTime'); if (ti) ti.textContent = d.time;
    var bd = document.getElementById('mvBody'); if (bd) bd.innerHTML = d.body;
    var viewer = document.getElementById('msgViewer');
    if (viewer) { viewer.style.display = 'flex'; viewer.style.flexDirection = 'column'; }
    // Update notification count
    var unreadCount = document.querySelectorAll('.msg-item.unread').length;
    var badge = document.getElementById('notifCount');
    if (badge) badge.textContent = unreadCount;
  };

  /* ====== CHARTS ON INIT ====== */
  drawBarChart();
  drawDonut();

  /* Redraw on section switch */
  var origSwitch = window.switchSection;
  window.switchSection = function (id) {
    origSwitch(id);
    if (id === 'reports') setTimeout(drawLineChart, 100);
    if (id === 'overview') {
      setTimeout(function () { drawBarChart(); drawDonut(); }, 100);
      setTimeout(function () {
        if (kpiRevenue)  countUp(kpiRevenue, 8420, '\u00a3', '', 1400);
        if (kpiOrders)   countUp(kpiOrders, 47, '', '', 900);
        if (kpiUsers)    countUp(kpiUsers, 142, '', '', 1100);
        if (kpiMessages) countUp(kpiMessages, 12, '', '', 800);
      }, 200);
    }
  };

  /* ====== KEYBOARD ESC ====== */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAllDropdowns(); closeLogout(); closeSidebar(); }
  });

});
