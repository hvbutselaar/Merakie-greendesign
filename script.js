/* MERAKI green design — shared behaviour: mobile nav, project filter, lightbox, contact form */
(function () {
  'use strict';

  /* ---- hero typewriter (loops "SOUL. CREATIVITY. LOVE." like the live site) ---- */
  var typedEl = document.getElementById('typed');
  if (typedEl) {
    var words = (typedEl.getAttribute('data-words') || '').split('|').filter(Boolean);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (words.length && !reduce) {
      var wi = 0, ci = 0, deleting = false;
      var TYPE = 110, ERASE = 55, HOLD = 1600, GAP = 500;
      var tick = function () {
        var w = words[wi];
        if (!deleting) {
          ci++;
          typedEl.textContent = w.slice(0, ci);
          if (ci >= w.length) { deleting = true; return setTimeout(tick, HOLD); }
        } else {
          ci--;
          typedEl.textContent = w.slice(0, ci);
          if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, GAP); }
        }
        setTimeout(tick, deleting ? ERASE : TYPE);
      };
      setTimeout(tick, GAP);
    } else if (words.length) {
      typedEl.textContent = words[0]; // reduced-motion: show final text, no animation
    }
  }

  /* ---- mobile nav toggle ---- */
  var burger = document.querySelector('.hamburger');
  var mobile = document.querySelector('.mobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      mobile.classList.toggle('open');
    });
  }

  /* ---- project category filter (projecten.html) ---- */
  var bar = document.querySelector('.filterbar');
  if (bar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.pgrid .pcard'));
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      bar.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      cards.forEach(function (c) {
        var show = cat === 'all' || c.getAttribute('data-category') === cat;
        c.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---- gallery lightbox (project detail pages) ---- */
  var gallery = document.getElementById('gallery');
  var lb = document.getElementById('lightbox');
  if (gallery && lb) {
    var imgs = Array.prototype.slice.call(gallery.querySelectorAll('img'));
    var lbImg = lb.querySelector('img');
    var idx = 0;
    function show(i) { idx = (i + imgs.length) % imgs.length; lbImg.src = imgs[idx].src; lbImg.alt = imgs[idx].alt; }
    function open(i) { show(i); lb.classList.add('open'); }
    function close() { lb.classList.remove('open'); }
    imgs.forEach(function (im, i) { im.addEventListener('click', function () { open(i); }); });
    lb.querySelector('.close').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---- contact form submit (Moerman pattern → contact-mail.php) ---- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var conf = document.getElementById('confirm');
      btn.disabled = true;
      btn.textContent = 'Bezig…';
      fetch('/contact-mail.php', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.ok) {
            conf.className = 'confirm ok show';
            conf.textContent = 'Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.';
            form.reset();
            btn.textContent = 'Verzonden';
          } else {
            conf.className = 'confirm err show';
            conf.textContent = 'Er ging iets mis. Bel of mail me gerust op marieke@meraki-greendesign.nl.';
            btn.disabled = false;
            btn.textContent = 'Verzenden';
          }
        })
        .catch(function () {
          conf.className = 'confirm err show';
          conf.textContent = 'Geen verbinding. Probeer het later opnieuw of mail marieke@meraki-greendesign.nl.';
          btn.disabled = false;
          btn.textContent = 'Verzenden';
        });
    });
  }
})();
