// drawer.js - Gestion du menu latéral

function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('show');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
}

function closeDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDrawer();
});
