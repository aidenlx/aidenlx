(function injectCloudflareAnalytics() {
  const cfScript = document.createElement('script');
  cfScript.defer = true;
  cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  cfScript.setAttribute('data-cf-beacon', '{"token": "3b2a59ad4c01435cbd1728183f7bfac8"}');
  document.head.appendChild(cfScript)
})();

// X (Twitter) post embeds.
// Notes hold X's standard <blockquote class="twitter-tweet"> markup. Obsidian Publish does not run
// the <script> tag inside notes, and it renders note sections lazily and swaps them on navigation,
// so widgets.js's own scan at load time misses most embeds. Load it once, then ask it to re-scan
// after every rendered section and every navigation (twttr.widgets.load is idempotent).
// If widgets.js is blocked or fails, the blockquote is left untouched and stays readable.
(function xEmbeds() {
  // Official async loader from X's docs: queues twttr.ready callbacks until widgets.js has loaded.
  window.twttr = (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.async = true;
    js.src = 'https://platform.x.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function (f) { t._e.push(f); };
    return t;
  })(document, 'script', 'twitter-wjs');

  var timer;
  function scan() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      // Obsidian Publish toggles theme-dark / theme-light on <body>; X reads data-theme per embed.
      // Only unrendered blockquotes are touched, so an already-rendered card keeps its theme
      // until the next page load.
      var theme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
      document.querySelectorAll('blockquote.twitter-tweet:not([data-theme])').forEach(function (el) {
        el.setAttribute('data-theme', theme);
      });
      window.twttr.ready(function (twttr) { twttr.widgets.load(document.body); });
    }, 150);
  }

  // Hooks declared in obsidianmd/obsidian-api publish.d.ts (not in the prose help docs).
  if (window.publish) {
    if (typeof publish.registerMarkdownPostProcessor === 'function') {
      publish.registerMarkdownPostProcessor(scan);
    }
    if (typeof publish.on === 'function') publish.on('navigated', scan);
  }
  scan(); // first load
})();
