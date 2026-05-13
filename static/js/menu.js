// Fichier: menu.js

document.addEventListener("DOMContentLoaded", () => {
    const containerMenu = document.getElementById('container-menu');
    if (containerMenu) {
        loadCategoriesMenu();
    }
});

/**
 * Charge les catégories et sous-catégories depuis l'API
 */
function loadCategoriesMenu() {
    const container = document.getElementById('container-menu');
    if (!container) return;

    // Afficher un skeleton loader
    showMenuSkeleton(container);

    fetch("/menu")
        .then(res => res.json())
        .then(response => { // Debug
            if (response.success && response.data && response.data.length > 0) {
                renderCategoriesMenu(response.data);
            } else {
                showEmptyMenu(container);
            }
        })
        .catch(err => {
            console.error("Erreur lors du chargement des catégories:", err);
            showErrorMenu(container);
        });
}

/**
 * Affiche un skeleton loader pendant le chargement
 */
function showMenuSkeleton(container) {
    container.innerHTML = `
        <li class="skeleton-menu-item">
            <div class="skeleton skeleton-line" style="height: 50px; margin: 8px 0;"></div>
        </li>
        <li class="skeleton-menu-item">
            <div class="skeleton skeleton-line" style="height: 50px; margin: 8px 0;"></div>
        </li>
        <li class="skeleton-menu-item">
            <div class="skeleton skeleton-line" style="height: 50px; margin: 8px 0;"></div>
        </li>
        <li class="skeleton-menu-item">
            <div class="skeleton skeleton-line" style="height: 50px; margin: 8px 0;"></div>
        </li>
    `;
}

/**
 * Affiche un message quand il n'y a pas de catégories
 */
function showEmptyMenu(container) {
    container.innerHTML = `
        <li class="empty-menu">
            <div class="text-center p-4">
                <i class="bi bi-folder-x" style="font-size: 48px; color: var(--text-secondary);"></i>
                <p class="mt-2" style="color: var(--text-secondary);">Aucune catégorie disponible</p>
            </div>
        </li>
    `;
}

/**
 * Affiche un message d'erreur
 */
function showErrorMenu(container) {
    container.innerHTML = `
        <li class="error-menu">
            <div class="text-center p-4">
                <i class="bi bi-exclamation-triangle" style="font-size: 48px; color: #dc3545;"></i>
                <p class="mt-2" style="color: var(--text-secondary);">Erreur lors du chargement</p>
                <button onclick="loadCategoriesMenu()" class="btn btn-sm btn-primary-custom mt-2">
                    <i class="bi bi-arrow-repeat"></i> Réessayer
                </button>
            </div>
        </li>
    `;
}

/**
 * Rendu du menu avec les catégories et sous-catégories
 */
