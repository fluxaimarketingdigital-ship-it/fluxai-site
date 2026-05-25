import { OS_UI, OS_AUTH } from '../os-core.js';
import { ClientOnboardingSchema } from '../../data/client-onboarding.schema.js';

let onboardingData = {
    principal: {},
    contrato: {},
    servicos: {},
    servicos_extras: {},
    arquivos: {},
    dna: {},
    regras_comunicacao: {},
    canais: {},
    planejamento: {}
};

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('onboarding-cliente', user.role);
    await OS_UI.renderTopbar();

    setupServicesLogic();
    setupExtrasLogic();
    document.getElementById('btn-review').addEventListener('click', generateReview);
    document.getElementById('btn-activate').addEventListener('click', activateClient);
}

function setupServicesLogic() {
    const container = document.getElementById('services-container');
    const { servicos } = ClientOnboardingSchema.blocks;
    
    let html = '';
    servicos.options.forEach(opt => {
        html += `
        <div class="service-box">
            <label style="display: flex; align-items: center; gap: 10px; font-weight: 700; color: #fff; cursor: pointer;">
                <input type="checkbox" class="service-check" value="${opt.value}"> ${opt.label}
            </label>
            <div class="service-details" id="details-${opt.value}" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--os-border); display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        `;
        
        servicos.subFields.forEach(sf => {
            if (sf.type === 'select') {
                const options = sf.options.map(o => `<option value="${o}" ${sf.default === o ? 'selected' : ''}>${o.replace(/_/g, ' ').toUpperCase()}</option>`).join('');
                html += `<div>
                    <label style="font-size: 0.7rem; color: var(--os-text-muted); display: block; margin-bottom: 5px;">${sf.label}</label>
                    <select class="os-input service-input" data-service="${opt.value}" data-field="${sf.name}" style="width: 100%;">${options}</select>
                </div>`;
            } else {
                html += `<div>
                    <label style="font-size: 0.7rem; color: var(--os-text-muted); display: block; margin-bottom: 5px;">${sf.label}</label>
                    <input type="text" class="os-input service-input" data-service="${opt.value}" data-field="${sf.name}" style="width: 100%;" />
                </div>`;
            }
        });

        html += `</div></div>`;
    });
    container.innerHTML = html;

    document.querySelectorAll('.service-check').forEach(chk => {
        const details = document.getElementById(`details-${chk.value}`);
        details.style.display = 'none';
        chk.addEventListener('change', (e) => {
            details.style.display = e.target.checked ? 'grid' : 'none';
        });
    });
}

function setupExtrasLogic() {
    const container = document.getElementById('extras-container');
    const { servicos_extras } = ClientOnboardingSchema.blocks;
    
    let html = '';
    
    // Serviços do Catálogo
    servicos_extras.catalogo.forEach(cat => {
        html += buildExtraBox(cat.servico_id, cat.nome_servico, cat.valor_base, cat.gera_credito_ia, cat.quantidade_credito_ia, servicos_extras.subFields);
    });

    // Opção Outro
    html += buildExtraBox('SRV_EXTRA_CUSTOM', 'Outro Serviço Personalizado', '', false, 0, servicos_extras.subFields, true);
    
    container.innerHTML = html;

    document.querySelectorAll('.extra-check').forEach(chk => {
        const details = document.getElementById(`details-extra-${chk.value}`);
        details.style.display = 'none';
        chk.addEventListener('change', (e) => {
            details.style.display = e.target.checked ? 'grid' : 'none';
        });
    });
}

function buildExtraBox(id, label, valorEstimado, geraCredito, qtdCredito, subFields, isCustom = false) {
    let html = `
    <div class="service-box extra-box">
        <label style="display: flex; align-items: center; gap: 10px; font-weight: 700; color: #fff; cursor: pointer;">
            <input type="checkbox" class="extra-check" value="${id}"> ${label}
            ${geraCredito ? `<span style="font-size:0.6rem; background:rgba(167,139,250,0.2); color:#a78bfa; padding:2px 6px; border-radius:4px;">+${qtdCredito} Créditos IA</span>` : ''}
        </label>
        <div class="service-details" id="details-extra-${id}" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--os-border); display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
    `;
    
    subFields.forEach(sf => {
        if (sf.type === 'select') {
            const options = sf.options.map(o => `<option value="${o}" ${sf.default === o ? 'selected' : ''}>${o.replace(/_/g, ' ').toUpperCase()}</option>`).join('');
            html += `<div>
                <label style="font-size: 0.7rem; color: var(--os-text-muted); display: block; margin-bottom: 5px;">${sf.label}</label>
                <select class="os-input extra-input" data-extra="${id}" data-field="${sf.name}" style="width: 100%;">${options}</select>
            </div>`;
        } else if (sf.type === 'textarea') {
            const isVisible = (sf.name === 'descricao_personalizada' && !isCustom) ? 'display:none;' : '';
            html += `<div style="grid-column: span 2; ${isVisible}">
                <label style="font-size: 0.7rem; color: var(--os-text-muted); display: block; margin-bottom: 5px;">${sf.label}</label>
                <textarea class="os-input extra-input" data-extra="${id}" data-field="${sf.name}" style="width: 100%; height: 60px;"></textarea>
            </div>`;
        } else {
            let val = (sf.name === 'valor_estimado' && !isCustom) ? valorEstimado : '';
            html += `<div>
                <label style="font-size: 0.7rem; color: var(--os-text-muted); display: block; margin-bottom: 5px;">${sf.label}</label>
                <input type="text" class="os-input extra-input" data-extra="${id}" data-field="${sf.name}" value="${val}" style="width: 100%;" />
            </div>`;
        }
    });

    html += `</div></div>`;
    return html;
}

