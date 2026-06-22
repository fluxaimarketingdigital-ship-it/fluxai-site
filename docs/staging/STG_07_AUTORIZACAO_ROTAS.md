# STG-07: GATE 4 — AUTORIZAÇÃO POR ROLE E SCOPE

Pós-Autenticação (Gate 3), o Proxy Backend implementou Middleware Secundário (`checkRole`):
1. Captura o `auth.uid()`.
2. Emite uma query Server-to-Server contra o Banco de Dados `profiles` e obtém Role e Escopo reais da Governança.
3. Cruza os dados com as permissões cadastradas no Objeto de Rota (`ROUTE_REGISTRY`).

Se um Cliente Tentar chamar `export_logs_administrativos` (permitido só a ADMIN), o Proxy intercepta e emite HTTP 403 Forbidden antes que o disparo externo (Make) ocorra.
