# AUDITORIA 2M: REVISÃO COMPLEMENTAR E EVIDÊNCIAS

Esta revisão retifica os conflitos levantados no relatório inicial da Fase 2M, baseando-se estritamente em provas extraídas de varreduras (`grep`) no código em produção. Nenhuma alteração foi feita no código ou nas integrações.

---

### 1. Proxy e Duality de Ambiente

**Conflito Técnico:** Como o `make-proxy` roda? Vercel ou Supabase?
**Resposta Definitiva (Prova Estática):** A arquitetura atual possui **dois** proxies rodando simultaneamente (Duality):
*   **Vercel API Route (`api/make-proxy.js`):** Usada pela camada antiga/nativa (`os/services/makeClient.js`). Esta route possui uma "allowlist" rígida que aceita **apenas** 3 rotas (01, 02 e 14).
*   **Supabase Edge Function (`supabase/functions/make-proxy/index.ts`):** Usada pelo sistema de roteamento moderno (`os/config/os-config.js` via `webhook-dispatcher.js`). É o proxy robusto que conhece as 11 rotas (Onboarding, Guardrail, etc) e gerencia a `x-fluxai-proxy-key`.

**Status:** Ambos são seguros e não vazam webhooks, mas manter dois proxies é uma dívida técnica que precisará ser unificada no futuro.

---

### 2. Evidência de Webhook Direto Zero

**Ação:** Varredura em profundidade em toda a árvore de diretórios.
**Comando executado:** `grep -ri "hook.us2.make.com" os/ src/ api/ *.js *.html`
**Resultados:**
*   **0 (Zero) ocorrências** em arquivos de produção do Client-Side (JS, HTML).
*   As únicas ocorrências encontradas estão em:
    *   `os/config/.env.example` (apenas como template).
    *   `docs/` e `scan_results.md` (documentação de testes).
    *   `scratch/` (scripts isolados de homologação).
**Conclusão:** É tecnicamente provado que o Frontend público não expõe nenhuma URL de webhook direto. O vazamento de URLs no payload foi estancado.

---

### 3. Rotas Ativas pelo Proxy

Analisando a malha de roteamento, encontramos um bypass. O arquivo `makeRoutes.js` possui um mapeamento que difere do `os-config.js`:

| Rota (Logica) | Arquivo Fonte | Webhook Supabase Edge | Passa pelo Proxy? | Status Atual |
| :--- | :--- | :--- | :--- | :--- |
| **01 Demandas** | `makeRoutes.js` / `os-config.js` | `DEMAND_SUBMISSION` | **SIM** | Ativa |
| **02 Leads** | `makeRoutes.js` / `os-config.js` | `LEAD_CAPTURE` | **SIM** | Ativa |
| **09 Onboarding** | `makeRoutes.js` / `os-config.js` | `CLIENT_ONBOARDING` | **SIM** | Rascunho / Homologada |
| **10 Serv. Extra Req** | `os-config.js` | `SERVICE_EXTRA_REQUEST` | **SIM** | Ativa |
| **11 IA Créditos** | `os-config.js` | `IA_CREDITOS_CONTROLE` | **SIM** | Ativa |
| **12 Serv. Extra Approv** | `os-config.js` | `SERVICE_EXTRA_APPROVAL`| **SIM** | Ativa |
| **13 IA Guardrail** | `os-config.js` | `IA_GUARDRAIL` | **SIM** | Ativa |
| **14 Arquivos** | `makeRoutes.js` | N/A (Usa Vercel API) | **SIM** | Ativa |
| **17 IA Gerações Log** | `os-config.js` | `GPT_GERACOES_LOG` | **SIM** | Ativa |

> **Nota Crítica sobre `makeRoutes.js`:** Rotas 10, 11, 13, 15 e 16 estão cadastradas com a flag `use_proxy: false`. Porém, como o botão real da UI usa o `os-config.js` e o `webhook-dispatcher.js`, elas acabam passando pelo Supabase Edge Function ignorando o `makeRoutes.js`. Isso prova que o `makeRoutes.js` é legado.

---

### 4. Serviços Extras (Fase 2D)

