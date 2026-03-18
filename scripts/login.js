// js/login.js
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro no login');
      return;
    }

    localStorage.setItem('token', data.token);
    alert('Login realizado com sucesso!');
    window.location.href = 'profile.html';
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
});