function gatherData() {
    // Coleta Simples (Principal, Contrato, Arquivos, DNA, Regras, Canais, Planejamento)
    const blocksToGather = ['principal', 'contrato', 'arquivos', 'dna', 'regras_comunicacao', 'canais', 'planejamento'];
    
    blocksToGather.forEach(blockKey => {
        ClientOnboardingSchema.blocks[blockKey].fields.forEach(f => {
            const el = document.getElementById(`f_${f.name}`);
            if(el) onboardingData[blockKey][f.name] = el.value;
        });
    });

    // Servicos Base
    onboardingData.servicos = {};
    document.querySelectorAll('.service-check:checked').forEach(chk => {
        const srv = chk.value;
        onboardingData.servicos[srv] = {};
        document.querySelectorAll(`.service-input[data-service="${srv}"]`).forEach(inp => {
            onboardingData.servicos[srv][inp.dataset.field] = inp.value;
        });
    });

    // Servicos Extras
    onboardingData.servicos_extras = {};
    document.querySelectorAll('.extra-check:checked').forEach(chk => {
        const extId = chk.value;
        const catalogItem = ClientOnboardingSchema.blocks.servicos_extras.catalogo.find(c => c.servico_id === extId);
        
        onboardingData.servicos_extras[extId] = {
            servico_nome: catalogItem ? catalogItem.nome_servico : 'Personalizado',
            gera_credito_ia: catalogItem ? catalogItem.gera_credito_ia : false,
            quantidade_credito_ia: catalogItem ? catalogItem.quantidade_credito_ia : 0
        };
        
        document.querySelectorAll(`.extra-input[data-extra="${extId}"]`).forEach(inp => {
            onboardingData.servicos_extras[extId][inp.dataset.field] = inp.value;
        });
    });
}

function generateGPT_Package() {
    let creditosIniciais = 10; // Créditos padrão por contrato ativo
    let limitadorExtendido = 0;
    
    Object.values(onboardingData.servicos_extras).forEach(ext => {
        if (ext.status_extra === 'aprovado' && ext.gera_credito_ia) {
            limitadorExtendido += ext.quantidade_credito_ia;
        }
    });

    const gptPackage = {
        meta: {
            client_id: onboardingData.principal.client_id,
            timestamp_geracao: new Date().toISOString(),
            status_operacional: onboardingData.principal.status
        },
        contrato_e_creditos: {
            valor_global: onboardingData.contrato.valor_global,
            creditos_base: creditosIniciais,
            creditos_extras_aprovados: limitadorExtendido,
            limite_total_geracao: creditosIniciais + limitadorExtendido,
            regra_consumo: "Gerar rascunho = 0 crédito. Aprovar rascunho na FluxAI = 1 crédito."
        },
        escopo_contratado: {
            servicos_base: Object.keys(onboardingData.servicos),
            servicos_extras: Object.keys(onboardingData.servicos_extras).map(k => onboardingData.servicos_extras[k].servico_nome)
        },
        dna_estrategico: onboardingData.dna,
        regras_comunicacao: onboardingData.regras_comunicacao,
        planejamento_base: onboardingData.planejamento,
        drive_assets: onboardingData.arquivos
    };

    return gptPackage;
}

