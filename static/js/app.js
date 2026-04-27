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
                    // Optionnel: notification de stock maximum
                    console.log(`Stock maximum atteint (${maxStock})`);
                    // Afficher un toast ou une notification
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
                // Optionnel: notification quantité minimum
                console.log('Quantité minimum atteinte');
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
                // Optionnel: notification
                console.log(`Quantité maximum: ${maxStock}`);
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
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionsList = document.querySelector('.suggestions-list');
    const clearAllBtn = document.querySelector('.clear-all');
    
    let isSticky = false;
    let stickyTop = 0;
    
    // Fonction pour calculer la position où la barre devient sticky
    // function calculateStickyPosition() {
    //     const searchWrapper = document.querySelector('.search-sticky-wrapper');
    //     if (searchWrapper) {
    //         // La barre devient sticky quand on dépasse sa position
    //         stickyTop = searchWrapper.offsetTop;
    //     }
    // }
    
    // Fonction pour gérer l'effet sticky
    // function handleStickyScroll() {
    //     if (!searchContainer) return;
        
    //     const scrollY = window.scrollY;
        
    //     if (scrollY >= stickyTop) {
    //         if (!isSticky) {
    //             // Devient sticky
    //             searchContainer.classList.add('sticky');
    //             document.body.classList.add('sticky-search-padding');
    //             isSticky = true;
    //         }
    //     } else {
    //         if (isSticky) {
    //             // Quitte le sticky
    //             searchContainer.classList.remove('sticky');
    //             document.body.classList.remove('sticky-search-padding');
    //             isSticky = false;
    //         }
    //     }
    // }
    
    // Afficher/masquer le bouton clear
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
        
        // Exemple de suggestions
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
            // Rediriger vers la page de recherche
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
    
    // Initialisation des événements
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
    
    // Initialisation
    // calculateStickyPosition();
    // handleStickyScroll();
    toggleClearButton();
    
    // // Événements de scroll avec debounce pour performance
    // let ticking = false;
    // window.addEventListener('scroll', () => {
    //     if (!ticking) {
    //         requestAnimationFrame(() => {
    //             handleStickyScroll();
    //             ticking = false;
    //         });
    //         ticking = true;
    //     }
    // });
    
    // window.addEventListener('resize', () => {
    //     calculateStickyPosition();
    //     // handleStickyScroll();
    // });

    const productTitles = document.querySelectorAll('.product-title');
    
    productTitles.forEach(function(title) {
        let text = title.innerText;
        if (text.length > 15) {
            title.innerText = text.substring(0, 15) + '...';
        }
    });
    document.querySelectorAll('.offcanvas-link-level1').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const level1Id = this.getAttribute('data-level1');
                const targetWrapper = document.getElementById(`level1-${level1Id}`);
                
                if (!targetWrapper) return;
                
                // Toggle la classe open sur le wrapper
                targetWrapper.classList.toggle('open');
                // Toggle la classe open sur le bouton (pour la flèche)
                this.classList.toggle('open');
                
                // Optionnel : fermer les autres niveaux 1 (comportement accordéon)
                // Désactiver l'accordéon automatique si on veut plusieurs ouverts simultanément
                // Pour un comportement plus propre, on peut laisser l'utilisateur ouvrir plusieurs catégories
            });
        });
        
        // Gestion des toggles pour niveau 2 (sous-catégories)
        document.querySelectorAll('.offcanvas-link-level2').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const level2Id = this.getAttribute('data-level2');
                const targetWrapper = document.getElementById(`level2-${level2Id}`);
                
                if (!targetWrapper) return;
                
                targetWrapper.classList.toggle('open');
                this.classList.toggle('open');
            });
        });
        
        // Fermer l'offcanvas quand on clique sur un lien de niveau 3 (optionnel)
        document.querySelectorAll('.level3-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const offcanvasElement = document.getElementById('navOffcanvas');
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
                // Rediriger vers le lien (comportement par défaut conservé)
            });
        });
        
        // Petit fix : prévenir la propagation des clics sur les liens pour éviter de fermer accidentellement
        document.querySelectorAll('.level3-link, .offcanvas-link-level2, .offcanvas-link-level1').forEach(el => {
            el.addEventListener('click', (e) => {
                if (el.classList && (el.classList.contains('offcanvas-link-level1') || el.classList.contains('offcanvas-link-level2'))) {
                    // Les boutons ne doivent pas fermer l'offcanvas, juste toggler
                    e.preventDefault();
                }
            });
        });
        
        // Option: initialisation de l'état (tout fermé au départ)
        // Pour s'assurer que tous les wrappers sont fermés par défaut
        document.querySelectorAll('.level2-wrapper, .level3-wrapper').forEach(wrapper => {
            wrapper.classList.remove('open');
        });
        document.querySelectorAll('.offcanvas-link-level1, .offcanvas-link-level2').forEach(btn => {
            btn.classList.remove('open');
        });



});