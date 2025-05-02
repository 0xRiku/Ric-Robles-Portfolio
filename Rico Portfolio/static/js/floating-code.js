document.addEventListener('DOMContentLoaded', () => {
    const floatingCodes = document.querySelectorAll('.floating-code');
    const elements = Array.from(floatingCodes).map((code, i) => {
        const rect = code.getBoundingClientRect();
        return {
            element: code,
            x: Math.random() * (window.innerWidth - rect.width),
            y: Math.random() * (window.innerHeight - rect.height),
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            speed: parseFloat(code.getAttribute('data-speed')),
            width: rect.width,
            height: rect.height,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
            elementStartX: 0,
            elementStartY: 0,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.5 + Math.random() * 0.5,
            wobbleRadius: 8 + Math.random() * 8,
            index: i
        };
    });

    let tick = 0;
    function updatePositions() {
        tick += 1;
        elements.forEach(obj => {
            if (!obj.isDragging) {
                const wobbleX = Math.sin(tick * 0.02 * obj.wobbleSpeed + obj.wobblePhase) * obj.wobbleRadius;
                const wobbleY = Math.cos(tick * 0.018 * obj.wobbleSpeed + obj.wobblePhase) * obj.wobbleRadius;

                obj.x += obj.vx * obj.speed;
                obj.y += obj.vy * obj.speed;

                if (Math.random() < 0.01) {
                    obj.vx += (Math.random() - 0.5) * 0.5;
                    obj.vy += (Math.random() - 0.5) * 0.5;
                    obj.vx = Math.max(-2, Math.min(2, obj.vx));
                    obj.vy = Math.max(-2, Math.min(2, obj.vy));
                }

                const maxX = window.innerWidth - obj.width;
                const maxY = window.innerHeight - obj.height;

                if (obj.x <= 0 || obj.x >= maxX) {
                    obj.vx *= -1;
                    obj.x = obj.x <= 0 ? 0 : maxX;
                }

                if (obj.y <= 0 || obj.y >= maxY) {
                    obj.vy *= -1;
                    obj.y = obj.y <= 0 ? 0 : maxY;
                }

                obj.element.style.transform = `translate(${obj.x + wobbleX}px, ${obj.y + wobbleY}px)`;
            }
        });

        requestAnimationFrame(updatePositions);
    }

    updatePositions();

    elements.forEach(obj => {
        obj.element.addEventListener('mousedown', (e) => {
            obj.isDragging = true;
            obj.element.classList.add('dragging');
            
            obj.dragStartX = e.clientX;
            obj.dragStartY = e.clientY;
            obj.elementStartX = obj.x;
            obj.elementStartY = obj.y;
            
            obj.vx = 0;
            obj.vy = 0;

            obj.element.style.opacity = '1';
            obj.element.style.pointerEvents = 'auto';
            visibleElements.add(obj.element);
        });

        document.addEventListener('mousemove', (e) => {
            if (obj.isDragging) {
                const dx = e.clientX - obj.dragStartX;
                const dy = e.clientY - obj.dragStartY;
                
                obj.x = obj.elementStartX + dx;
                obj.y = obj.elementStartY + dy;
                
                obj.element.style.transform = `translate(${obj.x}px, ${obj.y}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (obj.isDragging) {
                obj.isDragging = false;
                obj.element.classList.remove('dragging');
                
                obj.vx = (Math.random() - 0.5) * 4;
                obj.vy = (Math.random() - 0.5) * 4;
            }
        });
    });

    window.addEventListener('resize', () => {
        const maxX = window.innerWidth;
        const maxY = window.innerHeight;

        elements.forEach(obj => {
            obj.x = Math.min(obj.x, maxX - obj.width);
            obj.y = Math.min(obj.y, maxY - obj.height);
        });
    });

    elements.forEach(obj => {
        obj.element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            obj.isDragging = true;
            obj.element.classList.add('dragging');
            
            const touch = e.touches[0];
            obj.dragStartX = touch.clientX;
            obj.dragStartY = touch.clientY;
            obj.elementStartX = obj.x;
            obj.elementStartY = obj.y;
            
            obj.vx = 0;
            obj.vy = 0;

            obj.element.style.opacity = '1';
            obj.element.style.pointerEvents = 'auto';
            visibleElements.add(obj.element);
        });

        document.addEventListener('touchmove', (e) => {
            if (obj.isDragging) {
                const touch = e.touches[0];
                const dx = touch.clientX - obj.dragStartX;
                const dy = touch.clientY - obj.dragStartY;
                
                obj.x = obj.elementStartX + dx;
                obj.y = obj.elementStartY + dy;
                
                obj.element.style.transform = `translate(${obj.x}px, ${obj.y}px)`;
            }
        });

        document.addEventListener('touchend', () => {
            if (obj.isDragging) {
                obj.isDragging = false;
                obj.element.classList.remove('dragging');
                
                obj.vx = (Math.random() - 0.5) * 4;
                obj.vy = (Math.random() - 0.5) * 4;
            }
        });
    });

    let isHovering = false;
    let hoveredElement = null;
    let disappearInterval = null;
    let visibleElements = new Set(floatingCodes);

    floatingCodes.forEach(code => {
        code.addEventListener('mouseenter', () => {
            isHovering = true;
            hoveredElement = code;
        });

        code.addEventListener('mouseleave', () => {
            isHovering = false;
            hoveredElement = null;
        });
    });

    function startDisappearing() {
        let index = visibleElements.size - 1;
        
        disappearInterval = setInterval(() => {
            if (visibleElements.size === 0 || (visibleElements.size === 1 && visibleElements.has(hoveredElement))) {
                clearInterval(disappearInterval);
                return;
            }

            const visibleArray = Array.from(visibleElements);
            let randomIndex = Math.floor(Math.random() * visibleArray.length);
            let elementToHide = visibleArray[randomIndex];

            const elementData = elements.find(e => e.element === elementToHide);

            if (elementToHide === hoveredElement || (elementData && elementData.isDragging)) {
                return;
            }

            elementToHide.style.opacity = '0';
            elementToHide.style.pointerEvents = 'none';
            visibleElements.delete(elementToHide);
        }, 1000);
    }

    const container = document.querySelector('.floating-codes');
    container.addEventListener('mouseenter', () => {
        startDisappearing();
    });

    floatingCodes.forEach(code => {
        code.style.transition = 'opacity 0.5s ease, transform 0.4s ease';
    });
}); 