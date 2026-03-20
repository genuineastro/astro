/* ============================================================
   service.js — Shared JavaScript for all service pages
   Link with <script src="service.js" defer></script>
   ============================================================ */

/* ── Starfield canvas ── */
(function () {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    function initStars() {
        stars = [];
        const n = Math.floor((canvas.width * canvas.height) / 5500);
        for (let i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.3 + 0.2,
                t: Math.random() * Math.PI * 2,
                s: Math.random() * 0.4 + 0.1
            });
        }
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now() / 1000;
        stars.forEach(s => {
            const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(now * s.s + s.t));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,245,210,${a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();
    draw();
})();

/* ── Scroll reveal ── */
(function () {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── Mobile nav ── */
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
}

/* ── FAQ accordion ── */
function toggleFaq(item) {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.sp-faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

/* ── Navbar scroll shadow ── */
(function () {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.scrollY > 24
            ? '0 4px 24px rgba(0,0,0,0.4)'
            : 'none';
    }, { passive: true });
})();

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
