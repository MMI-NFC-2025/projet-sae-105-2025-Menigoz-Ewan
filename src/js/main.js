document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.header__menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.mobile-menu__close');
    let overlay = null;

    if (menuButton && mobileMenu) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            menuButton.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };

        const openMenu = () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            menuButton.classList.add('active');
            document.body.classList.add('no-scroll');
        };

        menuButton.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (closeButton) {
            closeButton.addEventListener('click', closeMenu);
        }

        overlay.addEventListener('click', closeMenu);

        mobileMenu.querySelectorAll('.mobile-menu__link1, .mobile-menu__link2').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });
    }

    initCarousels();
});

function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');

    if (!carousels.length) {
        return;
    }

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel__track');
        const wrapper = carousel.querySelector('.carousel__wrapper');
        const slides = track ? Array.from(track.children) : [];
        const prevBtn = carousel.querySelector('.carousel__btn--prev');
        const nextBtn = carousel.querySelector('.carousel__btn--next');
        const dotsContainer = carousel.parentElement.querySelector('.carousel__dots');

        if (!track || !wrapper || !slides.length) {
            return;
        }

        let currentIndex = 0;
        let isDragging = false;
        let startX = 0;
        let dragDistance = 0;
        let step = 0;
        let dots = [];

        const calculateStep = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const gapValue = parseFloat(getComputedStyle(track).gap);
            step = slideWidth + (Number.isNaN(gapValue) ? 0 : gapValue);
        };

        const setTransition = (enabled) => {
            track.style.transition = enabled ? 'transform 0.45s ease' : 'none';
        };

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const goToSlide = (index, animate = true) => {
            currentIndex = Math.max(0, Math.min(index, slides.length - 1));
            setTransition(animate);
            track.style.transform = `translateX(-${currentIndex * step}px)`;
            updateDots();
        };

        if (dotsContainer) {
            dotsContainer.innerHTML = '';

            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel__dot' + (index === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });

            dots = Array.from(dotsContainer.querySelectorAll('.carousel__dot'));
        }

        calculateStep();
        goToSlide(0, false);

        const handleResize = () => {
            calculateStep();
            goToSlide(currentIndex, false);
        };

        window.addEventListener('resize', handleResize);

        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            dragDistance = 0;
            setTransition(false);
        };

        const moveDrag = (e) => {
            if (!isDragging) {
                return;
            }

            const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            dragDistance = startX - currentX;

            track.style.transform = `translateX(-${currentIndex * step + dragDistance}px)`;
        };

        const endDrag = () => {
            if (!isDragging) {
                return;
            }

            isDragging = false;
            const threshold = step * 0.2;

            if (Math.abs(dragDistance) > threshold) {
                if (dragDistance > 0 && currentIndex < slides.length - 1) {
                    currentIndex += 1;
                } else if (dragDistance < 0 && currentIndex > 0) {
                    currentIndex -= 1;
                }
            }

            goToSlide(currentIndex);
        };

        wrapper.addEventListener('mousedown', startDrag);
        wrapper.addEventListener('touchstart', startDrag);
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('touchmove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        }
    });
}
