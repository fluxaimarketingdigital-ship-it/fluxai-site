# BLOCO 03: EDIÇÃO DE ONBOARDING E ESCOPO OPERACIONAL

**Status:** Planejado com Governança
**Data:** 05/06/2026

## 1. Objetivo da Funcionalidade
O FluxAI OS ganha a capacidade de **Editar Onboarding**. Clientes mudam de escopo (adicionam Ads, cancelam CRM, aumentam verba) e o sistema precisa refletir isso sem duplicar o client_id e sem destruir o histórico.

## 2. Campos Liberados para Edição
A interface permitirá alteração controlada de:
- Identidade da Marca (Tom de voz, dores, segmento)
- Canais (Ativar/Desativar redes)
- Módulos (Upsell e Downsell de serviços)
- Ads & Conteúdo (Verba, CPL, Frequência)
- Contrato (Fee, Vencimento, SLA)

## 3. Regras de Mutação e Governança
- **Proibido:** Alterar tokens, permissões de sistema e custos operacionais internos sem nível ADMIN.
- **Desligamento Seguro:** Se um serviço (ex: Orgânico & SEO) for removido na edição, ele é marcado como pausado/encerrado, garantindo a retenção dos dados antigos na aba SERVICOS_CLIENTES.
- **Transição de Coleta:** Mudar de manual para pi exige revalidação de token.
- **Gatilho de Roadmap:** Ao salvar uma edição que altera escopo ou canais, o usuário recebe um prompt: *"Deseja regenerar o Roadmap IA com o novo escopo?"*.

## 4. Matriz de Logs (Auditoria)
Qualquer alteração via tela de Edição injeta um log rastreável no sistema:
- ONBOARDING_UPDATED
- ONBOARDING_SCOPE_CHANGED
- ONBOARDING_SERVICE_ADDED / PAUSED / ENDED
- ONBOARDING_FINANCIAL_UPDATED
- ONBOARDING_ROADMAP_REGENERATED

Cada payload do log registrará o "Antes e Depois" (valor_anterior vs valor_novo), responsável e timestamp.
