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



/* ========== GALLERY STRIP LIGHTBOX ========== */
(function () {

  /* ── Update these src paths to match your actual image files ── */
  var GS_IMAGES = [
    { src: './assets/screenshots/Review1.png',                caption: '' },
    { src: './assets/screenshots/Review2.png',                caption: '' },
    { src: './assets/screenshots/Review3.png',                caption: '' },
    { src: './assets/screenshots/Review4.png',                caption: '' },
  ];

  /* ── DOM references ── */
  var lightbox  = document.getElementById('gsLightbox');
  var lbImg     = document.getElementById('gsLbImg');
  var lbSpinner = document.getElementById('gsLbSpinner');
  var lbCurrent = document.getElementById('gsLbCurrent');
  var lbTotal   = document.getElementById('gsLbTotal');
  var lbCaption = document.getElementById('gsLbCaption');
  var lbDots    = document.getElementById('gsLbDots');
  var track     = document.getElementById('gsTrack');
  var lbIndex   = 0;

  /* ── Guard: exit if lightbox not on page ── */
  if (!lightbox) return;

  /* ── Set total count ── */
  if (lbTotal) lbTotal.textContent = GS_IMAGES.length;

  /* ── Build dot indicators ── */
  if (lbDots) {
    GS_IMAGES.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'gs-lb-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', function () { gsGoTo(i); });
      lbDots.appendChild(dot);
    });
  }

  /* ── Open lightbox ── */
  window.gsOpenLightbox = function (index) {
    lbIndex = index;
    loadImage(index, null);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  /* ── Close lightbox ── */
  window.gsCloseLightbox = function () {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ── Navigate prev / next ── */
  window.gsLbNav = function (dir) {
    lbIndex = (lbIndex + dir + GS_IMAGES.length) % GS_IMAGES.length;
    loadImage(lbIndex, dir > 0 ? 'right' : 'left');
  };

  /* ── Jump to specific dot index ── */
  function gsGoTo(index) {
    if (index === lbIndex) return;
    var dir = index > lbIndex ? 'right' : 'left';
    lbIndex = index;
    loadImage(lbIndex, dir);
  }

  /* ── Load image with slide transition ── */
  function loadImage(index, direction) {
    var data = GS_IMAGES[index];
    if (!data) return;

    /* Show spinner while loading */
    if (lbImg)     lbImg.classList.add('loading');
    if (lbSpinner) lbSpinner.classList.add('visible');

    var tempImg = new Image();

    tempImg.onload = function () {
      lbImg.src = data.src;
      lbImg.alt = data.caption || '';

      lbSpinner.classList.remove('visible');
      lbImg.classList.remove('loading', 'slide-in-right', 'slide-in-left');

      /* Force reflow so animation re-triggers */
      void lbImg.offsetWidth;

      if (direction === 'right') lbImg.classList.add('slide-in-right');
      if (direction === 'left')  lbImg.classList.add('slide-in-left');

      /* Update counter */
      if (lbCurrent) lbCurrent.textContent = index + 1;

      /* Update caption */
      if (lbCaption) lbCaption.textContent = data.caption || 'Genuine Astro Guide';

      /* Update dots */
      document.querySelectorAll('.gs-lb-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === index);
      });
    };

    tempImg.onerror = function () {
      if (lbSpinner) lbSpinner.classList.remove('visible');
      if (lbImg)     lbImg.classList.remove('loading');
      if (lbCaption) lbCaption.textContent = 'Image not found — check your file path';
    };

    tempImg.src = data.src;
  }

  /* ── Keyboard: Escape / Arrow keys ── */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     gsCloseLightbox();
    if (e.key === 'ArrowRight') gsLbNav(1);
    if (e.key === 'ArrowLeft')  gsLbNav(-1);
  });

  /* ── Touch swipe support ── */
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) gsLbNav(diff > 0 ? 1 : -1);
  }, { passive: true });

  /* ── Pause strip scroll when lightbox is open ── */
  if (track) {
    new MutationObserver(function () {
      track.style.animationPlayState =
        lightbox.classList.contains('open') ? 'paused' : 'running';
    }).observe(lightbox, { attributes: true, attributeFilter: ['class'] });
  }

})();


/* ========== TOP BAR CLOSE BUTTON ========== */
var xMark = document.getElementById('x-mark');
if (xMark) {
  xMark.addEventListener('click', function () {
    var bar = document.getElementById('top-bar');
    if (bar) bar.style.display = 'none';
  });
}