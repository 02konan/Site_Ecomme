/* ========================
   ÉTAT DES FILTRES
   ======================== */
let tousLesProduits = []; // stocke tous les produits bruts

/* ========================
   CHARGEMENT INITIAL
   ======================== */
function Produits() {
    fetch("/produit/list")
        .then(res => res.json())
        .then(response => {
            if (response.data) {
                tousLesProduits = response.data; // ← on garde une copie
                afficheproduits(tousLesProduits);
            }
        })
        .catch(err => console.error("Erreur produits:", err));
}

/* ========================
   RÉCUPÉRER LES FILTRES ACTIFS
   ======================== */
function getFiltres() {
    // Catégorie
    const categorieEl = document.querySelector('#drawerFiltres input[name="category"]:checked');
    const categorie = categorieEl ? categorieEl.value : null;

    // Prix
    const prixMin = parseFloat(document.getElementById('prixMin').value) || 0;
    const prixMax = parseFloat(document.getElementById('prixMax').value) || Infinity;

    // Notes cochées
    const notes = Array.from(
        document.querySelectorAll('#drawerFiltres input[type="checkbox"]:checked')
    ).map(el => parseInt(el.value));

    return { categorie, prixMin, prixMax, notes };
}

/* ========================
   APPLIQUER LES FILTRES
   ======================== */
function appliquerFiltres() {
    const { categorie, prixMin, prixMax, notes } = getFiltres();

    let produitsFiltres = tousLesProduits;

    // Filtre catégorie
    if (categorie) {
        produitsFiltres = produitsFiltres.filter(p => p.categories === categorie);
    }

    // Filtre prix
    produitsFiltres = produitsFiltres.filter(p => {
        const prix = parseFloat(p.prix_produits);
        return prix >= prixMin && prix <= prixMax;
    });

    // Filtre note (note_produits doit exister dans ton API)
    // Si plusieurs notes cochées → on garde les produits >= à au moins une note cochée
    if (notes.length > 0) {
        const noteMin = Math.min(...notes);
        produitsFiltres = produitsFiltres.filter(p => {
            const note = parseFloat(p.note_produits) || 0;
            return note >= noteMin;
        });
    }

    // Mettre à jour le badge compteur
    updateCompteurFiltres();

    // Afficher les produits filtrés
    afficheproduits(produitsFiltres);

    fermerDrawerFiltres();
}

/* ========================
   BADGE COMPTEUR FILTRES
   ======================== */
function updateCompteurFiltres() {
    const { categorie, prixMin, prixMax, notes } = getFiltres();
    let count = 0;

    if (categorie) count++;
    if (prixMin > 0) count++;
    if (prixMax < Infinity) count++;
    count += notes.length;

    const badge = document.getElementById('filtres-compteur');
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

/* ========================
   RESET FILTRES
   ======================== */
function resetFiltres() {
    document.querySelectorAll('#drawerFiltres input').forEach(i => {
        if (i.type === 'checkbox' || i.type === 'radio') i.checked = false;
        else i.value = '';
    });

    document.getElementById('filtres-compteur').style.display = 'none';

    // Réafficher tous les produits
    afficheproduits(tousLesProduits);

    fermerDrawerFiltres();
}

/* ========================
   DRAWER OPEN / CLOSE
   ======================== */
function ouvrirDrawerFiltres() {
    document.getElementById('drawerFiltres').classList.add('open');
    document.getElementById('overlayFiltres').classList.add('open');
}

function fermerDrawerFiltres() {
    document.getElementById('drawerFiltres').classList.remove('open');
    document.getElementById('overlayFiltres').classList.remove('open');
}