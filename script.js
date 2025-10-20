// script.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ✅ COLOQUE SUAS CREDENCIAIS CORRETAS AQUI TAMBÉM ✅
const supabaseUrl = 'https://fvilrlcwcizqzyhxybbq.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aWxybGN3Y2l6cXp5aHh5YmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mjk1MDcsImV4cCI6MjA3NjMwNTUwN30.8GeyoYnqXzTbzPq1t8tAilUO7pCL83lmBZ8eOHC-_ko';

const supabase = createClient(supabaseUrl, supabaseKey);
// ...

// --- VERIFICAÇÃO DE SEGURANÇA ---
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'inicio.html';
    } else {
        const userEmailSpan = document.getElementById('user-email');
        if (userEmailSpan) {
            userEmailSpan.textContent = session.user.email;
        }
    }
}
// Roda a verificação assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// --- Seletores de Elementos (O RESTO DO CÓDIGO QUE ESTAVA FALTANDO) ---
const cvForm = document.getElementById('cv-form');
const ctaButton = cvForm.querySelector('.cta-button');
const buttonText = ctaButton.querySelector('.button-text');
const loadingOverlay = document.getElementById('loading-overlay');
const colorSwatches = document.querySelectorAll('.color-swatch');
const themeInput = document.getElementById('theme');
const placeholderImage = 'https://via.placeholder.com/150';
const photoUpload = document.getElementById('photo-upload');
const photoPreview = document.getElementById('photo-preview');
const takePhotoButton = document.getElementById('take-photo-button');
const removePhotoButton = document.getElementById('remove-photo-button');
const cameraModal = document.getElementById('camera-modal');
const video = document.getElementById('camera-video');
const canvas = document.getElementById('camera-canvas');
const captureButton = document.getElementById('capture-button');
const closeModalButton = document.getElementById('close-modal-button');
const logoutButton = document.getElementById('logout-button');
let stream = null;

// --- Funções da Câmera e Foto ---
function updatePhotoPreview(imageDataUrl) { photoPreview.src = imageDataUrl; removePhotoButton.style.display = 'inline-flex'; }
function removePhoto() { photoPreview.src = placeholderImage; photoUpload.value = ''; removePhotoButton.style.display = 'none'; }
async function startCamera() { try { if (stream) { stream.getTracks().forEach(track => track.stop()); } stream = await navigator.mediaDevices.getUserMedia({ video: true }); video.srcObject = stream; cameraModal.classList.add('visible'); } catch (err) { console.error("Erro ao acessar a câmera: ", err); alert("Não foi possível acessar a câmera. Verifique as permissões do seu navegador."); } }
function stopCamera() { if (stream) { stream.getTracks().forEach(track => track.stop()); stream = null; } cameraModal.classList.remove('visible'); }
function takePicture() { const context = canvas.getContext('2d'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; context.drawImage(video, 0, 0, canvas.width, canvas.height); const dataUrl = canvas.toDataURL('image/jpeg'); updatePhotoPreview(dataUrl); stopCamera(); }
function resetButton() { buttonText.textContent = '✨ Gerar Meu Currículo com IA'; ctaButton.disabled = false; ctaButton.classList.remove('success', 'error'); }

// --- Event Listeners ---
colorSwatches.forEach(swatch => { swatch.addEventListener('click', () => { colorSwatches.forEach(s => s.classList.remove('selected')); swatch.classList.add('selected'); themeInput.value = swatch.dataset.theme; }); });
photoUpload.addEventListener('change', (event) => { const file = event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (e) => updatePhotoPreview(e.target.result); reader.readAsDataURL(file); } });
takePhotoButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', takePicture);
closeModalButton.addEventListener('click', stopCamera);
removePhotoButton.addEventListener('click', removePhoto);

logoutButton.addEventListener('click', async () => {
    logoutButton.textContent = 'Saindo...';
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'inicio.html';
    } catch (error) {
        alert('Erro ao fazer logout: ' + error.message);
        logoutButton.textContent = 'Sair';
    }
});

cvForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    buttonText.textContent = 'Gerando... Por favor, aguarde.';
    ctaButton.disabled = true;
    loadingOverlay.classList.add('visible');
    ctaButton.classList.remove('success', 'error');

    if (photoPreview.src !== placeholderImage) {
        localStorage.setItem('userPhoto', photoPreview.src);
    } else {
        localStorage.removeItem('userPhoto');
    }

    const formData = new FormData(cvForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/server', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) { throw new Error('A resposta do servidor não foi OK'); }

        const result = await response.json();
        
        ctaButton.classList.add('success');
        buttonText.textContent = 'Sucesso! Redirecionando...';

        localStorage.setItem('curriculoGerado', result.curriculoTexto);
        localStorage.setItem('curriculoTheme', data.theme);
        
        setTimeout(() => { window.location.href = 'resultado.html'; }, 1000);

    } catch (error) {
        console.error('Erro:', error);
        ctaButton.classList.add('error');
        buttonText.textContent = 'Erro! Tente Novamente';
        alert('Houve um problema ao gerar seu currículo. Verifique o console para mais detalhes.');
        setTimeout(resetButton, 3000);
    } finally {
        loadingOverlay.classList.remove('visible');
    }
});