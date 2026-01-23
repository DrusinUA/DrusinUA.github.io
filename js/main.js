/**
 * Ravynix — Main JavaScript
 * Handles navigation, mobile menu, and smooth interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // State
    let isMobileMenuOpen = false;
    let lastScrollY = 0;

    /**
     * Initialize the application
     */
    function init() {
        setupMobileMenu();
        setupSmoothScroll();
        setupHeaderScroll();
        setupIntersectionObserver();
    }

    /**
     * Mobile Menu Toggle
     */
    function setupMobileMenu() {
        if (!mobileMenuToggle || !nav) return;

        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMobileMenuOpen && !nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        isMobileMenuOpen ? closeMobileMenu() : openMobileMenu();
    }

    function openMobileMenu() {
        isMobileMenuOpen = true;
        nav.classList.add('is-open');
        mobileMenuToggle.classList.add('is-active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        isMobileMenuOpen = false;
        nav.classList.remove('is-open');
        mobileMenuToggle.classList.remove('is-active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /**
     * Smooth Scroll for Navigation Links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Header Scroll Behavior
     * Adds subtle background opacity change on scroll
     */
    function setupHeaderScroll() {
        if (!header) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleHeaderScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        lastScrollY = scrollY;
    }

    /**
     * Intersection Observer for Fade-in Animations
     * Subtle entrance animations for sections
     */
    function setupIntersectionObserver() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe song cards for staggered animation
        document.querySelectorAll('.song-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 50}ms`;
            observer.observe(card);
        });

        // Observe sections
        document.querySelectorAll('.about-content, .contact-content').forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Platform Link Analytics (placeholder for future implementation)
     */
    function trackPlatformClick(platform, songTitle) {
        // Placeholder for analytics tracking
        // console.log(`Platform clicked: ${platform} for "${songTitle}"`);
    }

    // Expose tracking function for inline use if needed
    window.RavynixTrack = {
        platformClick: trackPlatformClick
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
