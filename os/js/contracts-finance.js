import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';

async function initFinance() {
    const user = await OS_AUTH.check('ADMIN');
    if (!user) return;

    OS_UI.renderSidebar('contracts-finance', user.role);
    await OS_UI.renderTopbar();

    await loadFinanceData();

    document.getElementById('btn-sync-finance').onclick = loadFinanceData;

    // Ativar auto-preenchimento inteligente de escopo e preço para Serviços Extras
    const selectExtra = document.getElementById('edit-extra-type');
    if (selectExtra) {
        selectExtra.addEventListener('change', () => {
            const val = selectExtra.value;
            const extraValField = document.getElementById('edit-extra-value');
            const extraDescField = document.getElementById('edit-extra-desc');
            
            const SERVICES_CATALOG = {
                "[FluxAI] Gravação / Captação Audiovisual": {
                    value: 400,
                    desc: "Captação presencial (até 4h de gravação) com equipamento profissional de áudio e vídeo, direção de cena para gravação de Reels e captação de materiais institucionais brutas."
                },
                "[FluxAI] Produção de Reels Extra (Unidade)": {
                    value: 100,
                    desc: "Roteirização técnica de 1 Reels extra (incluindo gancho forte, copy fluida e CTA clara), edição dinâmica premium com cortes precisos, legendas animadas sincronizadas e inserção de efeitos sonoros."
                },
                "[FluxAI] Produção de Carrosséis Extra (Unidade)": {
                    value: 80,
                    desc: "Pesquisa de pauta, roteiro em slides (até 8 slides) focado em storytelling, design visual premium corporativo sob a identidade da marca, criação de legenda de alta retenção e capa atraente."
                },
                "[FluxAI] Apresentação Comercial / Pitch Deck": {
                    value: 500,
                    desc: "Estruturação de narrativa de vendas (Pitch), design de apresentação corporativa premium (até 12 slides) no Canva ou PDF, diagramação limpa, focada em conversão para empresas e parceiros locais."
                },
                "[FluxAI] Branding & Identidade Visual Express": {
                    value: 1200,
                    desc: "Criação de logotipo principal, submark, paleta de cores institucional estratégica, tipografias recomendadas, manual básico de aplicação da marca e templates editáveis para posts e stories."
                },
                "[FluxAI] Gestão de Anúncios Meta Ads": {
                    value: 600,
                    desc: "Criação de conta de anúncios/gerenciador de negócios, configuração de pixel de rastreamento, pesquisa de público-alvo qualificado regional, criação de 2 campanhas de anúncios (Tráfego/Mensagens) e relatório quinzenal."
                },
                "[FluxAI Labs] Automação de Processos (Make / n8n)": {
                    value: 800,
                    desc: "Desenvolvimento de fluxos automatizados integrando WhatsApp, Planilhas, CRM e Email. Inclui tratamento de erros, webhook instantâneo, otimização de execução de tarefas e até 3 integrações ativas."
                },
                "[FluxAI Labs] Landing Page (LP) de Alta Conversão": {
                    value: 1500,
                    desc: "Criação de Landing Page com design premium responsivo, copy com técnicas de copywriting/venda, integração com WhatsApp ou formulários, pixel do Meta/Google instalado, SEO básico e hospedagem otimizada."
                },
                "[FluxAI Labs] Site Institucional Completo": {
                    value: 2500,
                    desc: "Desenvolvimento de site institucional estruturado em seções (Home, Sobre, Serviços, Depoimentos, Contato), design exclusivo, blog interno básico, otimização de velocidade, SEO On-Page avançado e integradores de contato."
                },
                "[FluxAI Labs] Arquitetura de CRM & Pipeline de Vendas": {
                    value: 900,
                    desc: "Estruturação completa de pipeline de funil de vendas (Prospecção, Qualificação, Apresentação, Fechamento) no CRM, automação de etapas para envio de propostas, tags e treinamento de equipe operacional."
                },
                "[FluxAI Labs] Chatbot de IA & Agente de Triagem": {
                    value: 1200,
                    desc: "Treinamento de agente inteligente de Inteligência Artificial para qualificar e realizar a triagem inicial de leads no WhatsApp ou Instagram Direct, integrado a banco de respostas do profissional."
                },
                "[FluxAI Labs] Dashboard de Analytics Personalizado": {
                    value: 1000,
                    desc: "Modelagem de dados operacionais e financeiros, integração com fontes de dados (Meta Ads/Google Sheets), gráficos iterativos corporativos no Looker Studio ou FluxAI OS Engine."
                }
            };
            
            if (val && SERVICES_CATALOG[val]) {
                extraValField.value = SERVICES_CATALOG[val].value;
                extraDescField.value = SERVICES_CATALOG[val].desc;
            } else {
                extraValField.value = '';
                extraDescField.value = '';
            }
        });
    }
}

