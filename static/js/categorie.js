document.addEventListener("DOMContentLoaded", () => {
    // Extrait l'ID proprement depuis l'URL
    const parts = window.location.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];

   

    if (document.getElementById("categorie-produits")) {
        Categorie(id);
    }

    
});

function Categorie(id) {
    
    fetch(`/categorie_produits/${id}`)
        .then(res => res.json())
        .then(response => {
            if (response.data) affichecategorie(response.data);
        })
        .catch(err => {
            console.error("Erreur produits:", err);
        });
}

function affichecategorie(produits) {
    const container = document.getElementById("categorie-produits");
    if (!container) return;
    container.innerHTML = "";

    const produitsLimit = produits;

    if (produitsLimit && produitsLimit.length > 0) {
        
        const h5 = container.previousElementSibling;
        if (h5 && h5.tagName === 'H5') {
            h5.textContent = produitsLimit[0].sous_categorie || '';
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

            if (pdt.sous_categorie !== categorieActuelle) {
                categorieActuelle = pdt.sous_categorie;

                const separateur = document.createElement("div");
                separateur.className = "col-12 categorie-separateur";
                separateur.innerHTML = `
                    <h6 class="categorie-titre text-muted fw-semibold mt-3 mb-2">
                        <span>${escapeHtml(categorieActuelle || '')}</span>
                    </h6>
                    <hr class="mt-0 mb-3">
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
                    prix: pdt.prix_produits,
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
            //         prix: pdt.prix_produits,
            //         img:  imageSrc
            //     });
            //     window.location.href = "/panier";
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
