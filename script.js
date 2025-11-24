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
                // Transform to X
                bars[0].style.transform = 'rotate(45deg) translateY(8px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                // Back to hamburger
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
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
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
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

        // Update theme-color meta tag for mobile browsers
        let themeColorMeta = document.querySelector('meta[name="theme-color"]:not([media])');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = theme === 'light' ? '#ffffff' : '#050505';

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

    // Category-Based Gallery System
    const galleryData = {
        boda: [
            'assets/gallery/boda/boda-1.jpg',
            'assets/gallery/boda/boda-2.jpg',
            'assets/gallery/boda/boda-3.jpg',
            'assets/gallery/boda/boda-4.jpg',
            'assets/gallery/boda/boda-5.jpg'
        ],
        comunion: [],
        eventos: [],
        casual: [],
        callejera: []
    };

    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImagesContainer = document.getElementById('gallery-images');
    const closeGalleryBtn = document.getElementById('close-gallery');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            const images = galleryData[category];

            if (images && images.length > 0) {
                // Clear previous images
                galleryImagesContainer.innerHTML = '';

                // Add images to modal
                images.forEach(imageSrc => {
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = `${category} photo`;
                    img.className = 'gallery-modal-img';
                    galleryImagesContainer.appendChild(img);
                });

                // Show modal
                galleryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on background click
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Decipher Text Animation
    const decipherText = document.getElementById('decipher-text');
    if (decipherText) {
        const originalText = decipherText.textContent;
        const charset = ['X', '$', '@', 'a', 'H', 'z', 'o', '0', 'y', '#', '?', '*', '0', '1', '+'];

        const getRandomChar = () => charset[Math.floor(Math.random() * charset.length)];

        const generateRandomText = (text) => {
            return text.split('').map(char => char === ' ' ? ' ' : getRandomChar()).join('');
        };

        const animateDecipher = async () => {
            const INITIAL_DURATION = 400;
            const REVEAL_DELAY = 40;

            let randomText = generateRandomText(originalText);
            const endTime = Date.now() + INITIAL_DURATION;

            while (Date.now() < endTime) {
                decipherText.textContent = randomText;
                await new Promise(resolve => setTimeout(resolve, 30));
                randomText = generateRandomText(originalText);
            }

            for (let i = 0; i < originalText.length; i++) {
                await new Promise(resolve => setTimeout(resolve, REVEAL_DELAY));
                decipherText.textContent = originalText.substring(0, i + 1) + randomText.substring(i + 1);
            }

            decipherText.textContent = originalText;
        };

        setTimeout(() => {
            animateDecipher();
        }, 500);
    }
});
