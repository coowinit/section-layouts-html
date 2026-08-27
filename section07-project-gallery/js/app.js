(() => {
  const root = document.querySelector('#section07');
  if (!root) return;

  const modal = root.querySelector('.modal');
  const modalContent = root.querySelector('.modal-content');
  const closeButtons = root.querySelectorAll('[data-modal-close]');
  const openLinks = root.querySelectorAll('[data-modal-open]');
  let gallery = null;
  let lastTrigger = null;
  let previousBodyOverflow = '';

  const destroyGallery = () => {
    if (gallery && typeof gallery.destroy === 'function') {
      gallery.destroy(true, true);
    }
    gallery = null;
  };

  const initGallery = () => {
    const el = modalContent.querySelector('.gallery');
    if (!el || typeof window.Swiper !== 'function') return;

    gallery = new window.Swiper(el, {
      slidesPerView: 1,
      speed: 500,
      rewind: true,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      navigation: {
        prevEl: el.querySelector('.gallery-prev'),
        nextEl: el.querySelector('.gallery-next')
      },
      pagination: {
        el: el.querySelector('.gallery-pagination'),
        clickable: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false
      }
    });

    gallery.update();
  };

  const openModal = (trigger) => {
    const project = trigger.closest('.project');
    const template = project?.querySelector('template.detail');
    if (!template) return;

    destroyGallery();
    modalContent.replaceChildren(template.content.cloneNode(true));
    const titleNode = modalContent.querySelector('.content h3');
    if (titleNode) titleNode.id = 'section07-modal-title';

    lastTrigger = trigger;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Modal 从 hidden 切换为可见后，等待浏览器完成网格尺寸计算，
    // 再初始化 Swiper，避免在宽高为 0 / 未稳定时计算出超大 wrapper。
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!modal.classList.contains('is-open')) return;
        initGallery();
        root.querySelector('.close')?.focus();
      });
    });
  };

  const closeModal = () => {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;
    destroyGallery();
    modalContent.replaceChildren();
    lastTrigger?.focus();
  };

  openLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(link);
    });
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
