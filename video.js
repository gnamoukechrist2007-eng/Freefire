// video.js - Gestion du fil d'actualité et des vidéos

const database = firebase.database();
const videosRef = database.ref('videos');

function loadVideos() {
    const container = document.getElementById('videos-feed');
    if (!container) return;
    
    container.innerHTML = '<p style="color:#555;text-align:center;padding:20px 0;">⏳ Chargement...</p>';

    videosRef.orderByChild('timestamp').limitToLast(50).on('child_added', (snapshot) => {
        const video = snapshot.val();
        const videoId = snapshot.key;
        
        // Extraire l'ID YouTube
        let youtubeId = video.url;
        if (youtubeId.includes('watch?v=')) {
            youtubeId = youtubeId.split('watch?v=')[1];
            if (youtubeId.includes('&')) youtubeId = youtubeId.split('&')[0];
        } else if (youtubeId.includes('youtu.be/')) {
            youtubeId = youtubeId.split('youtu.be/')[1];
            if (youtubeId.includes('?')) youtubeId = youtubeId.split('?')[0];
        }

        const card = document.createElement('div');
        card.className = 'video-card';
        card.onclick = () => window.location.href = `video.html?id=${videoId}`;
        
        card.innerHTML = `
            <div class="thumbnail" style="background-image:url('https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg');"></div>
            <h3>${escapeHTML(video.title || 'Sans titre')}</h3>
            <p>${escapeHTML(video.description || '').substring(0, 150)}${video.description && video.description.length > 150 ? '...' : ''}</p>
            <div class="meta">
                <span>👤 ${escapeHTML(video.author || 'Anonyme')}</span>
                <span>❤️ ${video.likes || 0}</span>
                <span>💬 ${video.commentCount || 0}</span>
                <span>📅 ${new Date(video.timestamp).toLocaleDateString()}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Charger les vidéos au chargement
document.addEventListener('DOMContentLoaded', function() {
    loadVideos();
});
