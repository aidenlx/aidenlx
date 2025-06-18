(function injectCloudflareAnalytics() {
  const cfScript = document.createElement('script');
  cfScript.defer = true;
  cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  cfScript.setAttribute('data-cf-beacon', '{"token": "3b2a59ad4c01435cbd1728183f7bfac8"}');
  document.head.appendChild(cfScript)
})()