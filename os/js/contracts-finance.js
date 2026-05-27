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
            const { data: contracts, error: cErr } = await supabase.from('contracts').select('*, projects(is_billing_exempt)').order('created_at', { ascending: false });
            const { data: payments, error: pErr } = await supabase.from('payments_ledger').select('*, contracts(client_name, company_name, project_id, projects(is_billing_exempt))').order('due_date', { ascending: true });

            if (cErr || pErr) throw cErr || pErr;

            // Filtra removendo os projetos isentos (ex: FluxAI Labs)
            const activeContracts = (contracts || []).filter(c => !c.projects?.is_billing_exempt);
            const activePayments = (payments || []).filter(p => !p.contracts?.projects?.is_billing_exempt);

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
     
    body.replaceChildren();
    payments.forEach(p => { 
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
 
        const tr = document.createElement('tr');
        
        const td1 = document.createElement('td');
        const divClient = document.createElement('div');
        divClient.className = 'safe-client';
        divClient.style.fontWeight = '700';
        divClient.textContent = p.contracts?.client_name || 'Desconhecido';
        const divCompany = document.createElement('div');
        divCompany.className = 'safe-company';
        divCompany.style.cssText = 'font-size: 0.7rem; color: var(--os-text-muted);';
        divCompany.textContent = p.contracts?.company_name || '';
        td1.appendChild(divClient);
        td1.appendChild(divCompany);
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        const healthSpan = document.createElement('span');
        healthSpan.className = `health-pill ${healthClass}`;
        healthSpan.textContent = health;
        td2.appendChild(healthSpan);
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.style.cssText = 'font-size: 0.7rem;';
        td3.style.color = finRisk === 'Nulo' ? 'var(--os-success)' : 'var(--os-warning)';
        td3.textContent = finRisk;
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.style.cssText = 'font-size: 0.7rem; color: var(--os-success);';
        td4.textContent = opRisk;
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        td5.style.cssText = 'font-size: 0.7rem; color: var(--os-success);';
        td5.textContent = 'Em Conformidade';
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.style.cssText = 'font-size: 0.75rem; font-weight: 700; color: var(--os-primary);';
        td6.textContent = nextAction;
        tr.appendChild(td6);

        
        body.appendChild(tr);
    });
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

    container.replaceChildren();
    if (alerts.length === 0) {
        const pNode = document.createElement('p');
        pNode.style.cssText = "font-size: 0.8rem; color: var(--os-text-muted); opacity: 0.5;";
        pNode.textContent = "Nenhum alerta crítico pendente.";
        container.appendChild(pNode);
        return;
    }

    alerts.forEach(a => { 
        const div = document.createElement('div'); 
        div.className = `alert-item ${a.type}`; 
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'alert-icon';
        iconDiv.style.color = a.type === 'critical' ? 'var(--os-danger)' : 'var(--os-warning)';
        
        const iconI = document.createElement('i');
        iconI.className = `fa-solid ${a.type === 'critical' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`;
        iconDiv.appendChild(iconI);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'alert-content';
        
        const titleH4 = document.createElement('h4');
        titleH4.className = 'safe-title';
        titleH4.textContent = a.title;
        
        const descP = document.createElement('p');
        descP.className = 'safe-desc';
        descP.textContent = a.desc;
        
        contentDiv.appendChild(titleH4);
        contentDiv.appendChild(descP);
        
        div.appendChild(iconDiv);
        div.appendChild(contentDiv);
        
        container.appendChild(div); 
    }); 
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
