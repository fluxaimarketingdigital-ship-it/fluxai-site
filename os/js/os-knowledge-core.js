/**
 * FLUXAI OS™ — KNOWLEDGE CORE™ v1.0.0
 * Motor de inteligência contextual por cliente, módulo e operação.
 *
 * Responsabilidades:
 *  1. Manter a Knowledge Base Master da FluxAI (DNA, metodologia, regras)
 *  2. Montar e cachear o contexto operacional por cliente antes de chamar a IA
 *  3. Controlar custo via model routing + cache de respostas
 *  4. Garantir isolamento de dados (um cliente jamais vê contexto de outro)
 *
 * USO:
 *   import { KnowledgeCore } from '/os/js/os-knowledge-core.js';
 *   const ctx = await KnowledgeCore.buildContext({ projectId, module, action });
 *   const result = await KnowledgeCore.ask(ctx, 'GENERATE_CONTENT_PLAN', { ... });
 */

import { getSupabase } from '/os/services/supabase-client.js';
import { OSState } from '/os/js/os-state.js';
import { PROMPT_TEMPLATES, selectModel } from '/os/js/os-prompt-templates.js';
import { VERTICAL_KNOWLEDGE } from '/os/js/os-vertical-knowledge.js';

// ─────────────────────────────────────────────────────────────────
// 1. FLUXAI MASTER KNOWLEDGE BASE
// Base institucional fixa — enviada como system prompt em toda chamada.
// ─────────────────────────────────────────────────────────────────

export const FLUXAI_MASTER_KNOWLEDGE = `
# FluxAI OS™ — Institucional
**Empresa:** FluxAI Labs
**Tipo:** Agência de Marketing Digital e Tecnologia Premium
**Posicionamento:** Infraestrutura operacional de crescimento, conteúdo e inteligência estratégica para marcas locais e especialistas.

## DNA e Metodologia
- Trabalhamos com escopo contratado. Nada sai do contrato sem aprovação financeira.
- Conteúdo é tratado como infraestrutura estratégica, não como postagem isolada.
- Todo planejamento obedece ao workflow de 14 estados do Content Engine™.
- Aprovações são trilaterais: Estratégico (FluxAI) → Operacional (Equipe) → Cliente.
- Versionamento imutável: V1 rejeitada é congelada; V2 é sempre nova entidade.

## Regras Operacionais
- Nenhum conteúdo vai para produção sem aprovação estratégica interna.
- Nenhum conteúdo é publicado sem aprovação do cliente.
- Serviços extras exigem aprovação financeira e briefing específico.
- O cliente visualiza apenas o que é autorizado: aprovações, docs, pagamentos e entregas.
- Dados de clientes são SEMPRE isolados por project_id. Nunca misturar.

## Tom de Voz Institucional da FluxAI
- Técnico, direto, confiável e premium.
- Sem exageros. Sem promessas vazias. Sem linguagem de guru.
- Autoridade técnica com evidência. Resultados com dados.

## Módulos do FluxAI OS™
- Content Engine™: pipeline editorial de 14 estados com governança e versionamento
- Financial Layer: faturamento PIX, comprovantes, alertas de vencimento
- Client Workspace: portal do cliente com visibilidade controlada
- Operational Linking™: serviço extra ativa automaticamente fluxo, pautas e tarefas
- Intelligence Layer: audit logs, events bus, métricas e análise de gargalos
`;

// ─────────────────────────────────────────────────────────────────
// 2. CACHE DE CONTEXTO
// Evita buscar os mesmos dados repetidamente dentro da mesma sessão.
// ─────────────────────────────────────────────────────────────────

const _contextCache = new Map(); // key: project_id → context snapshot
const _responseCache = new Map(); // key: hash(template+input) → response

function _cacheKey(projectId) { return `ctx_${projectId}`; }

function _responseKey(templateId, input) {
    const str = templateId + JSON.stringify(input).substring(0, 200);
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff; }
    return `resp_${hash}`;
}

