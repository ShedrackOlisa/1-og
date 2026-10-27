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

    /* ---- where the popup must NOT appear -----------------------------
       Any page carrying an AdSense unit is skipped automatically while
       skipWhenAdSense stays true, so new articles need no entry below.
       It looks for an actual <ins class="adsbygoogle"> on the page, not
       the loader script, so switching Auto Ads on site-wide later will
       not silently kill the popup everywhere.

       skipOnPaths is the manual list, for pages with no AdSense unit
       that should still stay clean. Each entry is matched anywhere in
       the page address, so the file slug on its own is enough:
         skipOnPaths: ['privacy-and-policy', 'contact']                 */
    skipWhenAdSense: true,
    skipOnPaths: [],

    /* Both buttons point here. */
    playUrl: 'https://play.google.com/store/apps/details?id=com.ziphynet.app',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.ziphynet.app',

    /* Button captions. Play and Download sit side by side on one row,
       Cancel sits on its own row underneath them. */
    playLabel: 'Get the App',
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
      { type: 'image', src: 'https://olitechgames.com/src/ziphynet-app-ad.jpg', alt: 'ZiphyNet game' },
      { type: 'video', src: 'https://example.com/ads/ziphy-1.mp4',  poster: 'https://olitechgames.com/src/ziphynet-app-ad.jpg' }
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

  /* Facebook page link. */
  facebookUrl: 'https://www.facebook.com/profile.php?id=61594118177533',
  facebookId: '61594118177533',

  countdownSeconds: 15,
  returnFallbackSeconds: 20,
  rememberSubscribe: false,

  waitingText: 'Finish the step in the new tab, then come back here to continue.',
  subscribeHeading: 'One last step',
  subscribeText: 'Follow our Facebook page to unlock this download. Tap the button, follow the page, then come back to this page.',
  subscribeLabel: 'FOLLOW ON FACEBOOK',
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
    '<h4><i class="fab fa-facebook"></i> ' + D.subscribeHeading + '</h4>' +
    '<p>' + D.subscribeText + '</p>' +
    '</div>';

  var a = document.createElement('a');
  a.className = 'subscribe-btn';
  a.href = D.facebookUrl;
  a.target = '_blank';
  a.rel = 'noopener';
  a.innerHTML = '<i class="fab fa-facebook"></i> ' + D.subscribeLabel;

  a.addEventListener('click', function (e) {
    var ua = navigator.userAgent || '';
    var isAndroid = /Android/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua);

    /* Force the Facebook app where we can. Desktop just follows the normal link. */
    if (isAndroid) {
      e.preventDefault();
      window.location.href =
        'intent://profile/' + D.facebookId +
        '#Intent;scheme=fb;package=com.facebook.katana;' +
        'S.browser_fallback_url=' + encodeURIComponent(D.facebookUrl) + ';end';
    } else if (isIOS) {
      e.preventDefault();
      window.location.href = 'fb://profile/' + D.facebookId;
      /* If the app is not installed the page stays visible, so fall back to the web link. */
      setTimeout(function () {
        if (!document.hidden) window.location.href = D.facebookUrl;
      }, 1200);
    }

    try { sessionStorage.setItem(SUB_KEY, '1'); } catch (err) {}
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

  /* True when this page is one the popup must leave alone. Checked before
     anything is built, so an excluded page does not even download a
     creative. See skipWhenAdSense / skipOnPaths in AD_CONFIG. */
  function adSkipsThisPage() {
    var here = (location.pathname + location.search).toLowerCase();
    var list = AD_CONFIG.skipOnPaths || [];
    for (var i = 0; i < list.length; i++) {
      var slug = String(list[i]).toLowerCase().replace(/^[\/\s]+/, '');
      if (slug && here.indexOf(slug) !== -1) return true;
    }
    if (AD_CONFIG.skipWhenAdSense && document.querySelector('ins.adsbygoogle')) return true;
    return false;
  }

  function initGameAd() {
    if (!AD_CONFIG.enabled) return;
    if (!AD_CONFIG.creatives || !AD_CONFIG.creatives.length) return;
    if (adSkipsThisPage()) return;
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

    var media = document.createElement('a');
media.className = 'olitech-ad-media';
media.href = 'https://play.google.com/store/apps/details?id=com.ziphynet.app';
media.target = '_blank';
media.rel = 'noopener sponsored';
media.setAttribute('aria-label', 'Get ZiphyNet on Google Play');
/* Close behind the new tab so the reader is not stuck on return. */
media.addEventListener('click', function () { setTimeout(close, 60); });
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

    /* Bottom-sheet layout: title and close button share a header row. */
var head = document.createElement('div');
head.className = 'olitech-ad-head';
var titleWrap = document.createElement('div');
titleWrap.appendChild(label);
titleWrap.appendChild(headline);
head.appendChild(titleWrap);
head.appendChild(closeBtn);

card.appendChild(head);
card.appendChild(media);
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

/* ===== 300x250 Random Ad Banner =====
   1) Add/edit your ads in the ADS list below.
   2) Put <div class="sa-ad-slot"></div> in your HTML wherever the ad should show.
   Each page load picks a random ad. Several slots on one page will show different ads. */
(function () {
  var ADS = [
    {
      img: "https://olitechgames.com/src/study-abroad-ad.jpg",
      url: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=CAEScAHrOzAVfz6Za3tBaP8CgX8aSCKXhIJODz65pP17bjmRQdCD80T8lO4JZJTN5YTPg_QEIurQsdbUCvigd81FlVZQ0ZrfU6u5ZSkpI-5f5DRr1uuMzRkpSit1uoJF6BB_4hSRSfexxLrH3-Bijo3Rf1o&ved=2ahUKEwj8hdbxrcyXAxV3QUEAHQMYM78QFnoECDUQAQ&uoh=2&usg=AOvVaw1XvYLz-gl98qiRaN8EWJnh",
      alt: "Study abroad for free - discover scholarships, tuition-free universities and global opportunities"
    },
    {
      img: "https://olitechgames.com/src/gta-5-ppsspp-ad.jpg",
      url: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=CAESbAHrOzAV392j0GHHJkvipnzHb5Mkc5KdRVDpR56FK34j--jC5ot1OtJirRTKNtbnPbbF-fYrs3RdV521Tbp7yFA46odPDloBgwismoj0R_yVBh0IaMe_A3_GMlVrFqa5soSFz0skc_xsGBZflg&ved=2ahUKEwjIub7Wp9CXAxUKdUEAHVoJCfoQFnoECEQQAQ&uoh=2&usg=AOvVaw0uRg8kJN9A67xehg0HBSwB",
      alt: "GTA 5 PPSSPP - Play the ultimate open-world game on your mobile device"
    },
    {
      img: "https://olitechgames.com/src/win-100-000-dollar-ad.jpg",
      url: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=CAESbAHrOzAV392j0GHHJkvipnzHb5Mkc5KdRVDpR56FK34j--jC5ot1OtJirRTKNtbnPbbF-fYrs3RdV521Tbp7yFA46odPDloBgwismoj0R_yVBh0IaMe_A3_GMlVrFqa5soSFz0skc_xsGBZflg&ved=2ahUKEwjIub7Wp9CXAxUKdUEAHVoJCfoQFnoECEQQAQ&uoh=2&usg=AOvVaw0uRg8kJN9A67xehg0HBSwB",
      alt: "Win $100,000 - Enter our daily giveaway now!"
    }
    // Add more ads by copying the block above, adding a comma after the previous "}":
    // , { img: "https://olitechgames.com/src/another-ad.jpg", url: "https://example.com/page", alt: "Describe the ad" }
  ];

  var css =
    ".sa-ad-wrap{width:300px;max-width:100%;margin:16px auto;line-height:0}" +
    ".sa-ad{position:relative;display:block;width:300px;height:250px;max-width:100%;overflow:hidden;border:1px solid #d9d9d9;border-radius:4px;background:#0a2a6e;box-shadow:0 1px 4px rgba(0,0,0,.15);text-decoration:none;-webkit-tap-highlight-color:transparent}" +
    ".sa-ad img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .35s ease}" +
    ".sa-ad:hover img{transform:scale(1.04)}" +
    ".sa-ad-tag{position:absolute;top:0;right:0;z-index:2;background:rgba(255,255,255,.92);color:#555;font:700 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.5px;text-transform:uppercase;padding:3px 5px;border-bottom-left-radius:4px}" +
    ".sa-ad-cta{position:absolute;left:14px;bottom:34px;width:127px;height:23px;border-radius:12px;z-index:1;pointer-events:none;animation:saPulse 2.2s ease-in-out infinite}" +
    "@keyframes saPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,221,0,.65)}50%{box-shadow:0 0 0 7px rgba(255,221,0,0)}}" +
    "@media (prefers-reduced-motion:reduce){.sa-ad-cta{animation:none}.sa-ad img{transition:none}}";

  function init() {
    var slots = document.querySelectorAll(".sa-ad-slot");
    if (!slots.length || !ADS.length) return;

    if (!document.getElementById("sa-ad-css")) {
      var style = document.createElement("style");
      style.id = "sa-ad-css";
      style.textContent = css;
      document.head.appendChild(style);
    }

    // Shuffle a copy so slots on the same page get different ads (repeats only if slots > ads)
    var pool = ADS.slice().sort(function () { return Math.random() - 0.5; });

    Array.prototype.forEach.call(slots, function (slot, i) {
      var ad = pool[i % pool.length];

      var wrap = document.createElement("div");
      wrap.className = "sa-ad-wrap";

      var a = document.createElement("a");
      a.className = "sa-ad";
      a.href = ad.url;
      a.target = "_blank";
      a.rel = "noopener sponsored nofollow";
      a.setAttribute("aria-label", "Advertisement: " + (ad.alt || ""));

      var tag = document.createElement("span");
      tag.className = "sa-ad-tag";
      tag.textContent = "Ad";

      var cta = document.createElement("span");
      cta.className = "sa-ad-cta";

      var img = document.createElement("img");
      img.width = 300;
      img.height = 250;
      img.alt = ad.alt || "Advertisement";
      img.loading = "lazy";
      img.onerror = function () { slot.style.display = "none"; }; // hide if image fails
      img.src = ad.img;

      a.appendChild(tag);
      a.appendChild(cta);
      a.appendChild(img);
      wrap.appendChild(a);
      slot.innerHTML = "";
      slot.appendChild(wrap);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


/* ===== ZiphyNet "Featured" ad - place under your <h1> =====
   1) Put <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1091464318795402"
     crossorigin="anonymous"></script>
    <div data-geo-ads>
<!-- AD CODE -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1091464318795402"
     data-ad-slot="9535249597"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div> right under your <h1>.
   2) Set the image and link below.
   Responsive: fills the width on phones, max 420px on desktop. */
(function () {
  var AD = {
    img: "https://olitechgames.com/src/ziphynet-app-ad.jpg", // upload ziphynet-app-ad.jpg here
    url: "https://play.google.com/store/apps/details?id=com.ziphynet.app", // your Google Play link
    alt: "Download the ZiphyNet app on Google Play - games, communities and friends"
  };

  var css =
    ".zn-ad-wrap{width:100%;max-width:420px;margin:14px auto 18px;line-height:0}" +
    ".zn-ad{position:relative;display:block;width:100%;aspect-ratio:1374/1145;overflow:hidden;border-radius:10px;background:#120508;border:1px solid rgba(255,59,59,.55);box-shadow:0 0 14px rgba(255,40,40,.35),0 2px 8px rgba(0,0,0,.35);text-decoration:none;-webkit-tap-highlight-color:transparent;transition:transform .2s ease,box-shadow .2s ease}" +
    ".zn-ad:hover{transform:translateY(-2px);box-shadow:0 0 22px rgba(255,40,40,.55),0 6px 14px rgba(0,0,0,.4)}" +
    ".zn-ad img{display:block;width:100%;height:100%;object-fit:cover}" +
    ".zn-ad-tag{position:absolute;top:0;left:0;z-index:3;background:rgba(0,0,0,.65);color:#fff;font:700 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.6px;text-transform:uppercase;padding:4px 7px;border-bottom-right-radius:8px}" +
    /* pulse around the Google Play button (positions are % so it scales with the banner) */
    ".zn-ad-cta{position:absolute;left:63.4%;top:54.4%;width:34.2%;height:14.6%;border-radius:12px;z-index:2;pointer-events:none;animation:znPulse 2s ease-in-out infinite}" +
    "@keyframes znPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,60,60,.7)}50%{box-shadow:0 0 0 9px rgba(255,60,60,0)}}" +
    /* light sweep */
    ".zn-ad-shine{position:absolute;top:0;left:-60%;width:40%;height:100%;z-index:2;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(255,255,255,.18),transparent);transform:skewX(-20deg);animation:znShine 5s ease-in-out infinite}" +
    "@keyframes znShine{0%,60%{left:-60%}100%{left:130%}}" +
    "@media (prefers-reduced-motion:reduce){.zn-ad-cta,.zn-ad-shine{animation:none}.zn-ad{transition:none}}";

  function init() {
    var slots = document.querySelectorAll(".zn-ad-slot");
    if (!slots.length) return;

    if (!document.getElementById("zn-ad-css")) {
      var style = document.createElement("style");
      style.id = "zn-ad-css";
      style.textContent = css;
      document.head.appendChild(style);
    }

    Array.prototype.forEach.call(slots, function (slot) {
      var wrap = document.createElement("div");
      wrap.className = "zn-ad-wrap";

      var a = document.createElement("a");
      a.className = "zn-ad";
      a.href = AD.url;
      a.target = "_blank";
      a.rel = "noopener sponsored";
      a.setAttribute("aria-label", "Advertisement: " + AD.alt);

      var tag = document.createElement("span");
      tag.className = "zn-ad-tag";
      tag.textContent = "Ad";

      var cta = document.createElement("span");
      cta.className = "zn-ad-cta";

      var shine = document.createElement("span");
      shine.className = "zn-ad-shine";

      var img = document.createElement("img");
      img.width = 900;
      img.height = 750;
      img.alt = AD.alt;
      img.onerror = function () { slot.style.display = "none"; };
      img.src = AD.img;

      a.appendChild(tag);
      a.appendChild(cta);
      a.appendChild(shine);
      a.appendChild(img);
      wrap.appendChild(a);
      slot.innerHTML = "";
      slot.appendChild(wrap);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();