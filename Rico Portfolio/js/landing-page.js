const header = document.querySelector('.sticky-header');
const nav = document.querySelector('nav');
const scrollElements = document.querySelectorAll('.section-header, .project-card, .achievement-card, .about-image, .about-text');
const projects = document.querySelectorAll('.project-card');
const scrollIndicator = document.querySelector('.scroll-indicator');

scrollElements.forEach((el) => {
    el.classList.add('js-opacity');
});

const elementInViewport = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= ((window.innerHeight || document.documentElement.clientHeight) / dividend));
};

const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop > (window.innerHeight || document.documentElement.clientHeight));
};

let lastScrollTop = 0;
const handleHeaderScroll = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScrollTop > 100) {
        if (currentScrollTop > lastScrollTop) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
    } else {
        header.classList.remove('hidden');
    }
    
    lastScrollTop = currentScrollTop;
};

const displayScrollElement = (element) => {
    element.classList.add('visible');
};

const hideScrollElement = (element) => {
    element.classList.remove('visible');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInViewport(el, 1.25)) {
            displayScrollElement(el);
        } else if (elementOutofView(el)) {
            hideScrollElement(el);
        }
    });
};

projects.forEach((el) => {
    el.addEventListener('click', () => {
        el.classList.toggle('active');
    });
});

let throttleTimer;
const throttle = (callback, time) => {
    if (throttleTimer) return;
    
    throttleTimer = true;
    setTimeout(() => {
        callback();
        throttleTimer = false;
    }, time);
};

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

window.addEventListener('scroll', () => {
    handleHeaderScroll();
    if (mediaQuery && !mediaQuery.matches) {
        throttle(handleScrollAnimation, 250);
    }
});

window.addEventListener('load', () => {
    handleScrollAnimation();
});

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
let isMenuOpen = false;

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
    nav.setAttribute('aria-expanded', isMenuOpen);
    
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);

document.addEventListener('click', (e) => {
    if (isMenuOpen && !nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        toggleMobileMenu();
    }
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    });
});

const themeSwitcher = document.querySelector('.theme-switcher');
const themeToggle = themeSwitcher.querySelector('.theme-toggle');
const themeDropdown = themeSwitcher.querySelector('.theme-dropdown');
const themeOptions = themeSwitcher.querySelectorAll('.theme-option');
let isThemeDropdownOpen = false;

function toggleThemeDropdown() {
    isThemeDropdownOpen = !isThemeDropdownOpen;
    themeSwitcher.setAttribute('aria-expanded', isThemeDropdownOpen);
    themeDropdown.setAttribute('aria-hidden', !isThemeDropdownOpen);
}

themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleThemeDropdown();
});

document.addEventListener('click', (e) => {
    if (isThemeDropdownOpen && !themeSwitcher.contains(e.target)) {
        toggleThemeDropdown();
    }
});

themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        document.body.className = theme;
        toggleThemeDropdown();
        
        localStorage.setItem('theme', theme);
    });
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.className = savedTheme;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isMenuOpen) {
            toggleMobileMenu();
        }
        if (isThemeDropdownOpen) {
            toggleThemeDropdown();
        }
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-header, .project-card, .achievement-card, .about-image, .about-text').forEach(el => {
    observer.observe(el);
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-duration', '0ms');
}

const prefersHighContrast = window.matchMedia('(forced-colors: active)');
if (prefersHighContrast.matches) {
    document.documentElement.classList.add('high-contrast');
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('contact-email').value;
        console.log('Form submitted:', email);
    });
}

const typingLines = document.querySelectorAll('.typing-line');
const codeContent = document.querySelector('.code-content');

function moveCursorToNextLine(currentLine) {
    currentLine.classList.remove('active');
    const nextLine = currentLine.nextElementSibling;
    if (nextLine && nextLine.classList.contains('typing-line')) {
        nextLine.classList.add('active');
    } else {
        codeContent.classList.add('all-typed');
    }
}

typingLines[0].classList.add('active');

typingLines.forEach((line, index) => {
    const delay = parseFloat(getComputedStyle(line).getPropertyValue('--typing-delay'));
    const duration = parseFloat(getComputedStyle(line).getPropertyValue('--typing-duration'));
    const charCount = parseInt(getComputedStyle(line).getPropertyValue('--char-count'));
    
    line.style.animation = `typing ${duration}s steps(${charCount}) ${delay}s forwards`;
    
    setTimeout(() => {
        line.classList.add('typed');
        moveCursorToNextLine(line);
    }, (delay + duration) * 1000);
});

const glowCodeCard = document.querySelector('.code-card');
const CONFIG = {
    proximity: 40,
    spread: 80,
    blur: 20,
    opacity: 0,
};

const updateGlow = (event) => {
    if (!glowCodeCard) return;

    const bounds = glowCodeCard.getBoundingClientRect();
    const center = [
        bounds.left + bounds.width * 0.5,
        bounds.top + bounds.height * 0.5
    ];

    if (
        event?.x > bounds.left - CONFIG.proximity &&
        event?.x < bounds.left + bounds.width + CONFIG.proximity &&
        event?.y > bounds.top - CONFIG.proximity &&
        event?.y < bounds.top + bounds.height + CONFIG.proximity
    ) {
        glowCodeCard.style.setProperty('--active', 1);
    } else {
        glowCodeCard.style.setProperty('--active', CONFIG.opacity);
    }

    let angle = Math.atan2(event?.y - center[1], event?.x - center[0]) * 180 / Math.PI;
    angle = angle < 0 ? angle + 360 : angle;
    glowCodeCard.style.setProperty('--start', angle + 90);
};

document.body.addEventListener('pointermove', updateGlow);

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        document.body.classList.add('home-page');
    } else {
        document.body.classList.add('not-home');
    }

    const header = document.querySelector('.sticky-header');
    let headerLastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > headerLastScrollY && currentScrollY > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        headerLastScrollY = currentScrollY;
    });

    const polygons = document.querySelectorAll('.polygon');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 1 : -1;

        polygons.forEach((polygon, index) => {
            const speed = (index + 1) * 0.1;
            const y = (currentScrollY * speed * scrollDirection) * 0.2;
            polygon.style.transform = `translateY(${y}px)`;
        });

        lastScrollY = currentScrollY;
    });

    const previewCard = document.querySelector('.preview-card');
    if (previewCard) {
        previewCard.addEventListener('mousemove', (e) => {
            const rect = previewCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            previewCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        previewCard.addEventListener('mouseleave', () => {
            previewCard.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(5deg)';
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.quick-link-card').forEach(card => {
        observer.observe(card);
        card.classList.add('fade-up');
    });

    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseover', () => {
            tag.style.transform = 'translateY(-5px)';
            tag.style.background = 'var(--accent-color)';
        });

        tag.addEventListener('mouseout', () => {
            tag.style.transform = 'translateY(0)';
            tag.style.background = 'var(--primary-bg)';
        });
    });
});

const showNotification = () => {
    const notification = document.getElementById('download-notification');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
};

document.querySelectorAll('.resume-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification();
    });
});