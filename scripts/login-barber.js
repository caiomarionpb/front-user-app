document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const alertBox = document.getElementById('alert');

  try {
    const res = await fetch('http://localhost:3000/api/auth/barber/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      alertBox.textContent = data.error || 'Erro no login';
      return;
    }
    localStorage.setItem('barber-token', data.token);
    window.location.href = 'schedule.html';
  } catch (error) {
    alertBox.textContent = 'Erro de conexão';
  }
});
