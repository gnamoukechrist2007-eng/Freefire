// script.js - Gestion des commentaires en direct

// CONFIGURATION FIREBASE (TES clés)
const firebaseConfig = {
  apiKey: "AIzaSyAF8P7z2feBCVKU9y6TJP1KgsCu_X2jLVE",
  authDomain: "gnamouke.firebaseapp.com",
  projectId: "gnamouke",
  storageBucket: "gnamouke.firebasestorage.app",
  messagingSenderId: "86690747848",
  appId: "1:86690747848:web:fa02381b3f18034c985cfd",
  measurementId: "G-5KW9D1GTB1"
};

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const commentsRef = database.ref('comments');

// AFFICHER LES COMMENTAIRES
function loadComments() {
    commentsRef.on('child_added', (snapshot) => {
        const comment = snapshot.val();
        const container = document.getElementById('comments-list');
        
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `
            <div class="comment-name">${escapeHTML(comment.name)}</div>
            <p class="comment-text">${escapeHTML(comment.text)}</p>
            <small>${new Date(comment.timestamp).toLocaleString()}</small>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    });
}

// ENVOYER UN COMMENTAIRE (connecté)
function submitComment() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Connecte-toi d'abord !");
        return;
    }

    const text = document.getElementById('comment-text').value.trim();
    if (text === "") {
        alert("Écris un message !");
        return;
    }

    commentsRef.push({
        name: user.displayName || "Anonyme",
        text: text.substring(0, 500),
        timestamp: Date.now(),
        uid: user.uid
    });

    document.getElementById('comment-text').value = '';
}

// PROTECTION XSS
function escapeHTML(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// BRANCHER LE BOUTON AU CHARGEMENT
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit-comment').addEventListener('click', submitComment);
    loadComments();

    // ENVOYER AVEC ENTRÉE (Ctrl+Entrée)
    document.getElementById('comment-text').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitComment();
        }
    });
});
