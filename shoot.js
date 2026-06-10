const webhookUrl = "https://hook.us2.make.com/rplnhe37vqvzcjh6gu92ltpvr8rirean";

const payload = {
    "evento": "servico_extra_aprovado",
    "servico_extra_id": "EXT-FLUXAI-2026-06-002",
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
    "valor_estimado": 2500.00,
    "valor_aprovado": 2500.00,
    "forma_cobranca": "boleto_15d",
    "competencia": "2026-06",
    "data_vencimento": "2026-06-30",
    "gera_credito_ia": "sim",
    "quantidade_credito_ia": 10,
    "impacto_planejamento": "Reorganizar o planejamento operacional do mês para incluir o setup avançado de CRM.",
    "responsavel_fluxai": "Kassia Drucila Gomes de Farias",
    "responsavel_comercial": "Kassia Drucila Gomes de Farias",
    "link_briefing_drive": "",
    "link_entrega_drive": "",
    "observacao": "Serviço extra aprovado em teste controlado do cenário 10.",
    "timestamp": "2026-06-06T13:00:00Z"
};

async function sendWebhook() {
    console.log(`[TESTE] Disparando Payload para o Webhook do Make...`);
    console.log(`URL alvo: ${webhookUrl}\n`);
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-FluxAI-Proxy': 'supabase-edge-function', // Simulando os headers do proxy
                'X-FluxAI-Route': 'SERVICE_EXTRA_APPROVAL'
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log(`[STATUS DO MAKE] ${response.status} ${response.statusText}`);
        console.log(`[RESPOSTA DO MAKE] ${text}`);
        
        if (response.ok) {
            console.log("\n[SUCESSO] Webhook ativado! Vá conferir os balões verdes no Make.com.");
        } else {
            console.log("\n[ERRO] O Make retornou um erro. Verifique se o cenário está ligado em Run Once.");
        }
    } catch (error) {
        console.error("\n[FALHA DE REDE] Erro ao disparar o webhook:", error.message);
    }
}

sendWebhook();

