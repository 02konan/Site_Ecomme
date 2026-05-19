
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
    document.addEventListener('click', function (e) {
        const button = e.target.closest('.product-card .box-card-btn .btn');
        if (!button) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Optional: handle cart/button click logic here.
        // Example: open modal, add to cart, etc.
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
    /* ========================
   FONCTION CAROUSEL GÉNÉRIQUE
   ======================== */
function initCarousel(trackId, prevBtnId, nextBtnId, dotsContainerId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsContainerId);

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = Array.from(track.querySelectorAll('.products-carousel-slide'));

    // Pas assez de slides → on masque les contrôles et on sort
    if (!slides.length) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }

    let current = 0;

    function getVisible() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 992) return 2;
        return 4;
    }

    function getGap() {
        return window.innerWidth < 576 ? 0 : 16;
    }

    function getTotal() {
        // Minimum 1 pour éviter les valeurs négatives ou nulles
        return Math.max(1, slides.length - getVisible() + 1);
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const total = getTotal();
        // On n'affiche les dots que s'il y a plus d'une position
        if (total <= 1) return;
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === current) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function updateBtns() {
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current >= getTotal() - 1;
    }

    function goTo(index) {
        current = Math.max(0, Math.min(index, getTotal() - 1));
        const slideWidth = slides[0].offsetWidth + getGap();
        track.style.transform = `translateX(-${current * slideWidth}px)`;
        updateDots();
        updateBtns();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            current = 0;
            buildDots();
            goTo(0);
        }, 150);
    });

    buildDots();
    goTo(0);
}

document.addEventListener('DOMContentLoaded', () => {
    initCarousel('productsTrack',         'productsPrev',         'productsNext',         'productsDots');
    initCarousel('productsTrackNouveaute','productsPrevNouveaute','productsNextNouveaute','productsDotsNouveaute');
    initCarousel('productsTrackRecents',  'productsPrevRecents',  'productsNextRecents',  'productsDotsRecents');
});
    /* ========================
       QUANTITY INPUT HANDLER
       ======================== */
    const quantityInput = document.querySelector('.count input');
    const btnPlus = document.querySelector('.btn-count:last-child');
    const btnMinus = document.querySelector('.btn-count:first-child');
    const maxStock = 99; // Stock maximum disponible

    if (quantityInput && btnPlus && btnMinus) {

        // Animation de feedback
        function animateButton(button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }

        // Fonction pour mettre à jour l'affichage
        function updateQuantity(value) {
            quantityInput.value = value;

            // Déclencher un événement personnalisé
            const event = new CustomEvent('quantityChanged', { 
                detail: { quantity: value } 
            });
            quantityInput.dispatchEvent(event);
        }

        // Incrémenter
        btnPlus.addEventListener('click', function() {
            animateButton(this);
            let currentValue = parseInt(quantityInput.value);

            if (!isNaN(currentValue)) {
                if (currentValue < maxStock) {
                    updateQuantity(currentValue + 1);
                } else {
                    console.log(`Stock maximum atteint (${maxStock})`);
                }
            } else {
                updateQuantity(1);
            }
        });

        // Décrémenter
        btnMinus.addEventListener('click', function() {
            animateButton(this);
            let currentValue = parseInt(quantityInput.value);

            if (!isNaN(currentValue) && currentValue > 1) {
                updateQuantity(currentValue - 1);
            } else if (currentValue === 1) {
            } else {
                updateQuantity(1);
            }
        });

        // Validation manuelle
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);

            if (isNaN(value) || value < 1) {
                updateQuantity(1);
            } else if (value > maxStock) {
                updateQuantity(maxStock);
            } else {
                updateQuantity(value);
            }
        });

        // Empêcher les caractères non numériques
        quantityInput.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Initialiser la valeur par défaut
        if (!quantityInput.value || parseInt(quantityInput.value) < 1) {
            quantityInput.value = 1;
        }
    }

  

    /* ========================
       PRODUCT TITLE TRUNCATE
       ======================== */
    const productTitles = document.querySelectorAll('.product-title');
    
    productTitles.forEach(function(title) {
        let text = title.innerText;
        if (text.length > 15) {
            title.innerText = text.substring(0, 15) + '...';
        }
    });

    /* ========================
       MENU OFFCANVAS À PLUSIEURS NIVEAUX
       ======================== */
    
    // Fonction pour initialiser le menu offcanvas
    function initOffcanvasMenu() {
        // Gestion des toggles pour niveau 1 (catégories principales)
        const level1Buttons = document.querySelectorAll('.offcanvas-link-level1');
        const level2Buttons = document.querySelectorAll('.offcanvas-link-level2');
        const level3Links = document.querySelectorAll('.level3-link');
        
        // Réinitialiser tous les états (tout fermé)
        document.querySelectorAll('.level2-wrapper, .level3-wrapper').forEach(wrapper => {
            wrapper.classList.remove('open');
        });
        document.querySelectorAll('.offcanvas-link-level1, .offcanvas-link-level2').forEach(btn => {
            btn.classList.remove('open');
        });
        
        // Gestion des clics sur les boutons de niveau 1
        level1Buttons.forEach(button => {
            // Supprimer les anciens listeners pour éviter les doublons
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const level1Id = this.getAttribute('data-level1');
                const targetWrapper = document.getElementById(`level1-${level1Id}`);
                
                if (!targetWrapper) return;
                
                // Toggle la classe open sur le wrapper
                targetWrapper.classList.toggle('open');
                // Toggle la classe open sur le bouton (pour la flèche)
                this.classList.toggle('open');
            });
        });
        
        // Gestion des clics sur les boutons de niveau 2
        level2Buttons.forEach(button => {
            // Supprimer les anciens listeners pour éviter les doublons
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const level2Id = this.getAttribute('data-level2');
                const targetWrapper = document.getElementById(`level2-${level2Id}`);
                
                if (!targetWrapper) return;
                
                targetWrapper.classList.toggle('open');
                this.classList.toggle('open');
            });
        });
        
        // Fermer l'offcanvas quand on clique sur un lien de niveau 3
        const offcanvasElement = document.getElementById('navOffcanvas');
        level3Links.forEach(link => {
            link.addEventListener('click', function(e) {
                if (offcanvasElement) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
            });
        });
    }
    
    // Attendre que le DOM soit complètement chargé avant d'initialiser le menu
    // Utiliser un petit délai pour s'assurer que tout le contenu est bien chargé
    setTimeout(initOffcanvasMenu, 100);
    
    // Alternative: utiliser MutationObserver pour détecter l'ajout dynamique du menu
    const observer = new MutationObserver(function(mutations) {
        const offcanvas = document.getElementById('navOffcanvas');
        if (offcanvas && offcanvas.querySelectorAll('.offcanvas-link-level1').length > 0) {
            initOffcanvasMenu();
            observer.disconnect(); // Arrêter l'observation une fois initialisé
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});

