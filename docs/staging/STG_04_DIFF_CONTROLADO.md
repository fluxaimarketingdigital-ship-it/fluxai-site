# STG-04: GATE 15 — DIFF CONTROLADO E REVISÃO

## Arquivos Modificados (na branch `staging/fluxai-os`)
1. **`os/services/makeClient.js`**
   * **Anterior:** Fallback explícito `if (!routeConfig.use_proxy) { targetUrl = ... }`.
   * **Novo:** Exceção atômica `if (routeConfig.use_proxy === false) { throw new Error(...) }`.
   * **Impacto:** Bloqueio severo de conexões P2P indesejadas (sem proxy).
2. **`os/config/os-config.js`**
   * **Anterior:** Hardcodes de URL na propriedade `SUPABASE_CONFIG.url` e falta de verificação cruzada de contaminação.
   * **Novo:** Detecção via `window.FLUXAI_ENV` e bloco estático de proteção (Fail-Closed) e renderização visual do Badge STG.
   * **Impacto:** Desvinculação entre o código base estático e o destino dinâmico dos requests.

## Segurança do Snapshot
* **Nenhuma alteração na branch principal `main`.**
* **Nenhum secret versionado ou exposto ao controle do Git.**
* **Nenhuma migração SQL foi aplicada via TCP.**
* **Nenhum webhook disparado no cURL/Fetch durante o tooling local.**
