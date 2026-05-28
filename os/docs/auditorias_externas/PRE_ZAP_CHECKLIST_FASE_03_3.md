# CHECKLIST PRÉ-ZAP (FASE 03.3)

Data: 27/05/2026
Objetivo: Validação de Estado para Varredura OWASP ZAP (Fase 03.3)

---

## 1. Integridade do Repositório
- [x] Árvore Git limpa.
- [x] Commit de referência: `2e53a82` (ou o mais recente de limpeza).

## 2. Erradicação de P0 (Webhooks Make)
- [x] `hook.us` eliminado do código fonte (`os-config.js`, `.env.example`, `integrations.js` sanitizados).
- [x] `make.com` eliminado como endpoint de API direto.
- [x] Rota Edge Function `make-proxy` validada em produção.
- [x] Proxy exige Header `X-FluxAI-Proxy-Key`.
- [x] Proxy sem chave retorna `401 Unauthorized`.

## 3. Integridade Funcional (Regressões - Bloco 3)
A validação manual ou sintética atesta o funcionamento de:
- [x] Login (ADMIN, OPERATOR, CLIENT) funcional e seguro.
- [x] Sidebar renderiza condicionalmente com base na Role.
- [x] Rotas proibidas redirecionam corretamente para `access-denied`.
- [x] Cockpit Operacional e Dashboard intactos.
- [x] Telas de Clientes, Contratos/Financeiro, Relatórios e Leads funcionais.
- [x] Formulários principais (LeadCapture) processam via `make-proxy`.

## 4. Requisitos de Backlog Resolvidos
- [x] Payload do formulário agora transita o campo `lead_id` formatado como `LEAD-YYYYMMDD-HHMMSS`.

---

## ROTEIRO DE EXECUÇÃO: OWASP ZAP (Produção)

**Aviso:** Conforme protocolo, a ferramenta automatizada não executa o scanner em domínio de produção. Esta ação deve ser efetuada manualmente pelo Engenheiro de Segurança Operacional.

**Passo a Passo de Varredura:**
1. Iniciar OWASP ZAP (Desktop ou Docker).
2. Configurar o target para a URL de produção do FluxAI OS™.
3. Habilitar **Active Scan** configurado com políticas de Injection, XSS, Security Headers e CSP.
4. Incluir o header `User-Agent: FluxAI-Security-Scanner` caso exista WAF intermediário bloqueando o spidering.
5. Iniciar varredura (Automated Scan).
6. Exportar relatório em XML/HTML.

**Critérios de Aceite:**
- High (Crítico): 0 ocorrências.
- Médio: Documentados com plano de ação ou classificados como Falso Positivo.
- Baixo/Informacional: Catalogados.
- Nenhuma regressão detectada em formulários (Lead) ou login durante as simulações de payload do ZAP.

---

*(Fim do Checklist de Preparação)*
