(function () {
  var MovieSite = {};

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-nav-links]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function renderSearch(form, query) {
    var panel = form.querySelector('[data-search-panel]');
    if (!panel) {
      return [];
    }
    var list = window.SearchIndex || [];
    var words = normalize(query).split(/\s+/).filter(Boolean);
    if (!words.length) {
      panel.innerHTML = '';
      panel.classList.remove('is-open');
      return [];
    }
    var results = list.filter(function (item) {
      var hay = normalize([item.title, item.region, item.type, item.year, item.genre, item.tags, item.desc].join(' '));
      return words.every(function (word) {
        return hay.indexOf(word) !== -1;
      });
    }).slice(0, 12);
    panel.innerHTML = results.map(function (item) {
      return '<a class="search-result" href="' + item.url + '"><img src="' + item.poster + '" alt=""><span><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + ' · ' + item.genre + '</span></span></a>';
    }).join('');
    panel.classList.toggle('is-open', results.length > 0);
    return results;
  }

  function initSearch() {
    qsa('.site-search, .large-search').forEach(function (form) {
      var input = form.querySelector('.search-input');
      if (!input) {
        return;
      }
      input.addEventListener('input', function () {
        renderSearch(form, input.value);
      });
      input.addEventListener('focus', function () {
        renderSearch(form, input.value);
      });
      form.addEventListener('submit', function (event) {
        var results = renderSearch(form, input.value);
        if (results.length) {
          event.preventDefault();
          window.location.href = results[0].url;
        }
      });
      document.addEventListener('click', function (event) {
        if (!form.contains(event.target)) {
          var panel = form.querySelector('[data-search-panel]');
          if (panel) {
            panel.classList.remove('is-open');
          }
        }
      });
    });
  }

  function initPageFilters() {
    qsa('.page-filter-input').forEach(function (input) {
      var root = input.closest('main') || document;
      var cards = qsa('[data-card]', root);
      input.addEventListener('input', function () {
        var value = normalize(input.value);
        cards.forEach(function (card) {
          var hay = normalize(card.getAttribute('data-search'));
          card.style.display = hay.indexOf(value) === -1 ? 'none' : '';
        });
      });
    });
  }

  MovieSite.bindPlayer = function (videoId, src, buttonId) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video) {
      return;
    }
    var shell = video.closest('.player-shell');
    var started = false;

    function attach() {
      if (started) {
        return;
      }
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function play() {
      attach();
      if (shell) {
        shell.classList.add('is-playing');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (!started || video.paused) {
        play();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initSearch();
    initPageFilters();
  });

  window.MovieSite = MovieSite;
})();
