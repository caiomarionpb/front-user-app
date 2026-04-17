// Futuro para interatividade
document.addEventListener('DOMContentLoaded', () => {
    const servicosBtn = document.querySelector('a[href="services.html"]');
    if (servicosBtn) {
        servicosBtn.addEventListener('click', function(e) {
            const token = localStorage.getItem('token');
            if (!token) {
                e.preventDefault();
                window.location.href = 'login.html';
            }
        });
    }
    console.log('Landing page loaded');
});
