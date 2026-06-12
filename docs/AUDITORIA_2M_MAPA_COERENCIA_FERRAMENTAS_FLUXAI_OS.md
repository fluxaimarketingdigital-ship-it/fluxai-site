# AUDITORIA 2M: MAPA DE COERÊNCIA DE FERRAMENTAS DO FLUXAI OS™

## Objetivo
Mapear como todas as ferramentas do ecossistema FluxAI conversam entre si, garantindo que não existam redundâncias, webhooks expostos, conflitos de estado ou execuções indevidas.

---

### 1. Rotas e Proxy
**Mapeamento da Camada de Integração**
*   **makeRoutes.js**: Registra de forma lógica as rotas (`ROTA_OS_09_ONBOARDING`, `ROTA_OS_01_PORTAL_DEMANDAS`, etc.) mapeando-as para os `routeIds` literais.
*   **makeClient.js**: Encapsula todas as chamadas do sistema e as força a passar pelo endereço estrito `/api/make-proxy`.
*   **api/make-proxy.js (Supabase Edge Function)**: O gateway central. Traduz `routeIds` para os verdadeiros Webhooks guardados no cofre (Vercel/Supabase Secrets) e injeta headers de autorização (`x-fluxai-proxy-key`).
*   **os-config.js**: Mantém a tabela `WEBHOOK_CONFIG` listando todos os aliases lógicos de comunicação.
*   **Webhooks Diretos no Frontend:** **0 (Zero)**. Confirmado via auditoria estática (`grep`), nenhuma URL do tipo `hook.us2` trafega pelo client-side.
*   **Rotas que passam pelo Proxy:** 100% das rotas ativas (Lead Capture, Demand Submission, Onboarding, IA Controls).
*   **Rotas Órfãs:** `CLIENTES_ARQUIVOS_SYNC` e `LEADS_CLIENTES` constam como strings vazias em `WEBHOOK_CONFIG`, indicando preparo para o futuro mas sem cenário atrelado no momento.

---

### 2. Frontend / Sistema
**Disparadores Operacionais**
*   **onboarding.html**: Promete "Ativação de Ecossistema de Alto Padrão". O botão "Disparar Infraestrutura" engatilha a ROTA 09. Apesar do jargão, o *payload* (Fase 2A) envia comandos explícitos de bloqueio de IA e Auth para manter segurança e modo rascunho.
*   **client-portal.html**: Os botões "Nova Demanda" e "Solicitar Serviço" chamam a ROTA 01 e a ROTA 10 (Serviços Extras).
*   **Conflitos Narrativos na Interface:** Nenhum botão no frontend possui permissão autônoma de bypass do Supabase Auth. Promessas de ativação no onboarding são seguras, pois a automação (Make) absorve os dados mas respeita os freios arquiteturais (`em_onboarding`, `rascunho`).

---

### 3. Onboarding
**Estudo de Rota e Conversação: Frontend → Proxy → Make 09 → Planilhas → OS**
*   **Gravação de Abas Mapeadas:** O cenário 09 (Fase 2A) grava perfeitamente nas 6 abas essenciais (`01_CLIENTES_ESTRATEGIA`, `04_CLIENTES_CONFIG`, `03_SERVICOS_CLIENTES`, `02_CONTRATOS_CLIENTES`, `11_DNA_CLIENTE_GPT`, `CLIENTES_ARQUIVOS`).
*   **Regras de Freio e Rascunho (Confirmadas):**
    *   Cliente nasce como: `em_onboarding`
    *   Contrato nasce como: `rascunho`
    *   Supabase: Não acionado.
    *   Auth: `auth_criado: false` e `status_acesso: nao_criado`
    *   Inteligência Artificial: `ia_bloqueada: true`
    *   DNA de Conteúdo: `pendente_revisao`

---

### 4. Planilhas
**Modelagem de Dados e Status**
*   Os status gerados no código (Frontend) estão rigorosamente alinhados com as Listas Suspensas das abas do Google Sheets.
    *   **Cliente:** ativo, inativo, pausado, em_onboarding.
    *   **Serviço:** ativo, inativo, nao_contratado, aguardando_autorizacao, pausado, encerrado (a antiga string "pendente" foi corrigida para "inativo").
*   **Fonte da Verdade:** `04_CLIENTES_CONFIG` permanece como a âncora relacional (Client ID). Nenhuma operação avança sem cruzar essa tabela.

---

### 5. Supabase / Auth / RBAC
*   O controle de acesso em `os-config.js` (`ROLE_CONFIG`) suporta `ADMIN`, `OPERATOR` e `CLIENT`.
*   A "role" `CLIENT` depende inerentemente do vínculo do perfil (no banco auth.users) com um `client_id` existente na planilha `04_CLIENTES_CONFIG`.
*   **Onboarding Seguro:** Confirmado que o Onboarding (ROTA 09 Fase 2A) não interage com o Supabase Admin API. Contas reais não são criadas prematuramente no banco.

---

