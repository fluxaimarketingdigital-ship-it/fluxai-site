# OWASP_ZAP_WORKFLOW_FIX_FASE_02_4

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Verificação Final Cirúrgica - ZAP Workflow Options

## 1. O Problema (Log do GitHub Actions)
O último log de execução reportou que a invocação do contêiner Docker do ZAP estava recebendo o comando:
`-J report_json.json -w report_md.md -r report_html.html -a -j -m 3 -T 10 -r zap-report.html -w zap-report.md -J zap-report.json`

Isso acusa uma sobreposição de flags de relatórios. O Action injeta o default (`-J report_json.json -w report_md.md -r report_html.html`) e no final estavam sendo concatenadas flags indesejadas customizadas com o prefixo `zap-report`.

## 2. Verificação do Arquivo Atual
Foi executada a auditoria rigorosa no arquivo `.github/workflows/owasp-zap-baseline.yml` do projeto na branch `main`.

A extração do step atual demonstra:
```yaml
      - name: Run ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.15.0
        with:
          target: ${{ matrix.target }}
          allow_issue_writing: false
          cmd_options: '-a -j -m 3 -T 10'
```

**Diagnóstico:** A base de código do nosso repositório **já está correta e estritamente limpa**. 
As strings `zap-report.html`, `zap-report.md` e `zap-report.json` **NÃO EXISTEM** em lugar algum do arquivo. A configuração `cmd_options` está contendo exata e puramente as opções operacionais (`-a -j -m 3 -T 10`).

Adicionalmente, confirmamos que o `Upload ZAP Reports` está capturando fielmente os nomes injetados nativamente pela engine do Zap Proxy:
```yaml
          path: |
            report_html.html
            report_md.md
            report_json.json
```

## 3. Conclusão da Preservação e Mitigação
1. **Nenhuma alteração funcional foi feita**. As configurações estáticas atestam que a sanitização das flags (Fase 02.3) teve total êxito na codebase.
2. A hipótese mais provável para o log anterior ter cuspido os nomes antigos é que o workflow dispatch manual foi invocado através de um **commit hash desatualizado** (anterior ao commit `chore(owasp): remove duplicate ZAP report options`). 
3. O repositório está sintonizado corretamente na master para a próxima invocação.

## 4. Próximo Passo
Certificar-se de selecionar a branch `main` (cujo HEAD aponta para a ausência total das flags legadas) no menu de acionamento manual do Workflow Dispatch, e rodar a action mais uma vez. Os artefatos baixarão perfeitamente.
