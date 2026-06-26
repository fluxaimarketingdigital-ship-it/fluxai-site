# INVENTÁRIO DE OBSERVABILIDADE E STATUS (PROXY)

## Distinção de Status: Network vs Business
Atualmente, o `api/make-proxy.js` **falha estruturalmente** em distinguir Sucesso de Rede de Sucesso de Negócio.
Se o webhook do Make recebe a mensagem HTTP (Network 200/202), o proxy retorna `success: true`. O Frontend, por sua vez, exibe ao usuário "Operação realizada com sucesso!". 
Entretanto, se o fluxo do Make sofrer crash na inserção do banco de dados 2 segundos depois (Business Status = Failed), o usuário já recebeu falso positivo.

## Rastreabilidade Sistêmica
**Logs Atuais:** 
```javascript
console.info(`[Make Proxy] Forwarded ${routeId}. Status: ${makeRes.status}`);
```
Este é o único log presente na Edge Function. Fica retido nos logs efêmeros da Vercel.

**Auditoria:** 
Não existe. Ninguém sabe se um funcionário real do cliente A, um invasor anônimo, ou o Admin foi o originador do disparo, pois o proxy não anota a identidade na camada de banco de dados (`transaction_events`), delegando tudo cegamente para o webhook do Make.
