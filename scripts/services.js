// Script responsável pela lógica de agendamento de serviços no front-end do usuário.
// Permite selecionar serviço, data, horário e realizar o agendamento, exibindo mensagens de sucesso ou erro.

// Elementos principais da interface
const miniCalendar = document.getElementById('mini-calendar'); // Calendário reduzido para seleção de datas
const monthYear = document.getElementById('month-year'); // Exibe mês e ano atuais
const btnBook = document.getElementById('btn-book'); // Botão para confirmar agendamento
const timesContainer = document.getElementById('times-container'); // Container dos horários disponíveis
const alertBox = document.getElementById('alert'); // Exibe mensagens de alerta
const servicesContainer = document.getElementById('services-container'); // Container dos serviços disponíveis
const barbersContainer = document.getElementById('barbers-container'); // Container dos barbeiros disponíveis


// Variáveis de estado para seleção do usuário
let selectedDate = null;      // Data selecionada
let selectedTime = null;      // Horário selecionado
let selectedService = null;   // Serviço selecionado
let selectedPrice = null;     // Preço do serviço selecionado
let selectedBarber = null;    // Barbeiro selecionado


// Dias da semana para exibição no calendário
const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


// === Serviços ===
// Adiciona evento de clique para cada botão de serviço, permitindo selecionar o serviço e o preço
servicesContainer.querySelectorAll('.service-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedService = btn.dataset.service;
    selectedPrice = btn.dataset.price;
    servicesContainer.querySelectorAll('.service-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    checkEnableButton();
  });
});


// === Barbeiros ===
/**
 * Busca os barbeiros na API e os exibe na interface.
 * Permite selecionar um barbeiro para o agendamento.
 */
async function generateBarbers() {
  try {
    const res = await fetch('http://localhost:3000/api/barbers');
    const barbers = await res.json();
    barbersContainer.innerHTML = '';
    barbers.forEach(barber => {
      const btn = document.createElement('div');
      btn.className = 'barber-btn btn';
      btn.dataset.barberId = barber.id;
      btn.style.background = '#181818';
      btn.style.textAlign = 'center';
      btn.innerHTML = `
        <img src="${barber.photoUrl}" alt="${barber.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
        <span class="barber-name" style="display:block; font-size:1.1rem;">${barber.name}</span>
        <span class="barber-description" style="color:#a5b4fc;">${barber.description}</span>
      `;
      btn.addEventListener('click', () => {
        selectedBarber = barber.id;
        barbersContainer.querySelectorAll('.barber-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        checkEnableButton();
      });
      barbersContainer.appendChild(btn);
    });
  } catch (error) {
    console.error('Erro ao buscar barbeiros:', error);
  }
}


// === Calendário ===
/**
 * Gera o mini calendário exibindo os próximos 28 dias a partir de hoje.
 * Permite selecionar uma data para o agendamento.
 */
function generateMiniCalendar() {
  miniCalendar.innerHTML = '';
  const today = new Date();
  // Gira o array de dias da semana para começar pelo dia de hoje
  const startIdx = today.getDay();
  const rotatedWeekdays = weekdays.slice(startIdx).concat(weekdays.slice(0, startIdx));
  rotatedWeekdays.forEach(day => {
    const el = document.createElement('div');
    el.textContent = day;
    el.className = 'day-of-week';
    miniCalendar.appendChild(el);
  });

  monthYear.textContent = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const totalDays = 28;

  // Cria os botões de dias do calendário
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
/**
 * Gera os botões de horários disponíveis para agendamento (das 8h às 19h).
 * Permite selecionar um horário.
 */
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
/**
 * Habilita ou desabilita o botão de agendar conforme seleção de data, horário e serviço.
 */
function checkEnableButton() {
  btnBook.disabled = !(selectedDate && selectedTime && selectedService && selectedBarber);
}


// === Agendar ===
/**
 * Evento de clique no botão de agendar.
 * Realiza a requisição para a API para criar um novo agendamento com os dados selecionados.
 * Exibe mensagens de sucesso ou erro conforme o resultado.
 */
btnBook.addEventListener('click', async () => {
  if (!selectedDate || !selectedTime || !selectedService || !selectedBarber) return;
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
        price: selectedPrice,
        barberId: selectedBarber
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
// Inicializa o calendário e os horários ao carregar a página
generateMiniCalendar();
generateTimes();
generateBarbers();