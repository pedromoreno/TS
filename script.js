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
            'assets/gallery/boda/IMG_0347-3cb3fd42-1000.jpg',
            'assets/gallery/boda/IMG_0360-6b36c920-1000.jpg',
            'assets/gallery/boda/IMG_0398-ce047fb1-1000.jpg',
            'assets/gallery/boda/IMG_0413-6fc139a1-1000.jpg',
            'assets/gallery/boda/IMG_0728-9d76bb52-1000.jpg',
            'assets/gallery/boda/IMG_0895-2d4ab481-1000.jpg',
            'assets/gallery/boda/IMG_1051-06db757f-1000.jpg',
            'assets/gallery/boda/IMG_2076-e8318828-1000.jpg',
            'assets/gallery/boda/IMG_2137-3ffadd78-1000.jpg',
            'assets/gallery/boda/IMG_2161-bb434ccb-1000.jpg',
            'assets/gallery/boda/IMG_2283-49f4ce38-1000.jpg',
            'assets/gallery/boda/IMG_7346-212778f6-1000.jpg',
            'assets/gallery/boda/IMG_7356-2-d390fa05-1000.jpg',
            'assets/gallery/boda/IMG_7456-80e23ee6-1000.jpg',
            'assets/gallery/boda/IMG_7517-7255bc15-1000.jpg'
        ],
        comunion: [
            'assets/gallery/comunion/DSCF0804-bc404f67-1500.jpg',
            'assets/gallery/comunion/DSCF0879-feb3d3b1-1500.jpg',
            'assets/gallery/comunion/DSCF0949-1d90ec5b-1500.jpg',
            'assets/gallery/comunion/DSCF2214-8bf5618a-1500.jpg',
            'assets/gallery/comunion/DSCF2344-8b0cc07b-1500.jpg',
            'assets/gallery/comunion/DSCF3254-899a192f-1500.jpg',
            'assets/gallery/comunion/DSCF4337-0f61aeda-1500.jpg',
            'assets/gallery/comunion/DSCF4490-2a30213e-1500.jpg',
            'assets/gallery/comunion/DSCF4517-d887a3cd-1500.jpg',
            'assets/gallery/comunion/DSCF4659-4675d12d-1500.jpg',
            'assets/gallery/comunion/DSCF4663-b4c253de-1500.jpg',
            'assets/gallery/comunion/DSCF4690-150715ce-1500.jpg',
            'assets/gallery/comunion/DSCF4729-e7b0973d-1500.jpg',
            'assets/gallery/comunion/DSCF4756-e09159ea-1500.jpg',
            'assets/gallery/comunion/DSCF7800-3404150e-1500.jpg',
            'assets/gallery/comunion/IMG_9367-531b8f35-1500.jpg',
            'assets/gallery/comunion/IMG_9474-a1ac0dc6-1500.jpg',
            'assets/gallery/comunion/IMG_9612-03d07a1d-1500.jpg',
            'assets/gallery/comunion/IMG_9632-857b2cc4-1500.jpg',
            'assets/gallery/comunion/IMG_9766-a0a87195-1500.jpg'
        ],
        eventos: [
            'assets/gallery/eventos/L1009592-Editar-b87f18cb-1000.jpg',
            'assets/gallery/eventos/L1009636-4ac89a38-1000.jpg',
            'assets/gallery/eventos/L1010987-f0da9d7e-1000.jpg',
            'assets/gallery/eventos/L1011010-a3a8599d-1000.jpg',
            'assets/gallery/eventos/L1011029-c3bd1a48-1000.jpg',
            'assets/gallery/eventos/L1011133-70730656-1000.jpg'
        ],
        casual: [
            'assets/gallery/casual/DSCF3750-ca8e0bb9-1000.jpg',
            'assets/gallery/casual/DSCF3780-3839894a-1000.jpg',
            'assets/gallery/casual/DSCF3994-bc2f920b-1000.jpg',
            'assets/gallery/casual/DSCF4032-ab0d9670-1000.jpg',
            'assets/gallery/casual/DSCF4036-0de91eb7-1000.jpg',
            'assets/gallery/casual/DSCF4051-ac2c58a7-1000.jpg',
            'assets/gallery/casual/DSCF4069-5e9bda54-1000.jpg',
            'assets/gallery/casual/L1010167-cb4914af-1000.jpg',
            'assets/gallery/casual/L1010177-983bd04c-1000.jpg',
            'assets/gallery/casual/L1010202-6a8c52bf-1000.jpg',
            'assets/gallery/casual/L1010206-3d0966dd-1000.jpg',
            'assets/gallery/casual/L1010213-cfbee42e-1000.jpg'
        ],
        callejera: [
            'assets/gallery/callejera/tumblr_b8a53fc2a9045b94e8578611b0428299_37ec70c5_1280-5f4db867-1000.jpg',
            'assets/gallery/callejera/tumblr_o1tyvs8Bhq1qz6z4jo1_1280-fe88fe77-1000.jpg',
            'assets/gallery/callejera/tumblr_ok1spogIq91qz6z4jo1_1280-0c3f7c84-1000.jpg',
            'assets/gallery/callejera/tumblr_oltpoy9KbM1qz6z4jo1_1280-bc037357-1000.jpg',
            'assets/gallery/callejera/tumblr_om4yklVP1I1qz6z4jo1_1280-4eb4f1a4-1000.jpg',
            'assets/gallery/callejera/tumblr_omgskmqsmW1qz6z4jo1_1280-135fe95a-1000.jpg',
            'assets/gallery/callejera/tumblr_ootov5rmnJ1qz6z4jo1_1280-1333b429-1000.jpg',
            'assets/gallery/callejera/tumblr_osh1c2Ntrz1qz6z4jo1_1280-02a6a099-1000.jpg',
            'assets/gallery/callejera/tumblr_osh1gcGpsx1qz6z4jo1_1280-3fefe673-1000.jpg',
            'assets/gallery/callejera/tumblr_oshepypdIu1qz6z4jo1_1280-cd586480-1000.jpg',
            'assets/gallery/callejera/tumblr_osrqaqoOrJ1qz6z4jo1_1280-bcc96163-1000.jpg',
            'assets/gallery/callejera/tumblr_owe8lfoq7N1qz6z4jo1_1280-6badbec1-1000.jpg',
            'assets/gallery/callejera/tumblr_ozeq22Jsfq1qz6z4jo1_1280-1-a43f27ab-1000.jpg',
            'assets/gallery/callejera/tumblr_ozk487A5Jc1qz6z4jo1_1280-62a2b1ca-1000.jpg',
            'assets/gallery/callejera/tumblr_ozk4avVQI31qz6z4jo1_1280-b5c66e68-1000.jpg',
            'assets/gallery/callejera/tumblr_ozpjbaR6iF1qz6z4jo1_1280-e1e86ba9-1000.jpg',
            'assets/gallery/callejera/tumblr_ozpo8tw4GD1qz6z4jo1_1280-b29aaf4a-1000.jpg',
            'assets/gallery/callejera/tumblr_p0hzpm2CKR1qz6z4jo1_1280-efbba580-1000.jpg',
            'assets/gallery/callejera/tumblr_p0uyomqk5D1qz6z4jo1_1280-1d0c2773-1000.jpg',
            'assets/gallery/callejera/tumblr_p2gc8seNTV1qz6z4jo1_1280-4e7ee390-1000.jpg',
            'assets/gallery/callejera/tumblr_p47lpwMw0z1qz6z4jo1_1280-2e6ba045-1000.jpg',
            'assets/gallery/callejera/tumblr_p91bob5rIx1qz6z4jo1_1280-14032878-1000.jpg',
            'assets/gallery/callejera/tumblr_pl4y82JVJ91qz6z4jo1_1280-402d2db9-1000.jpg'
        ]
    };

    console.log('Gallery system initialized', galleryData);

    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImagesContainer = document.getElementById('gallery-images');
    const closeGalleryBtn = document.getElementById('close-gallery');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            const images = galleryData[category];

            console.log('Gallery item clicked:', category);
            console.log('Images found:', images);
            console.log('Modal element:', galleryModal);

            if (images && images.length > 0) {
                // Clear previous images
                galleryImagesContainer.innerHTML = '';

                // Add images to modal with masonry layout
                images.forEach(imageSrc => {
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = `${category} photo`;
                    img.className = 'gallery-modal-img';

                    // Calculate grid row span based on image aspect ratio
                    img.onload = function () {
                        const aspectRatio = this.naturalHeight / this.naturalWidth;
                        // Base height is 280px (minmax value), each row is 20px
                        const baseSpan = 15; // ~300px / 20px
                        const rowSpan = Math.ceil(baseSpan * aspectRatio);
                        this.style.gridRowEnd = `span ${rowSpan}`;
                    };

                    galleryImagesContainer.appendChild(img);
                });

                // Show modal
                galleryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.log('Modal opened');
            } else {
                console.log('No images for category:', category);
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
