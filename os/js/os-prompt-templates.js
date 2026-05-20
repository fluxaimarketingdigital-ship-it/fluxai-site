/**
 * FLUXAI OS™ — PROMPT TEMPLATES v1.0.0
 * Biblioteca de templates reutilizáveis para o Prompt Orchestrator.
 *
 * Cada template define:
 *  - objective     : o que a IA deve fazer
 *  - complexity    : 'low' | 'medium' | 'high' → roteamento de modelo
 *  - maxTokens     : limite de tokens de saída
 *  - temperature   : criatividade (0.0 a 1.0)
 *  - cacheable     : se pode cachear resposta idêntica
 *  - cacheTTL      : tempo em ms do cache (default 30min)
 *  - outputFormat  : formato esperado de saída
 *  - restrictions  : restrições obrigatórias
 *  - buildUserPrompt(input, context) : função que monta o prompt do usuário
 */

// ─────────────────────────────────────────────────────────────────
// MODEL ROUTER — seleciona o modelo pelo nível de complexidade
// ─────────────────────────────────────────────────────────────────

export function selectModel(complexity = 'medium') {
    const models = {
        low:    'gpt-4o-mini',   // tarefas simples, baixo custo
        medium: 'gpt-4o-mini',  // análises moderadas
        high:   'gpt-4o'        // planejamento estratégico, análise crítica
    };
    return models[complexity] || 'gpt-4o-mini';
}

// ─────────────────────────────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────────────────────────────

