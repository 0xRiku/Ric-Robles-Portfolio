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

const initAnimations = () => {
    animateOnScroll();
    const heroText = document.querySelector('.hero-text');
    const codeCard = document.querySelector('.code-card');
    if (heroText) {
        heroText.classList.add('animate-slide-left', 'animate-delay-1');
    }
    if (codeCard) {
        codeCard.classList.add('animate-slide-right', 'animate-delay-2');
    }
};

const addHoverAnimations = () => {
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
};

const initTypingAnimation = () => {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.5}s`;
        line.classList.add('animate-fade-in');
    });
};

const initFloatingAnimations = () => {
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-scale');
    });
};

const initProjectHoverEffects = () => {
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
};

export {
    animateOnScroll,
    initAnimations,
    addHoverAnimations,
    initTypingAnimation,
    initFloatingAnimations,
    initProjectHoverEffects
}; 