document.addEventListener('DOMContentLoaded', () => {
    // Matrix FX Canvas Animation
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dots = [];
        let animationId;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            initDots();
        };

        const initDots = () => {
            dots = [];
            const dotSize = 2;
            const spacing = 25;
            const cols = Math.ceil(canvas.width / spacing);
            const rows = Math.ceil(canvas.height / spacing);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * spacing + spacing / 2;
                    const y = row * spacing + spacing / 2;
                    const dx = x - centerX;
                    const dy = y - centerY;
                    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

                    dots.push({
                        x,
                        y,
                        size: dotSize,
                        baseOpacity: 0.2 + Math.random() * 0.3,
                        distanceFromCenter,
                        flickerPhase: Math.random() * Math.PI * 2,
                        flickerSpeed: 0.8 + Math.random() * 0.4
                    });
                }
            }
        };

        const drawDots = (time) => {
            // Get background color from CSS variable
            const bgColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--bg-primary').trim() || '#050505';
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const waveSpeed = 0.0008;
            const waveProgress = (time * waveSpeed) % 1;
            const maxRadius = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
            const waveRadius = waveProgress * maxRadius * 1.5;
            const waveWidth = maxRadius * 0.15;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Get accent color from CSS variable
            const accentColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-color').trim() || '#3b82f6';

            dots.forEach(dot => {
                // Calculate wave effect
                const distanceToWave = Math.abs(dot.distanceFromCenter - waveRadius);
                const distanceNorm = distanceToWave / waveWidth;
                const waveFactor = Math.exp(-distanceNorm * distanceNorm * 4);

                // Flicker effect
                const flickerValue = Math.sin(time * 0.003 * dot.flickerSpeed + dot.flickerPhase);
                const flickerMultiplier = 0.7 + (flickerValue * 0.3);

                // Calculate opacity
                const waveOpacity = 0.3 + waveFactor * 0.7;
                let opacity = dot.baseOpacity * flickerMultiplier;
                opacity = Math.max(opacity, waveOpacity * 0.8);

                // Calculate size
                const sizeMultiplier = 1 + waveFactor * 1.5;
                const finalSize = dot.size * sizeMultiplier;

                // Draw dot
                ctx.fillStyle = waveFactor > 0.3 ? accentColor : `rgba(255, 255, 255, ${opacity})`;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, finalSize, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;
        };

        const animate = (timestamp) => {
            drawDots(timestamp);
            animationId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        animate(0);
    }

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
            const INITIAL_DURATION = 400; // Duration of random scrambling
            const REVEAL_DELAY = 40; // Delay between revealing each character

            // Initial scrambling phase
            let randomText = generateRandomText(originalText);
            const endTime = Date.now() + INITIAL_DURATION;

            while (Date.now() < endTime) {
                decipherText.textContent = randomText;
                await new Promise(resolve => setTimeout(resolve, 30));
                randomText = generateRandomText(originalText);
            }

            // Reveal phase - one character at a time
            for (let i = 0; i < originalText.length; i++) {
                await new Promise(resolve => setTimeout(resolve, REVEAL_DELAY));
                decipherText.textContent = originalText.substring(0, i + 1) + randomText.substring(i + 1);
            }

            // Ensure final text is correct
            decipherText.textContent = originalText;
        };

        // Start animation after a short delay
        setTimeout(() => {
            animateDecipher();
        }, 500);
    }
});
