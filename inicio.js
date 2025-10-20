// inicio.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'Shttps://fvilrlcwcizqzyhxybbq.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aWxybGN3Y2l6cXp5aHh5YmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mjk1MDcsImV4cCI6MjA3NjMwNTUwN30.8GeyoYnqXzTbzPq1t8tAilUO7pCL83lmBZ8eOHC-_ko';
const supabase = createClient(supabaseUrl, supabaseKey);

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signUpForm = document.querySelector('.sign-up-container form');
const signInForm = document.querySelector('.sign-in-container form');

signUpButton.addEventListener('click', () => container.classList.add("right-panel-active"));
signInButton.addEventListener('click', () => container.classList.remove("right-panel-active"));

signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = signUpForm.querySelector('input[type="email"]').value;
    const password = signUpForm.querySelector('input[type="password"]').value;
    const button = signUpForm.querySelector('button');
    button.textContent = 'Registrando...';
    button.disabled = true;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert("Erro no registro: " + error.message);
        button.textContent = 'Registrar';
        button.disabled = false;
    } else {
        alert("Registro realizado! Verifique seu email para confirmar a conta.");
        button.textContent = 'Registrar';
        button.disabled = false;
        signUpForm.reset();
        container.classList.remove("right-panel-active");
    }
});

signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;
    const button = signInForm.querySelector('button');
    button.textContent = 'Entrando...';
    button.disabled = true;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Erro no login: " + error.message);
        button.textContent = 'Entrar';
        button.disabled = false;
    } else {
        setTimeout(() => { window.location.href = 'index.html'; }, 500);
    }
});