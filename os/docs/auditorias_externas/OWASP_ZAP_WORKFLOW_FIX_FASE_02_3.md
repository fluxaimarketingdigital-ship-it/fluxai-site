# OWASP_ZAP_WORKFLOW_FIX_FASE_02_3

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Correção Cirúrgica de Workflows - Duplicação de Relatórios ZAP

## 1. Contexto e Sucesso Parcial
A execução do OWASP ZAP Baseline provou que a esteira operacional do Action conseguiu atingir o alvo e rodar os testes dinâmicos:
- **FAIL-NEW:** 0
- **WARN-NEW:** 17
- **PASS:** 53

No entanto, o erro logístico do *Upload ZAP Reports* persistiu (`File report_md.md does not exist`), barrando o output visual dos arquivos pelo GitHub Actions.

## 2. Diagnóstico da Duplicação
Os logs da última execução apontaram que o container Docker subjacente ao Action estava interpretando o `cmd_options` e misturando com os argumentos *default* do próprio Action (`zaproxy/action-baseline`). Isso resultava no envio de parâmetros redundantes para o contêiner do ZAP:
`-J report_json.json -w report_md.md -r report_html.html` seguidos de outros iguais/duplicados.
O ZAP nativamente rechaça inputs duplicados que sobrescrevem os caminhos de relatório.

## 3. Correções Aplicadas
Removemos totalmente as instruções de formatação que havíamos imposto (`-r`, `-w`, `-J`) de dentro do `cmd_options` no `.github/workflows/owasp-zap-baseline.yml`.
O comando foi estabilizado para a sua função restrita (somente opções de scan):
`cmd_options: '-a -j -m 3 -T 10'`

Essa correção devolve à action do ZAP o monopólio da nomeação dos relatórios e resolve o conflito da flag de saída.

## 4. Preservação Total
Reforçamos que **nenhum arquivo de código em produção, roteamento ou lógica do OS foi tocado**. A integridade das camadas de Segurança (Supabase/RBAC) segue 100% como homologada. A correção atual afeta puramente o CI do GitHub Actions.

## 5. Próximo Passo
Com os caminhos de saída reconciliados, instrui-se rodar novamente o **OWASP ZAP Baseline** via Workflow Dispatch. A coleta dos relatórios `.zip` deverá agora ser resolvida positivamente.