// TTL de 10 minutos para o cache de contexto
const CONTEXT_TTL_MS = 10 * 60 * 1000;

// ─────────────────────────────────────────────────────────────────
// 3. CLIENT KNOWLEDGE BASE
// Busca e estrutura todos os dados relevantes de um cliente.
// ─────────────────────────────────────────────────────────────────

async function _fetchClientKnowledge(projectId) {
    const cached = _contextCache.get(_cacheKey(projectId));
    if (cached && Date.now() - cached._fetchedAt < CONTEXT_TTL_MS) {
        return cached;
    }

    const supabase = getSupabase();
    let project = null, contract = null, extras = [], recentAssets = [], recentEvents = [];

    if (supabase && projectId && projectId !== 'proj_fluxai_labs_master') {
        try {
            const [projRes, contractRes, extrasRes, assetsRes, eventsRes] = await Promise.all([
                supabase.from('projects').select('company_name, segment, workspace_type, is_billing_exempt, tone, operational_activation, objectives, digital_infrastructure, metadata').eq('id', projectId).single(),
                supabase.from('contracts').select('deliverables, contract_value, due_day, status, start_date').eq('project_id', projectId).eq('status', 'ATIVO').single(),
                supabase.from('extra_services_contracts').select('service_type, workflow_status, service_value, deadline, responsible').eq('project_id', projectId).neq('workflow_status', 'CONCLUIDO'),
                supabase.from('content_assets').select('id,title,status,platform,scheduled_at,metadata').eq('project_id', projectId).order('created_at', { ascending: false }).limit(8),
                supabase.from('operational_events').select('event_type,responsible,context,created_at').eq('project_id', projectId).order('created_at', { ascending: false }).limit(6)
            ]);
            project = projRes.data;
            contract = contractRes.data;
            extras = extrasRes.data || [];
            recentAssets = assetsRes.data || [];
            recentEvents = eventsRes.data || [];
        } catch (err) {
            console.warn('[KNOWLEDGE] Fallback para localStorage.', err);
        }
    }

    // Removido fallback localStorage de mocks legados (Macrobloco 13.2)

    const knowledge = {
        _fetchedAt: Date.now(),
        project_id: projectId,

        // Identidade da marca
        company_name: project?.company_name || 'Cliente',
        segment: project?.segment || '',
        workspace_type: project?.workspace_type || 'CLIENT',
        is_billing_exempt: project?.is_billing_exempt || false,
        tone_of_voice: project?.tone || project?.operational_activation?.identity?.voice_tone || '',
        objectives: project?.objectives || '',
        positioning: project?.operational_activation?.identity?.positioning || '',
        value_proposition: project?.operational_activation?.identity?.value_proposition || '',
        differentiators: project?.operational_activation?.identity?.differentiators || '',
        pain_points: project?.operational_activation?.pain_points || [],
        editorial_pillars: project?.operational_activation?.dna?.editorial_pillars || '',
        forbidden_themes: project?.operational_activation?.dna?.forbidden_themes || '',
        digital_infrastructure: project?.digital_infrastructure || {},
        metadata: project?.metadata || {},

        // Contrato
        contract: contract ? {
            deliverables: contract.deliverables || '',
            monthly_value: contract.contract_value || 0,
            due_day: contract.due_day || 5,
            status: contract.status || 'ATIVO',
            start_date: contract.start_date || ''
        } : null,

        // Serviços Extras Ativos
        active_extra_services: extras.map(e => ({
            type: e.service_type,
            status: e.workflow_status,
            value: e.service_value,
            deadline: e.deadline,
            responsible: e.responsible
        })),

        // Conteúdo Recente
        recent_assets: recentAssets.map(a => ({
            title: a.title,
            status: a.status,
            platform: a.platform
        })),

        // Histórico de Eventos
        recent_events: recentEvents.map(e => ({
            type: e.event_type,
            actor: e.responsible,
            summary: e.context,
            at: e.created_at
        }))
    };

    _contextCache.set(_cacheKey(projectId), knowledge);
    return knowledge;
}

