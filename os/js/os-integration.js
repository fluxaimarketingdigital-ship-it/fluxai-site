/**
 * FLUXAI OS™ — OS INTEGRATION ENGINE v1.0.0
 * Hub central de interligação entre módulos.
 *
 * MÓDULOS CONECTADOS:
 *   Onboarding ──→ [projects, contracts, payments_ledger, content_assets, operational_events]
 *   Serviço Extra ─→ [extra_services_contracts, payments_ledger, content_assets, operational_events]
 *   Financeiro ───→ [payments_ledger, operational_events, active_alerts]
 *   Content Engine → [content_assets, operational_events]
 *   Client Workspace → [content_assets, payments_ledger, extra_services_contracts]
 */

import { getSupabase } from '../services/supabase-client.js';

// ─────────────────────────────────────────────────────────────────
// 1. EVENT SYSTEM — Barramento de Auditoria Operacional
// ─────────────────────────────────────────────────────────────────

/**
 * Dispara um evento operacional para o barramento de auditoria.
 * Grava em operational_events (Supabase) com fallback em localStorage.
 *
 * @param {string} event_type  — Tipo do evento (ex: 'CONTEUDO_APROVADO')
 * @param {string} responsible — Nome/cargo de quem executou
 * @param {string} context     — Descrição legível da ação
 * @param {object} metadata    — Payload técnico correlacionado
 * @param {string} project_id  — ID do projeto afetado (UUID)
 */
export async function dispatchEvent(event_type, responsible, context, metadata = {}, project_id = null) {
    const payload = {
        event_type,
        responsible,
        context,
        metadata,
        project_id,
        created_at: new Date().toISOString()
    };

    // Tenta gravar no Supabase
    const supabase = getSupabase();
    if (supabase && project_id) {
        try {
            await supabase.from('operational_events').insert([payload]);
            return;
        } catch (err) {
            console.warn('[EVENTS] Falha no Supabase, persistindo localmente.', err);
        }
    }

    // Fallback: localStorage
    const local = JSON.parse(localStorage.getItem('fluxai_events') || '[]');
    local.unshift({ ...payload, id: 'evt_' + Date.now() });
    localStorage.setItem('fluxai_events', JSON.stringify(local.slice(0, 200)));
}

/**
 * Busca os últimos eventos de um projeto (Supabase ou localStorage).
 */
export async function getProjectEvents(project_id, limit = 20) {
    const supabase = getSupabase();
    if (supabase && project_id) {
        try {
            const { data } = await supabase
                .from('operational_events')
                .select('*')
                .eq('project_id', project_id)
                .order('created_at', { ascending: false })
                .limit(limit);
            if (data && data.length > 0) return data;
        } catch (err) {
            console.warn('[EVENTS] Fallback local para eventos.', err);
        }
    }
    const local = JSON.parse(localStorage.getItem('fluxai_events') || '[]');
    return local.filter(e => !project_id || e.project_id === project_id).slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────
// 2. FINANCIAL LAYER — Faturamento e Status
// ─────────────────────────────────────────────────────────────────

/**
 * Calcula o status financeiro de uma fatura baseado na data de vencimento.
 * @param {string} due_date — ISO date string
 * @param {string} current_status — status atual no banco
 */
export function calcFinancialStatus(due_date, current_status) {
    if (current_status === 'PAID') return 'PAID';
    if (current_status === 'PAYMENT_UNDER_REVIEW') return 'PAYMENT_UNDER_REVIEW';

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(due_date);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - now) / 86400000);

    if (diffDays < 0) return 'OVERDUE';
    if (diffDays === 0) return 'DUE_TODAY';
    if (diffDays <= 3) return 'UPCOMING_DUE';
    return 'ACTIVE';
}

/**
 * Cria uma fatura na tabela payments_ledger.
 * Usado pelo Onboarding (1ª fatura) e Serviço Extra (fatura avulsa).
 */
