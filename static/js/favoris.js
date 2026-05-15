/* ========================
   FAVORIS
   ======================== */

let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

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
    const index = favoris.findIndex(f => f.id === produit.id);

    if (index === -1) {
        favoris.push(produit);
    } else {
        favoris.splice(index, 1);
    }

    localStorage.setItem('favoris', JSON.stringify(favoris));
    updateCompteurFavoris();
    syncBoutonsFavoris();
}

/* Supprimer un favori depuis le drawer */
function supprimerFavori(id) {
    favoris = favoris.filter(f => f.id !== id);
    localStorage.setItem('favoris', JSON.stringify(favoris));
    updateCompteurFavoris();
    syncBoutonsFavoris();
    renderFavoris();
}

/* Mettre à jour le badge compteur */
function updateCompteurFavoris() {
    const badge = document.getElementById('favoris-compteur');
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
        icon.className = estFavori ? 'bi bi-heart-fill' : 'bi bi-heart';
        icon.style.color = estFavori ? 'gold' : '';
    });
}

/* Afficher les favoris dans le drawer */
function renderFavoris() {
    const body = document.getElementById('drawerFavorisBody');
    const favoris = favoris; 

    if (favoris.length === 0) {
        body.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-heartbreak fs-1"></i>
                <p class="mt-2">Vous n'avez pas encore de favoris</p>
            </div>`;
        return;
    }

    body.innerHTML = favoris.map(f => `
        <div class="d-flex align-items-center gap-3 mb-3 p-2 border rounded">
            <img src="${f.image}" alt="${f.nom}" 
                 style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
            <div class="flex-grow-1">
                <div style="font-size:14px;font-weight:500;">${f.nom}</div>
                <div style="font-size:13px;color:#888;">${f.prix} FCFA</div>
            </div>
            <button onclick="supprimerFavori(${f.id})" class="btn btn-sm text-danger">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');
}

/* Fermer le drawer via le bouton X */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeFavoris')
        .addEventListener('click', fermerDrawerFavoris);

    document.getElementById('continueBtn')
        .addEventListener('click', fermerDrawerFavoris);

    updateCompteurFavoris();
    syncBoutonsFavoris();
});