async function loadFinanceData() {
    const supabase = getSupabase();
    
    if (supabase) {
        try {
            const { data: contracts, error: cErr } = await supabase.from('contracts').select('*').order('created_at', { ascending: false });
            const { data: payments, error: pErr } = await supabase.from('payments').select('*, contracts(client_name, company_name, project_id)').order('due_date', { ascending: true });

            if (cErr || pErr) throw cErr || pErr;

            const activeContracts = contracts || [];
            const activePayments = payments || [];

            renderStats(activeContracts, activePayments);
            renderPayments(activePayments);
            renderContracts(activeContracts);
            renderContractHealth(activeContracts, activePayments);
            renderOperationalAlerts(activeContracts, activePayments);
            return;
        } catch (error) {
            console.warn('[FINANCE] Erro na API do Supabase. Carregando Dados Simulados Premium.', error);
        }
    }

    // SUPABASE OFFLINE OU RETORNOU ERRO -> USAR DADOS SIMULADOS DO LOCALSTORAGE PARA FIDELIDADE PREMIUM
    const now = new Date();
    const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 5);
    
    // Inicializar mockProjects no localStorage para persistência cadastral
    let mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects'));
    if (mockProjects && mockProjects[1] && (!mockProjects[1].digital_infrastructure?.operational_links?.canva || !mockProjects[1].digital_infrastructure.operational_links.canva.includes('folders'))) {
        mockProjects = null;
    }
    if (!mockProjects || !mockProjects[0] || !mockProjects[0].metadata || !mockProjects[0].metadata.dna) {
        mockProjects = [
            { 
                id: "p_c1", 
                company_name: "Maria Aparecida Nutricionista & Consultora Alimentar",
                segment: "Nutrição Clínica + Consultoria Alimentar",
                digital_infrastructure: {
                    operational_links: {
                        instagram: "https://www.instagram.com/mariaaparecida.nutri",
                        website: "",
                        canva: "https://drive.google.com/drive/folders/1K__Y4QTCfJ_4cnr54iocJyhFEDsPa5iZ?usp=drive_link",
                        drive: "https://drive.google.com/drive/folders/14stjSxP6piUM2w0gFmRS-v9H2zjFIE0P?usp=drive_link",
                        whatsapp: "5582993051282"
                    }
                },
                metadata: {
                    dna: {
                        desired_patterns: ["Alimentação Real", "Rotina Prática", "Saúde Sustentável", "Orientação Humanizada"],
                        anti_patterns: ["Terrorismo Nutricional", "Estética Fitness Genérica", "Promessas Milagrosas", "Sensacionalismo", "Antes e Depois Proibido", "Publicidade Antiética"],
                        forbidden_themes: "Promessas de emagrecimento rápido, antes e depois, propaganda irregular, terrorismo nutricional, associação indevida com marcas, publicidade antiética, discurso alarmista, recomendações irresponsáveis"
                    },
                    tone_of_voice: "Humano, técnico, confiável, acolhedor, sofisticado, claro, sem terrorismo alimentar, sem radicalismo",
                    strategic_roadmap: {
                        semana_1: "organização estratégica, alinhamento da marca, análise do Instagram, definição de pilares editoriais, definição da linguagem visual, alinhamento ético CFN",
                        semana_2: "primeiros conteúdos, construção de autoridade, otimização de bio, organização editorial, início da percepção premium",
                        semana_3: "fortalecimento regional, conteúdo educativo estratégico, conteúdo humanizado, aproximação com empresas locais, estruturação de narrativa profissional",
                        semana_4: "análise de métricas, ajustes de posicionamento, melhoria de retenção, consolidação da presença digital, evolução da autoridade"
                    },
                    cfn_rules: "Respeito ético profissional, comunicação responsável, ausência de promessas milagrosas, ausência de sensacionalismo, ausência de publicidade irregular, ausência de associação inadequada com marcas/suplementos, comunicação humanizada e técnica, valorização da autonomia alimentar, posicionamento profissional premium."
                }
            },
            { 
                id: "p_c2", 
                company_name: "Alves Odonto Premium",
                segment: "Odontologia de Alta Performance",
                digital_infrastructure: {
                    operational_links: {
                        instagram: "https://www.instagram.com/alves.odonto",
                        website: "https://alvesodontologia.com.br",
                        canva: "https://drive.google.com/drive/folders/1K__Y4QTCfJ_4cnr54iocJyhFEDsPa5iZ?usp=drive_link",
                        drive: "https://drive.google.com/drive/folders/14stjSxP6piUM2w0gFmRS-v9H2zjFIE0P?usp=drive_link",
                        whatsapp: "5582993051282"
                    }
                },
                metadata: {
                    dna: {
                        desired_patterns: ["Estética Natural", "Alta Performance Oral", "Tecnologia 3D", "Confiança Premium", "Atendimento Humanizado de Alta Performance"],
                        anti_patterns: ["Amadorismo Comercial", "Preços Populares Populistas", "Promessas Indevidas de Indolor", "Venda Agressiva Irresponsável", "Exposição de Pacientes Fora das Normas CRO"],
                        forbidden_themes: "Propaganda de tratamento indolor sem base científica, promessas de resultados estéticos milagrosos imediatos, fotos antes e depois depreciativas, descontos agressivos na saúde, mercantilização odontológica"
                    },
                    tone_of_voice: "Altamente profissional, sofisticado, elite, acolhedor, limpo, científico, preciso e de alta credibilidade",
                    strategic_roadmap: {
                        semana_1: "organização estratégica, alinhamento da marca premium, análise das diretrizes CRO locais, definição dos pilares de tecnologia, alinhamento visual de excelência clínica",
                        semana_2: "primeiros conteúdos de bastidores, construção de autoridade clínica, depoimentos qualificados, humanização da equipe médica, início da percepção de valor elite",
                        semana_3: "fortalecimento regional de credibilidade, demonstração prática da tecnologia 3D, conteúdo educativo preventivo premium, consolidação de diferenciais estéticos",
                        semana_4: "análise detalhada de performance, ajustes estratégicos de captação de pacientes, melhoria do agendamento direto, evolução da percepção de alta performance"
                    },
                    cfn_rules: "Respeito ético estrito às diretrizes do CRO (Conselho Regional de Odontologia), sem sensacionalismo ou mercantilização da saúde bucal, valorização da ciência, diagnósticos reais e integridade profissional."
                }
            },
            { 
                id: "p_c3", 
                company_name: "Apex Educacional",
                segment: "Educação Executiva de Elite",
                digital_infrastructure: {
                    operational_links: {
                        instagram: "https://www.instagram.com/instituto.apex",
                        website: "https://apexeducacional.com.br",
                        canva: "https://drive.google.com/drive/folders/1K__Y4QTCfJ_4cnr54iocJyhFEDsPa5iZ?usp=drive_link",
                        drive: "https://drive.google.com/drive/folders/14stjSxP6piUM2w0gFmRS-v9H2zjFIE0P?usp=drive_link",
                        whatsapp: "5582993051282"
                    }
                },
                metadata: {
                    dna: {
                        desired_patterns: ["Educação Executiva Avançada", "Networking Corporativo de Elite", "Escala de Times e Liderança", "Alta LTV e Retenção Corporativa"],
                        anti_patterns: ["Linguagem de Cursos Baratos Promocionais", "Fórmulas Mágicas de Enriquecimento Rápido", "Amadorismo Pedagógico", "Gatilhos Mentais Enganosos e Agressivos"],
                        forbidden_themes: "Esquemas de enriquecimento rápido, hacks genéricos de carreira, promessas irreais de faturamento empresarial sem embasamento sólido, gírias excessivas e informais"
                    },
                    tone_of_voice: "Executivo, altamente qualificado, afiado, autoritário com embasamento, educativo de excelência, analítico, inspirador e confiável",
                    strategic_roadmap: {
                        semana_1: "organização estratégica e alinhamento de posicionamento de elite, mapeamento de dores executivas, definição de paleta visual sóbria corporativa",
                        semana_2: "primeiros conteúdos estratégicos de gestão, construção de autoridade institucional, demonstração de depoimentos e cases corporativos de alto impacto",
                        semana_3: "fortalecimento de networking e ecossistema, publicação de estudos de caso reais de grandes corporações, conteúdo avançado de tomada de decisão executiva",
                        semana_4: "análise de métricas corporativas, otimização de conversão de turmas de alta LTV, captação estratégica B2B, consolidação do posicionamento de referência nacional"
                    },
                    cfn_rules: "Integridade educacional avançada, conformidade absoluta com as melhores práticas de ensino corporativo nacional, respeito ao desenvolvimento ético de lideranças empresariais."
                }
            }
        ];
        localStorage.setItem('fluxai_mock_projects', JSON.stringify(mockProjects));
    }

    // Inicializar mockContracts no localStorage para persistência interativa
    let mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts'));
    if (!mockContracts || (mockContracts[0] && mockContracts[0].client_name === "Maria Aparecida")) {
        mockContracts = [
            { id: "c1", project_id: "p_c1", client_name: "Maria Aparecida da Silva", company_name: "Maria Aparecida Nutricionista & Consultora Alimentar", deliverables: "2 carrosséis + 2 reels/mês", contract_value: 800, status: "ATIVO", created_at: "2026-05-10T00:00:00Z", due_day: 5 },
            { id: "c2", project_id: "p_c2", client_name: "Dr. Roberto Alves", company_name: "Alves Odonto Premium", deliverables: "Gestão de Tráfego + CRM", contract_value: 5000, status: "ATIVO", created_at: "2025-03-15T00:00:00Z", due_day: 15 },
            { id: "c3", project_id: "p_c3", client_name: "Instituto Apex", company_name: "Apex Educacional", deliverables: "Governança Full-Stack", contract_value: 8500, status: "ATIVO", created_at: "2024-11-20T00:00:00Z", due_day: 10 }
        ];
        localStorage.setItem('fluxai_mock_contracts', JSON.stringify(mockContracts));
    }

    // Inicializar mockPayments no localStorage para persistência interativa
    let mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments'));
    if (!mockPayments) {
        mockPayments = [
            { id: "p1", contract_id: "c1", amount_due: 800, due_date: "2026-06-04T00:00:00Z", status: "PAGO", payment_method: "Pix" },
            { id: "p2", contract_id: "c2", amount_due: 5000, due_date: nextWeek.toISOString(), status: "PENDENTE", payment_method: "Boleto" },
            { id: "p3", contract_id: "c3", amount_due: 8500, amount_paid: 8500, due_date: "2026-05-10T00:00:00Z", status: "PAGO", payment_method: "Pix" }
        ];
        localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));
    }

    // Vincular referências
    mockPayments.forEach(p => {
        p.contracts = mockContracts.find(c => c.id === p.contract_id);
        if (p.contracts) {
            p.contracts.projects = mockProjects.find(pr => pr.id === p.contracts.project_id);
        }
    });

    renderStats(mockContracts, mockPayments);
    renderPayments(mockPayments);
    renderContracts(mockContracts);
    renderContractHealth(mockContracts, mockPayments);
    renderOperationalAlerts(mockContracts, mockPayments);
}

