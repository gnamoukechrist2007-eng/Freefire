// publier.js - Publier une vidéo

const database = firebase.database();
const videosRef = database.ref('videos');

document.getElementById('publish-btn').addEventListener('click', function() {
    const user = firebase.auth().currentUser;
    if (!user) {
        document.getElementById('publish-status').innerHTML = '<span style="color:#e94560;">❌ Connecte-toi d\'abord !</span>';
        return;
    }

    const url = document.getElementById('video-url').value.trim();
    const title = document.getElementById('video-title').value.trim();
    const description = document.getElementById('video-description').value.trim();

    if (!url) {
        document.getElementById('publish-status').innerHTML = '<span style="color:#e94560;">❌ Ajoute un lien YouTube !</span>';
        return;
    }

    if (!title) {
        document.getElementById('publish-status').innerHTML = '<span style="color:#e94560;">❌ Ajoute un titre !</span>';
        return;
    }

    // Vérifier que c'est un lien YouTube
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        document.getElementById('publish-status').innerHTML = '<span style="color:#e94560;">❌ Seuls les liens YouTube sont acceptés !</span>';
        return;
    }

    document.getElementById('publish-status').innerHTML = '<span style="color:#27ae60;">⏳ Publication en cours...</span>';
    this.disabled = true;

    videosRef.push({
        url: url,
        title: title,
        description: description,
        author: user.displayName || 'Anonyme',
        authorId: user.uid,
        timestamp: Date.now(),
        likes: 0,
        commentCount: 0
    }).then(() => {
        document.getElementById('publish-status').innerHTML = '<span style="color:#27ae60;">✅ Vidéo publiée avec succès !</span>';
        document.getElementById('video-url').value = '';
        document.getElementById('video-title').value = '';
        document.getElementById('video-description').value = '';
        this.disabled = false;
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    }).catch((error) => {
        document.getElementById('publish-status').innerHTML = `<span style="color:#e94560;">❌ Erreur : ${error.message}</span>`;
        this.disabled = false;
    });
});
