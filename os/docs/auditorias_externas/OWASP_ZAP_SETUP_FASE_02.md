# OWASP_ZAP_SETUP_FASE_02

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Implementação de Infraestrutura Dinâmica (Fase 02)

## 1. Workflow Criado
Foi implementada a infraestrutura de Integração Contínua para o OWASP ZAP através do GitHub Actions no arquivo `.github/workflows/owasp-zap-baseline.yml`. O workflow utiliza a action oficial `zaproxy/action-baseline@v0.15.0`.

A execução foi configurada sob a diretiva `on: workflow_dispatch`, o que significa que este pipeline **não roda automaticamente** durante os `pushes`. Ele será acionado de forma estritamente manual, no momento autorizado, garantindo controle sob as janelas de auditoria da produção. Adicionalmente, `allow_issue_writing` foi setado para `false` para evitar abertura massiva de falsos positivos na aba de Issues do GitHub. O output gerado pela engine (HTML, Markdown, JSON) será exportado via `upload-artifact`.

## 2. Targets Iniciais (Escopo)
A estratégia de matriz (Matrix Strategy) foi definida para atacar isoladamente, de forma não-agressiva, duas frentes iniciais:
- **Index Principal:** `https://fluxaidigital.com.br/`
- **Frontend de Autenticação:** `https://fluxaidigital.com.br/os/login`

Nenhuma rota protegida ou autenticada (ex. command-center) faz parte deste escopo preliminar passivo.

## 3. Preservação do Código e Áreas Congeladas
- Nenhuma rota autenticada foi engatilhada no scanner.
- *Active Scan* foi expressamente proibido e suprimido na configuração deste `baseline`. A prioridade atual é capturar passivamente vazamentos e *security headers*.
- **Nenhum arquivo funcional (lógico, roteamento, CSS ou base do OS) sofreu modificação**. Auth, Supabase, RBAC, CodeQL e Sonar seguem blindados e operando sem digressão.

## 4. Próximo Passo
O passo autorizado subjacente a este Setup é a **Execução Manual do Workflow**.
O administrador deve acessar o portal do GitHub Actions no repositório, clicar em "OWASP ZAP Baseline" e acionar o botão "Run workflow".
Após a varredura, analisaremos de perto os `.html` e `.json` capturados pelos Artifacts da run.
