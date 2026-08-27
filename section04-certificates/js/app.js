(() => {
  const root = document.querySelector('#section04');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('.tab'));
  const slides = Array.from(root.querySelectorAll('.item'));
  const sliderEl = root.querySelector('.slider');
  const zoomButtons = Array.from(root.querySelectorAll('.zoom'));
  const modal = root.querySelector('.modal');
  const preview = root.querySelector('.preview');
  const closeButton = root.querySelector('.close');

  if (!tabs.length || !slides.length || !sliderEl) return;

  const setFilter = (filter) => {
    slides.forEach((slide) => {
      const categories = (slide.dataset.category || '').split(/\s+/).filter(Boolean);
      const visible = filter === 'all' || categories.includes(filter);
      slide.classList.toggle('is-hidden', !visible);
    });
  };

  const initialTab = tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0];
  let currentFilter = initialTab?.dataset.filter || 'all';
  setFilter(currentFilter);

  let swiper = null;

  const initSwiper = () => {
    if (typeof window.Swiper !== 'function') return;

    swiper = new window.Swiper(sliderEl, {
      slidesPerView: 1,
      spaceBetween: 22,
      speed: 500,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      pagination: {
        el: root.querySelector('.pagination'),
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 28,
        },
      },
    });
  };

  const refreshSwiper = () => {
    if (!swiper) return;
    swiper.update();
    swiper.slideTo(0, 0);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentFilter = tab.dataset.filter || 'all';

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });

      setFilter(currentFilter);
      refreshSwiper();
    });
  });

  let lastFocused = null;

  const openModal = (button) => {
    if (!modal || !preview || !button) return;

    lastFocused = document.activeElement;
    preview.src = button.dataset.src || '';
    preview.alt = button.dataset.alt || '';
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    closeButton?.focus();
  };

  const closeModal = () => {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    preview?.removeAttribute('src');
    if (preview) preview.alt = '';
    document.documentElement.style.overflow = '';

    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  zoomButtons.forEach((button) => {
    button.addEventListener('click', () => openModal(button));
  });

  closeButton?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      closeModal();
    }
  });

  initSwiper();
})();
