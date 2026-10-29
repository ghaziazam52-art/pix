(function () {
  'use strict';

  /* ---------- Hero graphic: pixels rising from a forge line ---------- */
  var svg = document.getElementById('forge-art');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    var N = 14, STEP = 40, PAD = 0, parts = [];

    function el(name, attrs) {
      var node = document.createElementNS(NS, name);
      for (var k in attrs) node.setAttribute(k, attrs[k]);
      return node;
    }
    // deterministic pseudo-random so the artwork is identical on every load
    function hash(x, y) {
      var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return h - Math.floor(h);
    }

    svg.appendChild(el('rect', { class: 'frame', x: 0.5, y: 0.5, width: 559, height: 559 }));
    svg.appendChild(el('line', { class: 'guide', x1: 0, y1: 560, x2: 560, y2: 0 }));

    var order = 0;
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var p = Math.abs(x + y - (N - 1));            // distance from the rising diagonal
        var along = (x - y + (N - 1)) / (2 * (N - 1)); // 0 bottom-left .. 1 top-right
        var width = 1.2 + along * 4.2;                 // the band widens as it rises
        var v = 1 - p / width;
        if (v <= 0) continue;
        if (hash(x, y) > 0.35 + v * 0.65) continue;    // pixel dropout at the edges

        var hot = p === 0 && along > 0.58 && hash(y, x) > 0.35;
        var size = 12 + v * 20;
        var cx = PAD + x * STEP + STEP / 2 + 0;
        var cy = PAD + y * STEP + STEP / 2 + 0;
        var r = el('rect', {
          class: 'cell' + (hot ? ' hot' : ''),
          x: (cx - size / 2).toFixed(1),
          y: (cy - size / 2).toFixed(1),
          width: size.toFixed(1),
          height: size.toFixed(1)
        });
        var o = hot ? 1 : Math.max(0.14, v * 0.9);
        r.style.setProperty('--o', o.toFixed(2));
        r.style.animationDelay = (order * 0.012 + (1 - along) * 0.5).toFixed(2) + 's' + (hot ? ', ' + (1.6 + hash(x, y) * 2).toFixed(2) + 's' : '');
        svg.appendChild(r);
        order++;
      }
    }
  }

  /* ---------- Header state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function () { setMenu(false); });

  // Keep the mobile menu out of the tab order while it is closed
  function syncNavFocus() {
    var mobile = window.matchMedia('(max-width: 900px)').matches;
    var open = nav.classList.contains('open');
    nav.querySelectorAll('a').forEach(function (a) {
      a.tabIndex = mobile && !open ? -1 : 0;
    });
  }
  new MutationObserver(syncNavFocus).observe(nav, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', syncNavFocus);
  syncNavFocus();

  /* ---------- Reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (item, i) {
      // light stagger for siblings inside the same list
      var sib = Array.prototype.indexOf.call(item.parentElement.children, item);
      item.style.setProperty('--d', Math.min(sib, 4) * 0.08 + 's');
      io.observe(item);
    });
  } else {
    items.forEach(function (item) { item.classList.add('in'); });
  }

  /* ---------- Support modal ---------- */
  var modal = document.getElementById('support-modal');
  var openBtn = document.getElementById('open-support');
  var closeBtn = document.getElementById('close-support');
  var copyBtn = document.getElementById('copy-upi');
  var status = document.getElementById('copy-status');
  var copyTimer;

  function openModal() {
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.classList.add('locked');
  }
  function closeModal() {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    document.body.classList.remove('locked');
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  // Escape is handled natively by <dialog>; this keeps the scroll lock in sync
  modal.addEventListener('close', function () { document.body.classList.remove('locked'); });
  modal.addEventListener('cancel', function () { document.body.classList.remove('locked'); });
  // Click on the backdrop (the dialog element itself) closes it
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  // Fallback Escape for browsers without <dialog> support
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.hasAttribute('open') && typeof modal.showModal !== 'function') closeModal();
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function flash(ok) {
    clearTimeout(copyTimer);
    copyBtn.textContent = ok ? 'Copied' : 'Press Ctrl/Cmd + C';
    status.textContent = ok ? 'UPI ID copied to clipboard.' : 'Copy failed. Select the ID and copy it manually.';
    copyTimer = setTimeout(function () {
      copyBtn.textContent = 'Copy';
      status.textContent = '';
    }, 2200);
  }

  copyBtn.addEventListener('click', function () {
    var text = document.getElementById('upi-id').textContent.trim();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { flash(true); }, function () { flash(fallbackCopy(text)); });
    } else {
      flash(fallbackCopy(text));
    }
  });
})();
