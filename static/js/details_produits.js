document.addEventListener("DOMContentLoaded", () => {
    // Extrait l'ID proprement depuis l'URL
    const parts = window.location.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];

    if (!id || isNaN(id)) {
        console.error("ID produit manquant dans l'URL");
        return;
    }

    details_produits(id);
});

function details_produits(id) {
    fetch(`/detail_produit/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Produit introuvable");
            return res.json();
        })
        .then(response => {
            if (response.data) affichedetails_produits(response.data);
        })
        .catch(err => {
            console.error("Erreur details produits:", err);
        });
}

function affichedetails_produits(pdt) {
    const container = document.getElementById("details-produits");
    if (!container) return;

    // Images secondaires avec placeholders
    const imgSecondaires = [
        pdt.img_secondaires[0] || null,
        pdt.img_secondaires[1] || null,
        pdt.img_secondaires[2] || null,
    ];

    const imagesHtml = imgSecondaires.map(img => `
        <div class="box-item">
            ${img
                ? `<img src="${window.urlProduitImage}${img}" alt="" class="image-item">`
                : `<div class="image-item placeholder-img"><i class="bi bi-image text-muted"></i></div>`
            }
        </div>
    `).join('');

    const prixActuel = parseFloat(pdt.prix);
    const prixAvant  = Math.round(prixActuel * 1.25);
    const reduction  = Math.round(((prixAvant - prixActuel) / prixAvant) * 100);

    container.innerHTML = `
        <div class="row g-3" data-aos="fade-up" data-aos-delay="0">

            <!-- Images -->
            <div class="col-12 col-md-6 d-flex flex-column align-items-center">
                <div class="box-main-image shadow-sm">
                    <img src="${window.urlProduitImage}${pdt.img_principale}" 
                         alt="${pdt.nom}" 
                         class="main-image" 
                         id="mainImage">
                </div>
                <div class="slide-image d-flex justify-content-between gap-2 mt-3">
                    <!-- Image principale en miniature -->
                    <div class="box-item">
                        <img src="${window.urlProduitImage}${pdt.img_principale}" 
                             alt="" class="image-item active">
                    </div>
                    <!-- Images secondaires -->
                    ${imagesHtml}
                </div>
            </div>

            <!-- Infos produit -->
            <div class="col-12 col-md-6 product-text">
                <span class="badge text-bg-danger rounded-pill mb-2">-${reduction}%</span>
                <h2 class="title text-capitalize">${pdt.nom}</h2>
                <p class="small text-muted mt-3">${pdt.description || ''}</p>

                <div class="w-100 d-flex justify-content-between align-items-center">
                    <div class="product-star d-flex gap-1">
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                        <span class="ms-2" style="color:var(--text-secondary);font-weight:500;">3.0</span>
                    </div>
                    <div>
                        <h5 class="mb-0">FCFA ${prixActuel.toLocaleString("fr-FR")}</h5>
                        <span class="text-decoration-line-through text-muted small">
                            FCFA ${prixAvant.toLocaleString("fr-FR")}
                        </span>
                    </div>
                </div>

                <div style="color:#CCCCCC"><hr></div>

                <div class="count d-flex gap-2 rounded-pill align-items-center">
                    <div class="btn-count" id="btnMoins"><i class="bi bi-dash"></i></div>
                    <input type="number" value="1" min="1" id="qtyInput">
                    <div class="btn-count" id="btnPlus"><i class="bi bi-plus"></i></div>
                </div>

                <div class="mt-4 d-flex flex-wrap gap-2">
                    <button class="btn btn-primary-custom rounded-pill buy-now" 
                            data-id="${pdt.id}">
                        Achetez maintenant
                    </button>
                    <button class="btn btn-outline-dark rounded-pill add-to-cart" 
                            data-id="${pdt.id}">
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </div>
    `;

    // Clique sur image miniature → change l'image principale
    container.querySelectorAll('.image-item').forEach(img => {
        img.addEventListener('click', () => {
            container.querySelectorAll('.image-item').forEach(i => i.classList.remove('active'));
            img.classList.add('active');
            document.getElementById('mainImage').src = img.src;
        });
    });

    // Quantité
    document.getElementById('btnMoins').addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    });
    document.getElementById('btnPlus').addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        input.value = parseInt(input.value) + 1;
    });

    // Ajouter au panier
    container.querySelector('.add-to-cart').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const qty = parseInt(document.getElementById('qtyInput').value);
        ajouterAuPanier({
            id:   pdt.id,
            nom:  pdt.nom,
            prix: pdt.prix,
            img:  `${window.urlProduitImage}${pdt.img_principale}`
        }, qty);
    });

    // Acheter maintenant
    container.querySelector('.buy-now').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const qty = parseInt(document.getElementById('qtyInput').value);
        ajouterAuPanier({
            id:   pdt.id,
            nom:  pdt.nom,
            prix: pdt.prix,
            img:  `${window.urlProduitImage}${pdt.img_principale}`
        }, qty);
        window.location.href = "/panier";
    });
}