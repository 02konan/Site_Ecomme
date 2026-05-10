
function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach((b, i) => {
        b.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'register' && i === 1));
    });
    document.getElementById('panel-login').classList.toggle('active', tab === 'login');
    document.getElementById('panel-register').classList.toggle('active', tab === 'register');
}

function togglePwd(id, btn) {
    const input = document.getElementById(id);
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.querySelector('i').className = isText ? 'bi bi-eye' : 'bi bi-eye-slash';
}

function connexion() {
    const email = document.getElementById('login-email').value.trim();
    const pwd   = document.getElementById('login-pwd').value.trim();

    if (!email || !pwd) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const btn = document.querySelector('#panel-login .btn-submit');
    btn.disabled = true;
    btn.textContent = "Connexion...";

    fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/';
        } else {
            alert(data.error || "Email ou mot de passe incorrect.");
            btn.disabled = false;
            btn.textContent = "Se connecter";
        }
    })
    .catch(err => {
        console.error("Erreur connexion:", err);
        btn.disabled = false;
        btn.textContent = "Se connecter";
    });
}

function inscription() {
    const nom     = document.getElementById('reg-nom').value.trim();
    const email   = document.getElementById('reg-email').value.trim();
    const tel     = document.getElementById('reg-tel').value.trim();
    const pwd     = document.getElementById('pwd-register').value.trim();
    const confirm = document.getElementById('pwd-confirm').value.trim();

    if (!nom || !email || !tel || !pwd || !confirm) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    if (pwd !== confirm) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    const btn = document.querySelector('#panel-register .btn-submit');
    btn.disabled = true;
    btn.textContent = "Création...";

    fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, tel, password: pwd })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/authentification';
        } else {
            alert(data.error || "Une erreur est survenue.");
            btn.disabled = false;
            btn.textContent = "Créer mon compte";
        }
    })
    .catch(err => {
        console.error("Erreur inscription:", err);
        btn.disabled = false;
        btn.textContent = "Créer mon compte";
    });
}