const elementInViewport = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= ((window.innerHeight || document.documentElement.clientHeight) / dividend));
};

const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop > (window.innerHeight || document.documentElement.clientHeight));
};

const handleHeaderScroll = () => {
    const header = document.querySelector('.sticky-header');
    let lastScrollTop = 0;
    
    return () => {
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
};

const handleScrollAnimation = () => {
    const scrollElements = document.querySelectorAll('.section-header, .project-card, .achievement-card, .about-image, .about-text');
    
    return () => {
        scrollElements.forEach((el) => {
            if (elementInViewport(el, 1.25)) {
                el.classList.add('visible');
            } else if (elementOutofView(el)) {
                el.classList.remove('visible');
            }
        });
    };
};

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                document.querySelectorAll('nav ul li a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
};

const throttle = (callback, time) => {
    let throttleTimer;
    return () => {
        if (throttleTimer) return;
        
        throttleTimer = true;
        setTimeout(() => {
            callback();
            throttleTimer = false;
        }, time);
    };
};

export {
    elementInViewport,
    elementOutofView,
    handleHeaderScroll,
    handleScrollAnimation,
    initSmoothScroll,
    throttle
}; 