// js/profile.js
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'login.html'; // redireciona se não logado
}

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const numberInput = document.getElementById('number');
const ageInput = document.getElementById('age');
const profileForm = document.getElementById('profileForm');

// Pega dados do profile
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

    nameInput.value = data.name;
    emailInput.value = data.email;
    numberInput.value = data.number;
    ageInput.value = data.age;
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
}

loadProfile();

// Atualiza profile
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:3000/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: nameInput.value,
        number: numberInput.value,
        age: ageInput.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro ao atualizar perfil');
      return;
    }

    alert(data.message || 'Perfil atualizado com sucesso!');
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
});