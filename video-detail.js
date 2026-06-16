// video-detail.js - Page détaillée d'une vidéo

const database = firebase.database();
const videosRef = database.ref('videos');

let videoId = null;
let currentUser = null;

function loadVideo() {
    const params = new URLSearchParams(window.location.search);
    videoId = params.get('id');
    if (!videoId) { window.location.href = 'index.html'; return; }

    const videoRef = videosRef.child(videoId);
    videoRef.on('value', (snapshot) => {
        const video = snapshot.val();
        if (!video) { window.location.href = 'index.html'; return; }

        document.getElementById('video-title-display').textContent = video.title || 'Sans titre';
        document.getElementById('video-author').innerHTML = `Par <strong>${escapeHTML(video.author || 'Anonyme')}</strong>`;
        document.getElementById('video-description-display').textContent = video.description || '';
        document.getElementById('like-count').textContent = video.likes || 0;

        // Extraire l'ID YouTube
        let youtubeId = video.url;
        if (youtubeId.includes('watch?v=')) {
            youtubeId = youtubeId.split('watch?v=')[1];
            if (youtubeId.includes('&')) youtubeId = youtubeId.split('&')[0];
        } else if (youtubeId.includes('youtu.be/')) {
            youtubeId = youtubeId.split('youtu.be/')[1];
            if (youtubeId.includes('?')) youtubeId = youtubeId.split('?')[0];
        }
        document.getElementById('video-iframe').src = `https://www.youtube.com/embed/${youtubeId}`;
    });

    // Charger les commentaires
    videoRef.child('comments').on('child_added', (snapshot) => {
        const comment = snapshot.val();
        const container = document.getElementById('video-comments-list');
        const div = document.createElement('div');
        div.className = 'video-comment';
        div.innerHTML = `
            <div class="name">${escapeHTML(comment.name || 'Anonyme')}</div>
            <div class="text">${escapeHTML(comment.text)}</div>
            <div class="time">${new Date(comment.timestamp).toLocaleString()}</div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    });
}

// LIKE
document.getElementById('like-btn').addEventListener('click', function() {
    const user = firebase.auth().currentUser;
    if (!user) { alert('Connecte-toi pour liker !'); return; }
    if (!videoId) return;

    const videoRef = videosRef.child(videoId);
    videoRef.child('likes').transaction((currentLikes) => {
        return (currentLikes || 0) + 1;
    });
});

// COMMENTAIRE VIDÉO
document.getElementById('video-comment-btn').addEventListener('click', function() {
    const user = firebase.auth().currentUser;
    if (!user) { alert('Connecte-toi pour commenter !'); return; }
    if (!videoId) return;

    const text = document.getElementById('video-comment-text').value.trim();
    if (!text) { alert('Écris un commentaire !'); return; }

    const videoRef = videosRef.child(videoId);
    videoRef.child('comments').push({
        name: user.displayName || 'Anonyme',
        text: text,
        timestamp: Date.now(),
        uid: user.uid
    });

    // Incrémenter le compteur de commentaires
    videoRef.child('commentCount').transaction((current) => {
        return (current || 0) + 1;
    });

    document.getElementById('video-comment-text').value = '';
});

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Vérifier l'utilisateur
firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
});

document.addEventListener('DOMContentLoaded', function() {
    loadVideo();

    // Entrée pour envoyer le commentaire
    document.getElementById('video-comment-text').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            document.getElementById('video-comment-btn').click();
        }
    });
});