// ─────────────────────────────────────────────────────────────────
// 4. CONTEXT ENGINE
// Seleciona e compõe o contexto mínimo necessário para cada ação.
// ─────────────────────────────────────────────────────────────────

export const KnowledgeCore = {

    /**
     * Constrói o contexto operacional completo para uma ação da IA.
     * Seleciona apenas o que é necessário para o módulo e ação atual.
     *
     * @param {object} options
     * @param {string} options.projectId    — ID do projeto (tenant)
     * @param {string} options.module       — Módulo ativo (ex: 'content-engine')
     * @param {string} options.action       — Ação sendo executada (ex: 'GENERATE_CONTENT_PLAN')
     * @param {string} options.userRole     — Papel do usuário logado
     * @returns {object} context — pronto para ser passado ao ask()
     */
    buildContext: async ({ projectId, module, action, userRole = 'ADMIN' }) => {
        // Segurança: CLIENT só vê seu próprio projeto
        const sessionProjectId = OSState.get('activeProjectId');
        if (userRole === 'CLIENT' && projectId !== sessionProjectId) {
            console.error('[KNOWLEDGE] Acesso negado: CLIENT tentou acessar projeto diferente.');
            return null;
        }

        const clientKnowledge = await _fetchClientKnowledge(projectId);
        const verticalKnowledge = VERTICAL_KNOWLEDGE.forSegment(clientKnowledge.segment);

        // Selecionar apenas o que esta ação precisa (Context Pruning)
        const needs = _resolveContextNeeds(module, action);

        const context = {
            // Sempre presente
            fluxai_institutional: FLUXAI_MASTER_KNOWLEDGE,
            company: clientKnowledge.company_name,
            segment: clientKnowledge.segment,
            workspace_type: clientKnowledge.workspace_type,

            // Condicionais por necessidade
            ...(needs.tone && { tone_of_voice: clientKnowledge.tone_of_voice }),
            ...(needs.pillars && { editorial_pillars: clientKnowledge.editorial_pillars }),
            ...(needs.contract && { contract: clientKnowledge.contract }),
            ...(needs.extras && { active_extra_services: clientKnowledge.active_extra_services }),
            ...(needs.recent_assets && { recent_assets: clientKnowledge.recent_assets }),
            ...(needs.recent_events && { recent_events: clientKnowledge.recent_events }),
            ...(needs.vertical && { vertical_rules: verticalKnowledge }),
            ...(needs.positioning && {
                positioning: clientKnowledge.positioning,
                value_proposition: clientKnowledge.value_proposition,
                differentiators: clientKnowledge.differentiators,
                pain_points: clientKnowledge.pain_points
            }),
            ...(needs.forbidden && { forbidden_themes: clientKnowledge.forbidden_themes }),

            // Metadados do contexto
            _meta: { projectId, module, action, userRole, builtAt: new Date().toISOString() }
        };

        return context;
    },

    /**
     * Executa uma chamada à IA usando o contexto pré-construído e um template.
     *
     * @param {object} context   — construído por buildContext()
     * @param {string} templateId — ex: 'GENERATE_CONTENT_PLAN'
     * @param {object} input     — dados específicos da ação (ex: { month, platform })
     * @param {object} options   — { forceRefresh: bool }
     */
    ask: async (context, templateId, input = {}, options = {}) => {
        if (!context) return { error: 'Contexto não autorizado.' };

        const template = PROMPT_TEMPLATES[templateId];
        if (!template) return { error: `Template "${templateId}" não encontrado.` };

        // Verificar cache de resposta
        const rKey = _responseKey(templateId, { ...context._meta, ...input });
        if (!options.forceRefresh && _responseCache.has(rKey)) {
            const cached = _responseCache.get(rKey);
            await _logUsage({ ...context._meta, templateId, model: 'CACHED', tokens: 0, cached: true });
            return { ...cached, fromCache: true };
        }

        // Montar prompt final
        const systemPrompt = _buildSystemPrompt(context, template);
        const userPrompt = template.buildUserPrompt(input, context);
        const model = selectModel(template.complexity);

        // Chamar API OpenAI
        // REMOVIDO: apiKey local. A chave agora vem de forma segura via Edge Function.

        try {
            const res = await getSupabase().functions.invoke('openai-proxy', {
                body: {
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    max_tokens: template.maxTokens || 1200,
                    temperature: template.temperature || 0.7
                }
            });
            
            // Supabase devolve { data, error } 
            if (res.error) {
                throw new Error(res.error.message || 'Erro na Edge Function openai-proxy');
            }
            
            const data = res.data;
            if (data.error) {
                throw new Error(data.error || 'HTTP_ERRO_OPENAI');
            }
            const content = data.choices?.[0]?.message?.content || '';
            const tokensUsed = data.usage?.total_tokens || 0;

            const result = { content, model, tokensUsed, templateId };

            // Salvar no cache se marcado como cacheável
            if (template.cacheable) {
                _responseCache.set(rKey, result);
                setTimeout(() => _responseCache.delete(rKey), template.cacheTTL || 30 * 60 * 1000);
            }

            // Registrar uso
            await _logUsage({ ...context._meta, templateId, model, tokens: tokensUsed, cached: false });

            return result;
        } catch (err) {
            console.error('[KNOWLEDGE] Erro na chamada de IA:', err);
            return { error: err.message };
        }
    },

    /**
     * Limpa o cache de contexto de um projeto específico.
     * Chamar quando onboarding ou contrato for atualizado.
     */
    invalidateCache: (projectId) => {
        _contextCache.delete(_cacheKey(projectId));
        console.log(`[KNOWLEDGE] Cache invalidado para projeto: ${projectId}`);
    },

    /**
     * Retorna o resumo do contexto de um cliente (sem chamar a IA).
     * Útil para exibir na UI antes de executar uma ação.
     */
    getContextSummary: async (projectId) => {
        const k = await _fetchClientKnowledge(projectId);
        return {
            company: k.company_name,
            segment: k.segment,
            contract_value: k.contract?.monthly_value,
            deliverables: k.contract?.deliverables,
            active_services: k.active_extra_services.map(e => e.type),
            tone: k.tone_of_voice,
            pillars: k.editorial_pillars,
            recent_asset_count: k.recent_assets.length
        };
    }
};

