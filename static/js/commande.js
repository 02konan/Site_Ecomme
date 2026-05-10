// =====================
//  MODALE COMMANDE
// =====================

function ouvrirModal() {
    document.getElementById("modalCommande").classList.add("open");
    document.getElementById("modalOverlay").classList.add("open");
    allerStep1();
}

function fermerModal() {
    document.getElementById("modalCommande").classList.remove("open");
    document.getElementById("modalOverlay").classList.remove("open");
}

function allerStep1() {
    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "none";
}

function allerStep2() {
    // Validation
    const nom     = document.getElementById("cmd-nom").value.trim();
    const tel     = document.getElementById("cmd-tel").value.trim();
    const adresse = document.getElementById("cmd-adresse").value.trim();
    const ville   = document.getElementById("cmd-ville").value.trim();

    if (!nom || !tel || !adresse || !ville) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // Affiche le récapitulatif
    const panier = getPanier();
    const recap  = document.getElementById("recapBody");

    const itemsHtml = panier.map(p => `
        <div class="recap-item">
            <img src="${p.img}" onerror="this.src='/static/img/default_1.png'">
            <div class="flex-grow-1">
                <div class="small fw-500">${escapeHtml(p.nom)}</div>
                <div class="text-muted" style="font-size:12px;">
                    ${p.quantite} × FCFA ${parseFloat(p.prix).toLocaleString("fr-FR")}
                </div>
            </div>
            <div class="small fw-500">
                FCFA ${(p.quantite * parseFloat(p.prix)).toLocaleString("fr-FR")}
            </div>
        </div>
    `).join("");

    recap.innerHTML = `
        ${itemsHtml}
        <div class="d-flex justify-content-between mt-3 fw-500">
            <span>Total</span>
            <span>FCFA ${totalPanier().toLocaleString("fr-FR")}</span>
        </div>
        <div style="background:#f8f8f8;border-radius:12px;padding:12px;margin-top:12px;font-size:13px;">
            <div><i class="bi bi-person me-2"></i>${escapeHtml(nom)}</div>
            <div class="mt-1"><i class="bi bi-telephone me-2"></i>${escapeHtml(tel)}</div>
            <div class="mt-1"><i class="bi bi-geo-alt me-2"></i>${escapeHtml(adresse)}, ${escapeHtml(ville)}</div>
        </div>
    `;

    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function confirmerCommande() {
    const nom     = document.getElementById("cmd-nom").value.trim();
    const tel     = document.getElementById("cmd-tel").value.trim();
    const adresse = document.getElementById("cmd-adresse").value.trim();
    const ville   = document.getElementById("cmd-ville").value.trim();

    const payload = {
        client: { nom, tel, adresse, ville },
        panier: getPanier().map(p => ({
            id_produit: p.id,
            nom:        p.nom,
            prix:       p.prix,
            quantite:   p.quantite
        })),
        total: totalPanier()
    };

    // Désactive le bouton pendant l'envoi
    const btn = document.querySelector("#step2 .btn-primary-custom");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Envoi...`;

    fetch("/commande/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(response => {
        if (response.success) {
            // Succès
            document.getElementById("recap-tel-confirm").textContent = tel;
            document.getElementById("step2").style.display = "none";
            document.getElementById("step3").style.display = "block";
            viderPanier(); // vide le localStorage
        } else {
            alert("Erreur : " + (response.error || "Réessayez."));
            btn.disabled = false;
            btn.innerHTML = `<i class="bi bi-check-circle me-2"></i>Confirmer la commande`;
        }
    })
    .catch(err => {
        console.error("Erreur commande:", err);
        alert("Une erreur est survenue. Réessayez.");
        btn.disabled = false;
        btn.innerHTML = `<i class="bi bi-check-circle me-2"></i>Confirmer la commande`;
    });
}

// Ferme la modale en cliquant sur l'overlay
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.addEventListener("click", fermerModal);
});