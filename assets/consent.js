/* =========================================================
   leonkrieger.com – Consent Mode v2 + GTM
   Wird synchron im <head> geladen, VOR allen anderen Skripten.

   Kompatibilität mit dem bestehenden GTM-Container:
   - Cookies:   consent_analytics, consent_gtm  (unverändert)
   - dataLayer: { event: 'consentUpdate', consentAnalytics, consentGTM }  (unverändert)
   "consentGTM" steht inhaltlich jetzt für die Kategorie "Marketing"
   (ad_storage, ad_user_data, ad_personalization).
   ========================================================= */
(function () {
  var GTM_ID = 'GTM-WZT8MMH3';
  var COOKIE_DAYS = 365;
  var doc = document.documentElement;
  doc.className += ' js';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? m[1] : null;
  }
  function setCookie(name, value) {
    var d = new Date(); d.setTime(d.getTime() + COOKIE_DAYS * 864e5);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax;Secure';
  }
  // Entfernt GA-Cookies, wenn die Einwilligung widerrufen wird
  function removeAnalyticsCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split('; ').forEach(function (c) {
      var name = c.split('=')[0];
      if (/^_ga($|_)|^_gid$|^_gat/.test(name)) {
        ['', '.' + host, host].forEach(function (dom) {
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + (dom ? ';domain=' + dom : '');
        });
      }
    });
  }

  function pushConsent(analytics, marketing) {
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    });
    window.dataLayer.push({ event: 'consentUpdate', consentAnalytics: analytics, consentGTM: marketing });
  }

  // Gespeicherte Entscheidung schon VOR dem GTM-Load anwenden (kein Warten auf DOMContentLoaded)
  var storedA = getCookie('consent_analytics');
  var storedM = getCookie('consent_gtm');
  var hasDecision = storedA !== null;
  if (hasDecision) pushConsent(storedA === 'true', storedM === 'true');

  // Google Tag Manager
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_ID);

  // ---------- Banner ----------
  function save(analytics, marketing) {
    var hadAnalytics = getCookie('consent_analytics') === 'true';
    setCookie('consent_analytics', analytics ? 'true' : 'false');
    setCookie('consent_gtm', marketing ? 'true' : 'false');
    pushConsent(analytics, marketing);
    if (!analytics) removeAnalyticsCookies();
    close();
    // Bereits geladene Tags lassen sich nicht "entladen" – bei Widerruf einmal neu laden
    if (hadAnalytics && !analytics) location.reload();
  }

  function close() {
    var o = document.getElementById('consent-overlay');
    if (!o) return;
    o.style.transition = 'opacity 0.2s'; o.style.opacity = '0';
    setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var lastFocus = null;

  function open(showDetail) {
    if (document.getElementById('consent-overlay')) return;
    lastFocus = document.activeElement;
    var a = getCookie('consent_analytics') === 'true';
    var m = getCookie('consent_gtm') === 'true';

    var o = document.createElement('div');
    o.id = 'consent-overlay';
    o.innerHTML =
      '<div id="consent-box" role="dialog" aria-modal="true" aria-labelledby="c-title">' +
        '<p class="c-label">Datenschutz</p>' +
        '<h2 id="c-title">Darf ich Analyse-Cookies setzen?</h2>' +
        '<p>Mit deiner Einwilligung nutze ich Google Analytics, um zu verstehen, wie diese Website genutzt wird. ' +
        'Dabei werden Daten an Google übertragen, ggf. auch in die USA. Du kannst deine Entscheidung jederzeit über ' +
        '„Cookie-Einstellungen“ im Footer ändern. Mehr dazu in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p>' +
        '<div class="c-buttons">' +
          '<button type="button" class="c-btn c-btn-decline" data-c="decline">Ablehnen</button>' +
          '<button type="button" class="c-btn c-btn-accept" data-c="accept">Alle akzeptieren</button>' +
        '</div>' +
        '<button type="button" class="c-customize" data-c="toggle" aria-expanded="false" aria-controls="consent-detail">Einstellungen anpassen</button>' +
        '<div id="consent-detail">' +
          '<div class="c-service"><div><h3>Notwendig</h3><p>Speichert deine Auswahl in den Cookies <code>consent_analytics</code> und <code>consent_gtm</code>.</p></div>' +
            '<label class="c-toggle"><input type="checkbox" checked disabled aria-label="Notwendig (immer aktiv)"><span class="c-toggle-track"></span></label></div>' +
          '<div class="c-service"><div><h3>Statistik – Google Analytics 4</h3><p>Seitenaufrufe, Verweildauer, Gerät und ungefähre Herkunft. Setzt die Cookies <code>_ga</code> und <code>_ga_*</code>.</p></div>' +
            '<label class="c-toggle"><input type="checkbox" id="toggle-ga4"' + (a ? ' checked' : '') + ' aria-label="Statistik erlauben"><span class="c-toggle-track"></span></label></div>' +
          '<div class="c-service"><div><h3>Marketing</h3><p>Werbe- und Conversion-Messung über Google-Dienste (z. B. Google Ads).</p></div>' +
            '<label class="c-toggle"><input type="checkbox" id="toggle-gtm"' + (m ? ' checked' : '') + ' aria-label="Marketing erlauben"><span class="c-toggle-track"></span></label></div>' +
          '<button type="button" class="c-save" data-c="save">Auswahl speichern</button>' +
        '</div>' +
        '<p class="c-links"><a href="/impressum/">Impressum</a> · <a href="/datenschutz/">Datenschutz</a></p>' +
      '</div>';
    document.body.appendChild(o);

    var detail = o.querySelector('#consent-detail');
    var toggleBtn = o.querySelector('[data-c="toggle"]');
    function setDetail(openIt) {
      detail.classList.toggle('open', openIt);
      toggleBtn.setAttribute('aria-expanded', openIt ? 'true' : 'false');
    }
    if (showDetail) setDetail(true);

    o.addEventListener('click', function (e) {
      var t = e.target.closest('[data-c]');
      if (!t) return;
      var c = t.getAttribute('data-c');
      if (c === 'accept') save(true, true);
      else if (c === 'decline') save(false, false);
      else if (c === 'toggle') setDetail(!detail.classList.contains('open'));
      else if (c === 'save') save(o.querySelector('#toggle-ga4').checked, o.querySelector('#toggle-gtm').checked);
    });
    o.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hasDecision) close();
    });
    var first = o.querySelector('.c-btn-decline');
    if (first) first.focus();
  }

  // Öffentliche API für "Cookie-Einstellungen"-Links
  window.LKConsent = { open: function () { open(true); } };

  document.addEventListener('DOMContentLoaded', function () {
    // Auf Impressum/Datenschutz blockiert der Banner nicht automatisch
    var manual = doc.getAttribute('data-consent') === 'manual';
    if (!hasDecision && !manual) open(false);
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-consent-open]');
      if (t) { e.preventDefault(); open(true); }
    });
  });
})();
