(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('active', idx === active);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('active', idx === active);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        show(idx);
        restart();
      });
    });

    show(0);
    restart();
  }

  var panel = document.querySelector('[data-filter-panel]');
  if (panel) {
    var input = panel.querySelector('[data-search-input]');
    var typeFilter = panel.querySelector('[data-filter-type]');
    var yearFilter = panel.querySelector('[data-filter-year]');
    var categoryFilter = panel.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-list] .movie-card'));
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function valueOf(select) {
      return select ? select.value.trim().toLowerCase() : '';
    }

    function applyFilters() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var typeValue = valueOf(typeFilter);
      var yearValue = valueOf(yearFilter);
      var categoryValue = valueOf(categoryFilter);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-type') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-keywords') || ''
        ].join(' ').toLowerCase();
        var type = (card.getAttribute('data-type') || '').toLowerCase();
        var year = (card.getAttribute('data-year') || '').toLowerCase();
        var category = (card.getAttribute('data-category') || '').toLowerCase();
        var matched = true;

        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }
        if (typeValue && type !== typeValue) {
          matched = false;
        }
        if (yearValue && year !== yearValue) {
          matched = false;
        }
        if (categoryValue && category !== categoryValue) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    [input, typeFilter, yearFilter, categoryFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