export async function createPayment({ contract_id, due_date, amount_due, payment_type = 'RECORRENTE', project_id }) {
    const payload = {
        contract_id,
        due_date,
        amount_due,
        payment_type,
        financial_status: calcFinancialStatus(due_date, 'ACTIVE'),
        pix_copia_e_cola: '45.291.901/0001-88' // chave CNPJ padrão da FluxAI
    };

    const supabase = getSupabase();
    if (supabase) {
        try {
            const { data } = await supabase.from('payments_ledger').insert([payload]).select().single();
            await dispatchEvent('FATURA_GERADA', 'Sistema', `Fatura de R$ ${amount_due} gerada (${payment_type})`, payload, project_id);
            return data;
        } catch (err) {
            console.warn('[FINANCE] Fallback local para pagamentos.', err);
        }
    }

    // Fallback localStorage
    const mock = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
    const newPayment = { id: 'pay_' + Date.now(), ...payload, created_at: new Date().toISOString() };
    mock.push(newPayment);
    localStorage.setItem('fluxai_mock_payments', JSON.stringify(mock));
    return newPayment;
}

// ─────────────────────────────────────────────────────────────────
// 3. EXTRA SERVICES — Operational Linking™
// ─────────────────────────────────────────────────────────────────

/**
 * Mapa de injeção automática de pautas por tipo de serviço extra.
 * Quando um add-on é ativado, o sistema injeta automaticamente
 * pautas específicas no Content Engine do projeto.
 */
const EXTRA_SERVICE_PAUTA_TEMPLATES = {
    GRAVACAO_VIDEO: [
        { title: 'Gravação: Bastidores & Humanização da Marca', status: 'DRAFT_PLANNING', platform: 'INSTAGRAM', priority: 'ALTA', caption: '🎬 HOOK: O que acontece nos bastidores do [EMPRESA]?\n\n💬 FALAS: Mostrar o processo real e humanizado...\n\n✨ CTA: Comente BASTIDORES para receber mais conteúdo como este.' },
        { title: 'Gravação: Depoimento de Cliente Real', status: 'DRAFT_PLANNING', platform: 'INSTAGRAM', priority: 'ALTA', caption: '🎬 HOOK: Esse resultado real mudou tudo para [CLIENTE].\n\n💬 FALAS: Depoimento espontâneo do cliente...\n\n✨ CTA: Agende pelo link da Bio.' },
        { title: 'Gravação: Apresentação de Serviços em Vídeo', status: 'DRAFT_PLANNING', platform: 'INSTAGRAM', priority: 'MÉDIA', caption: '🎬 HOOK: Saiba exatamente como funciona o [SERVIÇO].\n\n💬 FALAS: Apresentação clara e direta do processo...\n\n✨ CTA: Mande uma mensagem para saber mais.' }
    ],
    WEBSITE: [
        { title: '[WEBSITE] Briefing de Identidade Digital', status: 'DRAFT_PLANNING', platform: 'INTERNO', priority: 'ALTA', caption: 'TAREFA INTERNA: Levantar referências visuais, paleta de cores, tipografias e textos-base para o site.' },
        { title: '[WEBSITE] Copywriting das Seções Principais', status: 'DRAFT_PLANNING', platform: 'INTERNO', priority: 'ALTA', caption: 'TAREFA INTERNA: Redigir textos para Home, Sobre, Serviços, Depoimentos e Contato.' }
    ],
    LANDING_PAGE: [
        { title: '[LP] Definição de Oferta e CTA Principal', status: 'DRAFT_PLANNING', platform: 'INTERNO', priority: 'ALTA', caption: 'TAREFA INTERNA: Estruturar a oferta central, proposta de valor e CTA da LP de alta conversão.' }
    ],
    BRANDING: [
        { title: '[BRANDING] Moodboard e Referências Visuais', status: 'DRAFT_PLANNING', platform: 'INTERNO', priority: 'ALTA', caption: 'TAREFA INTERNA: Coletar referências visuais e definir a identidade visual da marca.' }
    ]
};

/**
 * Ativa um serviço extra para um projeto.
 * 1. Registra em extra_services_contracts
 * 2. Cria fatura avulsa em payments_ledger
 * 3. Injeta pautas no Content Engine
 * 4. Dispara evento operacional
 */
