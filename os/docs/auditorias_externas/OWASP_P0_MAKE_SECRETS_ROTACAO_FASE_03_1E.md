# OWASP_P0_MAKE_SECRETS_ROTACAO_FASE_03_1E

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Checklist Operacional de Secrets Supabase e Rotação Make (Fase 03.1E)

## 1. Resumo da Fase
A *Supabase Edge Function* `make-proxy` foi esculpida com sucesso no repositório. Porém, até este instante, a infraestrutura se encontra desvinculada. O frontend oficial segue acoplado ao `WEBHOOK_CONFIG` original. O objetivo tático desta etapa é puramente processual: documentar o checklist de revogação/inserção de senhas para preparar o terreno do deploy.

## 2. Motivo da Rotação (Invalidation)
As URLs de rotas do Make.com listadas em `os/config/os-config.js` são universalmente lidas por visitantes do Frontend. Dado o atesto de exposição do *OWASP ZAP*, todos os endereços lá embutidos são agora considerados irreversivelmente **comprometidos**. Eles não devem ser movidos para as Variáveis do Supabase; eles devem ser sumariamente descartados.

## 3. Ações Críticas no Painel do Make
Para restaurar a integridade da pipeline, execute as seguintes etapas **para cada um dos 11 cenários vitais**:
- Entrar no painel de automação correspondente do Make.
- Desacoplar o módulo *Webhook* original (e não deletar até a migração terminar, apenas pausar).
- Criar um webhook **100% NOVO** para atrelar ao cenário.
- Copiar essa URL recém-formada e isolá-la localmente; ela será injetada somente no Supabase.
- **Sob nenhuma hipótese** reutilizar a string de webhook que outrora habitou o repositório público.
- Testar o envio de dados via cURL ou Postman simulado após ancorar o novo webhook.

## 4. Lista Oficial de Secrets Esperados (Supabase Vault)
Estas variáveis de ambiente injetarão vida ao Proxy assim que criadas no Supabase. Os valores devem ser estritamente os novos Webhooks:
- `MAKE_WEBHOOK_DEMAND_SUBMISSION=<set in Supabase>`
- `MAKE_WEBHOOK_LEAD_CAPTURE=<set in Supabase>`
- `MAKE_WEBHOOK_CLIENT_ONBOARDING=<set in Supabase>`
- `MAKE_WEBHOOK_SERVICE_EXTRA_REQUEST=<set in Supabase>`
- `MAKE_WEBHOOK_IA_CREDITOS_CONTROLE=<set in Supabase>`
- `MAKE_WEBHOOK_AI_OPERATIONAL_CONTROL=<set in Supabase>`
- `MAKE_WEBHOOK_SERVICE_EXTRA_APPROVAL=<set in Supabase>`
- `MAKE_WEBHOOK_IA_GUARDRAIL=<set in Supabase>`
- `MAKE_WEBHOOK_PLANEJAMENTO_CONTEUDO=<set in Supabase>`
- `MAKE_WEBHOOK_CALENDARIO_POSTAGENS=<set in Supabase>`
- `MAKE_WEBHOOK_GPT_GERACOES_LOG=<set in Supabase>`

## 5. Injeção de Secrets via Supabase CLI
A injeção pode ser procedida pelo *Dashboard web* ou com rigor pelo Supabase CLI (mascarados por `<masked>` por razões de auditoria). Exemplo do comando sintático operacional:
```bash
supabase secrets set MAKE_WEBHOOK_DEMAND_SUBMISSION="https://hook.<masked>"
supabase secrets set MAKE_WEBHOOK_CLIENT_ONBOARDING="https://hook.<masked>"
# Repetir para os 11 endpoints...
```

## 6. Checklist de Validação Protetiva (Go / No-Go)
Antes de engatilhar qualquer alteração no frontend React/Vanilla (`os-config.js`), avalie este gate:
- [ ] Todas as 11 variáveis existem setadas no Cloud do Supabase?
- [ ] As URLs antigas do Make foram neutralizadas (Desligadas / Pausadas)?
- [ ] O código fonte ou os `.env` da branch `main` continuam sem hospedar credenciais/segredos reais?
- [ ] A Edge Function `make-proxy` compila perfeitamente de forma isolada?
- [ ] O código fonte da `make-proxy` foi vistoriado atestando que **não ecoa** a variável secreta num *Response.Body* acidental?
- [ ] A rota `LEAD_CAPTURE` permanece sinalizada como exceção pública e as demais aguardam `Authorization Bearer`?

## 7. Critério de Bloqueio (O que invalida a Migração)
O projeto engessará permanentemente na Fase 03.1E se for identificado:
- Ausência de mapeamento nas chaves do Supabase.
- Webhooks defasados recebendo carga de trabalho na retaguarda.
- Cópias locais ou residuais do `WEBHOOK_CONFIG` expostas em arquivos sub-dependentes de frontend após a migração futura.
- Edge Function contendo falhas cruciais de lint ou syntax error que frustrem o Deploy.

## 8. Próxima Fase (Fase 03.1F)
Após a conclusão impecável do checklist listado na Etapa 6, ocorrerá:
**O Deploy Controlado da Edge Function.** Enviaremos a estrutura finalizada da `make-proxy` atrelada à *Cloud*, testando unitariamente uma única rota pacífica e estática (ex. Capture Lead) de baixa dependência contratual, cruzando contra a blindagem do novo Supabase Secret.
