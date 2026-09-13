/* Tandläkarhuset Östersund: mobilmeny, sticky header, scroll-reveal, formulär */
(function () {
  'use strict';

  /* --- Exakt fönsterbredd till CSS -------------------------------------
     100vw räknar med scrollbaren. Halvbleed-sektionerna behöver den riktiga
     bredden för att texten ska hamna på samma vänsterlinje som .wrap.
     --------------------------------------------------------------------- */
  var sattBredd = function () {
    document.documentElement.style.setProperty(
      '--vw', document.documentElement.clientWidth + 'px');
  };
  sattBredd();
  window.addEventListener('resize', sattBredd, { passive: true });

  /* --- Mobilmeny ------------------------------------------------------- */
  var burgare = document.querySelector('.burgare');
  var meny = document.getElementById('mobilmeny');

  function stangMeny() {
    if (!burgare || !meny) return;
    burgare.setAttribute('aria-expanded', 'false');
    meny.classList.remove('oppen');
    document.body.classList.remove('meny-oppen');
  }

  if (burgare && meny) {
    burgare.addEventListener('click', function () {
      var oppen = burgare.getAttribute('aria-expanded') === 'true';
      burgare.setAttribute('aria-expanded', String(!oppen));
      meny.classList.toggle('oppen', !oppen);
      document.body.classList.toggle('meny-oppen', !oppen);
    });

    meny.addEventListener('click', function (e) {
      if (e.target.closest('a')) stangMeny();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') stangMeny();
    });

    // Stäng om fönstret växer förbi mobilbrytpunkten
    var mq = window.matchMedia('(min-width: 1041px)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(
      function (e) { if (e.matches) stangMeny(); }
    );
  }

  /* --- Sticky header: hårstreck först när sidan scrollats -------------- */
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var senast = -1;
    var uppdatera = function () {
      var scrollad = window.scrollY > 8;
      if (scrollad !== senast) {
        topbar.classList.toggle('scrollad', scrollad);
        senast = scrollad;
      }
    };
    uppdatera();
    window.addEventListener('scroll', uppdatera, { passive: true });
  }

  /* --- Scroll-reveal ---------------------------------------------------- */
  var element = document.querySelectorAll('.reveal');
  var stillsam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!element.length) {
    // inget att göra
  } else if (stillsam || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(element, function (el) { el.classList.add('syns'); });
  } else {
    var obs = new IntersectionObserver(function (poster) {
      poster.forEach(function (post) {
        if (post.isIntersecting) {
          post.target.classList.add('syns');
          obs.unobserve(post.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(element, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      obs.observe(el);
    });
  }

  /* --- Kontaktformulär --------------------------------------------------
     Sajten är statisk och har ingen server. Formuläret öppnar därför
     patientens e-postklient med ärendet ifyllt. Ska det i stället skickas
     från servern: byt ut lyssnaren mot en riktig <form action="…" method="post">.
     ------------------------------------------------------------------- */
  var form = document.getElementById('kontaktformular');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var team = d.get('team') || 'cll@tandlakarhuset.com';
      var namn = (d.get('namn') || '').toString().trim();
      var kropp =
        'Namn: ' + namn + '\n' +
        'Telefon: ' + (d.get('telefon') || '') + '\n' +
        'E-post: ' + (d.get('epost') || '') + '\n\n' +
        (d.get('arende') || '');
      window.location.href =
        'mailto:' + team +
        '?subject=' + encodeURIComponent('Webbformulär: ' + (namn || 'ny kontakt')) +
        '&body=' + encodeURIComponent(kropp);
    });
  }

  /* --- Karta: laddas först när den scrollas fram ----------------------- */
  var karta = document.querySelector('[data-karta]');
  if (karta && 'IntersectionObserver' in window) {
    var kobs = new IntersectionObserver(function (poster, o) {
      poster.forEach(function (post) {
        if (post.isIntersecting) {
          post.target.src = post.target.getAttribute('data-karta');
          o.unobserve(post.target);
        }
      });
    }, { rootMargin: '300px' });
    kobs.observe(karta);
  } else if (karta) {
    karta.src = karta.getAttribute('data-karta');
  }
})();
