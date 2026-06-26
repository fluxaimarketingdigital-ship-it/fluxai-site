# INVENTÁRIO DE TRANSAÇÕES CRÍTICAS

## Operações Mapeadas Sujeitas ao Proxy

A camada do proxy orquestra as seguintes alterações de estado de alto valor operacional:

1. **Onboarding Seguro (ROTA 09)**
   - Altera/Cria contratos financeiros.
   - Provisiona estrutura de pastas de cliente.
   - Registra setup inicial no Supabase via Make.

2. **Demandas (ROTA 01)**
   - Criação de artefatos visuais / solicitações de serviço.
   - Deduz escopo operacional e prazos de equipe.

3. **Captação de Leads (ROTA 02)**
   - Popula CRM externo/interno.

4. **Operações Desativadas no Backend, porém modeladas (10, 11, 13):**
   - **Serviços Extras (ROTA 10):** Alteração de viabilidade e impacto em boletos.
   - **IA Créditos (ROTA 11):** Dedução de créditos mensais de token GPT.

## Diagnóstico
Estas transações exigem garantia de unicidade (Idempotência) e certeza de origem (Autenticidade). Ambas propriedades não estão protegidas na atual camada proxy da Vercel.
