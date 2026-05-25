document.addEventListener("DOMContentLoaded", () => {
    showGridSkeletons(8);
    showCarouselSkeletons(document.querySelector('.products-carousel-track'), 4);
    showCarouselSkeletons(document.getElementById('productsTrackNouveaute'), 4);
    Produits();
    NosProduits();
    Produits_la_une();
    produit_nouveaute();
    produit_recents();
});

// Variables globales pour le carrousel
let carouselCurrent = 0;
let carouselSlides = [];
let carouselTrack = null;
let carouselPrevBtn = null;
let carouselNextBtn = null;
let carouselDotsContainer = null;
window.urlProduitImage = "https://divix.alwaysdata.net/uploads/produits/";



function showGridSkeletons(count = 8) {
    const container = document.getElementById("NosProduits");
    if (!container) return;

    let html = '';
    for (let i = 0; i < count; i += 1) {
        html += createGridSkeletonCard();
    }
    container.innerHTML = html;
}

function createGridSkeletonCard() {
    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="product-card skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="product-body">
                    <div class="col-8">
                        <div class="skeleton skeleton-line"></div>
                        <div class="skeleton skeleton-line short"></div>
                        <div class="skeleton skeleton-line xshort"></div>
                    </div>
                    <div class="col-4">
                        <div class="skeleton skeleton-line short"></div>
                        <div class="skeleton skeleton-line xshort"></div>
                    </div>
                </div>
                <div class="d-flex box-card-btn">
                    <div class="skeleton skeleton-button"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            </div>
        </div>`;
}

function showCarouselSkeletons(container, count = 4) {
    if (!container) return;

    let html = '';
    for (let i = 0; i < count; i += 1) {
        html += createCarouselSkeletonSlide();
    }
    container.innerHTML = html;
}
function createCarouselSkeletonSlide() {
    return `
        <div class="products-carousel-slide">
            <div class="product-card skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="product-body">
                    <div class="col-8">
                        <div class="skeleton skeleton-line"></div>
                        <div class="skeleton skeleton-line short"></div>
                    </div>
                    <div class="col-4">
                        <div class="skeleton skeleton-line short"></div>
                    </div>
                </div>
                <div class="d-flex box-card-btn">
                    <div class="skeleton skeleton-button"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            </div>
        </div>`;
}

function Produits_la_une() {
    const carousel = document.querySelector('.products-carousel-track');
    showCarouselSkeletons(carousel, 4);

    fetch("/produit_une/list")
        .then(res => res.json())
        .then(response => {
            if (response.data) afficheproduit_la_une(response.data);
        })
        .catch(err => {
            console.error("Erreur produits:", err);
        });
}
function afficheproduit_la_une(produits) {
    const container = document.getElementById("productsTrack");
    if (!container) return;
    container.innerHTML = "";

    // Limiter à 12 produits maximum
    const produitsLimit = produits.slice(0, 12);
    
    if (produitsLimit && produitsLimit.length > 0) {    
        produitsLimit.forEach(pdt => {
           const typeReduction = pdt.type;
            const reduction = Number(pdt.reduction) || 0;
            const prixOriginal = Number(pdt.prix_produits);

            let prixFinal = prixOriginal;
            let pourcentage = 0;

            if (typeReduction === "pourcentage") {
                pourcentage = reduction;
                prixFinal = prixOriginal * (1 - reduction / 100);

            } else if (typeReduction === "montant") {
                pourcentage = ((reduction / prixOriginal) * 100).toFixed(0);
                prixFinal = Math.max(0, prixOriginal - reduction);
            }
            const imageSrc = pdt.img_produits
                ? (/^https?:\/\//i.test(pdt.img_produits) ? pdt.img_produits : `${window.urlProduitImage}${pdt.img_produits}`)
                : `/static/img/default_1.png`;

            const item = document.createElement("div");
            item.className = "products-carousel-slide";
      item.innerHTML = `
                <a href="/produit/${pdt.id_produits}" class="text-decoration-none">
                    <div class="product-card">

                        ${
                            pourcentage > 0
                                ? `<span class="badge text-bg-danger rounded-pill px-2 py-1 reduction">
                                    -${pourcentage}%
                                </span>`
                                : ""
                        }

                        <button 
                            class="like"
                            data-favori-id="${pdt.id_produits}"
                            onclick="event.preventDefault(); event.stopPropagation(); toggleFavori({
                                id: ${pdt.id_produits},
                                nom: '${escapeHtml(pdt.nom_produits)}',
                                prix: ${prixFinal},
                                image: '${imageSrc}'
                            })"
                        >
                            <i 
                                class="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'bi bi-heart-fill'
                                        : 'bi bi-heart'
                                }"
                                style="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'color: gold;'
                                        : ''
                                }"
                            ></i>
                        </button>

                        <img 
                            src="${imageSrc}" 
                            class="product-img" 
                            loading="lazy"
                        >

                        <div class="product-body d-flex">

                            <div class="col-8">
                                <div class="product-title">
                                    ${escapeHtml(pdt.nom_produits)}
                                </div>

                                <p class="small product-desc text-muted">
                                    ${escapeHtml(pdt.descriptin_produits || '')}
                                </p>

                                <div class="product-star d-flex gap-1">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-half"></i>

                                    <span 
                                        class="ms-2"
                                        style="color:var(--text-secondary);font-weight:500;"
                                    >
                                        4.7
                                    </span>
                                </div>
                            </div>

                            <div class="col-4 d-flex flex-column ps-1">
                                <div class="product-price ms-auto">
                                    FCFA ${prixFinal}

                                    ${
                                        prixOriginal > prixFinal
                                            ? `<br>
                                            <span class="text-decoration-line-through text-muted">
                                                FCFA ${prixOriginal}
                                            </span>`
                                            : ""
                                    }
                                </div>
                            </div>

                        </div>

                        <div class="d-flex box-card-btn">
                            <button 
                                class="btn flex-grow-1 btn-sm btn-dark rounded-pill m-0 add-to-cart"
                                data-id="${pdt.id_produits}"
                            >
                                <i class="bi bi-cart me-2"></i>
                                Commander
                            </button>
                        </div>

                    </div>
                </a>
                `;
            container.appendChild(item);
            // Bouton Panier
                item.querySelector('.add-to-cart').addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    ajouterAuPanier({
                        id:   pdt.id_produits,
                        nom:  pdt.nom_produits,
                        prix: prixFinal,
                        img:  imageSrc
                    });
                });

                // Bouton Acheter
                // item.querySelector('.buy-now').addEventListener('click', (e) => {
                //     e.preventDefault();
                //     e.stopPropagation();
                //     ajouterAuPanier({
                //         id:   pdt.id_produits,
                //         nom:  pdt.nom_produits,
                //         prix: prixFinal,
                //         img:  imageSrc
                //     });
                //     ouvrirModal();
                //     fermerDrawer();
                            // });
        });
        
        // Initialiser le carrousel pour les nouveautés
        initCarouselNouveaute();
        
    } else {
        container.innerHTML = `
            <div class="text-center py-5 nothing">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Aucun produit trouvé</p>
            </div>
        `;
    }
}

function Produits() {
    const carousel = document.querySelector('.products-carousel-track');
    showCarouselSkeletons(carousel, 4);

    fetch("/produit/list")
        .then(res => res.json())
        .then(response => {
            if (response.data) afficheproduits(response.data);
        })
        .catch(err => {
            console.error("Erreur produits:", err);
        });
}
function afficheproduits(produits) {
    const container = document.getElementById("listeProduits");
    if (!container) return;
    container.innerHTML = "";

    const produitsLimit = produits;

    if (produitsLimit && produitsLimit.length > 0) {
        
        const h5 = container.previousElementSibling;
        if (h5 && h5.tagName === 'H5') {
            h5.textContent = produitsLimit[0].categories || '';
        }

        let categorieActuelle = null; 
      
       

        produitsLimit.forEach(pdt => {
               const typeReduction = pdt.type;
            const reduction = Number(pdt.reduction) || 0;
            const prixOriginal = Number(pdt.prix_produits);

            let prixFinal = prixOriginal;
            let pourcentage = 0;

            if (typeReduction === "pourcentage") {
                pourcentage = reduction;
                prixFinal = prixOriginal * (1 - reduction / 100);

            } else if (typeReduction === "montant") {
                pourcentage = ((reduction / prixOriginal) * 100).toFixed(0);
                prixFinal = Math.max(0, prixOriginal - reduction);
            }
            const imageSrc = pdt.img_produits
                ? (/^https?:\/\//i.test(pdt.img_produits) ? pdt.img_produits : `${window.urlProduitImage}${pdt.img_produits}`)
                : `/static/img/default_1.png`;

            if (pdt.categories !== categorieActuelle) {
                categorieActuelle = pdt.categories;

                const separateur = document.createElement("div");
                separateur.className = "col-12 categorie-separateur";
               
                separateur.innerHTML = `
                   <div class="w-100">
                        <div class="d-flex justify-content-between align-items-center mt-3 mb-2">
                            <h6 class="categorie-titre text-muted fw-semibold m-0">
                                <span>${escapeHtml(categorieActuelle || '')}</span>
                            </h6>
                            <a href="/categorie/${pdt.id_categorie}" class="text-decoration-none">
                                <div class="d-flex align-items-center gap-1">Voir Plus...</i></div>
                            </a>
                        </div>
                        <hr class="mt-0 mb-3">
                    </div>
                `;
                container.appendChild(separateur);
            }

            const item = document.createElement("div");
            item.className = "col-12 col-sm-6 col-md-4 col-lg-3";
                item.innerHTML = `
                <a href="/produit/${pdt.id_produits}" class="text-decoration-none">
                    <div class="product-card">

                        ${
                            pourcentage > 0
                                ? `<span class="badge text-bg-danger rounded-pill px-2 py-1 reduction">
                                    -${pourcentage}%
                                </span>`
                                : ""
                        }

                        <button 
                            class="like"
                            data-favori-id="${pdt.id_produits}"
                            onclick="event.preventDefault(); event.stopPropagation(); toggleFavori({
                                id: ${pdt.id_produits},
                                nom: '${escapeHtml(pdt.nom_produits)}',
                                prix: ${prixFinal},
                                image: '${imageSrc}'
                            })"
                        >
                            <i 
                                class="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'bi bi-heart-fill'
                                        : 'bi bi-heart'
                                }"
                                style="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'color: gold;'
                                        : ''
                                }"
                            ></i>
                        </button>

                        <img 
                            src="${imageSrc}" 
                            class="product-img" 
                            loading="lazy"
                        >

                        <div class="product-body d-flex">

                            <div class="col-8">
                                <div class="product-title">
                                    ${escapeHtml(pdt.nom_produits)}
                                </div>

                                <p class="small product-desc text-muted">
                                    ${escapeHtml(pdt.descriptin_produits || '')}
                                </p>

                                <div class="product-star d-flex gap-1">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-half"></i>

                                    <span 
                                        class="ms-2"
                                        style="color:var(--text-secondary);font-weight:500;"
                                    >
                                        4.7
                                    </span>
                                </div>
                            </div>

                            <div class="col-4 d-flex flex-column ps-1">
                                <div class="product-price ms-auto">
                                    FCFA ${prixFinal}

                                    ${
                                        prixFinal < prixOriginal
                                            ? `<br>
                                            <span class="text-decoration-line-through text-muted">
                                                FCFA ${prixOriginal}
                                            </span>`
                                            : ""
                                    }
                                </div>
                            </div>

                        </div>

                        <div class="d-flex box-card-btn">
                            <button 
                                class="btn flex-grow-1 btn-sm btn-dark rounded-pill m-0 add-to-cart"
                                data-id="${pdt.id_produits}"
                            >
                                <i class="bi bi-cart me-2"></i>
                                Commander
                            </button>
                        </div>

                    </div>
                </a>
                `;
            container.appendChild(item);

            // Bouton Panier
            item.querySelector('.add-to-cart').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                ajouterAuPanier({
                    id:   pdt.id_produits,
                    nom:  pdt.nom_produits,
                    prix: pdt.prix_produits,
                    img:  imageSrc
                });
            });

            // // Bouton Acheter
            // item.querySelector('.buy-now').addEventListener('click', (e) => {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     ajouterAuPanier({
            //         id:   pdt.id_produits,
            //         nom:  pdt.nom_produits,
            //         prix: pdt.prix_produits,
            //         img:  imageSrc
            //     });
            //     ouvrirModal();
            //     fermerDrawer();
            // });
        });
    } else {
        container.innerHTML = `
            <div class="text-center py-5 nothing">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Aucun produit trouvé</p>
            </div>
        `;
    }
}

function NosProduits() {
    const carousel = document.querySelector('.details-produits');
    showCarouselSkeletons(carousel, 4);

    fetch("/nos_produits")
        .then(res => res.json())
        .then(response => {
            if (response.data) afficheNosProduits(response.data);
        })
        .catch(err => {
            console.error("Erreur produits:", err);
        });
}
function afficheNosProduits(produits) {
    const container = document.getElementById("NosProduits");
    if (!container) return;
    container.innerHTML = "";

    const produitsLimit = produits;

    if (produitsLimit && produitsLimit.length > 0) {
        produitsLimit.forEach(pdt => {
            const typeReduction = pdt.type;
            const reduction = Number(pdt.reduction) || 0;
            const prixOriginal = Number(pdt.prix_produits);

            let prixFinal = prixOriginal;
            let pourcentage = 0;

            if (typeReduction === "pourcentage") {
                pourcentage = reduction;
                prixFinal = prixOriginal * (1 - reduction / 100);

            } else if (typeReduction === "montant") {
                pourcentage = ((reduction / prixOriginal) * 100).toFixed(0);
                prixFinal = Math.max(0, prixOriginal - reduction);
            }

            const imageSrc = pdt.img_produits
                ? (/^https?:\/\//i.test(pdt.img_produits) ? pdt.img_produits : `${window.urlProduitImage}${pdt.img_produits}`)
                : `/static/img/default_1.png`;

            const item = document.createElement("div");
            item.className = "col-12 col-sm-6 col-md-4 col-lg-3";
            item.innerHTML = `
                <a href="/produit/${pdt.id_produits}" class="text-decoration-none">
                    <div class="product-card">

                        ${
                            pourcentage > 0
                                ? `<span class="badge text-bg-danger rounded-pill px-2 py-1 reduction">
                                    -${pourcentage}%
                                </span>`
                                : ""
                        }

                        <button 
                            class="like"
                            data-favori-id="${pdt.id_produits}"
                            onclick="event.preventDefault(); event.stopPropagation(); toggleFavori({
                                id: ${pdt.id_produits},
                                nom: '${escapeHtml(pdt.nom_produits)}',
                                prix: ${prixFinal},
                                image: '${imageSrc}'
                            })"
                        >
                            <i 
                                class="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'bi bi-heart-fill'
                                        : 'bi bi-heart'
                                }"
                                style="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'color: gold;'
                                        : ''
                                }"
                            ></i>
                        </button>

                        <img 
                            src="${imageSrc}" 
                            class="product-img" 
                            loading="lazy"
                        >

                        <div class="product-body d-flex">

                            <div class="col-8">
                                <div class="product-title">
                                    ${escapeHtml(pdt.nom_produits)}
                                </div>

                                <p class="small product-desc text-muted">
                                    ${escapeHtml(pdt.descriptin_produits || '')}
                                </p>

                                <div class="product-star d-flex gap-1">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-half"></i>

                                    <span 
                                        class="ms-2"
                                        style="color:var(--text-secondary);font-weight:500;"
                                    >
                                        4.7
                                    </span>
                                </div>
                            </div>

                            <div class="col-4 d-flex flex-column ps-1">
                                <div class="product-price ms-auto">
                                    FCFA ${Math.round(prixFinal)}

                                    ${
                                        prixFinal < prixOriginal
                                            ? `<br>
                                            <span class="text-decoration-line-through text-muted">
                                                FCFA ${prixOriginal}
                                            </span>`
                                            : ""
                                    }
                                </div>
                            </div>

                        </div>

                        <div class="d-flex box-card-btn">
                            <button 
                                class="btn flex-grow-1 btn-sm btn-dark rounded-pill m-0 add-to-cart"
                                data-id="${pdt.id_produits}"
                            >
                                <i class="bi bi-cart me-2"></i>
                                Commander
                            </button>
                        </div>

                    </div>
                </a>
            `;
            container.appendChild(item);

            // Bouton Panier
            item.querySelector('.add-to-cart').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                ajouterAuPanier({
                    id:   pdt.id_produits,
                    nom:  pdt.nom_produits,
                    prix: prixFinal,
                    img:  imageSrc
                });
            });
        });
    } else {
        container.innerHTML = `
            <div class="text-center py-5 nothing">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Aucun produit trouvé</p>
            </div>
        `;
    }
}

function produit_nouveaute() {
    const container = document.getElementById("productsTrack");
    showCarouselSkeletons(container, 4);

    fetch("/produit_nouveaute/list")
        .then(res => res.json())
        .then(response => {
            if (response.data) afficheproduit_nouveaute(response.data);
        })
        .catch(err => {
            console.error("Erreur produits:", err);
        });
}
function afficheproduit_nouveaute(produits) {
    const container = document.getElementById("productsTrackNouveaute");
    if (!container) return;
    container.innerHTML = "";

    const produitsLimit = produits.slice(0, 12);

    if (produitsLimit && produitsLimit.length > 0) {    
        produitsLimit.forEach(pdt => {
           const typeReduction = pdt.type;
            const reduction = Number(pdt.reduction) || 0;
            const prixOriginal = Number(pdt.prix_produits);

            let prixFinal = prixOriginal;
            let pourcentage = 0;

            if (typeReduction === "pourcentage") {
                pourcentage = reduction;
                prixFinal = prixOriginal * (1 - reduction / 100);

            } else if (typeReduction === "montant") {
                pourcentage = ((reduction / prixOriginal) * 100).toFixed(0);
                prixFinal = Math.max(0, prixOriginal - reduction);
            }
            const imageSrc = pdt.img_produits
                ? (/^https?:\/\//i.test(pdt.img_produits) ? pdt.img_produits : `${window.urlProduitImage}${pdt.img_produits}`)
                : `/static/img/default_1.png`;

            const item = document.createElement("div");
            item.className = "products-carousel-slide";
      item.innerHTML = `
                <a href="/produit/${pdt.id_produits}" class="text-decoration-none">
                    <div class="product-card">

                        ${
                            pourcentage > 0
                                ? `<span class="badge text-bg-danger rounded-pill px-2 py-1 reduction">
                                    -${pourcentage}%
                                </span>`
                                : ""
                        }

                        <button 
                            class="like"
                            data-favori-id="${pdt.id_produits}"
                            onclick="event.preventDefault(); event.stopPropagation(); toggleFavori({
                                id: ${pdt.id_produits},
                                nom: '${escapeHtml(pdt.nom_produits)}',
                                prix: ${prixFinal},
                                image: '${imageSrc}'
                            })"
                        >
                            <i 
                                class="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'bi bi-heart-fill'
                                        : 'bi bi-heart'
                                }"
                                style="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'color: gold;'
                                        : ''
                                }"
                            ></i>
                        </button>

                        <img 
                            src="${imageSrc}" 
                            class="product-img" 
                            loading="lazy"
                        >

                        <div class="product-body d-flex">

                            <div class="col-8">
                                <div class="product-title">
                                    ${escapeHtml(pdt.nom_produits)}
                                </div>

                                <p class="small product-desc text-muted">
                                    ${escapeHtml(pdt.descriptin_produits || '')}
                                </p>

                                <div class="product-star d-flex gap-1">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-half"></i>

                                    <span 
                                        class="ms-2"
                                        style="color:var(--text-secondary);font-weight:500;"
                                    >
                                        4.7
                                    </span>
                                </div>
                            </div>

                            <div class="col-4 d-flex flex-column ps-1">
                                <div class="product-price ms-auto">
                                    FCFA ${prixFinal}

                                    ${
                                        prixOriginal > prixFinal
                                            ? `<br>
                                            <span class="text-decoration-line-through text-muted">
                                                FCFA ${prixOriginal}
                                            </span>`
                                            : ""
                                    }
                                </div>
                            </div>

                        </div>

                        <div class="d-flex box-card-btn">
                            <button 
                                class="btn flex-grow-1 btn-sm btn-dark rounded-pill m-0 add-to-cart"
                                data-id="${pdt.id_produits}"
                            >
                                <i class="bi bi-cart me-2"></i>
                                Commander
                            </button>
                        </div>

                    </div>
                </a>
                `;
            container.appendChild(item);
            // Bouton Panier
                item.querySelector('.add-to-cart').addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    ajouterAuPanier({
                        id:   pdt.id_produits,
                        nom:  pdt.nom_produits,
                        prix: prixFinal,
                        img:  imageSrc
                    });
                });

                // Bouton Acheter
                // item.querySelector('.buy-now').addEventListener('click', (e) => {
                //     e.preventDefault();
                //     e.stopPropagation();
                //     ajouterAuPanier({
                //         id:   pdt.id_produits,
                //         nom:  pdt.nom_produits,
                //         prix: prixFinal,
                //         img:  imageSrc
                //     });
                //     ouvrirModal();
                //     fermerDrawer();
                            // });
        });
        
        // Initialiser le carrousel pour les nouveautés
        initCarouselNouveaute();
        
    } else {
        container.innerHTML = `
            <div class="text-center py-5 nothing">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Aucun produit trouvé</p>
            </div>
        `;
    }
}

function produit_recents() {
    const container = document.getElementById("productsTrackRecents");
    showCarouselSkeletons(container, 4);

    fetch("/produit_recents/list")
        .then(res => res.json())
        .then(response => {
            if (response.data) afficheproduit_recents(response.data);
        })
        .catch(err => {
            console.error("Erreur produits:", err);
        });
}
function afficheproduit_recents(produits) {
    const container = document.getElementById("productsTrackRecents");
    if (!container) return;
    container.innerHTML = "";

    const produitsLimit = produits.slice(0, 12);
if (produitsLimit && produitsLimit.length > 0) {    
        produitsLimit.forEach(pdt => {
           const typeReduction = pdt.type;
            const reduction = Number(pdt.reduction) || 0;
            const prixOriginal = Number(pdt.prix_produits);

            let prixFinal = prixOriginal;
            let pourcentage = 0;

            if (typeReduction === "pourcentage") {
                pourcentage = reduction;
                prixFinal = prixOriginal * (1 - reduction / 100);

            } else if (typeReduction === "montant") {
                pourcentage = ((reduction / prixOriginal) * 100).toFixed(0);
                prixFinal = Math.max(0, prixOriginal - reduction);
            }
            const imageSrc = pdt.img_produits
                ? (/^https?:\/\//i.test(pdt.img_produits) ? pdt.img_produits : `${window.urlProduitImage}${pdt.img_produits}`)
                : `/static/img/default_1.png`;

            const item = document.createElement("div");
            item.className = "products-carousel-slide";
      item.innerHTML = `
                <a href="/produit/${pdt.id_produits}" class="text-decoration-none">
                    <div class="product-card">

                        ${
                            pourcentage > 0
                                ? `<span class="badge text-bg-danger rounded-pill px-2 py-1 reduction">
                                    -${pourcentage}%
                                </span>`
                                : ""
                        }

                        <button 
                            class="like"
                            data-favori-id="${pdt.id_produits}"
                            onclick="event.preventDefault(); event.stopPropagation(); toggleFavori({
                                id: ${pdt.id_produits},
                                nom: '${escapeHtml(pdt.nom_produits)}',
                                prix: ${prixFinal},
                                image: '${imageSrc}'
                            })"
                        >
                            <i 
                                class="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'bi bi-heart-fill'
                                        : 'bi bi-heart'
                                }"
                                style="${
                                    favoris.some(f => f.id === pdt.id_produits)
                                        ? 'color: gold;'
                                        : ''
                                }"
                            ></i>
                        </button>

                        <img 
                            src="${imageSrc}" 
                            class="product-img" 
                            loading="lazy"
                        >

                        <div class="product-body d-flex">

                            <div class="col-8">
                                <div class="product-title">
                                    ${escapeHtml(pdt.nom_produits)}
                                </div>

                                <p class="small product-desc text-muted">
                                    ${escapeHtml(pdt.descriptin_produits || '')}
                                </p>

                                <div class="product-star d-flex gap-1">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-half"></i>

                                    <span 
                                        class="ms-2"
                                        style="color:var(--text-secondary);font-weight:500;"
                                    >
                                        4.7
                                    </span>
                                </div>
                            </div>

                            <div class="col-4 d-flex flex-column ps-1">
                                <div class="product-price ms-auto">
                                    FCFA ${prixFinal}

                                    ${
                                        prixOriginal > prixFinal
                                            ? `<br>
                                            <span class="text-decoration-line-through text-muted">
                                                FCFA ${prixOriginal}
                                            </span>`
                                            : ""
                                    }
                                </div>
                            </div>

                        </div>

                        <div class="d-flex box-card-btn">
                            <button 
                                class="btn flex-grow-1 btn-sm btn-dark rounded-pill m-0 add-to-cart"
                                data-id="${pdt.id_produits}"
                            >
                                <i class="bi bi-cart me-2"></i>
                                Commander
                            </button>
                        </div>

                    </div>
                </a>
                `;
            container.appendChild(item);
            // Bouton Panier
                item.querySelector('.add-to-cart').addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    ajouterAuPanier({
                        id:   pdt.id_produits,
                        nom:  pdt.nom_produits,
                        prix: prixFinal,
                        img:  imageSrc
                    });
                });

                // Bouton Acheter
                // item.querySelector('.buy-now').addEventListener('click', (e) => {
                //     e.preventDefault();
                //     e.stopPropagation();
                //     ajouterAuPanier({
                //         id:   pdt.id_produits,
                //         nom:  pdt.nom_produits,
                //         prix: prixFinal,
                //         img:  imageSrc
                //     });
                //     ouvrirModal();
                //     fermerDrawer();
                            // });
        });
        
        // Initialiser le carrousel pour les nouveautés
        initCarouselNouveaute();
        
    } else {
        container.innerHTML = `
            <div class="text-center py-5 nothing">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Aucun produit trouvé</p>
            </div>
        `;
    }
}


function initCarousel() {
    carouselTrack = document.getElementById('productsTrack');
    carouselPrevBtn = document.getElementById('productsPrev');
    carouselNextBtn = document.getElementById('productsNext');
    carouselDotsContainer = document.getElementById('productsDots');
    
    if (!carouselTrack) return;
    
    carouselSlides = Array.from(carouselTrack.querySelectorAll('.products-carousel-slide'));
    if (carouselSlides.length === 0) return;
    
    carouselCurrent = 0;
    
    // Nettoyer les anciens événements
    if (carouselPrevBtn) {
        const newPrevBtn = carouselPrevBtn.cloneNode(true);
        carouselPrevBtn.parentNode.replaceChild(newPrevBtn, carouselPrevBtn);
        carouselPrevBtn = newPrevBtn;
    }
    
    if (carouselNextBtn) {
        const newNextBtn = carouselNextBtn.cloneNode(true);
        carouselNextBtn.parentNode.replaceChild(newNextBtn, carouselNextBtn);
        carouselNextBtn = newNextBtn;
    }
    
    buildCarouselDots();
    updateCarouselButtons();
    updateCarouselPosition();
    
    // Ajouter les événements
    if (carouselPrevBtn) {
        carouselPrevBtn.addEventListener('click', () => carouselPrev());
    }
    
    if (carouselNextBtn) {
        carouselNextBtn.addEventListener('click', () => carouselNext());
    }
    
    // Gestion du redimensionnement
    let resizeTimer;
    window.removeEventListener('resize', carouselResizeHandler);
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            carouselCurrent = 0;
            buildCarouselDots();
            updateCarouselPosition();
            updateCarouselButtons();
        }, 150);
    });
}

function initCarouselNouveaute() {
    const track = document.getElementById('productsTrackNouveaute');
    const prevBtn = document.getElementById('productsPrevNouveaute');
    const nextBtn = document.getElementById('productsNextNouveaute');
    const dotsContainer = document.getElementById('productsDotsNouveaute');
    
    if (!track) return;
    
    const slides = Array.from(track.querySelectorAll('.products-carousel-slide'));
    if (slides.length === 0) return;
    
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
        return slides.length - getVisible() + 1;
    }
    
    function buildDots() {
        if (!dotsContainer) return;
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
    
    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }
    
    function updateBtns() {
        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current >= getTotal() - 1;
    }
    
    function goTo(index) {
        current = Math.max(0, Math.min(index, getTotal() - 1));
        const slideWidth = slides[0].offsetWidth + getGap();
        track.style.transform = `translateX(-${current * slideWidth}px)`;
        updateDots();
        updateBtns();
    }
    
    function next() {
        if (current < getTotal() - 1) {
            goTo(current + 1);
        }
    }
    
    function prev() {
        if (current > 0) {
            goTo(current - 1);
        }
    }
    
    // Nettoyer et ajouter les événements
    if (prevBtn) {
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        newPrevBtn.addEventListener('click', prev);
    }
    
    if (nextBtn) {
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        newNextBtn.addEventListener('click', next);
    }
    
    buildDots();
    goTo(0);
}


function buildCarouselDots() {
    if (!carouselDotsContainer) return;
    carouselDotsContainer.innerHTML = '';
    const total = getCarouselTotal();
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === carouselCurrent) dot.classList.add('active');
        dot.addEventListener('click', () => goToCarouselSlide(i));
        carouselDotsContainer.appendChild(dot);
    }
}
function updateCarouselDots() {
    if (!carouselDotsContainer) return;
    const dots = carouselDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === carouselCurrent);
    });
}

/**
 * Met à jour l'état des boutons
 */
function updateCarouselButtons() {
    if (carouselPrevBtn) {
        carouselPrevBtn.disabled = carouselCurrent === 0;
    }
    if (carouselNextBtn) {
        carouselNextBtn.disabled = carouselCurrent >= getCarouselTotal() - 1;
    }
}

/**
 * Obtient le nombre de slides visibles
 */
function getCarouselVisible() {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 992) return 2;
    return 4;
}

/**
 * Obtient le gap entre les slides
 */
function getCarouselGap() {
    return window.innerWidth < 576 ? 0 : 16;
}

/**
 * Obtient le nombre total de positions
 */
function getCarouselTotal() {
    return carouselSlides.length - getCarouselVisible() + 1;
}

/**
 * Met à jour la position du carrousel
 */
function updateCarouselPosition() {
    if (!carouselTrack || carouselSlides.length === 0) return;
    const slideWidth = carouselSlides[0].offsetWidth + getCarouselGap();
    carouselTrack.style.transform = `translateX(-${carouselCurrent * slideWidth}px)`;
    updateCarouselDots();
    updateCarouselButtons();
}

/**
 * Va à un slide spécifique
 */
function goToCarouselSlide(index) {
    carouselCurrent = Math.max(0, Math.min(index, getCarouselTotal() - 1));
    updateCarouselPosition();
}

/**
 * Slide suivant
 */
function carouselNext() {
    if (carouselCurrent < getCarouselTotal() - 1) {
        carouselCurrent++;
        updateCarouselPosition();
    }
}

/**
 * Slide précédent
 */
function carouselPrev() {
    if (carouselCurrent > 0) {
        carouselCurrent--;
        updateCarouselPosition();
    }
}

/**
 * Gestionnaire de resize
 */
function carouselResizeHandler() {
    carouselCurrent = 0;
    buildCarouselDots();
    updateCarouselPosition();
    updateCarouselButtons();
}

/**
 * Échappe les caractères HTML
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}