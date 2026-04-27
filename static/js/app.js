/* ========================
   AOS INIT
   ======================== */
AOS.init({
    once: true,
    duration: 800,
});

document.addEventListener('DOMContentLoaded', function () {

    /* ========================
       PRODUCT PAGE — SWITCH IMAGE
       ======================== */
    const mainImage = document.querySelector('.main-image');
    const imageItems = document.querySelectorAll('.image-item');

    if (mainImage && imageItems.length) {
        imageItems.forEach(item => {
            item.addEventListener('click', function () {
                if (this.src && this.src.trim() !== '') {
                    mainImage.src = this.src;
                    imageItems.forEach(img => img.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    /* ========================
       PANIER — STOP PROPAGATION
       ======================== */
    document.querySelectorAll('.product-card .btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    /* ========================
       OFFCANVAS — SOUS-MENU
       ======================== */
    const ocToggle = document.querySelector('.oc-toggle');
    const ocSubmenu = document.querySelector('.oc-submenu');

    if (ocToggle && ocSubmenu) {
        ocToggle.addEventListener('click', () => {
            ocToggle.classList.toggle('open');
            ocSubmenu.classList.toggle('open');
        });
    }

    /* ========================
       CAROUSEL PRODUITS LES PLUS VENDUS
       ======================== */
    const track       = document.getElementById('productsTrack');
    const prevBtn     = document.getElementById('productsPrev');
    const nextBtn     = document.getElementById('productsNext');
    const dotsContainer = document.getElementById('productsDots');

    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.products-carousel-slide'));
    let current = 0;

    /* Nombre de slides visibles selon breakpoint */
    function getVisible() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 992) return 2;
        return 4;
    }

    /* Gap entre les slides selon breakpoint */
    function getGap() {
        return window.innerWidth < 576 ? 0 : 16;
    }

    /* Nombre total de positions */
    function getTotal() {
        return slides.length - getVisible() + 1;
    }

    /* Construction des dots */
    function buildDots() {
        dotsContainer.innerHTML = '';
        const total = getTotal();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === current) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    /* Mise à jour visuelle des dots */
    function updateDots() {
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    /* Mise à jour des boutons prev/next */
    function updateBtns() {
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current >= getTotal() - 1;
    }

    /* Déplacement vers une position */
    function goTo(index) {
        current = Math.max(0, Math.min(index, getTotal() - 1));

        /* Largeur d'une slide + gap pour calculer le décalage */
        const slideWidth = slides[0].offsetWidth + getGap();
        track.style.transform = `translateX(-${current * slideWidth}px)`;

        updateDots();
        updateBtns();
    }

    /* Événements boutons */
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    /* Resize : recalcul complet */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            current = 0;
            buildDots();
            goTo(0);
        }, 150);
    });

    /* Init */
    buildDots();
    goTo(0);

});