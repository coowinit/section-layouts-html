(() => {
  const root = document.querySelector('#section03');
  if (!root) return;

  const viewer = root.querySelector('.viewer');
  const swatches = [...root.querySelectorAll('.swatch')];
  const slides = [...root.querySelectorAll('.slide')];
  const colorName = root.querySelector('[data-color-name]');
  const activeSwatchIndex = swatches.findIndex((item) => item.classList.contains('is-active'));
  const activeSlideIndex = slides.findIndex((item) => item.classList.contains('is-active'));
  const initialIndex = activeSwatchIndex >= 0
    ? activeSwatchIndex
    : activeSlideIndex >= 0
      ? activeSlideIndex
      : 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateUI = (index) => {
    const swatch = swatches[index];
    const slide = slides[index];
    if (!swatch || !slide) return;

    swatches.forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    /* 同时保留静态兜底状态；Swiper 初始化后该 class 不参与布局。 */
    slides.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === index);
    });

    colorName.textContent = slide.dataset.name || swatch.dataset.name || '';
  };

  updateUI(initialIndex);

  if (typeof window.Swiper === 'function') {
    const swiper = new window.Swiper(viewer, {
      initialSlide: initialIndex,
      slidesPerView: 1,
      speed: reduceMotion ? 0 : 650,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      rewind: true,
      autoplay: reduceMotion ? false : {
        delay: 3000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: root.querySelector('.swiper-pagination'),
        clickable: true
      },
      a11y: {
        enabled: true
      },
      on: {
        init() {
          updateUI(this.realIndex ?? this.activeIndex);
        },
        slideChange() {
          updateUI(this.realIndex ?? this.activeIndex);
        }
      }
    });

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const index = Number(swatch.dataset.index);
        if (!Number.isInteger(index)) return;

        /* 用户主动选择颜色后停止自动播放，尊重当前选择。 */
        if (swiper.autoplay && swiper.autoplay.running) {
          swiper.autoplay.stop();
        }

        swiper.slideTo(index);
        updateUI(index);
      });
    });

    return;
  }

  /* 本地 Swiper 脚本不可用时的轻量兜底：仍可自动切换和点击色卡。 */
  let currentIndex = initialIndex;
  let timer = null;

  const stopFallbackAutoplay = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const activateFallback = (index) => {
    if (!slides[index]) return;
    currentIndex = index;
    updateUI(currentIndex);
  };

  if (!reduceMotion && slides.length > 1) {
    timer = window.setInterval(() => {
      activateFallback((currentIndex + 1) % slides.length);
    }, 4500);
  }

  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const index = Number(swatch.dataset.index);
      if (!Number.isInteger(index)) return;
      stopFallbackAutoplay();
      activateFallback(index);
    });
  });
})();
