const token = localStorage.getItem('token');
const loginLink = document.querySelector('a[href="login.html"]');
const registerLink = document.querySelector('a[href="register.html"]');
const profileLink = document.querySelector('a[href="profile.html"]');

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

if (token) {
  if (loginLink) loginLink.style.display = 'none';
  if (registerLink) registerLink.style.display = 'none';
  addLogoutButton();
} else {
  if (profileLink) profileLink.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname.split('/').pop();

    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

