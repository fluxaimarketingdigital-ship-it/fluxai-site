# Checkpoint de Homologação: Fase 2D (Portal do Cliente e Serviços Extras)

**Data da homologação:** 11 de Junho de 2026  
**Cliente usado no teste:** Executa Group (client_id: `EXECUTA_GROUP_003`)  
**Commits relacionados:** `baf7d9c`, `db6461a` e `03231d4`  

## 1. Fluxo Homologado
O fluxo do Portal do Cliente focado em Solicitações Extras foi concluído e validado em produção. O acesso autenticado foi comprovado via Supabase Auth (role `CLIENT`), mantendo rígida blindagem por `client_id`.

## 2. Dados do Teste Final
- **Rota Usada:** `ROTA_OS_01_PORTAL_DEMANDAS` (via proxy `api/make-proxy`)
- **Aba de Destino Temporária:** `07_DEMANDAS_CLIENTES`
- **Resultado do Teste:** Sucesso. Registro `DEM_FLUXAI_2026_06_4320` criado corretamente com campos comerciais preservados.

## 3. Regra de Negócio Consolidada
**A separação é absoluta.** O cliente *não* abre demanda mensal contratada. As demandas mensais/recorrentes são planejadas e inseridas internamente pelo time operacional da FluxAI. O botão do Portal do Cliente é utilizado exclusivamente para **"Solicitar Serviço Extra"** (fora do escopo).

## 4. Status de Execução e Pendências Futuras
**Status Atual:** Fase 2D Homologada em modo *transitório*.

**Pendência Futura:**  
Atualmente, os serviços extras estão caindo na rota e planilha de Demandas Mensais (`07_DEMANDAS_CLIENTES`). Assim que a nova rota comercial estiver auditada, o fluxo final deverá migrar de forma permanente para:
- **Rota Alvo:** `ROTA_OS_10_SERVICO_EXTRA`
- **Aba Alvo:** `06_SERVICOS_EXTRAS_CLIENTES`

> Nenhuma alteração no RBAC, Auth, Fase 2A (Onboarding) ou CSP foi realizada nesta etapa. O sistema permanece hermeticamente seguro.
