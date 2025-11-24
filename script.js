document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            // Animate hamburger to X
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            if (mobileMenuBtn.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                // We need a 3rd bar for standard hamburger, but I used 2 in CSS. 
                // Let's adjust logic or CSS. 
                // Actually, let's keep it simple: toggle class and let CSS handle it if I added styles.
                // I didn't add specific transform styles for .active in CSS for the bars.
                // Let's add inline styles for now or rely on a class.
                // Re-checking CSS: I didn't add .mobile-menu-btn.active .bar styles.
                // I will add simple inline transforms here for immediate effect.
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                const bars = mobileMenuBtn.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    });

    // Smooth Scroll (Polyfill-like behavior if CSS scroll-behavior fails or for more control)
    // CSS scroll-behavior: smooth is already in style.css, so this is just a fallback/enhancement
    // ensuring it works on all anchors.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Fade In on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in to sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    const systemIcon = themeToggleBtn.querySelector('.system-icon');
    const siteLogo = document.getElementById('site-logo');

    // Function to update UI icons based on current state
    const updateIcons = (state) => {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'none';
        systemIcon.style.display = 'none';

        if (state === 'light') {
            sunIcon.style.display = 'block'; // Current is Light
        } else if (state === 'dark') {
            moonIcon.style.display = 'block'; // Current is Dark
        } else {
            systemIcon.style.display = 'block'; // Current is System
        }
    };

    // Function to apply theme
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'light') {
            siteLogo.src = 'assets/logo-black.png';
        } else {
            siteLogo.src = 'assets/logo-white.png';
        }
    };

    const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to set state
    const setState = (state) => {
        localStorage.setItem('themeState', state);
        updateIcons(state);

        if (state === 'system') {
            applyTheme(systemThemeMedia.matches ? 'dark' : 'light');
        } else {
            applyTheme(state);
        }
    };

    // Initial Load
    const savedState = localStorage.getItem('themeState') || 'system';
    setState(savedState);

    // Listen for system theme changes
    const handleSystemThemeChange = (e) => {
        if (localStorage.getItem('themeState') === 'system') {
            console.log('System theme changed:', e.matches ? 'Dark' : 'Light');
            applyTheme(e.matches ? 'dark' : 'light');
        }
    };

    // Support for different browser implementations
    if (systemThemeMedia.addEventListener) {
        systemThemeMedia.addEventListener('change', handleSystemThemeChange);
    } else {
        systemThemeMedia.addListener(handleSystemThemeChange);
    }

    // Toggle Click Handler
    themeToggleBtn.addEventListener('click', () => {
        const currentState = localStorage.getItem('themeState') || 'system';
        let newState;

        if (currentState === 'light') {
            newState = 'dark';
        } else if (currentState === 'dark') {
            newState = 'system';
        } else {
            newState = 'light';
        }

        setState(newState);
    });
});
