/* ========================
   FAVORIS
   ======================== */

let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

function getfavoris() {
    return favoris;
}
function saveFavoris(favoris) {
    localStorage.setItem("favoris", JSON.stringify(favoris));
    updateCompteurFavoris();
    syncBoutonsFavoris();
}
/* Ouvrir / Fermer le drawer favoris */
function ouvrirDrawerFavoris() {
    document.getElementById('drawerFavoris').classList.add('open');
    document.body.classList.add('drawer-open');
    renderFavoris();
}

function fermerDrawerFavoris() {
    document.getElementById('drawerFavoris').classList.remove('open');
    document.body.classList.remove('drawer-open');
}

/* Ajouter ou retirer un produit des favoris */
function toggleFavori(produit) {
    // produit = { id, nom, prix, image }
    const index = favoris.findIndex(p => p.id === produit.id);

    if (index === -1) {
        favoris.push(produit);
    } else {
        favoris.splice(index, 1);
    }

    saveFavoris(favoris);
}

/* Supprimer un favori depuis le drawer */
function supprimerFavori(id) {
    favoris = favoris.filter(p => p.id !== id);
    saveFavoris(favoris);
    renderFavoris();
}
function modifierQuantite(id, quantite) {
    const fav = getfavoris();
    const index = fav.findIndex(p => p.id === id);
    if (index !== -1) {
        if (quantite <= 0) {
            supprimerFavori(id);
        } else {
            fav[index].quantite = quantite;
            saveFavoris(fav);
        }
    }
}

function clearFavoris() {
    favoris = [];
    localStorage.removeItem('favoris');
    updateCompteurFavoris();
    syncBoutonsFavoris();
    renderFavoris();
}

function totalFavoris() {
    return favoris.reduce((acc, p) => acc + parseFloat(p.prix), 0);
}
/* Mettre à jour le badge compteur */
function updateCompteurFavoris() {
    const badge = document.getElementById('favoris-compteur');
    if (!badge) return; 

    if (favoris.length > 0) {
        badge.textContent = favoris.length;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

/* Synchroniser l'icône cœur sur tous les boutons produits */
function syncBoutonsFavoris() {
    document.querySelectorAll('[data-favori-id]').forEach(btn => {
        const id = parseInt(btn.dataset.favoriId);
        const estFavori = favoris.some(f => f.id === id);
        btn.classList.toggle('actif', estFavori);
        const icon = btn.querySelector('i');
        if (!icon) return;
        icon.className = estFavori ? 'bi bi-heart-fill' : 'bi bi-heart';
        icon.style.color = estFavori ? 'gold' : '';
    });
}

/* Afficher les favoris dans le drawer */
function renderFavoris() {
    const body = document.getElementById('drawerFavorisBody');
    if (!body) return;

    const badge = document.getElementById('favoris-compteur');
    const total = document.getElementById('favoris-total');
    if (total) total.textContent = `FCFA ${totalFavoris().toLocaleString("fr-FR")}`;


    if (favoris.length === 0) {
        body.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-heartbreak fs-1"></i>
                <p class="mt-2">Vous n'avez pas encore de favoris</p>
            </div>`;
        return;
    }

    body.innerHTML = favoris.map(p => `
        <div class="d-flex gap-3 align-items-center border rounded-3 p-2">
            <img src="${p.image}" alt="${escapeHtml(p.nom)}"
                 style="width:56px;height:56px;object-fit:cover;border-radius:8px;"
                 onerror="this.src='/static/img/default_1.png'">
            <div class="flex-grow-1">
                <div class="small fw-500">${escapeHtml(p.nom)}</div>
                <div class="text-muted" style="font-size:12px;">
                    FCFA ${parseFloat(p.prix).toLocaleString("fr-FR")}
                </div>
            </div>
            <button class="btn btn-sm text-danger"
                    onclick="supprimerFavori(${p.id}); renderDrawer();">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');
}

/* Fermer le drawer via le bouton X */
document.addEventListener('DOMContentLoaded', () => {
    const closeFavoris = document.getElementById('closeFavoris');
    if (closeFavoris) closeFavoris.addEventListener('click', fermerDrawerFavoris);

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) continueBtn.addEventListener('click', fermerDrawerFavoris);

    updateCompteurFavoris();
    syncBoutonsFavoris();
});