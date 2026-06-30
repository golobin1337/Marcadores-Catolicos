/* ============================================================
   URGENCY BAR — compensate fixed height so content isn't hidden
   ============================================================ */
(function () {
  function applyBarOffset() {
    var bar = document.getElementById('urgency-bar');
    if (!bar) return;
    document.body.style.paddingTop = bar.offsetHeight + 'px';
  }
  applyBarOffset();
  window.addEventListener('resize', applyBarOffset);
})();

/* ============================================================
   DATE INJECTION
   ============================================================ */
(function () {
  var el = document.getElementById('today-date');
  if (!el) return;
  var now = new Date();
  el.textContent = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
})();

/* ============================================================
   COUNTDOWN TIMER
   Persists across page reloads via localStorage.
   Initialises at 9h 23m 30s, resets when expired.
   ============================================================ */
(function () {
  var INITIAL_SECONDS = 9 * 3600 + 23 * 60 + 30;
  var KEY = 'mrc_countdown_expiry';

  var stored = localStorage.getItem(KEY);
  var expiry;

  if (stored) {
    expiry = parseInt(stored, 10);
    if (isNaN(expiry) || expiry < Date.now()) {
      expiry = Date.now() + INITIAL_SECONDS * 1000;
      localStorage.setItem(KEY, expiry);
    }
  } else {
    expiry = Date.now() + INITIAL_SECONDS * 1000;
    localStorage.setItem(KEY, expiry);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var remaining = Math.max(0, expiry - Date.now());
    var el = document.getElementById('countdown');
    if (!el) return;

    var h = Math.floor(remaining / 3600000);
    var m = Math.floor((remaining % 3600000) / 60000);
    var s = Math.floor((remaining % 60000) / 1000);
    el.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);

    if (remaining === 0) {
      expiry = Date.now() + INITIAL_SECONDS * 1000;
      localStorage.setItem(KEY, expiry);
    }
  }

  tick();
  setInterval(tick, 1000);
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = this.closest('.faq-item');
    var isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(function (i) {
      i.classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

/* ============================================================
   SMOOTH SCROLL — offset accounts for fixed urgency bar
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var hash = this.getAttribute('href');
    if (hash === '#' || hash === '#checkout') return;
    var target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    var barH = (document.getElementById('urgency-bar') || { offsetHeight: 0 }).offsetHeight;
    var top = target.getBoundingClientRect().top + window.pageYOffset - barH - 10;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* ============================================================
   SCROLL REVEAL
   Uses IntersectionObserver to fade-in elements.
   ============================================================ */
(function () {
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================================
   URGENCY BAR — add shadow on scroll
   ============================================================ */
window.addEventListener('scroll', function () {
  var bar = document.getElementById('urgency-bar');
  if (!bar) return;
  bar.style.boxShadow = window.scrollY > 0
    ? '0 3px 16px rgba(0,0,0,.35)'
    : '0 2px 12px rgba(0,0,0,.3)';
}, { passive: true });
