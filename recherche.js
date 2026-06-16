// recherche.js - Recherche YouTube (simplifiée)

let currentFilter = 'all';

function setFilter(platform) {
    currentFilter = platform;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.platform === platform);
    });
    const query = document.getElementById('search-input').value.trim();
    if (query) searchAll();
}

async function searchAll() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) { alert('🔎 Entre un mot-clé !'); return; }

    const container = document.getElementById('results-container');
    container.innerHTML = '<p style="text-align:center;color:#888;">⏳ Recherche en cours...</p>';

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&key=AIzaSyD9J4y7a5pLvR8k5j6h9l8o2p3q4r5s6t7u8v9w0&type=video`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            container.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                    <h3 style="color:#e94560;">📋 ${data.items.length} résultats</h3>
                    <span style="color:#666;font-size:0.8em;">pour "${query}"</span>
                </div>
                <div class="results-grid">
                    ${data.items.map(item => `
                        <div class="result-card platform-youtube">
                            <div class="result-thumbnail" style="background-image:url('${item.snippet.thumbnails.medium.url}')">
                                <span class="platform-badge">▶️</span>
                            </div>
                            <div class="result-info">
                                <h4><a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">${escapeHTML(item.snippet.title)}</a></h4>
                                <p>${escapeHTML(item.snippet.description.substring(0, 150))}${item.snippet.description.length > 150 ? '...' : ''}</p>
                                <small>👤 ${escapeHTML(item.snippet.channelTitle)}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            container.innerHTML = `<div style="text-align:center;padding:40px 0;color:#555;"><p>😕 Aucun résultat trouvé pour "${query}"</p></div>`;
        }
    } catch (error) {
        container.innerHTML = `<div style="text-align:center;padding:40px 0;color:#e94560;"><p>❌ Erreur de recherche. Vérifie ta connexion.</p></div>`;
    }
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

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
        document.getElementById('search-input').value = query;
        searchAll();
    }
});
