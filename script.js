// =============================================================================
// 1. THEME TOGGLE & MOBILE MENU
// =============================================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}

themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// =============================================================================
// 2. LOADER FADE OUT
// =============================================================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    // Keep loader for at least 3 seconds, or until load, whichever is longer
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Wait for transition
    }, 3000); // 3 seconds visible time
});

// =============================================================================
// 3. THREE.JS GALAXY BACKGROUND
// =============================================================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

function buildStarTexture(color1 = '#ffffff', color2 = 'rgba(0,0,0,0)') {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, color1);
    grad.addColorStop(0.2, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.4, 'rgba(255,100,100,0.4)');
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
}
const starTex = buildStarTexture('#ffffff');

function createStars(total, spreadFactor = 10, sizeRange = [0.02, 0.1]) {
    const positions = new Float32Array(total * 3);
    const sizes = new Float32Array(total);
    const colors = new Float32Array(total * 3);
    for (let i = 0; i < total; i++) {
        const i3 = i * 3;
        const r = Math.random() * spreadFactor;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 1.0;
        positions[i3] = Math.cos(theta) * r * (0.6 + Math.random() * 0.6);
        positions[i3 + 1] = y;
        positions[i3 + 2] = Math.sin(theta) * r * (0.6 + Math.random() * 0.6);
        const t = Math.random();
        if (t < 0.7) {
            const grey = 0.5 + Math.random() * 0.5;
            colors[i3] = grey; colors[i3 + 1] = grey; colors[i3 + 2] = grey;
        } else if (t < 0.95) {
            colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1;
        } else {
            colors[i3] = 1; colors[i3 + 1] = Math.random() * 0.5; colors[i3 + 2] = Math.random() * 0.3;
        }
        sizes[i] = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    const material = new THREE.PointsMaterial({
        size: 0.03, map: starTex, alphaTest: 0.5, transparent: true,
        vertexColors: true, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const points = new THREE.Points(g, material);
    points.rotation.y = Math.random() * Math.PI * 2;
    return points;
}

const stars1 = createStars(1500, 10, [0.03, 0.08]);
const stars2 = createStars(1000, 7, [0.05, 0.12]);
const stars3 = createStars(500, 5, [0.08, 0.15]);
stars2.rotation.y += Math.PI / 4;
stars3.rotation.y -= Math.PI / 4;
scene.add(stars1); scene.add(stars2); scene.add(stars3);

const scrollSpeed = 0.00005;
const animate = () => {
    requestAnimationFrame(animate);
    stars1.rotation.y += scrollSpeed * 0.5;
    stars2.rotation.y += scrollSpeed * 1.5;
    stars3.rotation.y += scrollSpeed * 2.5;
    renderer.render(scene, camera);
};
animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// =============================================================================
// 4. TEXT ANIMATIONS (JAPANESE TO ENGLISH EFFECT)
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {

    // 1. NAME CYCLE
    const nameElement = document.getElementById("name-cycle");
    if (nameElement) {
        const phrases = ["Salman Farsi ’s", "サルマン・ファルシの"];
        let phraseIndex = 0, charIndex = 0, isDeleting = false;
        const waitTime = 2500;

        function loopName() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) charIndex--; else charIndex++;
            nameElement.textContent = currentPhrase.substring(0, charIndex);

            if (phraseIndex === 1) {
                nameElement.style.fontFamily = "'Noto Sans JP', sans-serif";
                nameElement.style.fontSize = "0.9em";
            } else {
                nameElement.style.fontFamily = "'Poppins', sans-serif";
                nameElement.style.fontSize = "1em";
            }

            let typeSpeed = 100;
            if (isDeleting) {
                typeSpeed = 50;
                nameElement.classList.add("typing");
                nameElement.classList.remove("blinking");
            } else {
                typeSpeed = Math.floor(Math.random() * (150 - 80 + 1) + 80);
                nameElement.classList.add("typing");
                nameElement.classList.remove("blinking");
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = waitTime;
                nameElement.classList.remove("typing");
                nameElement.classList.add("blinking");
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            setTimeout(loopName, typeSpeed);
        }
        loopName();
    }

    // 2. JAPANESE -> ENGLISH TYPING LOOP
    const container = document.getElementById("typing-text");
    if (container) {
        // --- SETTINGS ---
        const minSpeed = 30;    // Fastest typing
        const maxSpeed = 70;    // Slowest typing
        const deleteSpeed = 10; // Deleting speed
        const readDelay = 6000; // Time to read (6s)
        const restartDelay = 1000;

        // --- JAPANESE KATAKANA CHARACTERS ---
        const glitchChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

        const rawHTML = container.innerHTML.trim();
        container.innerHTML = "";
        const cursor = document.createElement("span");
        cursor.className = "cursor-bar blinking";
        container.appendChild(cursor);

        let isTyping = true;
        let charIndex = 0;

        const lines = rawHTML.split(/<br\s*\/?>/i);
        let allChars = [];
        lines.forEach((line, lIndex) => {
            const cleanLine = line.replace(/\n/g, "").trim();
            for (let i = 0; i < cleanLine.length; i++) {
                allChars.push({ char: cleanLine[i], isBr: false });
            }
            if (lIndex < lines.length - 1) {
                allChars.push({ char: "", isBr: true });
            }
        });

        function typeLoop() {
            if (isTyping) {
                if (charIndex < allChars.length) {
                    cursor.classList.remove("blinking");
                    cursor.classList.add("typing");

                    const charObj = allChars[charIndex];

                    if (charObj.isBr) {
                        const br = document.createElement("br");
                        cursor.before(br);
                    } else {
                        const span = document.createElement("span");
                        span.className = "char";

                        // 1. Show Random Japanese Character
                        span.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        span.classList.add("decoding");
                        cursor.before(span);

                        // 2. Decode to English after 80ms
                        setTimeout(() => {
                            span.textContent = charObj.char;
                            span.classList.remove("decoding");
                            span.classList.add("visible");
                        }, 80);
                    }

                    charIndex++;
                    const randomSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
                    setTimeout(typeLoop, randomSpeed);

                } else {
                    cursor.classList.remove("typing");
                    cursor.classList.add("blinking");
                    isTyping = false;
                    setTimeout(typeLoop, readDelay);
                }

            } else {
                if (charIndex > 0) {
                    cursor.classList.remove("blinking");
                    cursor.classList.add("typing");
                    const previousEl = cursor.previousSibling;
                    if (previousEl) previousEl.remove();
                    charIndex--;
                    setTimeout(typeLoop, deleteSpeed);
                } else {
                    isTyping = true;
                    cursor.classList.remove("typing");
                    cursor.classList.add("blinking");
                    setTimeout(typeLoop, restartDelay);
                }
            }
        }
        setTimeout(typeLoop, 500);
    }
});

// =============================================================================
// 5. TABS & FORM
// =============================================================================
function opentab(tabname, event) {
    var tablinks = document.getElementsByClassName("tab-links");
    var tabcontents = document.getElementsByClassName("tab-contents");
    for (var i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active-link");
    for (var i = 0; i < tabcontents.length; i++) tabcontents[i].classList.remove("active-tab");
    if (event) event.currentTarget.classList.add("active-link");
    var targetContent = document.getElementById(tabname);
    if (targetContent) targetContent.classList.add("active-tab");
}

const scriptURL = 'YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");
if(form){
    form.addEventListener('submit', e => {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                msg.innerHTML = "Message Sent Successfully!";
                setTimeout(function () { msg.innerHTML = "" }, 5000);
                form.reset();
            })
            .catch(error => console.error('Error!', error.message));
    });
}

// =============================================================================
// 6. BATMAN MOBILE TOUCH FIX
// =============================================================================
const batmanBtn = document.querySelector('.batman-btn');
if (batmanBtn) {
    batmanBtn.addEventListener('touchstart', (e) => {
        batmanBtn.classList.add('touch-active');
    }, {passive: true});

    batmanBtn.addEventListener('touchend', () => {
        setTimeout(() => {
            batmanBtn.classList.remove('touch-active');
        }, 200);
    });
}
