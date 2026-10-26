/* leonkrieger.com – Navigation, Animationen, Kontaktformular */
(function () {
  // Mobile-Navigation
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Einblend-Animationen
  var faders = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    faders.forEach(function (f) { observer.observe(f); });
  } else {
    faders.forEach(function (f) { f.classList.add('visible'); });
  }

  // Kontaktformular (Formspree)
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn-send');
      var success = document.getElementById('formSuccess');
      btn.textContent = 'Wird gesendet …'; btn.disabled = true;
      try {
        var res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          success.style.display = 'block'; form.reset(); btn.style.display = 'none';
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'form_submit_success', form_id: 'contact' });
        } else {
          btn.textContent = 'Fehler – bitte per E-Mail melden'; btn.disabled = false;
        }
      } catch (err) {
        btn.textContent = 'Fehler – bitte per E-Mail melden'; btn.disabled = false;
      }
    });
  }
})();
