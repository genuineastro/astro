// ========== STARFIELD ==========
(function () {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    function initStars() {
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 5000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 0.4 + 1.2,
                opacity: Math.random(),
                speed: Math.random() * 1.4 + 5.1,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = Date.now() / 1000;
        stars.forEach(s => {
            const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.twinkle));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 210, ${alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    draw();
})();

// ========== MOBILE MENU ==========
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========== COUNT UP ==========
function countUp(el, target, suffix) {
    let current = 0;
    const step = target / 70;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current >= target) clearInterval(timer);
    }, 22);
}
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('[data-count]');
            els.forEach(el => {
                const target = parseInt(el.getAttribute('data-count'));
                countUp(el, target);
            });
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });
const trustGrid = document.querySelector('.trust-grid');
if (trustGrid) countObserver.observe(trustGrid);

// ========== TESTIMONIAL CAROUSEL ==========
let testiIndex = 0;
const track = document.getElementById('testiTrack');
const cards = track.querySelectorAll('.testi-card');
const dotsEl = document.getElementById('testiDots');
let cardsPerView = 3;

function getCardsPerView() {
    return window.innerWidth < 700 ? 1 : window.innerWidth < 1024 ? 2 : 3;
}
function buildDots() {
    dotsEl.innerHTML = '';
    const total = cards.length - cardsPerView + 1;
    for (let i = 0; i < total; i++) {
        const d = document.createElement('div');
        d.className = 'testi-dot' + (i === 0 ? ' active' : '');
        d.onclick = () => goTesti(i);
        dotsEl.appendChild(d);
    }
}
function setCardWidth() {
    cardsPerView = getCardsPerView();
    const gap = 22;
    const w = (100 / cardsPerView) + '%';
    cards.forEach(c => {
        c.style.flex = `0 0 calc(${w} - ${(gap * (cardsPerView - 1)) / cardsPerView}px)`;
    });
    buildDots();
    goTesti(0);
}
function goTesti(idx) {
    const maxIdx = cards.length - cardsPerView;
    testiIndex = Math.max(0, Math.min(idx, maxIdx));
    const cardW = cards[0].offsetWidth + 22;
    track.style.transform = `translateX(-${testiIndex * cardW}px)`;
    document.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === testiIndex);
    });
}
function testiNext() { goTesti(testiIndex + 1); }
function testiPrev() { goTesti(testiIndex - 1); }
window.addEventListener('resize', setCardWidth);
setCardWidth();

// Auto-advance
setInterval(() => testiNext(), 5000);

// ========== FORM SUBMIT ==========
function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  let state = "sending";
  const btn = document.getElementById("consultFormBtn")
  btn.innerHTML = "Submitting..."
  btn.disabled = true

  // Send data using fetch (FormSubmit)
  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
  })
  .then(() => {
    // Show success modal
    document.getElementById('successModal').classList.add('show');
    state = "sent"
    // Reset form
    form.reset();
    btn.innerHTML = "Submitted"
  })
  .catch(() => {
    alert("Something went wrong. Please try again.");
    btn.disabled = false;
    btn.innerText = "🔮 Submit Consultation Request";
  });
}

function closeModal() {
  document.getElementById('successModal').classList.remove('show');
}

document.getElementById('successModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});




document.getElementById('x-mark').addEventListener("click", () => {
    console.log("hello")
    document.getElementById('top-bar').style.display = 'none'
})


/* ========== CUSTOM CURSOR ========== */
(function () {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    /* Skip on touch devices */
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId;

    /* Track mouse position */
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        /* Dot follows instantly */
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';

        dot.classList.remove('hidden');
        ring.classList.remove('hidden');
    });

    /* Ring lags behind using lerp (linear interpolation) */
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';

        rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Hide when mouse leaves window */
    document.addEventListener('mouseleave', () => {
        dot.classList.add('hidden');
        ring.classList.add('hidden');
    });
    document.addEventListener('mouseenter', () => {
        dot.classList.remove('hidden');
        ring.classList.remove('hidden');
    });

    /* Hover state on interactive elements */
    const hoverTargets = 'a, button, .btn, .problem-card, .service-card, .testi-btn, .hamburger, .nav-dropdown li a, .sp-faq-q, .footer-social';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            dot.classList.add('on-link');
            ring.classList.add('on-link');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            dot.classList.remove('on-link');
            ring.classList.remove('on-link');
        }
    });

    /* Click flash */
    document.addEventListener('mousedown', () => {
        dot.classList.add('clicking');
        ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
        dot.classList.remove('clicking');
        ring.classList.remove('clicking');
    });
})();