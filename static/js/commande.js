// =====================
//  MODALE COMMANDE
// =====================
function ouvrirModal() {
    // fetch('/authentification/verifier')
    //     .then(res => res.json())
    //     .then(data => {
    //         if (data.connected) {
    //             console.log("auth check:", data)

    //             const user = data.user;
    //             document.getElementById("cmd-nom").value     = user.nom   || '';
    //             document.getElementById("cmd-tel").value     = user.tel   || '';
    //         } else {
    //             window.location.href = '/auth';
    //         }
    //     })
    //     .catch(err => console.error("Erreur check auth:", err));

     document.getElementById("modalCommande").classList.add("open");
      document.getElementById("modalOverlay").classList.add("open");
      document.body.style.overflow = "hidden";
                allerStep1();
    
}
function afficherVille() {
    const adresse = document.getElementById('cmd-adresse').value;
    const divVille = document.getElementById('div-ville');
    
    if (adresse === 'Autres') {
        divVille.style.display = 'block';
    } else {
        divVille.style.display = 'none';
        document.getElementById('cmd-ville').value = '';
    }
}

function fermerModal() {
    document.getElementById("modalCommande").classList.remove("open");
    document.getElementById("modalOverlay").classList.remove("open");
    document.body.style.overflow = "";
}

function allerStep1() {
    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "none";
}

function getFraisLivraison() {
    const select = document.getElementById("cmd-adresse");
    const option = select.options[select.selectedIndex];
    return parseInt(option.getAttribute("data-frais") || "0");
}

function allerStep2() {
    const nom      = document.getElementById("cmd-nom").value.trim();
    const tel      = document.getElementById("cmd-tel").value.trim();
    const adresse  = document.getElementById("cmd-adresse").value.trim();
    const quartier = document.getElementById("cmd-quartier").value.trim();
    const notes    = document.getElementById("cmd-notes").value.trim();
    const frais    = getFraisLivraison();

    if (!nom || !tel || !adresse) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }
    if (!quartier) {
        alert("Veuillez indiquer votre quartier.");
        return;
    }
    if (adresse === "autre" && !document.getElementById("cmd-ville").value.trim()) {
        alert("Veuillez préciser votre ville.");
        return;
    }
    if (!tel || tel.replace(/\s/g, "").length < 10) {
        alert("Veuillez entrer un numéro valide à 10 chiffres.");
        return;
    }

    const panier = getPanier();
    const recap  = document.getElementById("recapBody");
    const total  = totalPanier();

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

    const adresseAffichee = adresse === "autre"
        ? `${document.getElementById("cmd-ville").value.trim()}, ${quartier}`
        : `${escapeHtml(adresse)}, ${escapeHtml(quartier)}`;

    recap.innerHTML = `
        ${itemsHtml}
        <hr>
        <div class="d-flex justify-content-between mt-2" style="font-size:13px;">
            <span>Sous-total</span>
            <span>FCFA ${total.toLocaleString("fr-FR")}</span>
        </div>
        <div class="d-flex justify-content-between mt-1" style="font-size:13px;">
            <span>Frais de livraison</span>
            <span>${frais > 0 ? "FCFA " + frais.toLocaleString("fr-FR") : '<span class="text-muted">À définir</span>'}</span>
        </div>
        <div class="d-flex justify-content-between mt-2 fw-500">
            <span>Total</span>
            <span>FCFA ${(total + frais).toLocaleString("fr-FR")}</span>
        </div>
        <div style="background:#f8f8f8;border-radius:12px;padding:12px;margin-top:12px;font-size:13px;">
            <div><i class="bi bi-person me-2"></i>${escapeHtml(nom)}</div>
            <div class="mt-1"><i class="bi bi-telephone me-2"></i>${escapeHtml(tel)}</div>
            <div class="mt-1"><i class="bi bi-geo-alt me-2"></i>${adresseAffichee}</div>
            ${notes ? `<div class="mt-1"><i class="bi bi-chat-left-text me-2"></i>${escapeHtml(notes)}</div>` : ""}
        </div>
    `;

    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function confirmerCommande() {
    const nom      = document.getElementById("cmd-nom").value.trim();
    const tel      = document.getElementById("cmd-tel").value.trim();
    const adresse  = document.getElementById("cmd-adresse").value.trim();
    const ville    = document.getElementById("cmd-ville").value.trim();
    const quartier = document.getElementById("cmd-quartier").value.trim();
    const notes    = document.getElementById("cmd-notes").value.trim();
    const frais    = getFraisLivraison();
    const total    = totalPanier();

    const payload = {
        client: { nom, tel, adresse, ville, quartier, notes },
        panier: getPanier().map(p => ({
            id_produit: p.id,
            nom:        p.nom,
            prix:       p.prix,
            quantite:   p.quantite
        })),
        frais_livraison: frais,
        total: total + frais
    };

    const btn = document.querySelector("#step2 .btn-primary-custom");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Envoi...`;

    fetch("/commande/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        console.log("status:", res.status);
        return res.text();
    })
    .then(text => {
        console.log("réponse brute:", text);
        const response = JSON.parse(text);
        if (response.success) {
            document.getElementById("recap-tel-confirm").textContent = tel;
            document.getElementById("step2").style.display = "none";
            document.getElementById("step3").style.display = "block";
            localStorage.removeItem("panier");
            updateCompteurPanier();
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

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.addEventListener("click", fermerModal);

    const inputTel = document.getElementById("cmd-tel");
    if (inputTel) {
        inputTel.addEventListener("input", () => {
            inputTel.value = inputTel.value.replace(/[^0-9\s]/g, "").slice(0, 10);
        });
        inputTel.addEventListener("keydown", (e) => {
            const allowed = ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"];
            if (allowed.includes(e.key)) return;
            if (!/^[0-9]$/.test(e.key)) e.preventDefault();
        });
    }
});