function renderCategoriesMenu(categories) {
    const container = document.getElementById('container-menu');
    if (!container) return;

    container.innerHTML = '';

    categories.forEach((category, index) => {
        const categoryId = `cat-${category.id || index}`;
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;

        // Créer l'élément li principal
        const li = document.createElement('li');

        // Créer le bouton de niveau 1
        const button = document.createElement('button');
        button.className = 'offcanvas-link-level1';
        button.setAttribute('data-level1', categoryId);
        button.innerHTML = `
            <span>${escapeHtmlSafe(category.nom)}</span>
            ${hasSubcategories ? '<i class="bi bi-chevron-down level1-chevron"></i>' : ''}
        `;

        li.appendChild(button);

        // Créer le wrapper de niveau 2 (sous-catégories)
        if (hasSubcategories) {
            const level2Wrapper = document.createElement('div');
            level2Wrapper.className = 'level2-wrapper';
            level2Wrapper.id = `level1-${categoryId}`;

            const level2List = document.createElement('ul');
            level2List.className = 'level2-list';

            // Parcourir les sous-catégories (niveau 2)
            category.subcategories.forEach((subcategory, subIndex) => {
                const subId = `sub-${subcategory.id || subIndex}`;
                // Vérifier si la sous-catégorie a elle-même des sous-catégories (niveau 3)
                const hasLevel3 = subcategory.subcategories && subcategory.subcategories.length > 0;

                const level2Item = document.createElement('li');
                level2Item.className = 'level2-item';

                if (hasLevel3) {
                    // S'il y a un niveau 3, créer un bouton toggle
                    const level2Button = document.createElement('button');
                    level2Button.className = 'offcanvas-link-level2';
                    level2Button.setAttribute('data-level2', subId);
                    level2Button.innerHTML = `
                        <span class="text-upper">${escapeHtmlSafe(subcategory.nom)}</span>
                    `;
                    level2Item.appendChild(level2Button);

                    // Niveau 3
                    const level3Wrapper = document.createElement('div');
                    level3Wrapper.className = 'level3-wrapper';
                    level3Wrapper.id = `level2-${subId}`;

                    const level3List = document.createElement('ul');
                    level3List.className = 'level3-list';

                    subcategory.subcategories.forEach((level3Item) => {
                        const linkLi = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = level3Item.link || '#';
                        link.className = 'level3-link';
                        link.textContent = escapeHtmlSafe(level3Item.nom);
                        linkLi.appendChild(link);
                        level3List.appendChild(linkLi);
                    });

                    level3Wrapper.appendChild(level3List);
                    level2Item.appendChild(level3Wrapper);
                } else {
                    // Pas de niveau 3, créer un lien direct vers la sous-catégorie
                    const directLink = document.createElement('a');
                    directLink.href = `/categorie/${escapeHtmlSafe(subcategory.id)}`;
                    directLink.className = 'level2-link';
                    directLink.style.display = 'flex';
                    directLink.style.alignItems = 'center';
                    directLink.style.padding = '10px 20px 10px 54px';
                    directLink.style.gap = '10px';
                    directLink.style.textDecoration = 'none';
                    directLink.style.color = 'var(--text-secondary)';
                    directLink.innerHTML = `
                        <span class="text-uppercase">${escapeHtmlSafe(subcategory.nom)}</span>
                    `;
                    level2Item.appendChild(directLink);
                }

                level2List.appendChild(level2Item);
            });

            level2Wrapper.appendChild(level2List);
            li.appendChild(level2Wrapper);
        } else {
            // Si pas de sous-catégories, ajouter un lien direct
            const directLink = document.createElement('a');
            directLink.href = `/categorie/${escapeHtmlSafe(category.id)}`;
            directLink.className = 'offcanvas-link-level1';
            directLink.style.display = 'flex';
            directLink.style.alignItems = 'center';
            directLink.style.gap = '14px';
            directLink.style.padding = '16px 20px';
            directLink.style.textDecoration = 'none';
            directLink.style.color = 'var(--dark)';
            directLink.innerHTML = `
                <span>${escapeHtmlSafe(category.nom)}</span>
                <i class="bi bi-chevron-right" style="margin-left: auto;"></i>
            `;
            li.innerHTML = '';
            li.appendChild(directLink);
        }

        container.appendChild(li);
    });

    // Réinitialiser les événements du menu après le rendu
    initOffcanvasMenuEvents();
}

/**
 * Initialise les événements du menu offcanvas (toggle des niveaux)
 */
function initOffcanvasMenuEvents() {
    // Gestion des toggles pour niveau 1
    const level1Buttons = document.querySelectorAll('.offcanvas-link-level1');
    
    level1Buttons.forEach(button => {
        // Supprimer l'ancien événement en clonant
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }

        newButton.addEventListener('click', function(e) {
            // Ne pas empêcher le comportement par défaut si c'est un lien
            if (this.tagName === 'BUTTON') {
                e.preventDefault();
                e.stopPropagation();

                const level1Id = this.getAttribute('data-level1');
                if (level1Id) {
                    const targetWrapper = document.getElementById(`level1-${level1Id}`);
                    if (targetWrapper) {
                        targetWrapper.classList.toggle('open');
                        this.classList.toggle('open');
                    }
                }
            }
        });
    });

    // Gestion des toggles pour niveau 2
    const level2Buttons = document.querySelectorAll('.offcanvas-link-level2');
    
    level2Buttons.forEach(button => {
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }

        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const level2Id = this.getAttribute('data-level2');
            if (level2Id) {
                const targetWrapper = document.getElementById(`level2-${level2Id}`);
                if (targetWrapper) {
                    targetWrapper.classList.toggle('open');
                    this.classList.toggle('open');
                }
            }
        });
    });

    // Fermer l'offcanvas quand on clique sur un lien
    const offcanvasElement = document.getElementById('navOffcanvas');
    document.querySelectorAll('.level3-link').forEach(link => {
        const newLink = link.cloneNode(true);
        if (link.parentNode) {
            link.parentNode.replaceChild(newLink, link);
        }
        
        newLink.addEventListener('click', (e) => {
            if (offcanvasElement) {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }
        });
    });
}

/**
 * Échappe les caractères HTML (version sécurisée)
 */
function escapeHtmlSafe(str) {
    if (str === null || str === undefined) return '';
    // Convertir en string si ce n'est pas déjà une chaîne
    const stringValue = String(str);
    return stringValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}