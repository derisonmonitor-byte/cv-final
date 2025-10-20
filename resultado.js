// resultado.js (VERSÃO FINAL E COMPLETA)

import supabase from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    // Carrega e aplica o tema de cor escolhido
    const theme = localStorage.getItem('curriculoTheme') || 'blue';
    document.body.classList.add(`theme-${theme}`);

    // Carrega e exibe a foto
    const photoContainer = document.getElementById('photo-container');
    const cvPhoto = document.getElementById('cv-photo');
    const photoData = localStorage.getItem('userPhoto');
    if (photoData) {
        cvPhoto.src = photoData;
    } else {
        if(photoContainer) photoContainer.style.display = 'none';
    }

    // Carrega e injeta o texto da IA
    const textoGerado = localStorage.getItem('curriculoGerado');
    if (textoGerado) {
        parseAndInject(textoGerado);
    } else {
        if(document.getElementById('nome')) document.getElementById('nome').textContent = "Erro ao Carregar Currículo";
    }

    // Configura o botão de download
    const botaoBaixar = document.getElementById('baixar-pdf');
    if(botaoBaixar) botaoBaixar.addEventListener('click', () => {
        const curriculo = document.getElementById('curriculo-para-baixar');
        const nomeCandidato = document.getElementById('nome').textContent || 'curriculo';
        const opt = {
            margin: 0,
            filename: `curriculo-${nomeCandidato.toLowerCase().replace(/ /g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        };
        // Usa window.html2pdf() para garantir que a ferramenta seja encontrada
        window.html2pdf().from(curriculo).set(opt).save();
    });

    // Configura o botão de logout
    const logoutButton = document.getElementById('logout-button');
    if(logoutButton) logoutButton.addEventListener('click', async () => {
        logoutButton.textContent = 'Saindo...';
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.href = 'inicio.html';
        } catch (error) {
            alert('Erro ao fazer logout: ' + error.message);
            logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
        }
    });
});

// ✅ A FUNÇÃO QUE FALTAVA ESTÁ AQUI, COMPLETA E CORRETA ✅
function parseAndInject(text) {
    const extract = (start, end) => {
        const startIndex = text.indexOf(start) + start.length;
        const endIndex = text.indexOf(end);
        if (startIndex > start.length - 1 && endIndex > -1) {
            return text.substring(startIndex, endIndex).trim();
        }
        return '';
    };

    const toHtml = (str) => {
        let processedStr = str
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^\* (.*)/gm, '<li>$1</li>');

        if (processedStr.includes('<li>')) {
            return `<ul>${processedStr.replace(/\n/g, '')}</ul>`;
        } else {
            return processedStr.replace(/\n/g, '<br>');
        }
    };

    const nome = extract('[START_NOME]', '[END_NOME]');
    const objetivo = extract('[START_OBJETIVO]', '[END_OBJETIVO]');
    const contato = extract('[START_CONTATO]', '[END_CONTATO]');
    const habilidades = extract('[START_HABILIDADES]', '[END_HABILIDADES]');
    const resumo = extract('[START_RESUMO]', '[END_RESUMO]');
    const experiencia = extract('[START_EXPERIENCIA]', '[END_EXPERIENCIA]');
    const formacao = extract('[START_FORMACAO]', '[END_FORMACAO]');
        
    document.getElementById('nome').innerHTML = toHtml(nome);
    document.querySelector('#objetivo .content').innerHTML = toHtml(objetivo);
    document.querySelector('#contato .content').innerHTML = toHtml(contato);
    document.querySelector('#habilidades .content').innerHTML = toHtml(habilidades);
    document.querySelector('#resumo .content').innerHTML = toHtml(resumo);
    document.querySelector('#experiencia .content').innerHTML = toHtml(experiencia);
    document.querySelector('#formacao .content').innerHTML = toHtml(formacao);
}