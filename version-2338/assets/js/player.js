(function (global) {
  function boot(src) {
    var box = document.querySelector('[data-player]');
    if (!box) {
      return;
    }

    var video = box.querySelector('video');
    var button = box.querySelector('[data-play-button]');
    var attached = false;
    var hls = null;

    function attach() {
      if (attached || !video || !src) {
        return;
      }
      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return;
      }

      if (global.Hls && global.Hls.isSupported()) {
        hls = new global.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        return;
      }

      video.src = src;
    }

    function play() {
      attach();
      if (button) {
        button.classList.add('is-hidden');
      }
      if (video) {
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
      video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
          button.classList.remove('is-hidden');
        }
      });
      attach();
    }

    global.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  global.MoviePlayer = {
    boot: boot
  };
})(window);
