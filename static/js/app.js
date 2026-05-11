/* ========================
   AOS INIT
   ======================== */
AOS.init({
    once: true,
    duration: 800,
});

document.addEventListener('DOMContentLoaded', function () {

    window.urlProduitImage = "https://divix.alwaysdata.net/ecommerce/uploads/produits/";

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
    const track = document.getElementById('productsTrack');
    const prevBtn = document.getElementById('productsPrev');
    const nextBtn = document.getElementById('productsNext');
    const dotsContainer = document.getElementById('productsDots');

    if (track) {
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
    }

    /* ========================
       CAROUSEL PRODUITS Nouveaute
       ======================== */
    const track = document.getElementById('productsTrackNouveaute');
    const prevBtn = document.getElementById('productsPrevNouveaute');
    const nextBtn = document.getElementById('productsNextNouveaute');
    const dotsContainer = document.getElementById('productsDotsNouveaute');

    if (track) {
        
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
    }

    /* ========================
       CAROUSEL PRODUITS RECENTS
       ======================== */
    const track = document.getElementById('productsTrackRecents');
    const prevBtn = document.getElementById('productsPrevRecents');
    const nextBtn = document.getElementById('productsNextRecents');
    const dotsContainer = document.getElementById('productsDotsRecents');

    if (track) {
        
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
    }

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
       SEARCH FUNCTIONALITY
       ======================== */
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionsList = document.querySelector('.suggestions-list');
    const clearAllBtn = document.querySelector('.clear-all');
    
    // Fonction pour afficher/masquer le bouton clear
    function toggleClearButton() {
        if (searchInput && searchClear) {
            if (searchInput.value.length > 0) {
                searchClear.style.display = 'flex';
            } else {
                searchClear.style.display = 'none';
            }
        }
    }
    
    // Effacer le champ
    function clearSearch() {
        if (searchInput) {
            searchInput.value = '';
            toggleClearButton();
            searchInput.focus();
            hideSuggestions();
        }
    }
    
    // Afficher les suggestions
    function showSuggestions() {
        if (searchSuggestions && searchInput && searchInput.value.length >= 2) {
            searchSuggestions.style.display = 'block';
            loadSuggestions(searchInput.value);
        } else if (searchSuggestions && searchInput && searchInput.value.length === 0) {
            loadHistory();
            searchSuggestions.style.display = 'block';
        } else {
            hideSuggestions();
        }
    }
    
    // Cacher les suggestions
    function hideSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.style.display = 'none';
        }
    }
    
    // Charger les suggestions (simulées)
    function loadSuggestions(query) {
        if (!suggestionsList) return;
        
        const mockSuggestions = [
            { text: `${query} appareil photo`, count: 45 },
            { text: `${query} drone professionnel`, count: 23 },
            { text: `${query} casque audio`, count: 67 },
            { text: `${query} macbook pro`, count: 12 },
            { text: `${query} sony camera`, count: 34 }
        ];
        
        suggestionsList.innerHTML = '';
        
        mockSuggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <i class="bi bi-search"></i>
                <span class="suggestion-text">${suggestion.text}</span>
                <span class="suggestion-count">${suggestion.count} produits</span>
            `;
            item.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = suggestion.text;
                    performSearch();
                }
            });
            suggestionsList.appendChild(item);
        });
    }
    
    // Effectuer la recherche
    function performSearch() {
        if (!searchInput) return;
        const query = searchInput.value.trim();
        if (query.length > 0) {
            saveToHistory(query);
            window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
        }
    }
    
    // Sauvegarder dans l'historique
    function saveToHistory(query) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        history = [query, ...history.filter(item => item !== query)];
        if (history.length > 10) history.pop();
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    
    // Charger l'historique
    function loadHistory() {
        if (!suggestionsList) return;
        
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (history.length > 0) {
            suggestionsList.innerHTML = '';
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'suggestion-item';
                historyItem.innerHTML = `
                    <i class="bi bi-clock-history"></i>
                    <span class="suggestion-text">${item}</span>
                `;
                historyItem.addEventListener('click', () => {
                    if (searchInput) {
                        searchInput.value = item;
                        performSearch();
                    }
                });
                suggestionsList.appendChild(historyItem);
            });
        }
    }
    
    // Effacer l'historique
    function clearHistory() {
        localStorage.removeItem('searchHistory');
        hideSuggestions();
        if (searchInput && searchInput.value.length === 0) {
            loadHistory();
            showSuggestions();
        }
    }
    
    // Initialisation des événements de recherche
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            toggleClearButton();
            if (searchInput.value.length >= 2) {
                showSuggestions();
            } else if (searchInput.value.length === 0) {
                loadHistory();
                showSuggestions();
            } else {
                hideSuggestions();
            }
        });
        
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length >= 2) {
                showSuggestions();
            } else if (searchInput.value.length === 0) {
                loadHistory();
                showSuggestions();
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', clearSearch);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearHistory);
    }
    
    // Fermer les suggestions en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            hideSuggestions();
        }
    });
    
    toggleClearButton();

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

