// inicio.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ✅ COLOQUE SUAS CREDENCIAIS CORRETAS AQUI ✅
const supabaseUrl = 'https://fvilrlcwcizqzyhxybbq.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aWxybGN3Y2l6cXp5aHh5YmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mjk1MDcsImV4cCI6MjA3NjMwNTUwN30.8GeyoYnqXzTbzPq1t8tAilUO7pCL83lmBZ8eOHC-_ko';

const supabase = createClient(supabaseUrl, supabaseKey);
// ...
// ... (cole o resto do código do 'inicio.js' da minha resposta anterior aqui) ...
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Formulários
const signUpForm = document.querySelector('.sign-up-container form');
const signInForm = document.querySelector('.sign-in-container form');

// --- LÓGICA DE ANIMAÇÃO DO PAINEL ---
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// --- LÓGICA DE REGISTRO DE USUÁRIO ---
signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const email = signUpForm.querySelector('input[type="email"]').value;
    const password = signUpForm.querySelector('input[type="password"]').value;
    const button = signUpForm.querySelector('button');

    button.textContent = 'Registrando...';

    // Usa o Supabase para criar um novo usuário
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert("Erro no registro: " + error.message);
        button.textContent = 'Registrar';
    } else {
        alert("Registro realizado com sucesso! Verifique seu email para confirmar a conta.");
        button.textContent = 'Registrar';
        signUpForm.reset();
        container.classList.remove("right-panel-active");
    }
});

// --- LÓGICA DE LOGIN ---
signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;
    const button = signInForm.querySelector('button');

    button.textContent = 'Entrando...';

    // Usa o Supabase para fazer o login
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Erro no login: " + error.message);
        button.textContent = 'Entrar';
    } else {
        // SUCESSO! Redireciona para a página principal
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
});