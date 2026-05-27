# Guia de Execução de Validações Externas

Este guia orienta o operador de qualidade sobre como rodar e extrair os resultados das cinco principais ferramentas externas de validação escolhidas para atestar o FluxAI OS™.

**Siga estritamente as regras de segurança estabelecidas.** Não conecte contas externas oficiais ou dados sensíveis aos scanners.

---

## 1. PageSpeed Insights / Lighthouse

**O que testar:** 
Performance de carregamento, métricas de Core Web Vitals, Acessibilidade, Boas Práticas de interface e SEO on-page.

**Link da Ferramenta:**
- [PageSpeed Insights (Web)](https://pagespeed.web.dev/)
- Painel Lighthouse integrado no Google Chrome DevTools (Aba *Lighthouse*).

**Qual URL usar:**
- Localmente: suba o servidor na porta local (`localhost:4040`) e use o DevTools Lighthouse nas rotas principais (`/os/login.html`, `/os/command-center.html`, `/os/content-engine.html`).

**Como exportar o resultado:**
- Se usar o Chrome DevTools: No canto superior direito da aba Lighthouse, clique no menu de opções e selecione "Print Summary" (salvar como PDF).

**Quais prints tirar:**
- Screenshot do painel superior contendo os 4 círculos de pontuação (Performance, Accessibility, Best Practices, SEO).

**Onde salvar as evidências:**
- Pasta: `os/docs/auditorias_externas/01_pagespeed_lighthouse/`
- Arquivos: `lighthouse_score.png`, `lighthouse_report_completo.pdf`

---

## 2. Snyk

**O que testar:** 
Análise de Vulnerabilidades em Software Open Source (SCA). Verifica dependências no `package.json` para falhas conhecidas de segurança (CVEs).

**Link da Ferramenta:**
- [Snyk CLI](https://snyk.io/)

**Qual arquivo usar:**
- Arquivo alvo: `package.json` localizado na raiz do projeto.

**Como executar (CLI Local):**
```bash
# Na raiz do projeto:
npm install -g snyk
snyk test > snyk_report.txt
```

**Como exportar o resultado:**
- O comando acima já exportará a saída para o arquivo texto.
- Se usar a interface web (Snyk Open Source), exporte o sumário visual em PDF da página do projeto.

**Quais prints tirar:**
- Print do terminal resumindo "Tested N dependencies for known issues, found X issues."

**Onde salvar as evidências:**
- Pasta: `os/docs/auditorias_externas/02_snyk/`
- Arquivos: `snyk_report.txt`, `snyk_terminal.png`

---

## 3. GitHub CodeQL

**O que testar:** 
Análise Estática de Segurança de Código (SAST). Encontra padrões de código vulneráveis (ex: Injeção de código, Cross-Site Scripting, vazamentos de lógica).

**Link da Ferramenta:**
- [GitHub CodeQL via GitHub Actions](https://docs.github.com/pt/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning)
- [CodeQL CLI Local](https://github.com/github/codeql-cli-binaries)

**Qual repositório usar:**
- Clone o código em um repositório privado estritamente para teste, garantindo a higienização de qualquer token antes do envio.
- Alvo primário: Arquivos `.js` em `os/js/` e scripts da raiz.

**Como exportar o resultado:**
- O CodeQL exporta relatórios padronizados no formato `.sarif` (Static Analysis Results Interchange Format).

**Quais prints tirar:**
- Dashboard da aba `Security > Code scanning alerts` do repositório no GitHub.

**Onde salvar as evidências:**
- Pasta: `os/docs/auditorias_externas/03_codeql/`
- Arquivos: `codeql_results.sarif`, `code_scanning_alerts.png`

---

## 4. SonarCloud / SonarLint

**O que testar:** 
Qualidade geral do código (Code Smells), dívida técnica (Technical Debt), cobertura de código e potenciais bugs lógicos não estruturais.

**Link da Ferramenta:**
- [SonarCloud](https://sonarcloud.io/)
- [SonarLint (Extensão IDE)](https://www.sonarsource.com/products/sonarlint/)

**Qual arquivo/repositório usar:**
- Para execução rápida: Use o **SonarLint** diretamente no VS Code na pasta `os/`.
- Para execução profunda: Analise o diretório raiz apontando para o SonarCloud via `sonar-scanner`.

**Como exportar o resultado:**
- Via SonarCloud: Acesse o "Quality Gate" e gere um PDF do dashboard executivo da página principal do projeto.

**Quais prints tirar:**
- Print do "Quality Gate" mostrando as notas (A, B, C) de *Reliability*, *Security*, *Maintainability*.

**Onde salvar as evidências:**
- Pasta: `os/docs/auditorias_externas/04_sonarcloud/`
- Arquivos: `quality_gate_dashboard.png`, `sonar_issues_list.pdf`

---

## 5. OWASP ZAP (Zed Attack Proxy)

**O que testar:** 
Teste Dinâmico de Segurança (DAST) simulando um ataque de caixa preta contra o sistema em execução (XSS dinâmico, vulnerabilidades em cabeçalhos HTTP, clickjacking).

**Link da Ferramenta:**
- [OWASP ZAP Download](https://www.zaproxy.org/)

**Qual URL usar:**
- Inicie o servidor local isolado (porta 4040).
- URL de ataque DAST: `http://localhost:4040/` (Spider passará pelos links acessíveis).
- **Importante:** Não ataque o domínio de produção oficial. Teste apenas no `localhost`.

**Como exportar o resultado:**
- No menu do ZAP, navegue para *Report > Generate HTML/PDF Report*.

**Quais prints tirar:**
- Aba "Alerts" com o resumo da árvore de vulnerabilidades encontradas classificadas por bandeiras coloridas (Vermelho = Crítico).

**Onde salvar as evidências:**
- Pasta: `os/docs/auditorias_externas/05_owasp_zap/`
- Arquivos: `zap_dast_report.pdf`, `zap_alerts_tree.png`

---

## 🏁 Fluxo Final de Auditoria

1. **Gere os arquivos** em suas respectivas pastas.
2. **Atualize a Matriz** localizada em `VALIDACAO_EXTERNA_INDEPENDENTE.md` com os riscos e status.
3. Se um risco **🔴 CRÍTICO** for encontrado, interrompa o fluxo e crie um plano de contingência antes de finalizar a auditoria técnica.
