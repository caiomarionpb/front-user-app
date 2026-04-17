const miniCalendar = document.getElementById('mini-calendar');
const monthYear = document.getElementById('month-year');
const btnBook = document.getElementById('btn-book');
const timesContainer = document.getElementById('times-container');
const alertBox = document.getElementById('alert');
const servicesContainer = document.getElementById('services-container');

let selectedDate = null;
let selectedTime = null;
let selectedService = null;
let selectedPrice = null;

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// === Serviços ===
servicesContainer.querySelectorAll('.service-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedService = btn.dataset.service;
    selectedPrice = btn.dataset.price;
    servicesContainer.querySelectorAll('.service-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    checkEnableButton();
  });
});

// === Calendário ===
function generateMiniCalendar() {
  miniCalendar.innerHTML = '';
  weekdays.forEach(day => {
    const el = document.createElement('div');
    el.textContent = day;
    el.className = 'day-of-week';
    miniCalendar.appendChild(el);
  });

  const today = new Date();
  monthYear.textContent = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const totalDays = 28;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const btn = document.createElement('div');
    btn.className = 'calendar-day';
    btn.textContent = date.getDate();
    btn.dataset.date = date.toISOString().split('T')[0];

    const todayStr = new Date().toISOString().split('T')[0];
    if (btn.dataset.date === todayStr) btn.classList.add('today');

    btn.addEventListener('click', () => {
      selectedDate = btn.dataset.date;
      document.querySelectorAll('.calendar-day').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      checkEnableButton();
    });

    miniCalendar.appendChild(btn);
  }
}

// === Horários ===
function generateTimes() {
  timesContainer.innerHTML = '';
  for (let h = 8; h <= 19; h++) {
    const timeStr = h.toString().padStart(2,'0') + ':00';
    const btn = document.createElement('button');
    btn.className = 'time-btn';
    btn.textContent = timeStr;
    btn.dataset.time = timeStr;

    btn.addEventListener('click', () => {
      selectedTime = btn.dataset.time;
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      checkEnableButton();
    });

    timesContainer.appendChild(btn);
  }
}

// === Botão habilitado ===
function checkEnableButton() {
  btnBook.disabled = !(selectedDate && selectedTime && selectedService);
}

// === Agendar ===
btnBook.addEventListener('click', async () => {
  if (!selectedDate || !selectedTime || !selectedService) return;
  const token = localStorage.getItem('token');
  if (!token) {
    alertBox.style.color = 'red';
    alertBox.textContent = 'Faça login para agendar!';
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        price: selectedPrice
      })
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Erro ao agendar:', data);
      alertBox.style.color = 'red';
      alertBox.textContent = data.error || 'Não foi possível agendar';
      return;
    }
    alertBox.style.color = 'green';
    alertBox.textContent = `Agendamento confirmado: ${selectedService} em ${selectedDate} às ${selectedTime} por R$${selectedPrice}!`;
  } catch(err) {
    alertBox.style.color = 'red';
    alertBox.textContent = err.message || 'Erro inesperado ao agendar';
    console.error('Erro inesperado ao agendar:', err);
  }
});

// === Inicializa ===
generateMiniCalendar();
generateTimes();