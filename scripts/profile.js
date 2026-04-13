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

    if (nameInput) nameInput.value = data.name || '';
    if (emailInput) emailInput.value = data.email || '';
    if (numberInput) numberInput.value = data.number || '';
    if (ageInput) ageInput.value = data.age?.toString() || '';
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
}

loadProfile();

// Atualiza profile
if (profileForm) {
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
          name: nameInput?.value,
          number: numberInput?.value,
          age: Number(ageInput?.value)
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
} else {
  console.error('profileForm não encontrado.');
}