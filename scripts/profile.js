/**
 * Script responsável pela página de perfil do usuário.
 * Permite visualizar e editar dados do perfil e listar agendamentos futuros e históricos.
 */

// --- Agendamentos ---
/**
 * Carrega os agendamentos do usuário (futuros e históricos) e exibe na tela.
 * Permite confirmar ou cancelar agendamentos futuros.
 */
async function loadBookings() {
  alert('loadBookings chamada!');
  console.log('loadBookings chamada!');
  const futureList = document.getElementById('future-bookings-list');
  const historyList = document.getElementById('history-bookings-list');
  if (!futureList || !historyList) {
    alert('Elementos de lista não encontrados!');
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token não encontrado!');
    window.location.href = 'login.html';
    return;
  }
  futureList.innerHTML = '<p style="color:#aaa;">Carregando...</p>';
  historyList.innerHTML = '<p style="color:#aaa;">Carregando...</p>';
  try {
    const res = await fetch('http://localhost:3000/api/users/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Requisição feita para /api/users/bookings, status:', res.status);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao buscar agendamentos');
    // Futuros
    if (data.future && data.future.length > 0) {
      futureList.innerHTML = '';
      data.future.forEach(b => {
        const div = document.createElement('div');
        div.className = 'booking-card';
        div.innerHTML = `
          <div class="booking-main">
            <span class="booking-service">${b.service}</span>
            <span class="booking-date">${formatDate(b.date)} às ${b.time}</span>
            <span class="booking-status">${b.status}</span>
            <span style="color:#a5b4fc; font-weight:bold;">R$${b.price}</span>
          </div>
          <div class="booking-actions"></div>
        `;
        const actions = div.querySelector('.booking-actions');
        // Botão de confirmação de agendamento
        if (b.status === 'marcado') {
          const btnConfirm = document.createElement('button');
          btnConfirm.textContent = 'Confirmar Agendamento';
          btnConfirm.className = 'btn btn-primary';
          btnConfirm.onclick = async () => {
            btnConfirm.disabled = true;
            btnConfirm.textContent = 'Confirmando...';
            try {
              const res = await fetch(`http://localhost:3000/api/users/bookings/${b.id}/confirm`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const d = await res.json();
              if (!res.ok) throw new Error(d.error || 'Erro ao confirmar');
              btnConfirm.textContent = 'Confirmado!';
              div.querySelector('.booking-status').textContent = 'confirmado';
            } catch (err) {
              btnConfirm.disabled = false;
              btnConfirm.textContent = 'Confirmar Agendamento';
              alert(err.message);
            }
          };
          actions.appendChild(btnConfirm);
        }
        // Botão cancelar
        if (b.status === 'marcado' || b.status === 'confirmado') {
          const btnCancel = document.createElement('button');
          btnCancel.textContent = 'Cancelar';
          btnCancel.className = 'btn-cancel';
          btnCancel.onclick = async () => {
            if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
            btnCancel.disabled = true;
            btnCancel.textContent = 'Cancelando...';
            try {
              const res = await fetch(`http://localhost:3000/api/users/bookings/${b.id}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const d = await res.json();
              if (!res.ok) throw new Error(d.error || 'Erro ao cancelar');
              btnCancel.textContent = 'Cancelado';
              div.querySelector('.booking-status').textContent = 'cancelado';
              actions.innerHTML = '';
            } catch (err) {
              btnCancel.disabled = false;
              btnCancel.textContent = 'Cancelar';
              alert(err.message);
            }
          };
          actions.appendChild(btnCancel);
        }
        futureList.appendChild(div);
      });
    // Formata data para dd/mm/yyyy
    /**
     * Formata uma string de data para o formato dd/mm/yyyy.
     * @param {string} dateStr
     * @returns {string}
     */
    function formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR');
    }
    } else {
      futureList.innerHTML = '<p style="color:#aaa;">Nenhum agendamento futuro encontrado.</p>';
    }
    // Histórico
    if (data.history && data.history.length > 0) {
      historyList.innerHTML = '';
      data.history.forEach(b => {
        const div = document.createElement('div');
        div.className = 'booking-card';
        div.innerHTML = `
          <div><b>${b.service}</b> - ${b.date} às ${b.time} <span style="color:#a5b4fc;">R$${b.price}</span></div>
          <div>Status: <span style="color:#a5b4fc;">${b.status}</span></div>
        `;
        historyList.appendChild(div);
      });
    } else {
      historyList.innerHTML = '<p style="color:#aaa;">Nenhum histórico encontrado.</p>';
    }
  } catch (err) {
    alert('Erro ao buscar agendamentos: ' + err.message);
    futureList.innerHTML = '<p style="color:#ff6b6b;">' + err.message + '</p>';
    historyList.innerHTML = '<p style="color:#ff6b6b;">' + err.message + '</p>';
  }
}


// Carrega os agendamentos ao carregar a página
window.addEventListener('DOMContentLoaded', loadBookings);



// Elementos do formulário de perfil
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const numberInput = document.getElementById('number');
const ageInput = document.getElementById('age');
const profileForm = document.getElementById('profileForm');
const editBtn = document.getElementById('edit-profile-btn');
const saveBtn = document.getElementById('save-profile-btn');
const cancelBtn = document.getElementById('cancel-profile-btn');
let profileBackup = {}; // Guarda os dados originais para restaurar em caso de cancelamento



// Pega dados do profile
/**
 * Carrega os dados do perfil do usuário e preenche o formulário.
 * Desabilita os campos após carregar.
 */
async function loadProfile() {
  try {
    const res = await fetch('http://localhost:3000/api/users/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Erro ao carregar perfil');
      return;
    }
    if (nameInput) nameInput.value = data.name || '';
    if (emailInput) emailInput.value = data.email || '';
    if (numberInput) numberInput.value = data.number || '';
    if (ageInput) ageInput.value = data.age?.toString() || '';
    profileBackup = { name: data.name, number: data.number, age: data.age };
    setProfileDisabled(true);
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    editBtn.style.display = '';
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
}


/**
 * Habilita ou desabilita os campos do formulário de perfil.
 * @param {boolean} disabled
 */
function setProfileDisabled(disabled) {
  nameInput.disabled = disabled;
  numberInput.disabled = disabled;
  ageInput.disabled = disabled;
}


// Evento para habilitar edição do perfil
editBtn.addEventListener('click', () => {
  setProfileDisabled(false);
  saveBtn.style.display = '';
  cancelBtn.style.display = '';
  editBtn.style.display = 'none';
});

// Evento para cancelar edição e restaurar dados originais
cancelBtn.addEventListener('click', () => {
  if (profileBackup) {
    nameInput.value = profileBackup.name || '';
    numberInput.value = profileBackup.number || '';
    ageInput.value = profileBackup.age?.toString() || '';
  }
  setProfileDisabled(true);
  saveBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
  editBtn.style.display = '';
});

// Carrega o perfil ao abrir a página
loadProfile();

// Atualiza profile
// Evento de envio do formulário de perfil para atualizar os dados do usuário
if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    try {
      const res = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nameInput?.value,
          number: numberInput?.value,
          age: Number(ageInput?.value)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Erro ao atualizar perfil');
        saveBtn.disabled = false;
        return;
      }
      alert(data.message || 'Perfil atualizado com sucesso!');
      setProfileDisabled(true);
      saveBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      editBtn.style.display = '';
      profileBackup = { name: nameInput.value, number: numberInput.value, age: ageInput.value };
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor');
      saveBtn.disabled = false;
    }
  });
}