### 6. Serviços Extras
*   **Fluxo de Comunicação:** Os pedidos nascem no painel via ROTA 10 (Request), ficam pendentes, e o seu aceite ou recusa transita pela ROTA 12 (Aprovação / Idempotência).
*   **Proteção de Faturamento:** Serviços extras não ativam faturamento mensal automático. Eles dependem do aval do `OPERATOR`.

---

### 7. IA / Créditos / Guardrails
*   **Matriz de IA:** `IA_CREDITOS_CONTROLE` (ROTA 11), `IA_GUARDRAIL` (ROTA 13) e `GPT_GERACOES_LOG` (ROTA 17).
*   **Acionamento Limitado:** O cliente logado **não** pode acionar geração de IA de forma independente nem consumir saldo acima do limite de contingência.
*   A restrição `ia_bloqueada: true` disparada pelo Onboarding garante que nenhum robô gere *prompts* vazios ou com contexto incompleto de um cliente que acabou de entrar.

---

### 8. Relatórios e Métricas
*   **Rotas de Analytics:** Dados das abas diárias (GA4, Meta, Instagram, Clarity) não são disparados passivamente para os clientes. Eles são compilados pelas automações em um Rascunho Mensal (`ANALISE_MENSAL_CLIENTE`).
*   **Transição de Status:** `rascunho` -> `em_revisao` -> `aprovado_internamente` -> `enviado_ao_cliente` (ROTA 07 - Report Update).

---

### 9. Canais e Integrações Externas
*   Tokens da Meta, GA4 e Clarity estão atrelados ao cliente na `04_CLIENTES_CONFIG`.
*   A arquitetura impede que métricas cruzem porque o `client_id` (Ex: `BETA_ENTERPRISES_TESTE_2026_06_001`) é usado como chave de busca (`Search Rows` no Make) antes de qualquer Append de linha no banco analítico.

---

### 10. Coerência Narrativa FluxAI
*   **Vocabulário Premium:** O código e a UI adotam estritamente termos como "Sistema de Crescimento", "FluxAI OS" e "Engenharia de Conteúdo". Termos de agência tradicional ("Pacotinho de post", "diquinha") estão na lista de proibidos do DNA GPT.
*   **Incoerência Detectada:** Não há quebras narrativas no Frontend. Porém, o nome interno de certas abas (ex: "CLIENTES_ARQUIVOS") é pragmático; isso é aceitável pois é infraestrutura não visível ao usuário.

---

### 11. Matriz Ferramenta x Responsabilidade

| Dado / Decisão | Fonte da Verdade | Quem Executa | Quem Mostra | Quem não pode alterar | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **client_id** | `04_CLIENTES_CONFIG` | Make (ROTA 09) | OS (Toda a UI) | Cliente / IA | **OK** |
| **status_cliente** | `04_CLIENTES_CONFIG` | Admin OS | Dashboard OS | Cliente / Operador N1 | **OK** |
| **status_servico** | `03_SERVICOS_CLIENTES` | Automação / Admin | Serviços OS | Cliente | **OK** |
| **Auth / Acesso** | `Supabase Auth` | FluxAI Admin | Tela Login | Automação Onboarding | **OK** |
| **Métricas Meta/GA** | APIs Oficiais | Make (Rotinas) | Relatório OS | Operador / Cliente | **OK** |
| **Serviço Extra** | `SERVICOS_EXTRAS_CLIENTES` | Cliente (Solicita) | Painel Financeiro | IA | **OK** |
| **Relatório Mensal** | `ANALISE_MENSAL_CLIENTE` | IA / Operador | Portal do Cliente | Cliente | **OK** |
| **Créditos IA** | `IA_CREDITOS_CLIENTE` | Guardrail Make | OS Admin | Cliente / IA sozinha | **OK** |
| **Arquivos (Drive)** | Google Drive | Make (Folder Gen) | Client Portal | Cliente (Estrutura) | **OK** |

---

### 12. Resultado Final e Recomendações

**Resumo Executivo:**
O ecossistema encontra-se **altamente coerente**. A blindagem operada pelo `make-proxy` isolou completamente a comunicação externa. Os freios estruturais da Fase 2A (Onboarding Seguro) evitam o maior risco possível: a criação de clientes zumbis no banco e acionamento de IA antes da revisão humana.

**O que é risco crítico (Mas está mitigado):**
*   **Encoding UTF-8:** A falta de declaração explícita de `charset` no payload do proxy pode causar corrupção no banco de dados (planilhas) ao receber textos com acentuação. (Já previsto no plano de virada oficial).

**O que precisa ser corrigido / Ação Prática:**
1.  Aplicar a alteração de header UTF-8 no `makeClient.js` e `api/make-proxy.js`.
2.  Rotacionar o Webhook de Onboarding.
3.  Atualizar a Environment Variable e ativar oficialmente a Fase 2A.
4.  Com a Fase 2A operante, preparar a expansão do fluxo Auth (liberação do usuário via Supabase apenas no momento do `status_cliente` transitar de `em_onboarding` para `ativo`).