export const PROMPT_TEMPLATES = {

    // ──────────────────────────────────────────
    // CONTENT ENGINE™ — PLANEJAMENTO E PRODUÇÃO
    // ──────────────────────────────────────────

    GENERATE_CONTENT_PLAN: {
        objective: 'Gerar um planejamento editorial mensal completo para o cliente, respeitando o escopo contratado, os pilares editoriais, o nicho profissional e os serviços extras ativos.',
        complexity: 'high',
        maxTokens: 2000,
        temperature: 0.75,
        cacheable: false,
        outputFormat: `Retornar em JSON com o seguinte formato:
{
  "pautas": [
    {
      "titulo": "...",
      "objetivo": "...",
      "formato": "REELS | CARROSSEL | SINGLE | STORIES",
      "plataforma": "INSTAGRAM | LINKEDIN | TIKTOK",
      "gancho": "...",
      "copy_resumida": "...",
      "cta": "...",
      "prioridade": "ALTA | MÉDIA | BAIXA",
      "dentro_do_contrato": true | false,
      "servico_extra_vinculado": "...",
      "observacoes": "..."
    }
  ],
  "resumo_estrategico": "...",
  "alertas": ["..."]
}`,
        restrictions: 'Respeitar tom de voz. Respeitar temas proibidos. Não sugerir conteúdo fora do escopo contratado sem sinalizar. Respeitar regras éticas do nicho.',
        buildUserPrompt(input, context) {
            return `Gere o planejamento editorial de ${input.month || 'este mês'} para ${context.company}.

Objetivo do mês: ${input.objective || context.objectives || 'Autoridade e conversão'}
Canal principal: ${input.platform || 'Instagram'}
Quantidade de pautas: ${input.qty || 8}
Serviços extras ativos: ${(context.active_extra_services || []).map(s => s.type).join(', ') || 'Nenhum'}
Funil atual: ${input.funnel || 'Topo + Meio'}

Gere as pautas respeitando o escopo contratado, o nicho e as regras do segmento.`;
        }
    },

    GENERATE_CONTENT_BY_PROFESSION: {
        objective: 'Gerar pautas específicas para a profissão e nicho do cliente, respeitando os limites éticos e comunicacionais da área.',
        complexity: 'high',
        maxTokens: 1500,
        temperature: 0.7,
        cacheable: false,
        outputFormat: 'JSON com array de pautas (mesmo formato do GENERATE_CONTENT_PLAN) mais campo "ethical_compliance": true|false e "compliance_notes": "..."',
        restrictions: 'Respeitar TODOS os limites éticos do nicho. Não sugerir promessas milagrosas. Não sugerir prescrição individual em conteúdo público. Sinalizar qualquer pauta com risco ético.',
        buildUserPrompt(input, context) {
            return `Gere ${input.qty || 5} pautas de conteúdo para ${context.company} (${context.segment}).

Profissão/Especialidade: ${input.profession || context.segment}
Público-alvo deste conjunto: ${input.audience || 'Pacientes / Seguidores'}
Formato preferido: ${input.format || 'Reels'}
Objetivo: ${input.objective || 'Autoridade e Conexão'}

Respeite as regras éticas do nicho identificadas no contexto.`;
        }
    },

    REVIEW_CONTENT_PLAN: {
        objective: 'Revisar um planejamento editorial existente e verificar se está dentro do contrato, respeita o nicho e os pilares do cliente.',
        complexity: 'medium',
        maxTokens: 1000,
        temperature: 0.4,
        cacheable: false,
        outputFormat: `JSON:
{
  "aprovado": true | false,
  "alertas": ["..."],
  "pautas_fora_do_escopo": ["..."],
  "pautas_com_risco_etico": ["..."],
  "sugestoes_de_melhoria": ["..."],
  "nota_geral": "0-10"
}`,
        restrictions: 'Ser objetivo e técnico. Não sugerir aprovação de conteúdo que viole regras éticas do nicho. Identificar pautas fora do escopo contratado.',
        buildUserPrompt(input, context) {
            return `Revise o seguinte planejamento editorial de ${context.company}:

${input.plan_content || '[Planejamento não fornecido]'}

Verifique:
1. Está dentro do escopo contratado? (${context.contract?.deliverables || 'Escopo não informado'})
2. Respeita os pilares editoriais?
3. Respeita as regras éticas do segmento ${context.segment}?
4. Tem pauta vinculada a serviço extra? (Extras ativos: ${(context.active_extra_services || []).map(s => s.type).join(', ') || 'Nenhum'})`;
        }
    },

    GENERATE_CAPTION: {
        objective: 'Gerar a legenda completa de uma pauta de conteúdo, com gancho, corpo e CTA adequados ao nicho e tom de voz do cliente.',
        complexity: 'medium',
        maxTokens: 600,
        temperature: 0.8,
        cacheable: false,
        outputFormat: 'Texto simples: GANCHO (1-2 linhas) + quebra de linha + CORPO (3-5 parágrafos) + quebra + CTA. Não usar markdown.',
        restrictions: 'Respeitar tom de voz. Não fazer promessas. Usar linguagem do segmento. Respeitar temas proibidos.',
        buildUserPrompt(input, context) {
            return `Crie a legenda completa para o seguinte conteúdo de ${context.company}:

Título da pauta: ${input.title || ''}
Formato: ${input.format || 'Reels'}
Objetivo: ${input.objective || 'Autoridade'}
Tom: ${context.tone_of_voice || 'Técnico e direto'}
CTA sugerido: ${input.cta || 'Comente sua dúvida'}

Escreva uma legenda completa com gancho forte, corpo educativo e CTA claro.`;
        }
    },

    GENERATE_HOOKS: {
        objective: 'Gerar 5 opções de gancho (hook) para um conteúdo específico, maximizando retenção nos primeiros 3 segundos.',
        complexity: 'low',
        maxTokens: 400,
        temperature: 0.9,
        cacheable: true,
        cacheTTL: 15 * 60 * 1000,
        outputFormat: 'Lista numerada de 5 ganchos. Cada gancho deve ser uma frase curta, impactante, adequada ao formato e plataforma.',
        restrictions: 'Não usar clickbait enganoso. Respeitar tom de voz. Não fazer afirmações que violem as regras do nicho.',
        buildUserPrompt(input, context) {
            return `Crie 5 opções de gancho (hook) para um ${input.format || 'Reels'} de ${context.company} sobre:

Tema: ${input.theme || ''}
Objetivo: ${input.objective || 'Gerar retenção e curiosidade'}
Público: ${input.audience || 'Seguidores'}

Tom: ${context.tone_of_voice || 'Direto e técnico'}`;
        }
    },

    GENERATE_CTA: {
        objective: 'Gerar 5 opções de CTA (Call To Action) adequadas ao objetivo do conteúdo e ao nicho do cliente.',
        complexity: 'low',
        maxTokens: 250,
        temperature: 0.8,
        cacheable: true,
        cacheTTL: 20 * 60 * 1000,
        outputFormat: 'Lista numerada de 5 CTAs. Cada um em 1 linha. Indicar o objetivo de cada um (ex: DM, salvar, comentar, clicar no link).',
        restrictions: 'Não criar CTAs agressivos. Adequar ao nicho. Não prometer resultado imediato.',
        buildUserPrompt(input, context) {
            return `Crie 5 CTAs para ${context.company} (${context.segment}).

Objetivo do conteúdo: ${input.objective || 'Engajamento'}
Formato: ${input.format || 'Reels'}
Ação desejada: ${input.desired_action || 'Comentar ou salvar'}`;
        }
    },

    // ──────────────────────────────────────────
    // CONTRATO E ESCOPO
    // ──────────────────────────────────────────

    CHECK_CONTRACT_SCOPE: {
        objective: 'Verificar se uma pauta, tarefa ou entrega específica está dentro do escopo contratado ou se pertence a um serviço extra.',
        complexity: 'low',
        maxTokens: 300,
        temperature: 0.2,
        cacheable: true,
        cacheTTL: 30 * 60 * 1000,
        outputFormat: `JSON: { "dentro_do_contrato": true|false, "servico_extra_necessario": "..." | null, "justificativa": "..." }`,
        restrictions: 'Resposta objetiva. Não inventar escopo. Baseado estritamente no contrato e extras ativos.',
        buildUserPrompt(input, context) {
            return `Verifique se a seguinte entrega está dentro do contrato de ${context.company}:

Entrega solicitada: ${input.delivery || ''}
Contrato atual: ${context.contract?.deliverables || 'Não disponível'}
Serviços extras ativos: ${(context.active_extra_services || []).map(s => s.type).join(', ') || 'Nenhum'}`;
        }
    },

    VALIDATE_EXTRA_SERVICE: {
        objective: 'Analisar se um serviço extra solicitado é adequado para o cliente e gerar briefing inicial automático.',
        complexity: 'medium',
        maxTokens: 600,
        temperature: 0.5,
        cacheable: false,
        outputFormat: `JSON: { "adequado": true|false, "justificativa": "...", "briefing_inicial": { "objetivo": "...", "entregaveis": ["..."], "prazo_sugerido": "...", "requisitos": ["..."] } }`,
        restrictions: 'Ser realista. Não criar escopo além do que foi descrito.',
        buildUserPrompt(input, context) {
            return `Valide se o serviço extra a seguir é adequado para ${context.company} e gere um briefing inicial:

Serviço solicitado: ${input.service_type || ''}
Valor negociado: R$ ${input.value || 0}
Prazo: ${input.deadline || 'A definir'}
Observações: ${input.notes || ''}
Contrato principal: ${context.contract?.deliverables || 'Não disponível'}`;
        }
    },

    CREATE_PLAN_BASED_ON_EXTRA: {
        objective: 'Criar um plano de tarefas e pautas específico para um serviço extra contratado, integrando ao Content Engine™.',
        complexity: 'high',
        maxTokens: 1500,
        temperature: 0.65,
        cacheable: false,
        outputFormat: `JSON: { "tarefas": [{ "titulo": "...", "responsavel": "...", "prazo": "...", "modulo": "CONTENT_ENGINE|FINANCEIRO|OPERACIONAL" }], "pautas_geradas": [{ "titulo": "...", "formato": "...", "objetivo": "..." }], "cronograma": "..." }`,
        restrictions: 'Tarefas devem ser concretas e executáveis. Pautas devem respeitar o escopo e nicho.',
        buildUserPrompt(input, context) {
            return `Crie um plano de execução para o serviço extra de ${input.service_type || ''} para ${context.company}.

Prazo: ${input.deadline || 'A definir'}
Responsável: ${input.responsible || 'Equipe FluxAI'}
Segmento: ${context.segment}
Tom: ${context.tone_of_voice}
Pilares: ${context.editorial_pillars || 'Não definidos'}

Gere tarefas operacionais e pautas específicas para este serviço.`;
        }
    },

    // ──────────────────────────────────────────
    // FINANCEIRO
    // ──────────────────────────────────────────

    FINANCIAL_ALERT_MESSAGE: {
        objective: 'Redigir uma mensagem de alerta de vencimento de fatura para enviar ao cliente, no tom de voz da FluxAI.',
        complexity: 'low',
        maxTokens: 250,
        temperature: 0.5,
        cacheable: true,
        cacheTTL: 60 * 60 * 1000,
        outputFormat: 'Texto simples. Mensagem profissional e cordial. Máximo 5 linhas.',
        restrictions: 'Não ser agressivo. Não usar linguagem de cobrança agressiva. Manter tom profissional.',
        buildUserPrompt(input, context) {
            return `Redija uma mensagem de alerta financeiro para ${context.company}.

Situação: ${input.status || 'Vencimento hoje'}
Valor: R$ ${input.amount || context.contract?.monthly_value || 0}
Vencimento: ${input.due_date || 'Hoje'}
Canal: ${input.channel || 'WhatsApp'}`;
        }
    },

    // ──────────────────────────────────────────
    // ÁREA DO CLIENTE
    // ──────────────────────────────────────────

    CLIENT_APPROVAL_SUMMARY: {
        objective: 'Redigir um resumo executivo das aprovações pendentes para o cliente visualizar no portal.',
        complexity: 'low',
        maxTokens: 400,
        temperature: 0.4,
        cacheable: false,
        outputFormat: 'Texto em linguagem simples e acessível para o cliente. Máximo 8 linhas. Sem jargão técnico.',
        restrictions: 'Não revelar comentários internos. Não revelar margens. Linguagem do cliente.',
        buildUserPrompt(input, context) {
            const pendingList = (context.recent_assets || []).filter(a => a.status?.includes('REVIEW')).map(a => `- ${a.title}`).join('\n');
            return `Crie um resumo das aprovações pendentes para ${context.company}:

Itens aguardando aprovação:
${pendingList || '- Nenhum item pendente'}

Escreva de forma amigável e clara para o cliente saber o que precisa aprovar.`;
        }
    },

    GENERATE_WHATSAPP_MESSAGE: {
        objective: 'Gerar uma mensagem de WhatsApp contextualizada para comunicar algo ao cliente sobre sua operação.',
        complexity: 'low',
        maxTokens: 300,
        temperature: 0.6,
        cacheable: false,
        outputFormat: 'Texto simples formatado para WhatsApp. Máximo 10 linhas. Usar emojis com moderação.',
        restrictions: 'Tom profissional mas humano. Não revelar informações internas. Não pressionar o cliente.',
        buildUserPrompt(input, context) {
            return `Crie uma mensagem de WhatsApp para ${context.company}.

Assunto: ${input.subject || ''}
Contexto: ${input.context_note || ''}
Tom: ${context.tone_of_voice || 'Profissional e cordial'}`;
        }
    },

    // ──────────────────────────────────────────
    // ESTRATÉGICO
    // ──────────────────────────────────────────

    STRATEGIC_FEEDBACK: {
        objective: 'Gerar análise estratégica do mês do cliente com base no histórico de conteúdo, aprovações e eventos operacionais.',
        complexity: 'high',
        maxTokens: 1200,
        temperature: 0.5,
        cacheable: false,
        outputFormat: `JSON: { "pontos_positivos": ["..."], "pontos_de_atencao": ["..."], "recomendacoes": ["..."], "proximo_foco": "...", "nota_operacional": "0-10" }`,
        restrictions: 'Ser honesto. Não criar feedback genérico. Basear-se estritamente nos dados do contexto.',
        buildUserPrompt(input, context) {
            const events = (context.recent_events || []).map(e => `- [${e.type}] ${e.summary}`).join('\n');
            const assets = (context.recent_assets || []).map(a => `- [${a.status}] ${a.title}`).join('\n');
            return `Gere uma análise estratégica operacional para ${context.company}.

Últimos eventos:
${events || '- Sem eventos recentes'}

Conteúdos no pipeline:
${assets || '- Sem conteúdo recente'}

Período analisado: ${input.period || 'Último mês'}`;
        }
    },

    REVIEW_CONTENT_ETHICAL: {
        objective: 'Verificar se um conteúdo ou pauta respeita as regras éticas e legais do nicho do cliente.',
        complexity: 'medium',
        maxTokens: 500,
        temperature: 0.2,
        cacheable: false,
        outputFormat: `JSON: { "aprovado_etica": true|false, "violacoes": ["..."], "sugestoes": ["..."], "nivel_risco": "BAIXO|MÉDIO|ALTO" }`,
        restrictions: 'Ser rigoroso. Qualquer violação ética deve ser sinalizada. Priorizar a integridade profissional do cliente.',
        buildUserPrompt(input, context) {
            return `Verifique se o conteúdo a seguir está em conformidade ética para ${context.company} (${context.segment}):

Conteúdo a revisar:
${input.content || '[Conteúdo não fornecido]'}

Aplique as regras éticas e legais do segmento ${context.segment}.`;
        }
    },

    GENERATE_VERTICAL_CONTENT_PLAN: {
        objective: 'Gerar um plano de conteúdo especializado para o nicho vertical do cliente, integrando serviços extras e regras profissionais.',
        complexity: 'high',
        maxTokens: 2000,
        temperature: 0.7,
        cacheable: false,
        outputFormat: 'JSON com estrutura idêntica ao GENERATE_CONTENT_PLAN, acrescido de campo "vertical_compliance": true|false por pauta.',
        restrictions: 'Seguir estritamente as regras verticais do segmento. Sinalizar qualquer pauta com risco ético ou fora do escopo.',
        buildUserPrompt(input, context) {
            return `Gere um plano de conteúdo vertical para ${context.company} (${context.segment}).

Funil do mês: ${input.funnel || 'Autoridade + Conversão'}
Público principal: ${input.audience || 'Definido pelo segmento'}
Quantidade: ${input.qty || 8}
Período: ${input.month || 'Este mês'}
Serviços extras ativos: ${(context.active_extra_services || []).map(s => s.type).join(', ') || 'Nenhum'}

Aplique as regras verticais e éticas do segmento identificadas no contexto.`;
        }
    },

    GENERATE_CLIENT_STRATEGY: {
        objective: 'Gerar uma estratégia de crescimento personalizada para o cliente com base no contrato, nicho, serviços ativos e histórico.',
        complexity: 'high',
        maxTokens: 1500,
        temperature: 0.65,
        cacheable: false,
        outputFormat: `JSON: { "estrategia_titulo": "...", "objetivo_principal": "...", "canais_prioritarios": ["..."], "pilares_acionados": ["..."], "acoes_prioritarias": ["..."], "kpis_sugeridos": ["..."], "prazo": "..." }`,
        restrictions: 'Baseada exclusivamente nos dados reais do cliente. Não inventar escopo. Realista.',
        buildUserPrompt(input, context) {
            return `Crie uma estratégia de crescimento para ${context.company} (${context.segment}).

Período: ${input.period || 'Próximos 30 dias'}
Objetivo declarado: ${context.objectives || input.objective || 'Crescimento de autoridade e conversão'}
Serviços ativos: ${context.contract?.deliverables || 'Contrato padrão'}
Extras: ${(context.active_extra_services || []).map(s => s.type).join(', ') || 'Nenhum'}`;
        }
    }
};
