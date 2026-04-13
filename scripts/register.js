// js/register.js
const form = document.getElementById('registerForm');

// ===== NOME (APENAS LETRAS E ESPAÇO) =====
const nameInput = document.getElementById('name');

nameInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
});

// ===== EMAIL (LETRAS, NÚMEROS, @ e .) =====
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
});

// ===== TELEFONE (SÓ NÚMEROS + FORMATAÇÃO) =====
const numberInput = document.getElementById('number');

// DIGITAÇÃO (só números, sem máscara)
numberInput.addEventListener('input', () => {
  let numbers = numberInput.value.replace(/\D/g, '');
  numberInput.value = numbers.slice(0, 11);
});

// FORMATA QUANDO SAIR DO CAMPO
numberInput.addEventListener('blur', () => {
  let numbers = numberInput.value;

  if (numbers.length < 10) return; // não formata incompleto

  let formatted = '';

  if (numbers.length === 11) {
    formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  numberInput.value = formatted;
});

// ===== IDADE (SÓ NÚMEROS E 2 DÍGITOS) =====
const ageInput = document.getElementById('age');

ageInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');

  value = value.slice(0, 2);

  e.target.value = value;
});

// ===== VALIDAÇÃO DE SENHA =====
function validarSenha(password) {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return minLength && hasUpper && hasNumber && hasSymbol;
}

// ===== SUBMIT =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = document.getElementById('password').value;
  const number = numberInput.value;
  const age = ageInput.value;

  if (!name || !email || !password || !number || !age) {
    alert('Preencha todos os campos');
    return;
  }

  if (number.length < 15) {
    alert('Telefone inválido. Use o formato (xx) xxxxx-xxxx');
    return;
  }

  const ageNumber = Number(age);
  if (ageNumber < 1 || ageNumber > 99) {
    alert('Idade inválida');
    return;
  }

  if (!validarSenha(password)) {
    alert('A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 número e 1 símbolo');
    return;
  }

  try {
    const apiUrl = 'http://localhost:3000/api/auth/register';
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, number, age: ageNumber })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro no cadastro');
      return;
    }

    localStorage.setItem('token', data.token);
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'profile.html';

  } catch (err) {
    console.error('Erro no fetch de registro:', err);
    alert('Erro na conexão com o servidor');
  }
});

console.log("JS carregado");