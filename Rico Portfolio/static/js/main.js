import { initThemeToggle } from './theme.js';
import { initMobileMenu } from './navigation.js';
import { initAchievementsScroll } from './achievements.js';
import {
    animateOnScroll,
    initAnimations,
    addHoverAnimations,
    initTypingAnimation,
    initFloatingAnimations,
    initProjectHoverEffects
} from './animations.js';
import {
    elementInViewport,
    elementOutofView,
    handleHeaderScroll,
    handleScrollAnimation,
    initSmoothScroll,
    throttle
} from './scroll.js';

let lastScrollTop = 0;
const header = document.querySelector('.sticky-header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 10) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
}); 

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-header, .project-card, .skill-category, .achievement-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('load', () => {
    animateOnScroll();
    
    const heroText = document.querySelector('.hero-text');
    const codeCard = document.querySelector('.code-card');
    
    if (heroText) {
        heroText.classList.add('animate-slide-left');
        heroText.classList.add('animate-delay-1');
    }
    
    if (codeCard) {
        codeCard.classList.add('animate-slide-right');
        codeCard.classList.add('animate-delay-2');
    }
});

window.addEventListener('scroll', () => {
    animateOnScroll();
});

const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2) rotate(10deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0)';
    });
});

const codeLines = document.querySelectorAll('.code-line');
codeLines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.5}s`;
    line.classList.add('animate-fade-in');
});


const achievementCards = document.querySelectorAll('.achievement-card');
achievementCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.classList.add('animate-scale');
});

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const achievementsGrid = document.querySelector('.achievements-grid');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    if (achievementsGrid) {
        let isDown = false;
        let startX;
        let scrollLeft;

        achievementsGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            achievementsGrid.style.cursor = 'grabbing';
            startX = e.pageX - achievementsGrid.offsetLeft;
            scrollLeft = achievementsGrid.scrollLeft;
            
            e.preventDefault();
        });

        achievementsGrid.addEventListener('mouseleave', () => {
            isDown = false;
            achievementsGrid.style.cursor = 'grab';
        });

        achievementsGrid.addEventListener('mouseup', () => {
            isDown = false;
            achievementsGrid.style.cursor = 'grab';
        });

        achievementsGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - achievementsGrid.offsetLeft;
            const walk = (x - startX) * 2;
            achievementsGrid.scrollLeft = scrollLeft - walk;
        });

        achievementsGrid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - achievementsGrid.offsetLeft;
            scrollLeft = achievementsGrid.scrollLeft;
        });

        achievementsGrid.addEventListener('touchmove', (e) => {
            if (e.touches.length !== 1) return;
            const x = e.touches[0].pageX - achievementsGrid.offsetLeft;
            const walk = (x - startX) * 2;
            achievementsGrid.scrollLeft = scrollLeft - walk;
            e.preventDefault();
        });

        const updateNavButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = achievementsGrid;
            prevButton.disabled = scrollLeft <= 0;
            nextButton.disabled = scrollLeft >= scrollWidth - clientWidth;
        };

        prevButton.addEventListener('click', () => {
            achievementsGrid.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        });

        nextButton.addEventListener('click', () => {
            achievementsGrid.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        });

        achievementsGrid.addEventListener('scroll', updateNavButtons);
        window.addEventListener('resize', updateNavButtons);
        updateNavButtons();

        achievementsGrid.addEventListener('keydown', (e) => {
            const focusedCard = document.activeElement;
            if (!focusedCard.classList.contains('achievement-card')) return;

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextCard = focusedCard.nextElementSibling;
                if (nextCard) {
                    nextCard.focus();
                    nextCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevCard = focusedCard.previousElementSibling;
                if (prevCard) {
                    prevCard.focus();
                    prevCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initAchievementsScroll();
    initAnimations();
    addHoverAnimations();
    initTypingAnimation();
    initFloatingAnimations();
    initProjectHoverEffects();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const headerScrollHandler = handleHeaderScroll();
    const scrollAnimationHandler = handleScrollAnimation();

    window.addEventListener('scroll', () => {
        headerScrollHandler();
        if (mediaQuery && !mediaQuery.matches) {
            throttle(scrollAnimationHandler, 250)();
        }
    });

    const scrollElements = document.querySelectorAll('.section-header, .project-card, .achievement-card, .about-image, .about-text');
    scrollElements.forEach((el) => {
        el.classList.add('js-opacity');
        if (elementInViewport(el, 1.25)) {
            el.classList.add('visible');
        }
    });
}); 