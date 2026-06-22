# STG-04: GATE 3 — MÓDULO DE CONFIGURAÇÃO CENTRAL

## Solução Implementada
Dado o ambiente Vanilla JS sem processo de *build* no frontend, foi adotada a criação do script global de configuração.

1. **`os/config/env.example.js`**: Criado como template para definição do objeto `window.FLUXAI_ENV`. Ele define variáveis de frontend requeridas: `FLUXAI_ENVIRONMENT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ALLOW_MAKE_DISPATCH`.
2. **`.env.preview.example`**: Criado na raiz para exemplificar as variáveis server-side injetadas pela Vercel no `api/make-proxy.js`.
3. **`os-config.js`**: Atualizado para abandonar hardcodes (como as chaves da SUPABASE_CONFIG) e passar a consumir `window.FLUXAI_ENV`.
4. **Gitignore:** O arquivo `os/config/env.js` (com valores preenchidos) deve ser incluído no `.gitignore` para garantir que secrets locais não subam ao repósitório.

## Valores Mandatórios de Staging
```javascript
window.FLUXAI_ENV = {
  FLUXAI_ENVIRONMENT: "staging",
  SUPABASE_URL: "https://[URL_STAGING].supabase.co", // Substituível em laboratório
  ALLOW_MAKE_DISPATCH: false,
  ALLOW_EXTERNAL_COMMUNICATION: false,
  ALLOW_SCHEDULED_EXECUTION: false
};
```
