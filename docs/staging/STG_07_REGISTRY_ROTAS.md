# STG-07: GATE 2 — REGISTRY CENTRAL DE ROTAS

Foi estabelecido um mapa de rotas (Route Registry) estático no Proxy Backend para travar destinos.
* Exemplo de Objeto de Registry validado no Proxy:

```javascript
const ROUTE_REGISTRY = {
  "onboarding_cliente": {
    roles_permitidas: ["ADMIN", "OPERATOR"],
    metodo: "POST",
    destino_logico: "MOCK_WEBHOOK_01",
    campos_bloqueados: ["role", "client_id"],
    status: "habilitada_em_staging"
  }
};
```
* **Regra de Fogo:** Qualquer requisição originada do `makeClient.js` cujo `route_name` não bata com as chaves do objeto acima resultará em `404/403 Route Unregistered`. Nenhuma URL absoluta de Webhook será aceita vinda do Frontend.
