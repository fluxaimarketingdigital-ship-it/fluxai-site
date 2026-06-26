# CHECKPOINT: MATRIZ FUNCIONAL DOS CENÁRIOS DO MAKE

**Data da Consolidação:** 17 de Junho de 2026
**Total Oficial (Grupo A):** 24 cenários
**Sandbox (Grupo B):** 1 cenário homologado tecnicamente
**Auxiliares (Grupo C):** 1 cenário
**Status Global dos Schedules:** Todos OFF

---

## ESTRUTURA FUNCIONAL

A matriz a seguir detalha 24 atributos por cenário, divididos nos grupos especificados.

### Grupo A — Cenários Oficiais (Total: 24)
*(Conta na base oficial. Inclui o cenário 10 oficial.)*

**Registro 1**
- **1. Número:** 10
- **2. Nome Exato:** `[HOMOLOGADO] 10_FLUXAI_SERVICO_EXTRA_REQUEST`
- **3. ID Make:** 5186459
- **4. Função Principal:** Registrar solicitação inicial de serviço extra para análise interna
- **5. Origem dos Dados:** Payload do webhook
- **6. Destino dos Dados:** SERVICOS_EXTRAS_CLIENTES
- **7. Gatilho:** Webhook
- **8. Schedule:** OFF
- **9. Webhook/Rota:** SERVICE_EXTRA_REQUEST
- **10. Coleta / Cliente:** Pedido de cliente ou registro interno
- **11. Dependências:** Nenhuma dependência operacional da sandbox
- **12. Efeito Interno:** Cria registro inicial com status solicitado para análise humana
- **13. Efeito Externo:** Alerta ou comunicação de solicitação, conforme fluxo homologado
- **14. Efeito Financeiro:** Não efetiva cobrança; apenas inicia o processo de análise comercial
- **15. Exige Aprovação Humana?:** Sim
- **16. Possui Idempotência?:** Não confirmado na fotografia documental localizada
- **17. Chave de Idempotência:** Não confirmada
- **18. Risco de Duplicidade:** Baixo, porém não revalidado nesta frente
- **19. Tratamento de Erro:** Conforme cenário homologado existente; não reabrir auditoria
- **20. Possibilidade de Rollback:** Não avaliada nesta frente
- **21. Estado de Homologação:** OFICIAL / HOMOLOGADO / CONGELADO
- **22. Risco Residual:** Baixo
- **23. Aptidão Virada:** Aprovado e já oficial
- **24. Observações:** Homologado, congelado e intocável. Conta entre os 24 cenários oficiais. Não foi alterado nem utilizado nos testes da sandbox.

*(Nota: Os demais 23 cenários oficiais permanecem inalterados conforme documentação anterior).*

---

### Grupo B — Sandbox e Cópias de Trabalho
*(Não conta nos 24. Schedule OFF mantido. Não substitui cenário oficial).*

**Registro 2**
- **1. Número:** SANDBOX-10
- **2. Nome Exato:** `[SANDBOX] 10_SERVICO_EXTRA_EFETIVACAO_SEGURA`
- **3. ID Make:** 5406168
- **4. Função Principal:** Efetivar internamente serviço extra após orçamento aprovado, com criação segura dos efeitos operacionais e financeiros
- **5. Origem dos Dados:** Webhook com servico_extra_id e dados previamente registrados na aba 06_SERVICOS_EXTRAS_CLIENTES
- **6. Destino dos Dados:** 08_FINANCEIRO_CLIENTES; 07_DEMANDAS_CLIENTES; 09_COMUNICACOES_CLIENTE; 10_IA_CREDITOS_CLIENTE; SERVICOS_EXTRAS_CLIENTES no Google Sheets e Supabase
- **7. Gatilho:** Webhook instantâneo
- **8. Schedule:** OFF
- **9. Webhook/Rota:** Webhook exclusivo da sandbox sandbox_fluxai_servico_extra_efetivacao
- **10. Coleta / Cliente:** Serviço extra previamente aprovado internamente
- **11. Dependências:** 06_SERVICOS_EXTRAS_CLIENTES; 02_CONTRATOS_CLIENTES com contrato vigente; Google Sheets; Supabase
- **12. Efeito Interno:** Cria ou reconhece financeiro, demanda, comunicação em rascunho e crédito IA quando aplicável; atualiza o serviço para em_execucao
- **13. Efeito Externo:** Nenhum envio externo automático; comunicação permanece em rascunho_fluxai com revisão humana obrigatória
- **14. Efeito Financeiro:** Cria lançamento no próximo vencimento contratual ou registra cortesia quando valor aprovado for zero
- **15. Exige Aprovação Humana?:** Sim, antes do disparo; o cenário só aceita orcamento_aprovado ou reprocessamento em em_execucao
- **16. Possui Idempotência?:** Sim
- **17. Chave de Idempotência:** IDs determinísticos por servico_extra_id: FIN_, DEM_, COM_ e IA_{client_id}_{competencia}_EXTRA_{servico_extra_id}
- **18. Risco de Duplicidade:** Baixo no processamento sequencial manual validado; teste de segundo disparo não gerou duplicidade
- **19. Tratamento de Erro:** Interrupção segura no módulo com falha; sem Resume; não repetir automaticamente; preservar registros já criados para auditoria
- **20. Possibilidade de Rollback:** Parcial e manual; não existe transação atômica entre Google Sheets e Supabase
- **21. Estado de Homologação:** SANDBOX HOMOLOGADA TECNICAMENTE
- **22. Risco Residual:** Baixo a moderado: sem trava atômica de concorrência e sem autorreparo quando Sheets e Supabase divergem parcialmente
- **23. Aptidão Virada:** Apta para decisão de virada controlada, mas ainda não autorizada para produção
- **24. Observações:** Teste funcional e de idempotência aprovado em 17/06/2026. Schedule OFF. Não conta nos 24 cenários oficiais. Não substitui automaticamente o cenário oficial 10_FLUXAI_SERVICO_EXTRA_REQUEST.

---

### Grupo C — Auxiliares Técnicos
*(Não conta nos 24. Não é operacional de cliente).*

**Registro 3**
- **1. Número:** AUX-01
- **2. Nome Exato:** `Integration Make, Google Drive`
- **3. ID Make:** 5369903
- **4. Função Principal:** Backup e exportação técnica de blueprints dos cenários Make
- **5. Origem dos Dados:** API e metadados do Make
- **6. Destino dos Dados:** Google Drive
- **7. Gatilho:** Execução técnica controlada
- **8. Schedule:** OFF, salvo decisão documental posterior
- **9. Webhook/Rota:** Não aplicável
- **10. Coleta / Cliente:** Uso interno técnico
- **11. Dependências:** Make API e Google Drive
- **12. Efeito Interno:** Backup dos blueprints
- **13. Efeito Externo:** Nenhum
- **14. Efeito Financeiro:** Nenhum
- **15. Exige Aprovação Humana?:** Sim
- **16. Possui Idempotência?:** Não avaliado nesta frente
- **17. Chave de Idempotência:** Não aplicável nesta classificação
- **18. Risco de Duplicidade:** Baixo e restrito a arquivos de backup
- **19. Tratamento de Erro:** Execução técnica controlada
- **20. Possibilidade de Rollback:** Não aplicável
- **21. Estado de Homologação:** AUXILIAR TÉCNICO
- **22. Risco Residual:** Baixo
- **23. Aptidão Virada:** Não aplicável
- **24. Observações:** Não é cenário operacional oficial e não conta nos 24 cenários.
