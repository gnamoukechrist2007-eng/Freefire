// profil.js - Gestion du profil

const database = firebase.database();
const usersRef = database.ref('users');
const videosRef = database.ref('videos');

function loadProfil(user) {
    if (!user) { window.location.href = 'index.html'; return; }

    const userId = user.uid;
    usersRef.child(userId).on('value', (snapshot) => {
        const data = snapshot.val();
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=120&background=e94560&color=fff`;
        if (data) {
            document.getElementById('display-name').value = data.displayName || user.displayName || '';
            document.getElementById('bio').value = data.bio || '';
            document.getElementById('avatar').src = data.photoURL || defaultAvatar;
            document.getElementById('couverture').src = data.coverURL || 'https://via.placeholder.com/800x200/1a1a2e/e94560?text=Ma+Couverture';
        } else {
            document.getElementById('display-name').value = user.displayName || '';
            document.getElementById('avatar').src = defaultAvatar;
        }
    });

    // Charger les vidéos de l'utilisateur
    loadMyVideos(userId);
}

function loadMyVideos(userId) {
    const container = document.getElementById('my-videos-list');
    if (!container) return;

    videosRef.orderByChild('authorId').equalTo(userId).on('value', (snapshot) => {
        container.innerHTML = '';
        const videos = [];
        snapshot.forEach(child => {
            videos.push({ id: child.key, ...child.val() });
        });

        if (videos.length === 0) {
            container.innerHTML = '<p style="color:#555;">Aucune vidéo publiée.</p>';
            return;
        }

        videos.reverse().forEach(video => {
            let youtubeId = video.url;
            if (youtubeId.includes('watch?v=')) {
                youtubeId = youtubeId.split('watch?v=')[1];
                if (youtubeId.includes('&')) youtubeId = youtubeId.split('&')[0];
            } else if (youtubeId.includes('youtu.be/')) {
                youtubeId = youtubeId.split('youtu.be/')[1];
                if (youtubeId.includes('?')) youtubeId = youtubeId.split('?')[0];
            }

            const div = document.createElement('div');
            div.className = 'video-card';
            div.onclick = () => window.location.href = `video.html?id=${video.id}`;
            div.innerHTML = `
                <div class="thumbnail" style="background-image:url('https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg');"></div>
                <h3>${escapeHTML(video.title || 'Sans titre')}</h3>
                <div class="meta">
                    <span>❤️ ${video.likes || 0}</span>
                    <span>💬 ${video.commentCount || 0}</span>
                    <span>📅 ${new Date(video.timestamp).toLocaleDateString()}</span>
                </div>
            `;
            container.appendChild(div);
        });
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

document.getElementById('edit-profil')?.addEventListener('click', function() {
    document.getElementById('display-name').disabled = false;
    document.getElementById('bio').disabled = false;
    document.getElementById('save-profil').style.display = 'inline-block';
    this.style.display = 'none';
});

document.getElementById('save-profil')?.addEventListener('click', function() {
    const displayName = document.getElementById('display-name').value.trim();
    const bio = document.getElementById('bio').value.trim();
    if (!displayName) { alert('Le pseudo est obligatoire !'); return; }

    const user = firebase.auth().currentUser;
    if (!user) { alert('Connecte-toi !'); return; }

    usersRef.child(user.uid).update({
        displayName: displayName,
        bio: bio
    }).then(() => {
        alert('✅ Profil mis à jour !');
        document.getElementById('display-name').disabled = true;
        document.getElementById('bio').disabled = true;
        document.getElementById('save-profil').style.display = 'none';
        document.getElementById('edit-profil').style.display = 'inline-block';
    });
});

document.getElementById('edit-avatar')?.addEventListener('click', function() {
    const url = prompt('Colle le lien de ta photo (ImgBB, Imgur...) :');
    if (url && url.startsWith('http')) {
        const user = firebase.auth().currentUser;
        if (!user) return;
        document.getElementById('avatar').src = url;
        usersRef.child(user.uid).update({ photoURL: url });
        alert('✅ Avatar mis à jour !');
    } else if (url) {
        alert('Lien invalide.');
    }
});

document.getElementById('edit-couverture')?.addEventListener('click', function() {
    const url = prompt('Colle le lien de ta couverture :');
    if (url && url.startsWith('http')) {
        const user = firebase.auth().currentUser;
        if (!user) return;
        document.getElementById('couverture').src = url;
        usersRef.child(user.uid).update({ coverURL: url });
        alert('✅ Couverture mise à jour !');
    } else if (url) {
        alert('Lien invalide.');
    }
});

function updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        document.getElementById('edit-avatar').style.display = 'inline-block';
        document.getElementById('edit-couverture').style.display = 'inline-block';
        document.getElementById('edit-profil').style.display = 'inline-block';
        loadProfil(user);
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        document.getElementById('edit-avatar').style.display = 'none';
        document.getElementById('edit-couverture').style.display = 'none';
        document.getElementById('edit-profil').style.display = 'none';
    }
}

firebase.auth().onAuthStateChanged(user => updateUI(user));
