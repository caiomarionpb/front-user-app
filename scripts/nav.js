
// Script responsável pela navegação e controle de exibição de links no menu principal.
// Mostra ou esconde links de login, registro, perfil e adiciona botão de logout conforme autenticação.

const token = localStorage.getItem('token'); // Token de autenticação do usuário
const loginLink = document.querySelector('a[href="login.html"]');
const registerLink = document.querySelector('a[href="register.html"]');
const profileLink = document.querySelector('a[href="profile.html"]');


/**
 * Adiciona o botão de logout ao menu de navegação se o usuário estiver autenticado.
 * Remove o token do localStorage ao clicar e redireciona para login.
 */
function addLogoutButton() {
  const nav = document.querySelector('.main-nav ul');
  if (!nav || document.getElementById('logout-btn')) return;
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.textContent = 'Sair';
  btn.id = 'logout-btn';
  btn.className = 'btn btn-logout';
  btn.style.background = '#4f46e5';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.padding = '8px 16px';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  btn.onclick = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  };
  li.appendChild(btn);
  nav.appendChild(li);
}


// Exibe ou esconde links do menu conforme autenticação
if (token) {
  if (loginLink) loginLink.style.display = 'none';
  if (registerLink) registerLink.style.display = 'none';
  addLogoutButton();
} else {
  if (profileLink) profileLink.style.display = 'none';
}


// Destaca o link ativo no menu de navegação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname.split('/').pop();

  links.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

