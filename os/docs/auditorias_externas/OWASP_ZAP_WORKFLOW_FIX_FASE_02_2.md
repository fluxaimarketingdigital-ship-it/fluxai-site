# OWASP_ZAP_WORKFLOW_FIX_FASE_02_2

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Correção Cirúrgica de Workflows - Geração de Artifacts ZAP

## 1. Problema Identificado
O workflow do OWASP ZAP Baseline abortou a etapa de `Upload ZAP Reports` acusando que o arquivo `/home/runner/work/fluxai-site/fluxai-site/report_md.md does not exist`. 
A raiz do problema estava no fato de que o `zaproxy/action-baseline@v0.15.0`, quando utilizado com modificadores em `cmd_options`, pode não engatilhar a saída automática dos relatórios `.html`, `.md` e `.json` sem as bandeiras explícitas de nomenclatura, desincronizando os outputs gerados com a instrução do `upload-artifact`.

## 2. Correções Realizadas
- **Forçar Nomenclatura no ZAP:** Atualizamos a diretiva `cmd_options` no arquivo `.github/workflows/owasp-zap-baseline.yml` injetando expressamente as flags de saída: `-r report_html.html -w report_md.md -J report_json.json`.
- **Diagnóstico Adicionado:** Adicionamos um step protetivo intermediário de telemetria `List generated files` (`ls -la`), instruído com a condicional `if: always()`. Caso a engine do ZAP falhe em parsear internamente, teremos o log transparente listando o conteúdo absoluto do diretório antes da falha no upload.
- **Node 20 Warning:** Mantido sem intervenção adicional, priorizando a estabilização do scan central do ZAP sem poluir o workflow com fixes tangenciais.

## 3. Preservação do Runtime
**A Regra Absoluta do Projeto foi honrada.** 
Nenhuma alteração foi realizada no runtime, arquitetura ou arquivos funcionais do FluxAI OS™. O `os-core.js`, roteamento, RBAC e Supabase permanecem intocáveis. 

## 4. Próximo Passo
Re-disparar o workflow `OWASP ZAP Baseline` manualmente na aba Actions para atestar o sucesso da captação dos arquivos `.zip` do report de auditoria.