// ─────────────────────────────────────────────────────────────────
// HELPERS INTERNOS
// ─────────────────────────────────────────────────────────────────

/**
 * Determina quais partes do contexto são necessárias por módulo+ação.
 * Context Pruning: só busca o que a ação precisa.
 */
function _resolveContextNeeds(module, action) {
    const base = { tone: true, pillars: false, contract: false, extras: false, recent_assets: false, recent_events: false, vertical: false, positioning: false, forbidden: false };

    const needs = {
        // Content Engine
        'GENERATE_CONTENT_PLAN':      { ...base, pillars: true, contract: true, extras: true, recent_assets: true, vertical: true, positioning: true, forbidden: true },
        'REVIEW_CONTENT_PLAN':        { ...base, pillars: true, contract: true, extras: true, recent_assets: true, vertical: true, forbidden: true },
        'GENERATE_CAPTION':           { ...base, pillars: true, positioning: true, vertical: true, forbidden: true },
        'GENERATE_HOOKS':             { ...base, positioning: true, vertical: true, tone: true },
        'GENERATE_CTA':               { ...base, tone: true, positioning: true },
        'STRATEGIC_FEEDBACK':         { ...base, pillars: true, contract: true, recent_assets: true, recent_events: true, vertical: true },

        // Contrato / Escopo
        'CHECK_CONTRACT_SCOPE':       { ...base, contract: true, extras: true },
        'VALIDATE_EXTRA_SERVICE':     { ...base, contract: true, extras: true, tone: false },
        'CREATE_PLAN_BASED_ON_EXTRA': { ...base, contract: true, extras: true, pillars: true, vertical: true },
        'CHECK_IF_INSIDE_CONTRACT':   { ...base, contract: true, extras: true },

        // Financeiro
        'FINANCIAL_ALERT_MESSAGE':    { ...base, contract: true, tone: true },

        // Cliente
        'CLIENT_APPROVAL_SUMMARY':    { ...base, recent_assets: true, recent_events: true },
        'GENERATE_WHATSAPP_MESSAGE':  { ...base, tone: true, positioning: true },

        // Estratégico
        'GENERATE_VERTICAL_PLAN':     { ...base, pillars: true, contract: true, extras: true, vertical: true, positioning: true, forbidden: true, recent_assets: true },
        'GENERATE_CONTENT_BY_PROFESSION': { ...base, pillars: true, vertical: true, positioning: true, forbidden: true, contract: true },
        'REVIEW_CONTENT_ETHICAL':     { ...base, vertical: true, forbidden: true, segment: true }
    };

    return needs[action] || base;
}

