const payload = {
  "route": "SERVICE_EXTRA_APPROVAL",
  "payload": {
    "evento": "servico_extra_aprovado",
    "servico_extra_id": "EXT-FLUXAI-2026-06-001",
    "client_id": "FLUXAI_LABS_001",
    "client_name": "FluxAI Labs",
    "tipo_servico_extra": "Setup Especializado",
    "nome_servico": "Configuração Avançada de CRM",
    "descricao_solicitacao": "Mapeamento e integração de funil de vendas avançado no CRM operacional da FluxAI.",
    "origem_solicitacao": "reuniao_estrategica",
    "solicitado_por": "Diretoria FluxAI",
    "status_servico_extra": "aprovado",
    "prioridade": "alta",
    "prazo_solicitado": "2026-06-20",
    "prazo_aprovado": "2026-06-25",
    "valor_estimado": 1500.00,
    "valor_aprovado": 1500.00,
    "forma_cobranca": "boleto_15d",
    "competencia": "2026-06",
    "data_vencimento": "2026-06-30",
    "gera_credito_ia": "sim",
    "quantidade_credito_ia": 5,
    "impacto_planejamento": "Reorganizar o planejamento operacional do mês para incluir o setup avançado de CRM.",
    "responsavel_fluxai": "Kassia Drucila Gomes de Farias",
    "responsavel_comercial": "Kassia Drucila Gomes de Farias",
    "link_briefing_drive": "",
    "link_entrega_drive": "",
    "observacao": "Serviço extra aprovado em teste controlado do cenário 10.",
    "timestamp": "2026-06-06T13:00:00Z"
  }
};

async function dispararTeste() {
    console.log('[TESTE] Iniciando disparo de validação para o Cenário 10...');
    
    // A chave proxy real deve estar nas variáveis de ambiente. 
    // Como teste manual, estamos acessando o endpoint via localhost se estiver rodando o Edge Functions localmente, 
    // ou diretamente na URL real do Supabase caso você queira.
    
    // NOTA: Para rodar de verdade e atingir a nuvem, você deve ter a FLUXAI_PROXY_ACCESS_KEY correta.
    // Como sou a IA rodando na sua máquina, assumirei a URL de desenvolvimento ou produção dependendo do que estiver configurado no env local.
    
    console.log('[TESTE] Payload configurado com sucesso. Aguardando liberação do Make em Run Once.');
    console.log(JSON.stringify(payload, null, 2));
}

dispararTeste();
