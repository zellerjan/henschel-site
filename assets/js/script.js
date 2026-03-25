document.addEventListener('DOMContentLoaded', () => {

    // BURGER MENU CLASS
    const navTriggers = document.querySelectorAll('.nav-burger, nav a');
    const header = document.querySelector('header');

    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            header.classList.toggle('expanded');
        });
    });


    // SPLIDE CAROUSEL
    new Splide('.splide', {
        type: 'loop',
        fixedWidth: '200px',
        arrows: false,
        pagination: false,
        autoplay: true,
        interval: 2000,
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

    // ----------- THREE JS MOSAIC GALLERY -------------
    const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

    const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;    
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_aberrationIntensity;
    uniform vec2 u_uvRate; // Das ist der Schlüssel gegen Verzerrung

    void main() {
        // UVs korrigieren, um object-fit: cover zu simulieren
        vec2 uvCover = (vUv - 0.5) * u_uvRate + 0.5;

        float tiles = 40.0; 
        vec2 gridUV = floor(uvCover * tiles) / tiles;
        vec2 centerOfPixel = gridUV + (0.5 / tiles);
        
        vec2 mouseDirection = u_mouse - u_prevMouse;
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.2, 0.0, pixelDistanceToMouse);
 
        vec2 uvOffset = strength * - mouseDirection * 0.2;
        vec2 uv = uvCover - uvOffset;

        vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.0075, 0.0));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.0075, 0.0));

        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
    }
`;

    function createMosaicInstance(container) {
        const img = container.querySelector(".image");
        if (!img) return;

        let scene, camera, renderer, planeMesh, texture;
        let mousePosition = { x: 0.5, y: 0.5 };
        let targetMousePosition = { x: 0.5, y: 0.5 };
        let prevPosition = { x: 0.5, y: 0.5 };
        let aberrationIntensity = 0.0;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(img.src, (loadedTexture) => {
            texture = loadedTexture;
            init();
        });

        function getUvRate(containerWidth, containerHeight) {
            // Berechnet das Verhältnis zwischen Bild und Container
            const imageAspect = texture.image.width / texture.image.height;
            const containerAspect = containerWidth / containerHeight;

            let x = 1, y = 1;
            if (containerAspect > imageAspect) {
                y = imageAspect / containerAspect;
            } else {
                x = containerAspect / imageAspect;
            }
            return new THREE.Vector2(x, y);
        }

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            const shaderUniforms = {
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_aberrationIntensity: { value: 0.0 },
                u_texture: { value: texture },
                u_uvRate: { value: getUvRate(container.clientWidth, container.clientHeight) }
            };

            planeMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 2),
                new THREE.ShaderMaterial({
                    uniforms: shaderUniforms,
                    vertexShader,
                    fragmentShader
                })
            );

            scene.add(planeMesh);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            renderer.domElement.style.position = "absolute";
            renderer.domElement.style.top = "0";
            renderer.domElement.style.left = "0";
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";

            container.appendChild(renderer.domElement);
            img.style.visibility = "hidden";

            const resizeObserver = new ResizeObserver(() => {
                const w = container.clientWidth;
                const h = container.clientHeight;
                renderer.setSize(w, h, false);
                // WICHTIG: Rate bei jedem Resize neu berechnen (für responsive Spans)
                planeMesh.material.uniforms.u_uvRate.value = getUvRate(w, h);
            });
            resizeObserver.observe(container);

            container.addEventListener("mousemove", (e) => {
                const rect = container.getBoundingClientRect();
                prevPosition = { ...targetMousePosition };
                targetMousePosition.x = (e.clientX - rect.left) / rect.width;
                targetMousePosition.y = (e.clientY - rect.top) / rect.height;
                aberrationIntensity = 1.0;
            });

            animate();
        }

        function animate() {
            requestAnimationFrame(animate);
            mousePosition.x += (targetMousePosition.x - mousePosition.x) * 0.05;
            mousePosition.y += (targetMousePosition.y - mousePosition.y) * 0.05;
            planeMesh.material.uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
            planeMesh.material.uniforms.u_prevMouse.value.set(prevPosition.x, 1.0 - prevPosition.y);
            aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);
            planeMesh.material.uniforms.u_aberrationIntensity.value = aberrationIntensity;
            renderer.render(scene, camera);
        }
    }

    window.addEventListener('load', () => {
        document.querySelectorAll(".imageContainer").forEach(createMosaicInstance);
    });


    // ------------- GSAP SETTINGS FOR SVG -----------------
    gsap.from(".line-horizontal, .line-vertical", {
        duration: 2,
        attr: { x2: 0, y2: 0 }, // Shrink lines to their start point
        opacity: 0,
        stagger: {
            each: 0.1,
            from: "center" // Can be "center", "end", or "random"
        },
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".quote",
            start: "top 70%",
            toggleActions: "play pause resume reset"
        }
    });


    
    // ---------- ADD FADE IN FUNCTION FOR LIST OF ELEMENTS -------------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                // This stops the observer from ever looking at this element again
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll("h1, h2, h3, h4, p, a, b, article, label, input, textarea, .imageContainer").forEach(el => {
        el.style.transition = "opacity 0.4s ease-in, transform 0.4s ease-out";
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";

        observer.observe(el);
    });
});