/**
 * Monta o system prompt completo a partir do contexto e do template.
 */
function _buildSystemPrompt(context, template) {
    const parts = [
        '# IDENTIDADE E REGRAS DO SISTEMA',
        context.fluxai_institutional,
        '',
        `# CLIENTE ATIVO: ${context.company}`,
        `Segmento: ${context.segment}`,
        context.tone_of_voice ? `Tom de voz: ${context.tone_of_voice}` : '',
        context.positioning ? `Posicionamento: ${context.positioning}` : '',
        context.value_proposition ? `Proposta de valor: ${context.value_proposition}` : '',
        context.editorial_pillars ? `Pilares editoriais: ${context.editorial_pillars}` : '',
        context.forbidden_themes ? `TEMAS PROIBIDOS: ${context.forbidden_themes}` : '',
        '',
        context.contract ? `# CONTRATO ATIVO\nEscopo: ${context.contract.deliverables}\nFee Mensal: R$ ${context.contract.monthly_value}` : '',
        '',
        context.active_extra_services?.length ? `# SERVIÇOS EXTRAS ATIVOS\n${context.active_extra_services.map(s => `- ${s.type} (${s.status})`).join('\n')}` : '',
        '',
        context.vertical_rules ? `# REGRAS DO NICHO (${context.segment})\n${context.vertical_rules}` : '',
        '',
        context.recent_assets?.length ? `# ÚLTIMOS CONTEÚDOS NO PIPELINE\n${context.recent_assets.map(a => `- [${a.status}] ${a.title}`).join('\n')}` : '',
        '',
        `# OBJETIVO DESTA TAREFA\n${template.objective}`,
        '',
        `# FORMATO DE SAÍDA\n${template.outputFormat}`,
        '',
        `# RESTRIÇÕES\n${template.restrictions || 'Ser preciso, contextual e respeitar as regras do cliente.'}`
    ];

    return parts.filter(p => p !== '').join('\n');
}

/**
 * Registra uso de IA para controle de custo por cliente e módulo.
 */
async function _logUsage({ projectId, module, action, templateId, model, tokens, cached }) {
    const logEntry = {
        project_id: projectId,
        module: module || 'unknown',
        action_type: templateId || action,
        model_used: model,
        tokens_estimated: tokens,
        cost_estimated: _estimateCost(model, tokens),
        cached_response: cached,
        created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
        try {
            await supabase.from('ai_usage_logs').insert([logEntry]);
            return;
        } catch (_) {}
    }

    // Fallback localStorage
    const logs = JSON.parse(localStorage.getItem('fluxai_ai_logs') || '[]');
    logs.unshift({ id: 'log_' + Date.now(), ...logEntry });
    localStorage.setItem('fluxai_ai_logs', JSON.stringify(logs.slice(0, 500)));
}

function _estimateCost(model, tokens) {
    const rates = {
        'gpt-4o': 0.000005,
        'gpt-4o-mini': 0.0000002,
        'gpt-3.5-turbo': 0.0000005,
        'CACHED': 0
    };
    return ((rates[model] || 0.000002) * tokens).toFixed(6);
}
