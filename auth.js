// auth.js - Connexion Google (version stable)

// Configuration Firebase (Tes clés)
const firebaseConfig = {
    apiKey: "AIzaSyAF8P7z2feBCVKU9y6TJP1KgsCu_X2jLVE",
    authDomain: "gnamouke.firebaseapp.com",
    projectId: "gnamouke",
    storageBucket: "gnamouke.firebasestorage.app",
    messagingSenderId: "86690747848",
    appId: "1:86690747848:web:fa02381b3f18034c985cfd",
    measurementId: "G-5KW9D1GTB1"
};

// Initialisation UNIQUE
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log("✅ Connecté :", result.user.displayName);
            updateUI(result.user);
            updateDrawer(result.user);
            closeDrawer();
            // Recharger la page pour afficher le profil
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error("❌ Erreur de connexion :", error);
            alert("Erreur de connexion : " + error.message);
        });
}

function signOut() {
    firebase.auth().signOut()
        .then(() => {
            console.log("✅ Déconnecté");
            updateUI(null);
            updateDrawer(null);
            closeDrawer();
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("❌ Erreur de déconnexion :", error);
            alert("Erreur : " + error.message);
        });
}

function updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const commentForm = document.getElementById('comment-form');
    const loginMsg = document.getElementById('login-message');

    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (commentForm) commentForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (commentForm) commentForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

function updateDrawer(user) {
    const nameEl = document.getElementById('drawer-name');
    const emailEl = document.getElementById('drawer-email');
    const avatarEl = document.getElementById('drawer-avatar-img');

    if (nameEl && emailEl && avatarEl) {
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
}

// Surveillance de l'état de connexion
firebase.auth().onAuthStateChanged((user) => {
    updateUI(user);
    updateDrawer(user);
});
