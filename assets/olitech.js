/* ==========================================================================
   OlitechGames site script
   One file for every page. Handles: mobile menu, download countdown,
   reading progress, skip link, game ad popup.

   The download countdown reads its per-page data from the markup, so this
   file never needs editing when you add a new game page. See the comment
   above initDownload() for the markup it expects.

   The game ad popup is configured in AD_CONFIG directly below. It builds
   its own markup, so no HTML file ever has to be touched for it.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     AD_CONFIG - the only block you edit to change the game ad popup.
     The look of the popup lives in section 12 of olitech.css.
     ====================================================================== */
  var AD_CONFIG = {

    /* Master switch. Set to false to turn the popup off site-wide. */
    enabled: true,

    /* Seconds to wait after the page is ready before the popup appears. */
    delaySeconds: 8,

    /* Both buttons point here. */
    playUrl: 'https://play.google.com/store/apps/details?id=com.ziphynet.app',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.ziphynet.app',

    /* Button captions. Play and Download sit side by side on one row,
       Cancel sits on its own row underneath them. */
    playLabel: 'Play Game',
    downloadLabel: 'Download Game',
    cancelLabel: 'Cancel',

    /* Wording on the card. */
    headline: 'Play ZiphyNet Now',
    text: 'Jump straight into the action. Install ZiphyNet free on Google Play and start playing in seconds.',

    /* How often one visitor sees it:
         'always'  - every page load (what the site does now)
         'session' - once per browser session
         a number  - once every N hours, e.g. 6 or 24                      */
    showEvery: 'always',

    /* Up to five creatives. One is picked at random per page load and is
       downloaded during the delay above, so it is ready before it shows.
         image: { type: 'image', src: '...', alt: '...' }
         video: { type: 'video', src: '...', poster: '...' }
       Videos autoplay muted and loop, which is the only form of autoplay
       mobile browsers allow. A poster makes the first frame appear
       instantly, so add one where you can.                               */
    creatives: [
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/f07bcb9f-0ad3-478c-a1f8-864363769d31.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/f6e53b5b-9404-4abf-b9e0-e5895d8f18ea.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/510b2277-4cfa-43b8-a58c-2848cc48b357.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/767873da-0d58-45ec-b08a-7a578fe41755.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/2efe389d-43dc-4156-b5e9-29ed771c2177.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/e04ff926-40e0-4044-aa80-637d136abf13.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/8d0376e8-9939-4b59-b38e-4694d0e3303e.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/c69ef6eb-570d-43ee-a499-5ee5dc51a1af.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/65214fd7-7f1e-4b6d-9bf5-baaa33036109.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/8b24abee-8617-47bd-a035-9bc4d53b746e.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/e94788fa-85bd-4b33-8c28-e59137b69ac0.jpg', alt: 'ZiphyNet game' },
      { type: 'image', src: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/e377e5f6-7090-427b-a8f3-e0f1df5d1341.jpg', alt: 'ZiphyNet game' },
      { type: 'video', src: 'https://example.com/ads/ziphy-1.mp4',  poster: 'https://gamehub-backend.shotavixofficial.workers.dev/api/r2/gamehub/8b24abee-8617-47bd-a035-9bc4d53b746e.jpg' }
    ]
  };
  /* ==================== end of the block you edit ======================= */


  /* ======================================================================
     DOWNLOAD_CONFIG - the subscribe gate on the download pages.
     Flow: GENERATE DOWNLOAD LINK -> reader returns from the ad tab ->
     subscribe step -> countdown -> real download link.
     The look lives in section 7 of olitech.css.
     ====================================================================== */
  var DOWNLOAD_CONFIG = {

    /* Channel link. sub_confirmation=1 pops the subscribe dialog open. */
    youtubeUrl: 'https://www.youtube.com/@ziphynet?sub_confirmation=1',

    /* Seconds to wait after the subscribe button is clicked. */
    countdownSeconds: 15,

    /* Safety net. If the ad tab never opened (popup blocker) the page never
       goes hidden, so nothing would bring the reader back. After this many
       seconds we show the subscribe step anyway rather than dead-ending. */
    returnFallbackSeconds: 20,

    /* Set true to ask only once per visit: after a reader has clicked
       subscribe on any page, other download pages skip straight to the
       link. False asks again on every download page.                      */
    rememberSubscribe: false,

    /* Wording. */
    waitingText: 'Finish the step in the new tab, then come back here to continue.',
    subscribeHeading: 'One last step',
    subscribeText: 'Subscribe to our YouTube channel to unlock this download. Tap the button, subscribe, then come back to this page.',
    subscribeLabel: 'SUBSCRIBE ON YOUTUBE',
    countdownText: 'Thanks! Your download link appears in',
    readyText: 'Download ready. File tested and verified'
  };
  /* ==================== end of the block you edit ======================= */

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

  /* --------------------------------------------------- download gateway ---
     Four steps, in order:

       1 idle   GENERATE DOWNLOAD LINK is showing. It is an <a target="_blank">
                that opens the direct link ad. We do not touch that navigation.
       2 await  The ad tab is open. As soon as this page is looked at again,
                we move to step 3. A fallback timer also moves us on in case
                the popup was blocked and the page never went hidden, so the
                reader can never dead-end here.
       3 sub    Subscribe instruction + the YouTube button. Clicking it opens
                the channel AND starts the countdown at the same moment.
       4 count  Counts down, then reveals the real download link.

     Progress is kept in sessionStorage against the page path. Phones often
     discard a background tab while the reader is on YouTube, and without
     this they would come back to a reloaded page and have to start over.

     The countdown works off a saved timestamp rather than counting ticks,
     because browsers throttle timers in hidden tabs - a plain setInterval
     would run slow, or barely at all, for the whole time the reader is away.

     Wording, the channel URL and the wait are all in DOWNLOAD_CONFIG at the
     top of this file. The old data-packaging / data-ready / data-countdown
     attributes on the page markup are no longer read; they are harmless
     leftovers and need not be removed.
  ------------------------------------------------------------------------- */
  function initDownload() {
    var mod = document.getElementById('downloadModule');
    if (!mod) return;
    var btn = document.getElementById('startDownloadTrigger');
    var area = document.getElementById('countdownArea');
    var ready = mod.querySelector('.download-ready');
    if (!btn || !area || !ready) return;

    var D = DOWNLOAD_CONFIG;
    var KEY = 'olitech-dl:' + location.pathname;
    var SUB_KEY = 'olitech-subscribed';
    var state = loadState();
    var ticker = null;
    var fallback = null;

    function loadState() {
      try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; }
      catch (e) { return {}; }
    }
    function saveState() {
      try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }
    function alreadySubscribed() {
      if (!D.rememberSubscribe) return false;
      try { return sessionStorage.getItem(SUB_KEY) === '1'; } catch (e) { return false; }
    }

    /* Replaces whatever is in the panel with one status card. */
    function stage(icon, message, digits) {
      area.hidden = false;
      area.innerHTML =
        '<div class="countdown-stage">' +
        '<div class="status-message"><i class="fas ' + icon + '"></i> ' + message + '</div>' +
        (digits ? '<div class="timer-digits">' + digits + '</div>' : '') +
        '</div>';
      return area.querySelector('.countdown-stage');
    }

    function msLeft() {
      var total = (D.countdownSeconds || 15) * 1000;
      return Math.max(0, state.subAt + total - Date.now());
    }

    function stopTicker() {
      if (ticker) { clearInterval(ticker); ticker = null; }
    }

    /* ----- step 2: waiting for the reader to come back from the ad ----- */
    function showWaiting() {
      stage('fa-external-link-alt', D.waitingText);
    }

    /* ----- step 3: the subscribe gate ----- */
    function showSubscribe() {
      btn.hidden = true;
      area.hidden = false;
      area.innerHTML =
        '<div class="subscribe-gate">' +
        '<h4><i class="fab fa-youtube"></i> ' + D.subscribeHeading + '</h4>' +
        '<p>' + D.subscribeText + '</p>' +
        '</div>';

      var a = document.createElement('a');
      a.className = 'subscribe-btn';
      a.href = D.youtubeUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = '<i class="fab fa-youtube"></i> ' + D.subscribeLabel;
      /* The click opens YouTube by itself; we only start the clock. */
      a.addEventListener('click', function () {
        try { sessionStorage.setItem(SUB_KEY, '1'); } catch (e) {}
        state.step = 'count';
        state.subAt = Date.now();
        saveState();
        startCount();
      });
      area.querySelector('.subscribe-gate').appendChild(a);
      a.focus();
    }

    /* ----- step 4: countdown, then the real link ----- */
    function startCount() {
      stopTicker();
      paint();
      ticker = setInterval(paint, 500);

      function paint() {
        var left = msLeft();
        if (left <= 0) { stopTicker(); return finish(); }
        stage('fa-clock', D.countdownText, Math.ceil(left / 1000) + 's');
      }
    }

    function finish() {
      stopTicker();
      btn.hidden = true;
      state.step = 'done';
      saveState();
      var box = stage('fa-check-circle', D.readyText);
      ready.hidden = false;
      box.appendChild(ready);
      var link = ready.querySelector('.final-btn');
      if (link) link.focus();
    }

    /* ----- moving between steps ----- */
    function toSubscribe() {
      if (fallback) { clearTimeout(fallback); fallback = null; }
      if (alreadySubscribed()) {          /* subscribed earlier this visit */
        state.step = 'count';
        state.subAt = state.subAt || 0;   /* 0 means the wait is already up */
        saveState();
        return finish();
      }
      state.step = 'sub';
      saveState();
      showSubscribe();
    }

    function armFallback() {
      if (fallback) clearTimeout(fallback);
      fallback = setTimeout(function () {
        if (state.step === 'await') toSubscribe();
      }, (D.returnFallbackSeconds || 20) * 1000);
    }

    /* Draw whatever step we are on. Called on load too, so a reader who
       comes back to a reloaded page lands where they left off. */
    function render() {
      switch (state.step) {
        case 'await': showWaiting(); armFallback(); break;
        case 'sub':   showSubscribe(); break;
        case 'count': startCount(); break;
        case 'done':  finish(); break;
      }
    }

    btn.addEventListener('click', function () {
      if (state.step) return;         /* already moving through the flow */
      state.step = 'await';
      saveState();
      showWaiting();
      armFallback();
    });

    /* Coming back to the tab is what advances step 2, and what re-syncs the
       countdown after the browser throttled it in the background. */
    function onReturn() {
      if (document.hidden) return;
      if (state.step === 'await') toSubscribe();
      else if (state.step === 'count') startCount();
    }
    document.addEventListener('visibilitychange', onReturn);
    window.addEventListener('focus', onReturn);

    render();
  }

  /* ---------------------------------------------------- game ad popup ---
     Builds the popup as soon as the page is ready but keeps it hidden, so
     the picked creative is already downloaded by the time the delay is up
     and the card appears without a blank frame. Settings are in AD_CONFIG
     at the top of this file; styles are in section 12 of olitech.css.
  ------------------------------------------------------------------------- */
  var AD_KEY = 'olitech-ad-seen';

  function adAlreadySeen() {
    var mode = AD_CONFIG.showEvery;
    if (mode === 'always') return false;
    try {
      if (mode === 'session') return sessionStorage.getItem(AD_KEY) === '1';
      var hours = parseFloat(mode);
      if (!(hours > 0)) return false;
      var last = parseFloat(localStorage.getItem(AD_KEY));
      return last > 0 && (Date.now() - last) < hours * 3600000;
    } catch (e) {
      return false; /* private mode or blocked storage: just show it */
    }
  }

  function markAdSeen() {
    var mode = AD_CONFIG.showEvery;
    if (mode === 'always') return;
    try {
      if (mode === 'session') sessionStorage.setItem(AD_KEY, '1');
      else localStorage.setItem(AD_KEY, String(Date.now()));
    } catch (e) {}
  }

  function buildCreative(creative) {
    if (creative.type === 'video') {
      var v = document.createElement('video');
      /* Attributes, not just properties: iOS needs them in the markup. */
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.setAttribute('muted', '');
      v.setAttribute('loop', '');
      v.setAttribute('preload', 'auto');
      v.muted = true;
      v.defaultMuted = true;
      v.loop = true;
      if (creative.poster) v.poster = creative.poster;
      v.src = creative.src;
      v.load();
      return v;
    }
    var img = document.createElement('img');
    img.src = creative.src;
    img.alt = creative.alt || '';
    img.loading = 'eager';
    img.decoding = 'async';
    return img;
  }

  function initGameAd() {
    if (!AD_CONFIG.enabled) return;
    if (!AD_CONFIG.creatives || !AD_CONFIG.creatives.length) return;
    if (adAlreadySeen()) return;

    var creative = AD_CONFIG.creatives[Math.floor(Math.random() * AD_CONFIG.creatives.length)];

    var overlay = document.createElement('div');
    overlay.className = 'olitech-ad-overlay';

    var card = document.createElement('div');
    card.className = 'olitech-ad-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'Advertisement');

    var label = document.createElement('div');
    label.className = 'olitech-ad-label';
    label.textContent = 'Advertisement';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'olitech-ad-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close ad');
    closeBtn.innerHTML = '&times;';

    var media = document.createElement('div');
    media.className = 'olitech-ad-media';
    media.appendChild(buildCreative(creative));

    var headline = document.createElement('h2');
    headline.className = 'olitech-ad-headline';
    headline.textContent = AD_CONFIG.headline;

    var text = document.createElement('p');
    text.className = 'olitech-ad-text';
    text.textContent = AD_CONFIG.text;

    var actions = document.createElement('div');
    actions.className = 'olitech-ad-actions';

    function cta(cls, href, caption) {
      var a = document.createElement('a');
      a.className = 'olitech-ad-btn ' + cls;
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener sponsored';
      a.textContent = caption;
      /* Close behind the new tab so the reader is not stuck on return. */
      a.addEventListener('click', function () { setTimeout(close, 60); });
      return a;
    }
    /* Play and Download share the top row; Cancel gets the row below. */
    var row = document.createElement('div');
    row.className = 'olitech-ad-row';
    row.appendChild(cta('olitech-ad-btn--play', AD_CONFIG.playUrl, AD_CONFIG.playLabel));
    row.appendChild(cta('olitech-ad-btn--download', AD_CONFIG.downloadUrl, AD_CONFIG.downloadLabel));

    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'olitech-ad-btn olitech-ad-btn--cancel';
    cancelBtn.textContent = AD_CONFIG.cancelLabel;
    cancelBtn.addEventListener('click', function () { close(); });

    actions.appendChild(row);
    actions.appendChild(cancelBtn);

    card.appendChild(label);
    card.appendChild(closeBtn);
    card.appendChild(media);
    card.appendChild(headline);
    card.appendChild(text);
    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    var lastFocus = null;
    var timer = null;
    var open = false;

    function trapTab(e) {
      if (e.key !== 'Tab') return;
      var f = card.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') close();
      else trapTab(e);
    }

    function show() {
      if (open) return;
      open = true;
      lastFocus = document.activeElement;
      overlay.classList.add('is-open');
      document.body.classList.add('olitech-ad-open');
      document.addEventListener('keydown', onKey);
      var vid = media.querySelector('video');
      if (vid) {
        var p = vid.play();
        if (p && p.catch) p.catch(function () {}); /* blocked autoplay is fine */
      }
      closeBtn.focus();
      markAdSeen();
    }

    function close() {
      if (!open) return;
      open = false;
      overlay.classList.remove('is-open');
      document.body.classList.remove('olitech-ad-open');
      document.removeEventListener('keydown', onKey);
      var vid = media.querySelector('video');
      if (vid) vid.pause();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    timer = setTimeout(show, (AD_CONFIG.delaySeconds || 0) * 1000);

    /* Do not let the popup land on a tab the reader has walked away from:
       it would fire the moment they come back. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && timer && !open) {
        clearTimeout(timer);
        timer = null;
      }
    });
  }

  /* ----------------------------------------------------------------- go --- */
  function boot() {
    initSkipLink();
    initMenu();
    initProgress();
    initDownload();
    initGameAd();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
