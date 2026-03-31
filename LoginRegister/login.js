(function () {
  'use strict';

  /* ---- Theme ---- */
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('rl-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  document.getElementById('themeBtn').addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('rl-theme', next);
  });

  /* ---- RTL ---- */
  document.getElementById('rtlBtn').addEventListener('click', () => {
    html.setAttribute('dir', html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
  });

  /* ---- Card Flip ---- */
  const wrapper = document.getElementById('cardWrapper');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');

  function showLogin() {
    wrapper.classList.remove('flipped');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  }
  function showRegister() {
    wrapper.classList.add('flipped');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
  }

  tabLogin.addEventListener('click', showLogin);
  tabRegister.addEventListener('click', showRegister);
  document.getElementById('goRegister').addEventListener('click', showRegister);
  document.getElementById('goLogin').addEventListener('click', showLogin);

  /* ---- Eye toggles ---- */
  document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.querySelector('.eye-open').style.display = isPass ? 'none' : 'block';
      btn.querySelector('.eye-closed').style.display = isPass ? 'block' : 'none';
    });
  });

  /* ---- Password Strength ---- */
  const regPass = document.getElementById('regPass');
  const bars = [document.getElementById('sb1'), document.getElementById('sb2'), document.getElementById('sb3'), document.getElementById('sb4')];
  const strengthLabel = document.getElementById('strengthLabel');
  const levels = ['', 'weak', 'fair', 'good', 'strong'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  regPass.addEventListener('input', () => {
    const v = regPass.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    bars.forEach((b, i) => {
      b.className = 'strength-bar';
      if (i < score) b.classList.add(levels[score]);
    });
    strengthLabel.textContent = v.length ? labels[score] : '';
  });

  /* ---- Validation helpers ---- */
  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErr(id) { setErr(id, ''); }
  function markField(inputEl, valid) {
    inputEl.classList.toggle('error-field', !valid);
  }

  /* ---- Login Validation ---- */
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPass');
    clearErr('loginEmailErr'); clearErr('loginPassErr');
    if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      setErr('loginEmailErr', 'Please enter a valid email.'); markField(email, false); ok = false;
    } else { markField(email, true); }
    if (pass.value.length < 6) {
      setErr('loginPassErr', 'Password must be at least 6 characters.'); markField(pass, false); ok = false;
    } else { markField(pass, true); }
    if (!ok) { loginForm.querySelector('.error-field').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    alert('Signed in successfully!');
  });

  /* ---- Register Validation ---- */
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const fn = document.getElementById('regFirstName');
    const ln = document.getElementById('regLastName');
    const em = document.getElementById('regEmail');
    const pw = document.getElementById('regPass');
    const cf = document.getElementById('regConfirm');
    const tc = document.getElementById('termsCheck');
    ['regFirstNameErr','regLastNameErr','regEmailErr','regPassErr','regConfirmErr','termsErr'].forEach(clearErr);
    if (!fn.value.trim()) { setErr('regFirstNameErr','First name is required.'); markField(fn,false); ok=false; } else markField(fn,true);
    if (!ln.value.trim()) { setErr('regLastNameErr','Last name is required.'); markField(ln,false); ok=false; } else markField(ln,true);
    if (!em.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value.trim())) { setErr('regEmailErr','Enter a valid email.'); markField(em,false); ok=false; } else markField(em,true);
    if (pw.value.length < 8) { setErr('regPassErr','Password must be at least 8 characters.'); markField(pw,false); ok=false; } else markField(pw,true);
    if (cf.value !== pw.value) { setErr('regConfirmErr','Passwords do not match.'); markField(cf,false); ok=false; } else markField(cf,true);
    if (!tc.checked) { setErr('termsErr','You must agree to the terms.'); ok=false; }
    if (!ok) { registerForm.querySelector('.error-field')?.scrollIntoView({ behavior:'smooth', block:'center' }); return; }
    alert('Account created successfully!');
  });

  /* ---- Particles ---- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -(Math.random() * 0.6 + 0.2),
      o: Math.random() * 0.4 + 0.1
    });
  }
  function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = html.getAttribute('data-theme') === 'dark';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(147,51,234,${p.o})` : `rgba(147,51,234,${p.o * 0.6})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    });
    requestAnimationFrame(animParticles);
  }
  animParticles();
})();
