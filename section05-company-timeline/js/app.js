(() => {
  const root = document.querySelector('#section05');
  if (!root || typeof Swiper === 'undefined') return;

  const years = Array.from(root.querySelectorAll('.year'));
  const activeYearIndex = years.findIndex((item) => item.classList.contains('is-active'));
  const initialIndex = activeYearIndex >= 0 ? activeYearIndex : 0;

  let syncing = false;
  let contentSwiper = null;

  const setActiveYear = (index) => {
    years.forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const timelineSwiper = new Swiper(root.querySelector('.timeline'), {
    initialSlide: initialIndex,
    slidesPerView: 3.2,
    centeredSlides: true,
    centeredSlidesBounds: false,
    spaceBetween: 0,
    speed: 420,
    watchOverflow: true,
    slideToClickedSlide: true,
    breakpoints: {
      576: { slidesPerView: 5 },
      768: { slidesPerView: 6 },
      992: { slidesPerView: 7 }
    },
    on: {
      slideChange(swiper) {
        if (syncing || !contentSwiper) return;
        syncing = true;
        contentSwiper.slideTo(swiper.activeIndex);
        setActiveYear(swiper.activeIndex);
        syncing = false;
      }
    }
  });

  contentSwiper = new Swiper(root.querySelector('.slider'), {
    initialSlide: initialIndex,
    slidesPerView: 1,
    speed: 520,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    rewind: true,
    allowTouchMove: true,
    navigation: {
      prevEl: root.querySelector('.prev'),
      nextEl: root.querySelector('.next')
    },
    on: {
      init(swiper) {
        setActiveYear(swiper.activeIndex);
      },
      slideChange(swiper) {
        if (syncing) return;
        syncing = true;
        setActiveYear(swiper.activeIndex);
        timelineSwiper.slideTo(swiper.activeIndex);
        syncing = false;
      }
    }
  });

  years.forEach((item, index) => {
    const activate = () => {
      contentSwiper.slideTo(index);
    };

    item.addEventListener('click', activate);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });
})();
