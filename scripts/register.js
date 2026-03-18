// js/register.js
const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const number = document.getElementById('number').value;
  const age = document.getElementById('age').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, number, age })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro no cadastro');
      return;
    }

    // Armazena token no localStorage
    localStorage.setItem('token', data.token);
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'profile.html'; // redireciona para profile
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
});