const token = localStorage.getItem('token');
const loginLink = document.getElementById('loginLink');

if (token && loginLink) {
  loginLink.style.display = 'none';
}
