import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';

async function init() {
    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;

    OS_UI.renderSidebar('content-engine', user.role);
    await OS_UI.renderTopbar();

    await loadPipeline();
    bindEvents();
}

async function loadPipeline() {
    // Simulação de carregamento do banco
    // Em produção: const { data } = await supabase.from('content_assets').select('*');
    const mockPipeline = [
        { id: 'AST-001', title: 'Manual de Identidade v2', stage: 'Aprovado', priority: 'alta', owner: 'Design Team', due: '15/05' },
        { id: 'AST-002', title: 'Post: Lançamento FluxAI', stage: 'Aprovado', priority: 'crítica', owner: 'Copywriter', due: 'Hoje' },
        { id: 'AST-003', title: 'Roteiro Vídeo VSL', stage: 'Produção', priority: 'média', owner: 'Video Editor', due: '20/05' }
    ];

    const body = document.getElementById('pipeline-table-body');
    body.innerHTML = mockPipeline.map(item => `
        <tr>
            <td><code style="font-size: 0.7rem;">${item.id}</code></td>
            <td><strong>${item.title}</strong></td>
            <td><span class="os-badge">${item.stage}</span></td>
            <td><span class="os-priority-${item.priority.toLowerCase()}">${item.priority}</span></td>
            <td>${item.owner}</td>
            <td>${item.due}</td>
            <td>
                ${item.stage === 'Aprovado' ? `<button class="btn-pub" onclick="window.openPublicationBridge('${item.id}', '${item.title}')">PUBLICAR</button>` : ''}
            </td>
        </tr>
    `).join('');
}

window.openPublicationBridge = (id, title) => {
    const modal = document.getElementById('pub-modal-overlay');
    const captionInput = document.getElementById('pub-caption-preview');
    
    // Mock de legenda gerada pela IA
    const mockCaption = `🚀 ${title}\n\nConheça a nova era da gestão operacional com a FluxAI OS™.\n\n#FluxAI #Sistemas #Gestão #B2B`;
    captionInput.value = mockCaption;

    modal.style.display = 'flex';

    // Auto-copy legenda
    navigator.clipboard.writeText(mockCaption).then(() => {
        console.log('Legenda copiada automaticamente.');
    });
};

function bindEvents() {
    const modal = document.getElementById('pub-modal-overlay');
    
    document.getElementById('close-pub-modal').onclick = () => modal.style.display = 'none';

    document.getElementById('btn-copy-caption').onclick = () => {
        const cap = document.getElementById('pub-caption-preview').value;
        navigator.clipboard.writeText(cap);
        alert('Legenda copiada para o clipboard!');
    };

    document.getElementById('btn-open-account').onclick = () => {
        // Em produção, pegamos o link salvo no projeto do cliente
        window.open('https://www.instagram.com/creator_studio/', '_blank');
    };

    document.getElementById('btn-open-assets').onclick = () => {
        window.open('https://www.canva.com/', '_blank');
    };

    document.getElementById('btn-confirm-pub').onclick = async () => {
        if (!confirm('Confirmar publicação manual deste ativo?')) return;
        
        // Em produção: await supabase.from('publication_logs').insert([...]);
        // await supabase.from('content_assets').update({ status: 'PUBLICADO' }).eq('id', id);
        
        alert('Ativo marcado como PUBLICADO com sucesso!');
        modal.style.display = 'none';
        loadPipeline();
    };
}

init();
