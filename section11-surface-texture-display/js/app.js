(() => {
    const root = document.querySelector('#section11');
    if (!root || typeof Swiper === 'undefined') return;

    const tabs = [...root.querySelectorAll('.tab')];
    const slider = root.querySelector('.texture');
    const wrapper = root.querySelector('.swiper-wrapper');
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const pagination = root.querySelector('.pagination');

    if (!tabs.length || !slider || !wrapper) return;

    const getTemplate = (key) => {
        return root.querySelector(`template[data-texture="${key}"]`);
    };

    const setActiveTab = (key) => {
        tabs.forEach((tab) => {
            const active = tab.dataset.texture === key;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    };

    const getSlides = (key) => {
        const template = getTemplate(key);
        if (!template) return [];

        return [...template.content.children].map((node) => node.cloneNode(true));
    };

    const initialTab = tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0];
    const initialKey = initialTab.dataset.texture;
    const initialSlides = getSlides(initialKey);

    wrapper.replaceChildren(...initialSlides);
    setActiveTab(initialKey);

    const swiper = new Swiper(slider, {
        slidesPerView: 1,
        speed: 520,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        navigation: {
            prevEl: prev,
            nextEl: next
        },
        pagination: {
            el: pagination,
            clickable: true
        }
    });

    const loadTexture = (key) => {
        const slides = getSlides(key);
        if (!slides.length) return;

        setActiveTab(key);

        swiper.removeAllSlides();
        swiper.appendSlide(slides);
        swiper.update();
        swiper.slideTo(0, 0, false);
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const key = tab.dataset.texture;

            if (tab.classList.contains('is-active')) {
                swiper.slideTo(0);
                return;
            }

            loadTexture(key);
        });
    });
})();
