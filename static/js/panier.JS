// =====================
//  UTILITAIRES PANIER
// =====================

function getPanier() {
    return JSON.parse(localStorage.getItem("panier")) || [];
}

function savePanier(panier) {
    localStorage.setItem("panier", JSON.stringify(panier));
    updateCompteurPanier();
}

function ajouterAuPanier(produit, qty = 1) {
    const panier = getPanier();
    const index = panier.findIndex(p => p.id === produit.id);
    if (index !== -1) {
        panier[index].quantite += qty;
    } else {
        panier.push({ ...produit, quantite: qty });
    }
    savePanier(panier);
    ouvrirDrawer();
}

function supprimerDuPanier(id) {
    const panier = getPanier().filter(p => p.id !== id);
    savePanier(panier);
}

function modifierQuantite(id, quantite) {
    const panier = getPanier();
    const index = panier.findIndex(p => p.id === id);
    if (index !== -1) {
        if (quantite <= 0) {
            supprimerDuPanier(id);
        } else {
            panier[index].quantite = quantite;
            savePanier(panier);
        }
    }
}

function totalPanier() {
    return getPanier().reduce((acc, p) => acc + (parseFloat(p.prix) * p.quantite), 0);
}

function updateCompteurPanier() {
    const total = getPanier().reduce((acc, p) => acc + p.quantite, 0);
    const compteur = document.getElementById("panier-compteur");
    if (compteur) {
        compteur.textContent = total;
        compteur.style.display = total > 0 ? "inline-block" : "none";
    }
}

// =====================
//  DRAWER
// =====================

function ouvrirDrawer() {
    const drawer  = document.getElementById("drawerPanier");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer)  drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");
    renderDrawer();
}

function fermerDrawer() {
    const drawer  = document.getElementById("drawerPanier");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer)  drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
}

function renderDrawer() {
    const panier = getPanier();
    const body   = document.getElementById("drawerBody");
    const count  = panier.reduce((a, p) => a + p.quantite, 0);
    const countEl = document.getElementById("drawer-count");
    const totalEl = document.getElementById("drawerTotal");

    if (countEl) countEl.textContent = `(${count} article${count > 1 ? "s" : ""})`;
    if (totalEl) totalEl.textContent = `FCFA ${totalPanier().toLocaleString("fr-FR")}`;

    if (!body) return;

    if (panier.length === 0) {
        body.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-cart-x fs-1"></i>
                <p class="mt-2">Votre panier est vide</p>
            </div>`;
        return;
    }

    body.innerHTML = panier.map(p => `
        <div class="d-flex gap-3 align-items-center border rounded-3 p-2">
            <img src="${p.img}" 
                 style="width:56px;height:56px;object-fit:cover;border-radius:8px;"
                 onerror="this.src='/static/img/default_1.png'">
            <div class="flex-grow-1">
                <div class="small fw-500">${escapeHtml(p.nom)}</div>
                <div class="text-muted" style="font-size:12px;">
                    FCFA ${parseFloat(p.prix).toLocaleString("fr-FR")}
                </div>
                <div class="d-flex align-items-center gap-2 mt-1">
                    <button class="btn btn-sm btn-outline-secondary rounded-circle p-0"
                            style="width:24px;height:24px;line-height:1;"
                            onclick="modifierQuantite(${p.id}, ${p.quantite - 1}); renderDrawer();">−</button>
                    <span class="small fw-500">${p.quantite}</span>
                    <button class="btn btn-sm btn-outline-secondary rounded-circle p-0"
                            style="width:24px;height:24px;line-height:1;"
                            onclick="modifierQuantite(${p.id}, ${p.quantite + 1}); renderDrawer();">+</button>
                </div>
            </div>
            <button class="btn btn-sm text-danger"
                    onclick="supprimerDuPanier(${p.id}); renderDrawer();">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join("");
}

// =====================
//  INIT
// =====================

document.addEventListener("DOMContentLoaded", () => {
    updateCompteurPanier();

    const closeBtn    = document.getElementById("closeDrawer");
    const overlay     = document.getElementById("drawerOverlay");
    const continueBtn = document.getElementById("continueBtn");

    if (closeBtn)     closeBtn.addEventListener("click", fermerDrawer);
    if (overlay)      overlay.addEventListener("click", fermerDrawer);
    if (continueBtn)  continueBtn.addEventListener("click", fermerDrawer);
});