export async function activateExtraService({ project_id, contract_id, service_type, service_value, deadline, responsible }) {
    const supabase = getSupabase();

    // 1. Registrar serviço extra
    const servicePayload = { project_id, service_type, service_value, deadline, responsible, workflow_status: 'ATV_PENDENTE' };
    let serviceRecord;

    if (supabase) {
        try {
            const { data } = await supabase.from('extra_services_contracts').insert([servicePayload]).select().single();
            serviceRecord = data;
        } catch (err) {
            console.warn('[EXTRAS] Fallback local.', err);
        }
    }
    if (!serviceRecord) {
        const mock = JSON.parse(localStorage.getItem('fluxai_mock_extras') || '[]');
        serviceRecord = { id: 'ext_' + Date.now(), ...servicePayload, created_at: new Date().toISOString() };
        mock.push(serviceRecord);
        localStorage.setItem('fluxai_mock_extras', JSON.stringify(mock));
    }

    // 2. Criar fatura avulsa
    if (contract_id && service_value > 0) {
        const dueDate = deadline || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
        await createPayment({ contract_id, due_date: dueDate, amount_due: service_value, payment_type: 'EXTRA', project_id });
    }

    // 3. Injetar pautas no Content Engine
    const templates = EXTRA_SERVICE_PAUTA_TEMPLATES[service_type] || [];
    const pautas = templates.map(t => ({ ...t, project_id, metadata: { extra_service_id: serviceRecord.id, version: 'V1', locked: false } }));

    if (pautas.length > 0) {
        if (supabase) {
            try {
                await supabase.from('content_assets').insert(pautas);
            } catch (err) {
                injectPautasLocal(pautas);
            }
        } else {
            injectPautasLocal(pautas);
        }
    }

    // 4. Disparar evento
    await dispatchEvent(
        'SERVICO_EXTRA_ATIVADO',
        responsible || 'Admin FluxAI',
        `Serviço extra "${service_type}" ativado. Valor: R$ ${service_value}. ${pautas.length} pautas injetadas no Content Engine.`,
        { service_type, service_value, deadline, pautas_geradas: pautas.length },
        project_id
    );

    return serviceRecord;
}

function injectPautasLocal(pautas) {
    const mock = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
    pautas.forEach(p => mock.push({ id: 'a_ext_' + Date.now() + crypto.getRandomValues(new Uint32Array(1))[0].toString(36), ...p, created_at: new Date().toISOString() }));
    localStorage.setItem('fluxai_mock_assets', JSON.stringify(mock));
}

// ─────────────────────────────────────────────────────────────────
// 4. ONBOARDING LINKING — Provisiona workspace completo
// ─────────────────────────────────────────────────────────────────

/**
 * Gera as 3 pautas iniciais estratégicas baseadas no nicho e dor do ICP.
 * Chamado no final do Onboarding após criar o projeto.
 */
export function generateInitialPautas(project_id, nicho, dor) {
    const pautas = [
        {
            project_id,
            title: `Autoridade: A Verdade sobre ${dor || 'o Principal Desafio do ' + nicho}`,
            status: 'DRAFT_PLANNING',
            platform: 'INSTAGRAM',
            priority: 'ALTA',
            caption: `🎯 OBJETIVO: Construir autoridade atacando diretamente a dor principal do público.\n\n🎬 HOOK: Você provavelmente está errando em ${dor || 'sua estratégia'} sem perceber.\n\n✨ CTA: Comente SIM se você quer a solução prática.`,
            metadata: { version: 'V1', locked: false, auto_generated: true }
        },
        {
            project_id,
            title: `Educação: Como Resolver ${dor || 'o Maior Problema de ' + nicho} de Verdade`,
            status: 'DRAFT_PLANNING',
            platform: 'INSTAGRAM',
            priority: 'MÉDIA',
            caption: `🎯 OBJETIVO: Educar o público e posicionar a marca como referência de solução.\n\n📋 ESTRUTURA: 3 passos práticos para superar ${dor || 'os desafios de ' + nicho}.\n\n✨ CTA: Salve este post para usar essa semana.`,
            metadata: { version: 'V1', locked: false, auto_generated: true }
        },
        {
            project_id,
            title: `Conexão: Por Que Escolher a ${nicho || 'Nossa Abordagem'}`,
            status: 'DRAFT_PLANNING',
            platform: 'INSTAGRAM',
            priority: 'MÉDIA',
            caption: `🎯 OBJETIVO: Humanizar a marca e gerar conexão emocional com o público local.\n\n💬 FALAS: A história real de como chegamos até aqui e por que fazemos diferente.\n\n✨ CTA: Agende uma consulta pelo link da Bio.`,
            metadata: { version: 'V1', locked: false, auto_generated: true }
        }
    ];
    return pautas;
}

