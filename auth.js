// auth.js - Connexion Google

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => { updateUI(result.user); updateDrawer(result.user); closeDrawer(); })
        .catch(error => alert("Erreur : " + error.message));
}

function signOut() {
    firebase.auth().signOut()
        .then(() => { updateUI(null); updateDrawer(null); closeDrawer(); window.location.href = 'index.html'; })
        .catch(error => alert("Erreur : " + error.message));
}

function updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
}

function updateDrawer(user) {
    const nameEl = document.getElementById('drawer-name');
    const emailEl = document.getElementById('drawer-email');
    const avatarEl = document.getElementById('drawer-avatar-img');
    if (user) {
        nameEl.textContent = user.displayName || 'Utilisateur';
        emailEl.textContent = user.email || '';
        avatarEl.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=80&background=e94560&color=fff`;
    } else {
        nameEl.textContent = 'Non connecté';
        emailEl.textContent = '';
        avatarEl.src = 'https://ui-avatars.com/api/?name=User&size=80&background=e94560&color=fff';
    }
}

firebase.auth().onAuthStateChanged(user => { updateUI(user); updateDrawer(user); });