function renderStats(contracts, payments) {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const isFluxAI = (name) => name && name.toLowerCase().includes('fluxai');

    const totalExpected = payments.reduce((acc, p) => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return acc;
        return acc + Number(p.amount_due || 0);
    }, 0);
    const totalPaid = payments.reduce((acc, p) => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return acc;
        return acc + Number(p.amount_paid || 0);
    }, 0);
    const totalPending = totalExpected - totalPaid;
    
    const activeCount = contracts.filter(c => c.status === 'ATIVO' && !isFluxAI(c.company_name) && !isFluxAI(c.client_name)).length;
    const totalContractValue = contracts.reduce((acc, c) => {
        if (isFluxAI(c.company_name) || isFluxAI(c.client_name)) return acc;
        return acc + Number(c.contract_value || 0);
    }, 0);
    const avgTicket = activeCount > 0 ? (totalContractValue / activeCount) : 0;
    
    const nextDue = payments.filter(p => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return false;
        const d = new Date(p.due_date);
        return p.status !== 'PAGO' && d >= now && d <= sevenDaysFromNow;
    }).length;

    const riskRevenue = payments.reduce((acc, p) => {
        if (isFluxAI(p.contracts?.company_name) || isFluxAI(p.contracts?.client_name)) return acc;
        const d = new Date(p.due_date);
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return (p.status !== 'PAGO' && diff > 5) ? acc + Number(p.amount_due) : acc;
    }, 0);

    document.getElementById('total-expected').innerText = formatCurrency(totalExpected);
    document.getElementById('total-paid').innerText = formatCurrency(totalPaid);
    document.getElementById('total-pending').innerText = formatCurrency(totalPending);
    document.getElementById('active-contracts-count').innerText = activeCount;
    document.getElementById('avg-ticket').innerText = formatCurrency(avgTicket);
    document.getElementById('next-due-count').innerText = nextDue;
    document.getElementById('revenue-at-risk').innerText = formatCurrency(riskRevenue);
}

