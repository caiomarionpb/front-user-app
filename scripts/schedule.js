document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('barber-token');
  if (!token) {
    window.location.href = 'login-barber.html';
    return;
  }

  const scheduleContainer = document.getElementById('schedule-container');

  try {
    const res = await fetch('http://localhost:3000/api/bookings/barber/today', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const bookings = await res.json();
    if (!res.ok) {
      scheduleContainer.innerHTML = `<p class="alert">${bookings.error || 'Erro ao buscar agendamentos'}</p>`;
      return;
    }
    if (bookings.length === 0) {
      scheduleContainer.innerHTML = '<p>Nenhum agendamento para hoje.</p>';
      return;
    }
    const bookingsList = bookings.map(b => `
      <div class="booking-card">
        <p><strong>Horário:</strong> ${b.time}</p>
        <p><strong>Serviço:</strong> ${b.service}</p>
        <p><strong>Cliente:</strong> ${b.user_name}</p>
      </div>
    `).join('');
    scheduleContainer.innerHTML = bookingsList;
  } catch (error) {
    scheduleContainer.innerHTML = '<p class="alert">Erro de conexão.</p>';
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('barber-token');
  window.location.href = 'login-barber.html';
});