**O cliente-portal chama a ROTA 10?**
Sim. A ROTA 10 tem cenário Make real (`10_FLUXAI_SERVICO_EXTRA_REQUEST`) mapeado no Supabase proxy. Ela insere a linha na aba `06_SERVICOS_EXTRAS_CLIENTES`.
**Conflito ROTA 12:** O Plano-Mestre anterior tratava a ROTA 12 como "IA Entregas". O código de produção atual a nomeia como `SERVICE_EXTRA_APPROVAL`. A ROTA 12 **pertence** ao módulo financeiro (Aprovação e Idempotência) de Serviços Extras.
**Conclusão:** Fase 2D não pode ser declarada 100% concluída até que o fluxo (ROTA 10 -> ROTA 12) seja testado E-to-E para provar que a ROTA 10 foi totalmente desconectada da ROTA 01 antiga.

---

### 5. IA / Créditos / Guardrails

**Existem Rotas 11, 12, 13 e 17?**
*   **ROTA 11 (`IA_CREDITOS_CONTROLE`)**: Oficial. Controla os créditos mensais via aba oficial `10_IA_CREDITOS_CLIENTE`. (Aba `IA_CREDITOS_CLIENTES` no plural é obsoleta).
*   **ROTA 12**: Não é IA Entregas. Como provado acima, foi renomeada no código para Aprovação de Serviço Extra.
*   **ROTA 13 (`IA_GUARDRAIL`)**: Existente e atrelada ao proxy Supabase. Impede sobrecarga de saldo.
*   **ROTA 17 (`GPT_GERACOES_LOG`)**: Existe no `os-config.js`. Seu destino é despejar logs em arquivos (GDrive ou BD Log) e não planilhas visíveis ao cliente.

---

### 6. Drive / Arquivos

**Criação Automática vs Registro:**
A Fase 2A e o código atual de Onboarding (`onboarding.js` / Make Cópia) não possuem o robô de "Folder Gen" ativo como evento síncrono da UI. O formulário pede o envio prévio das pastas e apenas registra o link da raiz na aba `CLIENTES_ARQUIVOS`. O acesso automático do cliente ao Drive via IA também não é garantido síncronamente pela ROTA 09 (Onboarding Rascunho).

---

### 7. Fonte da Verdade (Correção da Matriz)

A matriz anterior misturou responsabilidades. A separação estrita confirmada pelos identificadores é:

*   **`04_CLIENTES_CONFIG`**: Fonte da Verdade do `status` (ativo, inativo, pausado, em_onboarding).
*   **`01_CLIENTES_ESTRATEGIA`**: Não dita status do cliente, foca unicamente em campos de briefing de mercado (Posicionamento, Tom de Voz).
*   **`02_CONTRATOS_CLIENTES`**: Controla o `status_contrato` (rascunho, vigente, cancelado).
*   **`03_SERVICOS_CLIENTES`**: Controla o `status_servico` (ativo, inativo).

---

### 8. Coerência Narrativa (Textos Onboarding)

*   **Texto Atual:** "Ativação de Ecossistema de Alto Padrão" e "Disparar Infraestrutura".
*   **Problema:** Gera conflito interno. O botão promete ligar a infraestrutura, mas o cenário (Make 09 Seguro) trava tudo em "Rascunho", bloqueando IA e Auth de propósito.
*   **Sugestão de Substituição na UI:**
    *   De "Ativação de Ecossistema" para "Preparar Infraestrutura Segura".
    *   De "Disparar Infraestrutura" para "Submeter para Revisão Interna".
Isso alinha a narrativa High-Ticket à realidade de que todo setup passa por crivo humano antes de ir ao ar, aumentando a percepção de qualidade consultiva.

---

### 9. Status do Plano-Mestre
A Fase 2M agora possui as evidências concretas. Recomenda-se, no Plano Mestre, atualizar os seguintes itens:
1. Declarar a **Duality de Proxies** (Vercel vs Supabase) como um débito técnico leve a ser unificado no futuro.
2. Confirmar a extinção de Webhooks Diretos.
3. Declarar a Fase 2M como concluída apenas com a anuência deste relatório de revisão.
