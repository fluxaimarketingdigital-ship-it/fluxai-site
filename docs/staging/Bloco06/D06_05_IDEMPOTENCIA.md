# INVENTÁRIO DE IDEMPOTÊNCIA

**Existe proteção contra duplicidade no Proxy?**
Não existe.

**Existe idempotency_key?**
Não no lado do Proxy e não é forçada nativamente. A tabela `public.transactions` recém projetada suporta `idempotency_key`, porém o `api/make-proxy.js` não exige, não gera e não checa esta chave. O frontend envia apenas IDs estáticos baseados em tempo (ex: `DEM_FLUXAI_YYYY_MM_XXX`), que servem mais para rastreio humano do que proteção criptográfica de retry.

**Existe deduplicação?**
Inexistente na fronteira da Vercel.

**Existe replay protection?**
Inexistente. Requisições idênticas enviadas N vezes resultarão em N invocações faturadas no Make e N ações sequenciais.
