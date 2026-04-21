
// Script responsável pelo cadastro de novos usuários no sistema.
// Realiza validações de campos, formatações e envia os dados para a API de registro.

const form = document.getElementById('registerForm'); // Formulário de registro


// ===== NOME (APENAS LETRAS E ESPAÇO) =====
// Permite apenas letras e espaços no campo nome
const nameInput = document.getElementById('name');
nameInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
});


// ===== EMAIL (LETRAS, NÚMEROS, @ e .) =====
// Permite apenas caracteres válidos para e-mail
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
});


// ===== TELEFONE (SÓ NÚMEROS + FORMATAÇÃO) =====
// Permite apenas números no campo telefone e formata ao sair do campo
const numberInput = document.getElementById('number');
// Digitação: só números, sem máscara
numberInput.addEventListener('input', () => {
  let numbers = numberInput.value.replace(/\D/g, '');
  numberInput.value = numbers.slice(0, 11);
});
// Formatação ao perder o foco
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
// Permite apenas números e limita a 2 dígitos
const ageInput = document.getElementById('age');
ageInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  value = value.slice(0, 2);
  e.target.value = value;
});


// ===== VALIDAÇÃO DE SENHA =====
/**
 * Valida se a senha atende aos requisitos mínimos:
 * - Pelo menos 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 símbolo
 */
function validarSenha(password) {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUpper && hasNumber && hasSymbol;
}


// ===== SUBMIT =====
// Evento de envio do formulário de registro.
// Realiza validações dos campos e envia os dados para a API de cadastro.
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = document.getElementById('password').value;
  const number = numberInput.value;
  const age = ageInput.value;

  // Validação dos campos obrigatórios
  if (!name || !email || !password || !number || !age) {
    alert('Preencha todos os campos');
    return;
  }

  // Validação do telefone
  if (number.length < 15) {
    alert('Telefone inválido. Use o formato (xx) xxxxx-xxxx');
    return;
  }

  // Validação da idade
  const ageNumber = Number(age);
  if (ageNumber < 1 || ageNumber > 99) {
    alert('Idade inválida');
    return;
  }

  // Validação da senha
  if (!validarSenha(password)) {
    alert('A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 número e 1 símbolo');
    return;
  }

  // Envia os dados para a API
  try {
    const apiUrl = 'http://localhost:3000/api/auth/register';
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, number, age })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro ao registrar');
      return;
    }

    alert('Registro realizado com sucesso!');
    window.location.href = 'login.html';
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
});


// Mensagem de debug para indicar que o JS foi carregado
console.log("JS carregado");