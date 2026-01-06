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
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
});
