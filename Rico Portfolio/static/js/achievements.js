const initAchievementsScroll = () => {
    const achievementsGrid = document.querySelector('.achievements-grid');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    if (!achievementsGrid) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
        isDown = true;
        achievementsGrid.style.cursor = 'grabbing';
        startX = e.pageX - achievementsGrid.offsetLeft;
        scrollLeft = achievementsGrid.scrollLeft;
        e.preventDefault();
    };

    const handleMouseLeave = () => {
        isDown = false;
        achievementsGrid.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
        isDown = false;
        achievementsGrid.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - achievementsGrid.offsetLeft;
        const walk = (x - startX) * 2;
        achievementsGrid.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        startX = e.touches[0].pageX - achievementsGrid.offsetLeft;
        scrollLeft = achievementsGrid.scrollLeft;
    };

    const handleTouchMove = (e) => {
        if (e.touches.length !== 1) return;
        const x = e.touches[0].pageX - achievementsGrid.offsetLeft;
        const walk = (x - startX) * 2;
        achievementsGrid.scrollLeft = scrollLeft - walk;
        e.preventDefault();
    };

    const updateNavButtons = () => {
        const { scrollLeft, scrollWidth, clientWidth } = achievementsGrid;
        prevButton.disabled = scrollLeft <= 0;
        nextButton.disabled = scrollLeft >= scrollWidth - clientWidth;
    };

    const handlePrevClick = () => {
        achievementsGrid.scrollBy({
            left: -320,
            behavior: 'smooth'
        });
    };

    const handleNextClick = () => {
        achievementsGrid.scrollBy({
            left: 320,
            behavior: 'smooth'
        });
    };

    const handleKeyDown = (e) => {
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
    };

    achievementsGrid.addEventListener('mousedown', handleMouseDown);
    achievementsGrid.addEventListener('mouseleave', handleMouseLeave);
    achievementsGrid.addEventListener('mouseup', handleMouseUp);
    achievementsGrid.addEventListener('mousemove', handleMouseMove);
    achievementsGrid.addEventListener('touchstart', handleTouchStart);
    achievementsGrid.addEventListener('touchmove', handleTouchMove);
    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);
    achievementsGrid.addEventListener('keydown', handleKeyDown);
    achievementsGrid.addEventListener('scroll', updateNavButtons);
    window.addEventListener('resize', updateNavButtons);
    updateNavButtons();
};

export { initAchievementsScroll }; 