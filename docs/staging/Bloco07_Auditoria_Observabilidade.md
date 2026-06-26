# AUDITORIA DE OBSERVABILIDADE (Bloco 07 - Fase 1)

## 1. Logs Atuais e Retenção
- **Frontend:** Apenas `console.log` e alertas. Efêmero (morre no browser do usuário). Nenhuma retenção ou envio a um serviço central (como Sentry ou Datadog).
- **Vercel (Proxy):** Utiliza `console.info` e `console.error`. Retenção nativa baixíssima (dependendo do plano, expira em dias). Extremamente difícil de buscar histórico sem integração com Data Dog / Logflare.
- **Make.com:** Guarda o histórico visual das bolhas, mas tem retenção limitada imposta pelo plano contratado (30 a 60 dias). A busca nativa por um payload específico dentro do Make é precária.
- **Supabase:** Mantém os logs nativos do Postgres e Auth, porém não existia camada de aplicação. Com a nova tabela `transactions`, a retenção passa a ser contínua e persistente.

## 2. A Tabela `transaction_events`
Atualmente ela foi desenhada apenas para rastrear transições de status: `from_status` e `to_status` do tipo `transaction_status` (`received`, `processing`, `completed`, `failed`). 
**Lacuna encontrada:** As transições genéricas (ex: de `processing` para `failed`) não explicam **quem/onde** causou a falha (se foi no Proxy validando o JWT, se foi no Make processando o HTTP, ou se foi no negócio ao criar a pasta no Drive). 

## 3. Observabilidade por Camada (Como está vs Como deve ficar)
| Camada | Observabilidade Atual | Capacidade Pós Bloco 07 |
| :--- | :--- | :--- |
| **Frontend** | Cega. | Assina e guarda o Correlation ID. |
| **Vercel Proxy** | Logs efêmeros perdidos. | Grava eventos `proxy_received` e `proxy_dispatched` no Supabase. |
| **Make.com** | Histórico isolado (Silo). | Dispara webhook reverso para o Supabase: `make_received`, `business_completed`. |
| **Supabase (DB)** | Tabela `transactions` recém criada. | Atua como a "Caixa Preta" definitiva do avião, armazenando toda a linha do tempo do `correlation_id`. |

## 4. O Teste do Correlation ID
**Dado um `correlation_id`, consigo reconstruir tudo?**
Atualmente: **NÃO**. O Make recebe o ID (enviado pelo Proxy no Bloco 06), mas o Make não "devolve" atualizações para o Supabase. O banco de dados para no status `processing`.
Para que a resposta seja **SIM**, precisamos implementar o "Webhook Reverso de Status" (Fase 2).
