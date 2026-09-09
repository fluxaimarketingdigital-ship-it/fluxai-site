import { OS_AUTH, OS_UI } from '../os-core.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';

/**
 * Banco de Dados de Vídeos (Placeholders para o manual operacional)
 * Substitua o 'embedUrl' pelo link real do vídeo quando estiver gravado (YouTube Embed ou Vimeo).
 */
const ACADEMY_VIDEOS = [
    {
        id: 'vid_01_primeiros_passos',
        title: 'Módulo 01: Primeiros Passos',
        desc: 'Acesso inicial, visão geral da arquitetura do FluxAI OS™ e gerenciamento básico de perfil.',
        roles: ['ADMIN', 'OPERATOR', 'CLIENT'],
        videoUrl: '',
        duration: 'A gravar'
    },
    {
        id: 'vid_02_operacao_interna',
        title: 'Operação Interna',
        desc: 'Command Center, Onboarding, Content Engine, CRM Intelligence, Financeiro e Auditoria.',
        roles: ['ADMIN', 'OPERATOR'],
        videoUrl: '',
        duration: 'A gravar'
    },
    {
        id: 'vid_03_portal_cliente',
        title: 'Visão do Cliente',
        desc: 'Navegação para os clientes da agência: como aprovar relatórios.',
        roles: ['ADMIN', 'OPERATOR', 'CLIENT'],
        videoUrl: '',
        duration: 'A gravar'
    },
    {
        id: 'vid_04_comercial_pitch',
        title: 'Apresentação Comercial',
        desc: 'Pitch do sistema para reuniões de vendas e demonstração executiva para novos leads.',
        roles: ['ADMIN', 'OPERATOR'],
        videoUrl: '',
        duration: 'A gravar'
    }
];

let currentUser = null;
let currentVideoId = null;

async function initAcademy() {
    // Requer no mínimo acesso CLIENT, mas o conteúdo varia por role.
    currentUser = await OS_AUTH.check(null);
    if (!currentUser) return;

    OS_UI.renderSidebar('fluxai-academy', currentUser.role);
    await OS_UI.renderTopbar();

    renderPlaylist();
    
    // Auto-selecionar o primeiro vídeo disponível para o usuário
    const firstAvailable = getAvailableVideos()[0];
    if (firstAvailable) {
        window.loadAcademyVideo(firstAvailable.id);
    }
    
    OS_LOGS_ENGINE.userAction('ACADEMY_ACCESSED', 'fluxai-academy', { action: 'Acessou a área de treinamento' }, currentUser.role, null, false);
}

function getAvailableVideos() {
    return ACADEMY_VIDEOS.filter(vid => vid.roles.includes(currentUser.role));
}

function renderPlaylist() {
    const playlistEl = document.getElementById('academy-playlist');
    const videos = getAvailableVideos();
    
    if (videos.length === 0) {
        playlistEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--os-text-muted);">Nenhum vídeo disponível para o seu nível de acesso.</div>';
        return;
    }

    playlistEl.innerHTML = videos.map((vid, index) => {
        const isActive = vid.id === currentVideoId ? 'active' : '';
        const roleBadges = vid.roles.map(r => `<span class="badge-role">${r}</span>`).join('');
        
        return `
            <div class="playlist-item ${isActive}" onclick="window.loadAcademyVideo('${vid.id}')">
                <div class="playlist-item-thumb">
                    <i class="fa-solid fa-play"></i>
                </div>
                <div class="playlist-item-content">
                    <div class="playlist-item-title">${index + 1}. ${vid.title}</div>
                    <div class="playlist-item-meta">
                        ${roleBadges} • ${vid.duration}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.loadAcademyVideo = (id) => {
    const video = ACADEMY_VIDEOS.find(v => v.id === id);
    if (!video) return;

    // Verificar se o usuário tem permissão
    if (!video.roles.includes(currentUser.role)) {
        alert('Você não tem permissão para visualizar este módulo.');
        return;
    }

    currentVideoId = id;
    
    // Atualizar UI da Playlist
    renderPlaylist();

    // Atualizar Player
    const wrapper = document.getElementById('academy-video-wrapper');
    if (video.videoUrl) {
        wrapper.innerHTML = `<video controls autoplay style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"><source src="${video.videoUrl}" type="video/mp4">Seu navegador não suporta vídeos.</video>`;
    } else {
        // Placeholder visual para quando não houver vídeo gravado
        wrapper.innerHTML = `
            <div style="width:100%; height:100%; position:absolute; top:0; left:0; background: linear-gradient(45deg, #1a1a2e, #16213e); display:flex; flex-direction:column; align-items:center; justify-content:center; color: #fff; text-align: center; padding: 20px;">
                <i class="fa-solid fa-video-slash" style="font-size: 3rem; color: var(--os-primary); margin-bottom: 15px; opacity: 0.8;"></i>
                <h3 style="margin:0 0 10px 0; font-family: var(--os-font-mono);">GRAVAÇÃO PENDENTE</h3>
                <p style="color: var(--os-text-muted); font-size: 0.9rem; max-width: 80%;">
                    Este treinamento será disponibilizado após a gravação oficial.
                </p>
            </div>
        `;
    }

    // Atualizar Informações
    document.getElementById('academy-video-title').textContent = video.title;
    document.getElementById('academy-video-roles').innerHTML = video.roles.map(r => `<span class="badge-role" style="background: rgba(167, 139, 250, 0.2); color: var(--os-primary);">${r}</span>`).join('');
    document.getElementById('academy-video-desc').textContent = video.desc;
    
    OS_LOGS_ENGINE.userAction('ACADEMY_VIDEO_PLAYED', 'fluxai-academy', { video_id: id, video_title: video.title }, currentUser.role, null, false);
};

// Start
document.addEventListener('DOMContentLoaded', initAcademy);