function renderPayments(payments) {
    const body = document.getElementById('payments-body');
    const now = new Date();
    
    body.innerHTML = payments.map(p => {
        const dueDate = new Date(p.due_date);
        const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        const isPaid = p.status === 'PAGO';
        
        let delayText = '';
        let delayClass = '';
        
        if (isPaid) {
            delayText = 'Liquidado';
            delayClass = 'color: var(--os-success); font-weight: 700;';
        } else if (diffDays < 0) {
            delayText = `${Math.abs(diffDays)}d atraso`;
            delayClass = 'color: var(--os-danger); font-weight: 700;';
        } else if (diffDays === 0) {
            delayText = 'Vence Hoje';
            delayClass = 'color: var(--os-info); font-weight: 800;';
        } else {
            delayText = `em ${diffDays} dias`;
            delayClass = 'color: var(--os-text-muted);';
        }

        const statusClass = p.status === 'PAGO' ? 'status-pago' : (diffDays < 0 ? 'status-atrasado' : 'status-pendente');

        return `
            <tr>
                <td>
                    <div style="font-weight: 700;">${p.contracts?.client_name || 'Desconhecido'}</div>
                    <div style="font-size: 0.7rem; color: var(--os-text-muted);">${p.contracts?.company_name || ''}</div>
                </td>
                <td style="font-family: var(--os-font-mono); font-weight: 600;">${formatCurrency(p.amount_due)}</td>
                <td>${dueDate.toLocaleDateString('pt-BR')}</td>
                <td style="font-size: 0.7rem; text-transform: uppercase;">${p.payment_method || 'Pix'}</td>
                <td><span class="status-badge ${statusClass}">${p.status}</span></td>
                <td style="${delayClass} font-size: 0.75rem;">${delayText}</td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        ${!isPaid ? `
                            <button class="btn-mini btn-whatsapp" title="Lembrar WhatsApp" onclick="window.sendWhatsAppBilling('${p.id}')">
                                <i class="fa-brands fa-whatsapp"></i>
                            </button>
                            <button class="btn-mini" title="Marcar Recebido" onclick="window.markAsPaid('${p.id}', ${p.amount_due})">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        ` : `
                             <button class="btn-mini" title="Gerar Recibo"><i class="fa-solid fa-file-invoice"></i></button>
                        `}
                        <button class="btn-mini" title="Abrir Contrato" onclick="window.generateContractDoc('${p.contract_id}')">
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button class="btn-mini" title="Abrir Workspace" onclick="window.open('/os/content-engine.html?project=${p.contracts?.project_id}', '_blank')">
                            <i class="fa-solid fa-briefcase"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.attachReceipt = async (paymentId) => {
    const url = prompt('Cole o link do comprovante aqui:');
    if (!url) return;

    const supabase = getSupabase();
    const { error } = await supabase.from('payments').update({ receipt_url: url }).eq('id', paymentId);
    
    if (error) {
        alert('Erro ao anexar: ' + error.message);
    } else {
        alert('Comprovante anexado com sucesso!');
        loadFinanceData();
    }
};

function renderContracts(contracts) {
    const body = document.getElementById('contracts-body');
    body.innerHTML = contracts.map(c => {
        const startDate = new Date(c.created_at).toLocaleDateString('pt-BR');
        const renewalDate = new Date(new Date(c.created_at).setMonth(new Date(c.created_at).getMonth() + 6)).toLocaleDateString('pt-BR');

        const val = c.contract_value;
        const deliverables = c.deliverables || 'N/A';
        
        let deliverablesHtml = deliverables;
        if (deliverables.includes('[EXTRA]')) {
            const parts = deliverables.split('[EXTRA]:');
            const baseDeliverables = parts[0].trim();
            const extraDetails = parts.slice(1).join('[EXTRA]:').trim();
            deliverablesHtml = `
                <div style="font-weight: 500;">${baseDeliverables.replace(/\n/g, '<br>')}</div>
                <div style="margin-top: 6px; display: inline-flex; align-items: center; gap: 6px; background: rgba(142, 158, 104, 0.12); border: 1px dashed var(--os-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; color: #fff; line-height: 1.2;">
                    <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--os-primary); font-size: 0.65rem;"></i>
                    <span><strong>EXTRA:</strong> ${extraDetails}</span>
                </div>
            `;
        } else {
            deliverablesHtml = `<div style="font-weight: 500;">${deliverables.replace(/\n/g, '<br>')}</div>`;
        }

        return `
            <tr>
                <td>
                    <div style="font-weight: 700;">${c.company_name}</div>
                    <div style="font-size: 0.7rem; color: var(--os-text-muted);">${c.client_name}</div>
                </td>
                <td style="font-size: 0.7rem; font-weight: 700; color: var(--os-primary);">ENGENHARIA DE CONTEÚDO</td>
                <td style="font-size: 0.75rem;">${deliverablesHtml}</td>
                <td style="font-family: var(--os-font-mono); font-weight: 600;">${formatCurrency(val)}</td>
                <td><span class="status-badge" style="background: rgba(255,255,255,0.05);">${c.status}</span></td>
                <td>${startDate}</td>
                <td>${renewalDate}</td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <a href="/os/workspace.html?project=${c.project_id}" class="btn-mini" style="display:inline-flex; align-items:center; justify-content:center; text-decoration:none;" title="Ver Workspace Cliente">
                            <i class="fa-solid fa-briefcase"></i>
                        </a>
                        <button class="btn-mini" title="Abrir Contrato" onclick="window.generateContractDoc('${c.id}')">
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button class="btn-mini" title="Editar" onclick="window.editContract('${c.id}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Helpers de Resiliência de Cadastro & Links Operacionais
function getProjectLinks(project) {
    if (!project) return {};
    return project.links || 
           project.digital_infrastructure?.operational_links || 
           project.metadata?.digital_infrastructure?.operational_links || 
           {};
}

function updateProjectLinks(project, updatedLinks) {
    if (!project) return {};
    
    project.links = updatedLinks;
    
    if (!project.digital_infrastructure) {
        project.digital_infrastructure = {};
    }
    project.digital_infrastructure.operational_links = updatedLinks;
    
    if (!project.metadata) {
        project.metadata = {};
    }
    if (!project.metadata.digital_infrastructure) {
        project.metadata.digital_infrastructure = {};
    }
    project.metadata.digital_infrastructure.operational_links = updatedLinks;
    
    return project;
}

// Controle de Abas do Modal
window.switchTab = (tabName) => {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-content-section');
    
    tabs.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    sections.forEach(sec => {
        if (sec.id === `tab-content-${tabName}`) {
            sec.style.display = 'block';
        } else {
            sec.style.display = 'none';
        }
    });
};

window.closeEditContractModal = () => {
    document.getElementById('edit-contract-modal').style.display = 'none';
};

window.editContract = async (contractId) => {
    const supabase = getSupabase();
    let c = null;

    if (supabase && !contractId.startsWith('c')) {
        try {
            const { data } = await supabase.from('contracts').select('*').eq('id', contractId).single();
            c = data;
        } catch (e) {
            console.warn('[FINANCE] Erro ao buscar no Supabase. Buscando nos mocks.', e);
        }
    }

    if (!c) {
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        c = mockContracts.find(x => x.id === contractId);
    }

    if (!c) {
        alert('Contrato não encontrado.');
        return;
    }

    // Buscar projeto correspondente para obter links e segmentos
    let project = null;
    if (supabase && c.project_id && !c.project_id.startsWith('p_')) {
        try {
            const { data } = await supabase.from('projects').select('*').eq('id', c.project_id).single();
            project = data;
        } catch (e) {
            console.warn('[FINANCE] Erro ao buscar projeto no Supabase. Buscando nos mocks.', e);
        }
    }

    if (!project && c.project_id) {
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        project = mockProjects.find(x => x.id === c.project_id);
    }

    // Preencher campos recorrentes
    document.getElementById('edit-contract-id').value = c.id;
    document.getElementById('edit-project-id').value = c.project_id || '';
    document.getElementById('edit-monthly-fee').value = c.contract_value;
    document.getElementById('edit-payment-day').value = c.due_day || 5;
    document.getElementById('edit-contract-deliverables').value = c.deliverables || '';

    // Limpar campos extras (evitar manter entradas anteriores)
    document.getElementById('edit-extra-type').value = '';
    document.getElementById('edit-extra-value').value = '';
    document.getElementById('edit-extra-desc').value = '';

    // Preencher campos de cadastro
    document.getElementById('edit-brand-name').value = project ? project.company_name : (c.company_name || '');
    document.getElementById('edit-brand-segment').value = project ? (project.segment || '') : '';

    const links = getProjectLinks(project);
    document.getElementById('edit-link-instagram').value = links.instagram || '';
    document.getElementById('edit-link-whatsapp').value = links.whatsapp || '';
    document.getElementById('edit-link-drive').value = links.drive || '';
    document.getElementById('edit-link-canva').value = links.canva || '';
    document.getElementById('edit-link-website').value = links.website || '';

    // Exibir o modal
    document.getElementById('edit-contract-modal').style.display = 'flex';
    window.switchTab('contrato'); // Começa focado nos dados do Contrato
};

window.saveContractEdit = async () => {
    const contractId = document.getElementById('edit-contract-id').value;
    const projectId = document.getElementById('edit-project-id').value;
    
    const monthlyFee = Number(document.getElementById('edit-monthly-fee').value);
    const paymentDay = Number(document.getElementById('edit-payment-day').value);
    let deliverables = document.getElementById('edit-contract-deliverables').value;

    const brandName = document.getElementById('edit-brand-name').value;
    const brandSegment = document.getElementById('edit-brand-segment').value;

    // Extra / Avulso
    const extraType = document.getElementById('edit-extra-type').value;
    const extraValue = Number(document.getElementById('edit-extra-value').value) || 0;
    const extraDesc = document.getElementById('edit-extra-desc').value;

    // Links
    const updatedLinks = {
        instagram: document.getElementById('edit-link-instagram').value,
        whatsapp: document.getElementById('edit-link-whatsapp').value,
        drive: document.getElementById('edit-link-drive').value,
        canva: document.getElementById('edit-link-canva').value,
        website: document.getElementById('edit-link-website').value
    };

    // Caso haja um serviço extra válido, anexa ao escopo
    let extraAdded = false;
    if (extraValue > 0 && extraType) {
        deliverables += `\n[EXTRA]: ${extraType} - ${extraDesc}`;
        extraAdded = true;
    }

    const supabase = getSupabase();

    if (supabase && !contractId.startsWith('c')) {
        try {
            // 1. Atualizar o Contrato recorrente
            const { error: cErr } = await supabase.from('contracts').update({
                contract_value: monthlyFee,
                deliverables: deliverables,
                due_day: paymentDay,
                company_name: brandName
            }).eq('id', contractId);

            if (cErr) throw cErr;

            // 2. Atualizar o Cadastro & Links no Projeto
            if (projectId) {
                const { data: existingProject } = await supabase.from('projects').select('*').eq('id', projectId).single();
                
                let updatedProj = updateProjectLinks(existingProject || {}, updatedLinks);
                updatedProj.company_name = brandName;
                updatedProj.segment = brandSegment;

                const { error: pErr } = await supabase.from('projects').update(updatedProj).eq('id', projectId);
                if (pErr) throw pErr;
            }

            // 3. Se houver serviço extra, cria um faturamento imediato pendente para hoje
            if (extraAdded) {
                const { error: payErr } = await supabase.from('payments').insert([{
                    contract_id: contractId,
                    amount_due: extraValue,
                    due_date: new Date().toISOString(),
                    status: 'PENDENTE',
                    payment_method: 'Pix'
                }]);
                if (payErr) throw payErr;
                
                await logAction(`Extra lançado: ${extraType} (R$ ${extraValue})`, contractId);
            }

            await logAction('Contrato e cadastro atualizados via modal premium de governança', contractId);
            alert('Atualizações gravadas no Supabase com sucesso!');
        } catch (error) {
            alert('Erro ao salvar no banco de dados: ' + error.message);
            return;
        }
    } else {
        // MOCK PERSISTENCE (Resiliência offline localStorage)
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');

        // 1. Atualizar o Contrato nos mocks
        const cIdx = mockContracts.findIndex(x => x.id === contractId);
        if (cIdx !== -1) {
            mockContracts[cIdx].contract_value = monthlyFee;
            mockContracts[cIdx].deliverables = deliverables;
            mockContracts[cIdx].due_day = paymentDay;
            mockContracts[cIdx].company_name = brandName;
            localStorage.setItem('fluxai_mock_contracts', JSON.stringify(mockContracts));
        }

        // 2. Atualizar Projeto nos mocks
        const pIdx = mockProjects.findIndex(x => x.id === projectId);
        if (pIdx !== -1) {
            mockProjects[pIdx].company_name = brandName;
            mockProjects[pIdx].segment = brandSegment;
            updateProjectLinks(mockProjects[pIdx], updatedLinks);
            localStorage.setItem('fluxai_mock_projects', JSON.stringify(mockProjects));
        } else if (projectId) {
            const newProj = {
                id: projectId,
                company_name: brandName,
                segment: brandSegment
            };
            updateProjectLinks(newProj, updatedLinks);
            mockProjects.push(newProj);
            localStorage.setItem('fluxai_mock_projects', JSON.stringify(mockProjects));
        }

        // 3. Atualizar faturamentos recorrentes em aberto para refletir novo valor se mudou
        mockPayments.forEach(p => {
            if (p.contract_id === contractId && p.status !== 'PAGO' && !p.id.includes('extra')) {
                p.amount_due = monthlyFee;
            }
        });

        // 4. Se adicionou serviço extra, lança lançamento avulso para hoje
        if (extraAdded) {
            const newPayment = {
                id: 'p_extra_' + Date.now(),
                contract_id: contractId,
                amount_due: extraValue,
                due_date: new Date().toISOString(),
                status: 'PENDENTE',
                payment_method: 'Pix'
            };
            mockPayments.push(newPayment);
        }

        localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));
        alert('Contrato e cadastro atualizados localmente com sucesso!');
    }

    window.closeEditContractModal();
    loadFinanceData();
};