/**
 * Calcula o dia de vencimento da primeira fatura baseado no due_day do contrato.
 */
export function calcFirstDueDate(due_day = 5) {
    const now = new Date();
    const currentDay = now.getDate();
    let dueDate = new Date(now.getFullYear(), now.getMonth(), due_day);
    if (currentDay >= due_day) {
        dueDate = new Date(now.getFullYear(), now.getMonth() + 1, due_day);
    }
    return dueDate.toISOString().split('T')[0];
}

// ─────────────────────────────────────────────────────────────────
// 5. FINANCIAL ALERTS — Checagem de vencimentos
// ─────────────────────────────────────────────────────────────────

/**
 * Retorna o status financeiro atual de um projeto (para exibir no Client Portal).
 * Busca todos os pagamentos pendentes do projeto e retorna o mais urgente.
 */
export async function getProjectFinancialAlert(project_id) {
    let payments = [];

    const supabase = getSupabase();
    if (supabase) {
        try {
            const { data } = await supabase
                .from('payments_ledger')
                .select('*, contracts(project_id, company_name, contract_value)')
                .eq('contracts.project_id', project_id)
                .neq('financial_status', 'PAID')
                .order('due_date', { ascending: true });
            if (data) payments = data;
        } catch (err) { /* fallback abaixo */ }
    }

    if (payments.length === 0) {
        // Fallback: calcular a partir dos mocks
        const mockPayments = JSON.parse(localStorage.getItem('fluxai_mock_payments') || '[]');
        const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
        const projectContracts = mockContracts.filter(c => c.project_id === project_id);
        payments = mockPayments.filter(p =>
            projectContracts.some(c => c.id === p.contract_id) && p.status !== 'PAGO'
        );
    }

    if (payments.length === 0) return null;

    // Retorna o mais urgente
    const urgent = payments[0];
    const status = calcFinancialStatus(urgent.due_date, urgent.financial_status || urgent.status);
    return { ...urgent, financial_status: status };
}

// ─────────────────────────────────────────────────────────────────
// 6. CONTENT ENGINE STATUS HELPERS
// ─────────────────────────────────────────────────────────────────

/**
 * Mapa universal de tradução dos status legados para os 14 estados governativos.
 */
