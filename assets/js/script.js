document.addEventListener('DOMContentLoaded', () => {

    // BURGER MENU CLASS
    const navTriggers = document.querySelectorAll('.nav-burger, nav a');
    const header = document.querySelector('header');

    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            header.classList.toggle('expanded');
        });
    });

    // TILT EFFECT 
    $('[data-tilt]').tilt({
        maxTilt: 20,
        perspective: 5000,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        glare: true,
        maxGlare: .2,
        reset: false,
    });

    // SPLIDE CAROUSEL
    new Splide('.splide', {
        type: 'loop',
        fixedWidth: '200px',
        arrows: false,
        pagination: false,
        autoplay: true,
        interval: 1500,
        pauseOnHover: false,
        perMove: 1,
        easing: 'ease',
    }).mount();

    // HERO PARALLAX MOVEMENT BACKGROUND IMAGE
    function initHeroParallax() {
        const hero = document.querySelector('section.hero');
        const header = document.querySelector('header');

        const initialStyle = window.getComputedStyle(hero);
        const originalBaseSize = parseFloat(initialStyle.backgroundSize) || 60;

        window.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 750) return;

            const heroRect = hero.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();
            const areaTop = headerRect.top;
            const areaBottom = heroRect.bottom;

            if (e.clientY >= areaTop && e.clientY <= areaBottom) {
                // Relative mouse position from -0.5 to 0.5
                const mouseXShift = (e.clientX / window.innerWidth) - 0.5;
                const mouseYShift = ((e.clientY - areaTop) / (areaBottom - areaTop)) - 0.5;

                // Pixel-based offsets:
                // 40 is the intensity. Adjust this for more/less movement.
                const moveX = mouseXShift * 100;
                const moveY = mouseYShift * 100;

                hero.style.backgroundSize = `${originalBaseSize + 3}%`;

                // We use 'calc(50% + offset)' to keep it centered but move it by pixels
                // This prevents the "reversal" bug entirely.
                hero.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
            } else {
                hero.style.backgroundSize = '';
                hero.style.backgroundPosition = '';
            }
        });
    }

    initHeroParallax();

});