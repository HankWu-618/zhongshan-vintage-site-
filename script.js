document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.topnav-toggle');
  var menu = document.querySelector('.topnav-menu');

  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '開啟選單');
    };

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? '關閉選單' : '開啟選單');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 780 && menu.classList.contains('open')) closeMenu();
    });
  }

  var currentNavLink = document.querySelector('.topnav-menu > li.active > a');
  if (currentNavLink) currentNavLink.setAttribute('aria-current', 'page');

  var winnersTableBody = document.querySelector('[data-winners-body]');
  if (winnersTableBody) {
    fetch('winners.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var monthLabel = document.querySelector('[data-winners-month]');
        if (monthLabel && data.month) monthLabel.textContent = data.month;

        winnersTableBody.innerHTML = '';
        (data.winners || []).forEach(function (w) {
          var tr = document.createElement('tr');
          tr.innerHTML =
            '<td>' + w.prize + '</td>' +
            '<td>' + w.name + '</td>' +
            '<td>' + w.contact + '</td>';
          winnersTableBody.appendChild(tr);
        });
      })
      .catch(function () {
        winnersTableBody.innerHTML =
          '<tr><td colspan="3">名單載入中，請稍後再試。</td></tr>';
      });
  }

  // ---------- Scroll reveal ----------
  var revealTargets = document.querySelectorAll(
    '.info-block, .highlight-card, .shop-row, .link-card, .step-card, ' +
    '.content-photo, .district-quote, .reserve-cta, .store-list-box, .group-list li'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // ---------- Nav shrink on scroll ----------
  var topnav = document.querySelector('.topnav');
  if (topnav) {
    var updateNav = function () {
      if (window.scrollY > 40) {
        topnav.classList.add('nav-scrolled');
      } else {
        topnav.classList.remove('nav-scrolled');
      }
    };
    updateNav();
    window.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateNav);
    }, { passive: true });
  }

  // ---------- Scroll progress bar ----------
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  var updateProgress = function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  updateProgress();
  window.addEventListener('scroll', function () {
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  window.addEventListener('resize', updateProgress);

  // ---------- Sticker click burst on CTA buttons ----------
  var burstEmojis = ['✦', '♥', '✧', '★'];

  function burstStickers(x, y) {
    for (var i = 0; i < 6; i++) {
      var el = document.createElement('span');
      el.className = 'click-burst';
      el.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      var angle = Math.random() * Math.PI * 2;
      var dist = 40 + Math.random() * 40;
      el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      document.body.appendChild(el);
      el.addEventListener('animationend', function () {
        this.remove();
      });
    }
  }

  document.querySelectorAll('.reserve-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      burstStickers(e.clientX, e.clientY);
    });
  });

  // ---------- Count-up numbers ----------
  var countTargets = document.querySelectorAll('.count-up');
  if ('IntersectionObserver' in window && countTargets.length) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        var duration = 1200;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = Math.floor(eased * target);
          el.textContent = value.toLocaleString('en-US');
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString('en-US');
          }
        }
        window.requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    countTargets.forEach(function (el) {
      countObserver.observe(el);
    });
  }
});
