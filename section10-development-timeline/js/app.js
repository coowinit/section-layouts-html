(() => {
    const root = document.querySelector('#section10');
    if (!root || typeof Swiper === 'undefined') return;

    const slider = root.querySelector('.history');
    const pagination = root.querySelector('.pagination');

    if (!slider) return;

    new Swiper(slider, {
        slidesPerView: 1.08,
        spaceBetween: 16,
        speed: 520,
        grabCursor: true,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        pagination: {
            el: pagination,
            clickable: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20
            }
        }
    });
})();