function generateReview() {
    gatherData();

    if (!onboardingData.principal.client_id || !onboardingData.principal.client_name) {
        alert("Preencha o ID e Nome do Cliente na etapa de Dados Principais.");
        return;
    }

    const reviewContainer = document.getElementById('review-container');
    const rotasSugeridas = generateRoutes();
    const gptPackage = generateGPT_Package();

    document.getElementById('gpt-package-preview').textContent = JSON.stringify(gptPackage, null, 2);

    let reviewHtml = `
    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid var(--os-border);">
        <h4 style="color: var(--os-primary); margin-top: 0;">CLIENTES_CONFIG (1 linha)</h4>
        <pre style="font-size: 0.75rem; color: #ccc; margin:0; white-space: pre-wrap;">${JSON.stringify({...onboardingData.principal, ...onboardingData.contrato}, null, 2)}</pre>
    </div>
    
    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid var(--os-border); margin-top: 15px;">
        <h4 style="color: var(--os-primary); margin-top: 0;">SERVICOS_CLIENTES (${Object.keys(onboardingData.servicos).length} linhas)</h4>
        <pre style="font-size: 0.75rem; color: #ccc; margin:0; white-space: pre-wrap;">${JSON.stringify(onboardingData.servicos, null, 2)}</pre>
    </div>

    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid var(--os-border); margin-top: 15px;">
        <h4 style="color: var(--os-primary); margin-top: 0;">SERVICOS_EXTRAS_CLIENTES (${Object.keys(onboardingData.servicos_extras).length} linhas)</h4>
        <pre style="font-size: 0.75rem; color: #ccc; margin:0; white-space: pre-wrap;">${JSON.stringify(onboardingData.servicos_extras, null, 2)}</pre>
    </div>

    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid var(--os-border); margin-top: 15px;">
        <h4 style="color: var(--os-primary); margin-top: 0;">ROTAS_AUTOMACOES (${rotasSugeridas.length} linhas)</h4>
        <pre style="font-size: 0.75rem; color: #ccc; margin:0; white-space: pre-wrap;">${JSON.stringify(rotasSugeridas, null, 2)}</pre>
    </div>`;

    reviewContainer.innerHTML = reviewHtml;
    document.getElementById('bloco-revisao').style.display = 'block';
    
    onboardingData.rotas_geradas = rotasSugeridas;
    onboardingData.gpt_package = gptPackage;
}

function generateRoutes() {
    const rotas = [];
    const client = onboardingData.principal;
    const canais = onboardingData.canais;

    Object.keys(onboardingData.servicos).forEach((srvName, index) => {
        const srv = onboardingData.servicos[srvName];
        let statusAuth = 'pendente';
        let statusRota = 'pausada';

        if (srv.modo_coleta === 'api') {
            if (canais.token_status === 'ativo') {
                statusAuth = 'autorizado'; statusRota = 'ativa';
            } else if (canais.token_status === 'aguardando_autorizacao') {
                statusAuth = 'aguardando_autorizacao'; statusRota = 'pausada';
            }
        } else if (srv.modo_coleta === 'manual') {
            statusAuth = 'nao_aplicavel'; statusRota = 'pausada'; 
        } else if (srv.modo_coleta === 'webhook') {
            statusAuth = 'autorizado'; statusRota = 'ativa';
        }

        rotas.push({
            rota_id: `RTA_AUTO_${client.client_id}_${index + 1}`,
            client_id: client.client_id,
            servico: srvName,
            tipo_integracao: srv.modo_coleta,
            status_autorizacao: statusAuth,
            status_rota: statusRota
        });
    });

    return rotas;
}

function activateClient() {
    if (!onboardingData.principal.client_id) {
        alert("Gere a revisão primeiro!"); return;
    }

    localStorage.setItem(`fluxai_onboarding_draft_${onboardingData.principal.client_id}`, JSON.stringify(onboardingData));

    const mockClients = JSON.parse(localStorage.getItem('fluxai_mock_clients') || '[]');
    mockClients.push({
        cliente_id: onboardingData.principal.client_id,
        nome_cliente: onboardingData.principal.client_name,
        status_ativo: onboardingData.principal.status,
        instagram_profile: onboardingData.principal.instagram,
        website: onboardingData.principal.site,
        token_auth_status: onboardingData.canais.token_status === 'ativo' ? 'ok' : 'ausente',
        data_entrada: onboardingData.principal.data_inicio
    });
    localStorage.setItem('fluxai_mock_clients', JSON.stringify(mockClients));

    document.getElementById('activation-msg').innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 20px; border-radius: 8px; text-align: center;">
            <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h3 style="margin: 0 0 10px;">Cliente Preparado para Sincronização</h3>
            <p style="margin: 0; font-size: 0.85rem; color: #ccc;">A Camada de Inteligência GPT já está engatilhada.</p>
        </div>
    `;

    document.getElementById('btn-activate').style.display = 'none';
}

initPage();
