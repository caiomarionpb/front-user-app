
// Script da landing page para controle de acesso ao botão de serviços.
// Redireciona para login caso o usuário não esteja autenticado ao tentar acessar serviços.

document.addEventListener('DOMContentLoaded', () => {
    const servicosBtn = document.querySelector('a[href="services.html"]');
    if (servicosBtn) {
        // Impede acesso à página de serviços se não estiver logado
        servicosBtn.addEventListener('click', function(e) {
            const token = localStorage.getItem('token');
            if (!token) {
                e.preventDefault();
                window.location.href = 'login.html';
            }
        });
    }
    // Mensagem de debug ao carregar landing page
    console.log('Landing page loaded');
});