export const STATUS_MAP = {
    // Legados → Novos
    'PLANEJAMENTO': 'DRAFT_PLANNING',
    'RASCUNHO': 'DRAFT_PLANNING',
    'REVISÃO GESTÃO': 'INTERNAL_REVIEW',
    'APROVAÇÃO ESTRATÉGICA': 'INTERNAL_REVIEW',
    'REVISÃO INTERNA': 'INTERNAL_REVISION',
    'APROVAÇÃO PLANEJAMENTO': 'CLIENT_REVIEW_PLANNING',
    'AGUARDANDO APROVAÇÃO': 'CLIENT_REVIEW_PLANNING',
    'AJUSTE': 'CLIENT_REVISION_PLANNING',
    'PLANEJAMENTO APROVADO': 'PLANNING_APPROVED',
    'FILA DE PRODUÇÃO': 'PRODUCTION_QUEUE',
    'EM PRODUÇÃO': 'IN_PRODUCTION',
    'QA INTERNO': 'INTERNAL_QA',
    'APROVAÇÃO FINAL': 'CLIENT_REVIEW_CONTENT',
    'AJUSTE DE PRODUÇÃO': 'CLIENT_REVISION_CONTENT',
    'APROVADO': 'CONTENT_APPROVED',
    'PRONTO': 'READY_TO_POST',
    'AGENDADO': 'READY_TO_POST',
    'PUBLICADO': 'POSTED',
    // Já no novo formato → retorna igual
    'DRAFT_PLANNING': 'DRAFT_PLANNING',
    'INTERNAL_REVIEW': 'INTERNAL_REVIEW',
    'INTERNAL_REVISION': 'INTERNAL_REVISION',
    'CLIENT_REVIEW_PLANNING': 'CLIENT_REVIEW_PLANNING',
    'CLIENT_REVISION_PLANNING': 'CLIENT_REVISION_PLANNING',
    'PLANNING_APPROVED': 'PLANNING_APPROVED',
    'PRODUCTION_QUEUE': 'PRODUCTION_QUEUE',
    'IN_PRODUCTION': 'IN_PRODUCTION',
    'INTERNAL_QA': 'INTERNAL_QA',
    'CLIENT_REVIEW_CONTENT': 'CLIENT_REVIEW_CONTENT',
    'CLIENT_REVISION_CONTENT': 'CLIENT_REVISION_CONTENT',
    'CONTENT_APPROVED': 'CONTENT_APPROVED',
    'READY_TO_POST': 'READY_TO_POST',
    'POSTED': 'POSTED'
};

/** Rótulos visuais dos 14 estados */
export const STATUS_LABELS = {
    DRAFT_PLANNING: 'Rascunho / Pauta',
    INTERNAL_REVIEW: 'Revisão Interna',
    INTERNAL_REVISION: 'Ajuste Interno',
    CLIENT_REVIEW_PLANNING: 'Aprovação do Cliente',
    CLIENT_REVISION_PLANNING: 'Ajuste Solicitado',
    PLANNING_APPROVED: 'Pauta Aprovada',
    PRODUCTION_QUEUE: 'Fila de Produção',
    IN_PRODUCTION: 'Em Produção',
    INTERNAL_QA: 'QA Interno',
    CLIENT_REVIEW_CONTENT: 'Aprovação da Arte',
    CLIENT_REVISION_CONTENT: 'Ajuste de Arte',
    CONTENT_APPROVED: 'Conteúdo Aprovado',
    READY_TO_POST: 'Pronto para Publicar',
    POSTED: 'Publicado'
};

/** Cores CSS por status */
export const STATUS_COLORS = {
    DRAFT_PLANNING: 'rgba(255,255,255,0.15)',
    INTERNAL_REVIEW: 'rgba(245,158,11,0.2)',
    INTERNAL_REVISION: 'rgba(245,158,11,0.3)',
    CLIENT_REVIEW_PLANNING: 'rgba(59,130,246,0.25)',
    CLIENT_REVISION_PLANNING: 'rgba(239,68,68,0.25)',
    PLANNING_APPROVED: 'rgba(16,185,129,0.15)',
    PRODUCTION_QUEUE: 'rgba(142,158,104,0.15)',
    IN_PRODUCTION: 'rgba(245,158,11,0.2)',
    INTERNAL_QA: 'rgba(139,92,246,0.2)',
    CLIENT_REVIEW_CONTENT: 'rgba(59,130,246,0.25)',
    CLIENT_REVISION_CONTENT: 'rgba(239,68,68,0.25)',
    CONTENT_APPROVED: 'rgba(16,185,129,0.2)',
    READY_TO_POST: 'rgba(16,185,129,0.3)',
    POSTED: 'rgba(16,185,129,0.05)'
};

/**
 * Normaliza status legado para o sistema de 14 estados.
 */
export function normalizeStatus(raw) {
    if (!raw) return 'DRAFT_PLANNING';
    return STATUS_MAP[raw.toUpperCase()] || STATUS_MAP[raw] || 'DRAFT_PLANNING';
}
