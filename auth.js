// auth.js - Gestion de l'authentification Google

// CONNEXION AVEC GOOGLE
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Bienvenue " + user.displayName);
            updateUI(user);
        })
        .catch((error) => {
            console.error("Erreur de connexion", error);
            alert("Erreur : " + error.message);
        });
}

// DÉCONNEXION
function signOut() {
    firebase.auth().signOut()
        .then(() => {
            console.log("Déconnecté");
            updateUI(null);
        })
        .catch((error) => {
            console.error("Erreur de déconnexion", error);
        });
}

// METTRE À JOUR L'INTERFACE
function updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const commentForm = document.getElementById('comment-form');
    const loginMsg = document.getElementById('login-message');

    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        userInfo.innerHTML = `
            <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName}" alt="Avatar" class="avatar">
            <span>${user.displayName}</span>
        `;
        commentForm.style.display = 'block';
        loginMsg.style.display = 'none';
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        userInfo.innerHTML = `<span>Non connecté</span>`;
        commentForm.style.display = 'none';
        loginMsg.style.display = 'block';
    }
}

// SURVEILLER L'ÉTAT DE CONNEXION
firebase.auth().onAuthStateChanged((user) => {
    updateUI(user);
});
