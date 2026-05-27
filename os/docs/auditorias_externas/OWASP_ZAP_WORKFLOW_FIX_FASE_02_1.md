# OWASP_ZAP_WORKFLOW_FIX_FASE_02_1

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Correção Cirúrgica de Workflows (CodeQL + Artifacts ZAP)

## 1. Problema Identificado
O CodeQL acusou um falso positivo / warning em relação à ausência de restrição explícita de permissões (least-privilege) nos nossos workflows (`sonar.yml` e `owasp-zap-baseline.yml`). Adicionalmente, o OWASP ZAP Action falhou em gerar o artefato porque o `cmd_options` customizado alterou os nomes de saída esperados internamente pela engine do GitHub Actions. Houve também um alerta genérico de depreciação sobre o Node.js 20 para actions legadas.

## 2. Correções Realizadas (Infraestrutura)
Nenhum código do projeto ou runtime foi alterado.

**A. Nível de Permissões (Least-Privilege)**
Foi inserido o bloco mínimo global nos arquivos `.github/workflows/sonar.yml` e `.github/workflows/owasp-zap-baseline.yml`:
```yaml
permissions:
  contents: read
```
Isso satisfaz as travas do CodeQL, prevenindo injeções de commit ou PR modifications se a CI/CD for comprometida.

**B. Geração de Relatórios do ZAP (Artifacts Fix)**
- Removemos as bandeiras customizadas de nomeação (`-r`, `-w`, `-J`) no passo `Run ZAP Baseline Scan`.
- Ajustamos o `Upload ZAP Reports` para resgatar os outputs originais e padrão da action: `report_html.html`, `report_md.md` e `report_json.json`.
- Aprimoramos o artefato final usando uma Matrix expandida (`slug: root` e `slug: login`), gerando arquivos claros como `zap-report-root.zip` e `zap-report-login.zip`.

**C. Deprecation do Node 20**
Foi embutido o flag ambiental `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` como mitigação preventiva no job do ZAP para forçar o uso do runtime 24, blindando contra avisos de depreciação do GitHub.

## 3. Próximo Passo
- O **OWASP ZAP Baseline** deve ser reexecutado de forma manual (Workflow Dispatch) na aba Actions para validar as saídas `.html`, `.md` e `.json`.
- As auditorias anteriores (CodeQL, Sonar) permanecem verdes.
