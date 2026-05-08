document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("NosProduits")) {
        Produits();
    }
});

function Produits() {
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
    const container = document.getElementById("NosProduits");
    if (!container) return;
    container.innerHTML = "";

    if (produits && produits.length > 0) {
        produits.forEach(pdt => {
            
            const prixActuel = pdt.prix_produits;
            const prixAvant = Math.round(prixActuel * 1.25); // +25% = prix avant réduction
            const reduction = Math.round(((prixAvant - prixActuel) / prixAvant) * 100); // % de réduction

            const item = document.createElement("div");
            item.className = "col-12 col-sm-6 col-md-4 col-lg-3"; 

            item.innerHTML = `
                <div class="product-card">
                    <span class="badge text-bg-danger rounded-pill px-2 py-1 reduction">-${reduction}%</span>
                    <div class="like"><i class="bi bi-heart"></i></div>
                    <img src="${pdt.img_produits}" class="product-img">
                    <div class="product-body d-flex">
                        <div class="col-8">
                            <div class="product-title">${pdt.nom_produits}</div>
                            <p class="small product-desc text-muted">${pdt.descriptin_produits}</p>
                            <div class="product-star d-flex gap-1">
                                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
                                <span class="ms-2" style="color:var(--text-secondary);font-weight:500;">4.7</span>
                            </div>
                        </div>
                        <div class="col-4 d-flex flex-column">
                            <div class="product-price ms-auto">FCFA ${prixActuel} <br/> <span class="text-decoration-line-through text-muted">FCFA ${prixAvant}</span></div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-dark rounded-pill mt-2 panier-btn"><i class="bi bi-cart me-2"></i>Panier</button>
                </div>
            `;
            container.appendChild(item);
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