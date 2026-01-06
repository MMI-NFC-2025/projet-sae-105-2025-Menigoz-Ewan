document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.header__menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.mobile-menu__close');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    if (!menuButton || !mobileMenu) {
        return;
    }

    // Function to close menu
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        menuButton.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    // Function to open menu
    const openMenu = () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        menuButton.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    // Toggle menu with hamburger button
    menuButton.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu with close button (X)
    if (closeButton) {
        closeButton.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on overlay
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('.mobile-menu__link1, .mobile-menu__link2').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = document.querySelector('.carousel__track');
        const cards = document.querySelectorAll('.carousel .card');
        const prevBtn = document.querySelector('.carousel__btn--prev');
        const nextBtn = document.querySelector('.carousel__btn--next');
        const dotsContainer = document.querySelector('.carousel__dots');
        const wrapper = document.querySelector('.carousel__wrapper');

        const cardWidth = cards[0].offsetWidth + 12; // card width + gap
        let currentPosition = 0;
        let isDragging = false;
        let startX = 0;
        let dragDistance = 0;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel__dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.carousel__dot');

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.round(currentPosition / cardWidth));
            });
        };

        const goToSlide = (index) => {
            currentPosition = Math.max(0, Math.min(index * cardWidth, (cards.length - 1) * cardWidth));
            track.style.transition = 'transform 0.4s ease';
            track.style.transform = `translateX(-${currentPosition}px)`;
            updateDots();
        };

        // Mouse/Touch drag functionality
        wrapper.addEventListener('mousedown', startDrag);
        wrapper.addEventListener('touchstart', startDrag);

        function startDrag(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            dragDistance = 0;
            track.style.transition = 'none';
        }

        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('touchmove', moveDrag);

        function moveDrag(e) {
            if (!isDragging) return;

            const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            dragDistance = startX - currentX;

            const newPosition = currentPosition + dragDistance;
            track.style.transform = `translateX(-${newPosition}px)`;
        }

        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;

            // Determine if swipe was significant enough
            const threshold = cardWidth * 0.2; // 20% of card width

            if (Math.abs(dragDistance) > threshold) {
                if (dragDistance > 0) {
                    // Swiped left - go to next slide
                    if (currentPosition < (cards.length - 1) * cardWidth) {
                        currentPosition += cardWidth;
                    }
                } else {
                    // Swiped right - go to previous slide
                    if (currentPosition > 0) {
                        currentPosition -= cardWidth;
                    }
                }
            }

            track.style.transition = 'transform 0.4s ease';
            track.style.transform = `translateX(-${currentPosition}px)`;
            updateDots();
        }

        prevBtn.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition -= cardWidth;
                track.style.transition = 'transform 0.4s ease';
                track.style.transform = `translateX(-${currentPosition}px)`;
                updateDots();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPosition < (cards.length - 1) * cardWidth) {
                currentPosition += cardWidth;
                track.style.transition = 'transform 0.4s ease';
                track.style.transform = `translateX(-${currentPosition}px)`;
                updateDots();
            }
        });
    }
});
