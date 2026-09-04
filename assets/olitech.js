/* ==========================================================================
   OlitechGames site script
   One file for every page. Handles: mobile menu, download countdown,
   reading progress, skip link.

   The download countdown reads its per-page data from the markup, so this
   file never needs editing when you add a new game page. See the comment
   above initDownload() for the markup it expects.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------- skip link --- */
  function initSkipLink() {
    var main = document.querySelector('main');
    if (!main) return;
    if (!main.id) main.id = 'main-content';
    var a = document.createElement('a');
    a.className = 'skip-link';
    a.href = '#' + main.id;
    a.textContent = 'Skip to content';
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* -------------------------------------------------------- mobile menu --- */
  function initMenu() {
    var burger = document.getElementById('hamburgerBtn');
    var overlay = document.getElementById('mobileMenuOverlay');
    var closeBtn = document.getElementById('closeMenuBtn');
    if (!burger || !overlay) return;

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'mobileMenuOverlay');
    if (!burger.getAttribute('aria-label')) burger.setAttribute('aria-label', 'Open menu');

    function open() {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded', 'true');
      var first = overlay.querySelector('a, button');
      if (first) first.focus();
    }
    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }

    burger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760 && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------- reading progress --- */
  function initProgress() {
    var article = document.querySelector('.article-content');
    var header = document.querySelector('.site-header');
    if (!article || !header) return;

    var bar = document.createElement('div');
    bar.className = 'read-progress';
    header.appendChild(bar);

    function update() {
      var top = article.getBoundingClientRect().top + window.scrollY;
      var span = article.offsetHeight - window.innerHeight;
      var p = (window.scrollY - top) / (span > 0 ? span : 1);
      bar.style.width = Math.max(0, Math.min(1, p)) * 100 + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------- download countdown ---
     Expected markup (generated on every game page):

       <div class="download-module" id="downloadModule"
            data-game="Dream League Soccer 2026"
            data-packaging="10" data-ready="10" data-countdown="10">
         <button id="startDownloadTrigger" class="trigger-download-btn">…</button>
         <div id="countdownArea" hidden></div>
         <div class="download-ready" hidden>
           <div class="final-buttons"><a class="final-btn" href="…">…</a></div>
           <div class="security-badge">…</div>
         </div>
       </div>

     To change the wait for the whole site, edit the three defaults below.
     To change it for one page only, edit that page's data- attributes.
  ------------------------------------------------------------------------- */
  function initDownload() {
    var mod = document.getElementById('downloadModule');
    if (!mod) return;
    var btn = document.getElementById('startDownloadTrigger');
    var area = document.getElementById('countdownArea');
    var ready = mod.querySelector('.download-ready');
    if (!btn || !area || !ready) return;

    var game = mod.getAttribute('data-game') || 'your file';
    var tPack = parseInt(mod.getAttribute('data-packaging'), 10) || 10;
    var tReady = parseInt(mod.getAttribute('data-ready'), 10) || 10;
    var tCount = parseInt(mod.getAttribute('data-countdown'), 10) || 10;
    var timer = null;

    function stage(icon, message, digits) {
      area.innerHTML =
        '<div class="countdown-stage">' +
        '<div class="status-message"><i class="fas ' + icon + '"></i> ' + message + '</div>' +
        (digits ? '<div class="timer-digits">' + digits + '</div>' : '') +
        '</div>';
      return area.querySelector('.countdown-stage');
    }

    function packaging() {
      stage('fa-cog fa-spin', 'Packaging ' + game + ' files on the secure server');
      timer = setTimeout(preparing, tPack * 1000);
    }
    function preparing() {
      stage('fa-cog fa-spin', 'Files ready. Opening the download gateway');
      timer = setTimeout(counting, tReady * 1000);
    }
    function counting() {
      var n = tCount;
      (function tick() {
        stage('fa-clock', 'Your download link appears in', n + 's');
        if (n === 0) return finish();
        n--;
        timer = setTimeout(tick, 1000);
      })();
    }
    function finish() {
      var box = stage('fa-check-circle', 'Download ready. File tested and verified');
      ready.hidden = false;
      box.appendChild(ready);
      btn.disabled = false;
      var link = ready.querySelector('.final-btn');
      if (link) link.focus();
    }

    btn.addEventListener('click', function () {
      if (timer) clearTimeout(timer);
      btn.disabled = true;
      area.hidden = false;
      packaging();
    });
  }

  /* ----------------------------------------------------------------- go --- */
  function boot() {
    initSkipLink();
    initMenu();
    initProgress();
    initDownload();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