window.sendWhatsAppBilling = async (paymentId) => {
    const supabase = getSupabase();
    let p = null;
    let whatsapp = '';

    if (supabase && !paymentId.startsWith('p')) {
        try {
            const { data } = await supabase.from('payments').select('*, contracts(client_name, company_name, project_id)').eq('id', paymentId).single();
            p = data;
            if (p) {
                const { data: project } = await supabase.from('projects').select('*').eq('id', p.contracts.project_id).single();
                const links = getProjectLinks(project);
                whatsapp = links.whatsapp || '';
            }
        } catch (e) {
            console.warn(e);
        }
    }

    if (!p) {
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        p = mockPayments.find(x => x.id === paymentId);
        if (p) {
            p.contracts = mockContracts.find(c => c.id === p.contract_id);
            const project = mockProjects.find(pr => pr.id === p.contracts?.project_id);
            const links = getProjectLinks(project);
            whatsapp = links.whatsapp || '5511999999999';
        }
    }

    if (!p) return;

    const msg = `Olá, ${p.contracts.client_name}. Tudo bem?\n\nPassando para lembrar que o pagamento referente ao serviço na FluxAI OS™ vence em ${new Date(p.due_date).toLocaleDateString('pt-BR')}, no valor de ${formatCurrency(p.amount_due)}.\n\nQualquer dúvida, fico à disposição.`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.markAsPaid = async (paymentId, amount) => {
    const method = prompt('Forma de Pagamento (Pix, Cartão, Boleto, etc):', 'Pix');
    if (!method) return;

    const receipt = prompt('Link do Comprovante (opcional):', '');

    const supabase = getSupabase();
    if (supabase && !paymentId.startsWith('p')) {
        try {
            const { error } = await supabase.from('payments').update({
                status: 'PAGO',
                amount_paid: amount,
                payment_method: method,
                receipt_url: receipt,
                paid_at: new Date().toISOString()
            }).eq('id', paymentId);

            if (error) throw error;
            await logAction(`Pagamento registrado via ${method}`, paymentId);
            loadFinanceData();
        } catch (error) {
            alert('Erro ao registrar pagamento: ' + error.message);
        }
    } else {
        // Mock update
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const idx = mockPayments.findIndex(p => p.id === paymentId);
        if (idx !== -1) {
            mockPayments[idx].status = 'PAGO';
            mockPayments[idx].amount_paid = amount;
            mockPayments[idx].payment_method = method;
            mockPayments[idx].receipt_url = receipt;
            mockPayments[idx].paid_at = new Date().toISOString();
            localStorage.setItem('fluxai_mock_payments', JSON.stringify(mockPayments));
            alert('Pagamento registrado localmente!');
            loadFinanceData();
        }
    }
};

window.generateContractDoc = (id) => {
    window.open(`/os/contract-view.html?id=${id}`, '_blank');
};

function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function renderContractHealth(contracts, payments) {
    const body = document.getElementById('health-body');
    if (!body) return;
    const now = new Date();

    body.innerHTML = contracts.map(c => {
        const cPayments = payments.filter(p => p.contract_id === c.id);
        const hasLate = cPayments.some(p => p.status !== 'PAGO' && new Date(p.due_date) < now);
        
        let health = 'Saudável';
        let healthClass = 'health-saudavel';
        let finRisk = 'Nulo';
        let opRisk = 'Baixo';
        let nextAction = 'Manter planejamento mensal e revisar próxima rodada';

        if (hasLate) {
            health = 'Atenção';
            healthClass = 'health-atencao';
            finRisk = 'Moderado';
            nextAction = 'Notificar Financeiro';
        }

        if (c.status !== 'ATIVO') {
            health = 'Encerrado';
            healthClass = 'health-atencao';
            nextAction = 'N/A';
        }

        return `
            <tr>
                <td>${c.client_name}</td>
                <td><span class="health-pill ${healthClass}">${health}</span></td>
                <td style="font-size: 0.7rem; color: ${finRisk === 'Nulo' ? 'var(--os-success)' : 'var(--os-warning)'};">${finRisk}</td>
                <td style="font-size: 0.7rem; color: var(--os-success);">${opRisk}</td>
                <td style="font-size: 0.7rem; color: var(--os-success);">Em Conformidade</td>
                <td style="font-size: 0.75rem; font-weight: 700; color: var(--os-primary);">${nextAction}</td>
            </tr>
        `;
    }).join('');
}

function renderOperationalAlerts(contracts, payments) {
    const container = document.getElementById('alerts-container');
    if (!container) return;
    const now = new Date();
    const alerts = [];

    payments.forEach(p => {
        const d = new Date(p.due_date);
        const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        
        if (p.status !== 'PAGO') {
            if (diff === 1) {
                alerts.push({
                    type: 'warning',
                    title: `Vencimento Próximo: ${p.contracts?.client_name}`,
                    desc: `Pagamento vence amanhã (${d.toLocaleDateString('pt-BR')}). Cobrança automática agendada.`
                });
            } else if (diff < 0) {
                alerts.push({
                    type: 'critical',
                    title: `Pagamento Atrasado: ${p.contracts?.client_name}`,
                    desc: `Atraso de ${Math.abs(diff)} dias detectado. Necessário contato direto.`
                });
            }
        }
    });

    contracts.forEach(c => {
        const renewalDate = new Date(new Date(c.created_at).setMonth(new Date(c.created_at).getMonth() + 6));
        const diff = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
        
        if (diff > 0 && diff < 30) {
            alerts.push({
                type: 'warning',
                title: `Renovação de Contrato: ${c.company_name}`,
                desc: `Vínculo expira em ${diff} dias (${renewalDate.toLocaleDateString('pt-BR')}). Preparar proposta.`
            });
        }
    });

    if (alerts.length === 0) {
        container.innerHTML = '<p style="font-size: 0.8rem; color: var(--os-text-muted); opacity: 0.5;">Nenhum alerta crítico pendente.</p>';
        return;
    }

    container.innerHTML = alerts.map(a => `
        <div class="alert-item ${a.type}">
            <div class="alert-icon" style="color: ${a.type === 'critical' ? 'var(--os-danger)' : 'var(--os-warning)'};">
                <i class="fa-solid ${a.type === 'critical' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i>
            </div>
            <div class="alert-content">
                <h4>${a.title}</h4>
                <p>${a.desc}</p>
            </div>
        </div>
    `).join('');
}

async function logAction(action, targetId) {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    await supabase.from('audit_logs').insert([{
        user_id: session.user.id,
        action: action,
        module: 'finance',
        target_id: targetId
    }]);
}

initFinance();
