
// Script responsável pelo login do usuário.
// Captura o formulário, envia os dados para a API e armazena o token em caso de sucesso.

const loginForm = document.getElementById('login-form'); // Formulário de login


// Evento de envio do formulário de login.
// Envia email e senha para a API, armazena o token e redireciona em caso de sucesso.
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

    // Salva o token no localStorage e redireciona para a página de serviços
    localStorage.setItem('token', data.token);
    alert('Login realizado com sucesso!');
    window.location.href = 'services.html';
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
});