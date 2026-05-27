# OWASP_ZAP_PREPARACAO_FASE_01

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Preparação da Auditoria Dinâmica (DAST) - OWASP ZAP

## 1. Objetivo da Auditoria
O OWASP ZAP (Zed Attack Proxy) será utilizado para realizar a auditoria dinâmica (DAST - Dynamic Application Security Testing) do FluxAI OS™ em ambiente de produção. O objetivo primário é mapear a superfície de ataque em runtime, analisando o comportamento do servidor, cabeçalhos de resposta HTTP, vazamentos sensíveis e integridade de sessão que as auditorias estáticas (CodeQL/SonarCloud) não conseguem cobrir sozinhas.

## 2. Escopo Inicial (Rotas Públicas e Controladas)
A análise passiva do crawler deve ser orientada primordialmente às seguintes rotas ativas:
- https://fluxaidigital.com.br/
- https://fluxaidigital.com.br/os/login
- https://fluxaidigital.com.br/os/access-denied
- https://fluxaidigital.com.br/os/client-portal
- https://fluxaidigital.com.br/os/command-center
- https://fluxaidigital.com.br/os/governance-users
- https://fluxaidigital.com.br/os/logs

## 3. Cuidados e Limites Operacionais
**Regra de Ouro:** Não serão conduzidos testes destrutivos.
- Não executar testes de Brute Force.
- Não executar Fuzzing agressivo que possa induzir indisponibilidade no servidor ou corromper memória.
- Não injetar ou submeter Payloads que alterem dados reais do projeto (SQL Injection DML).
- Não executar ataques autenticados via Active Scan sem um checklist separado e estrito que proteja os dados de produção.

## 4. Vetores de Validação Prioritária
A varredura focará no diagnóstico e mitigação de:
- Ausência ou configuração inadequada de Security Headers.
- Content Security Policy (CSP).
- Proteção contra Clickjacking (`X-Frame-Options` ou `frame-ancestors`).
- Implementação estrita de HSTS.
- Falhas de Mixed Content (HTTP em HTTPS).
- Integridade e flags de Cookies/Session.
- Exposição acidental de arquivos sensíveis ou diretórios abertos.
- Tentativas de acesso a rotas internas operacionais sem sessão válida estabelecida.
- Manipulação e exposição de Erros HTTP (Stack trace).
- Vulnerabilidades a XSS (Cross-Site Scripting) refletido básico.
- Exposição desnecessária de informações técnicas de servidores e infraestrutura (Server Signatures).

## 5. Critérios de Severidade (Triage)
Os achados do ZAP deverão ser catalogados sob o seguinte prisma de criticidade operacional:
- **Crítico:** Exposição de token de sessão, bypass direto de autenticação (acesso sem login real) ou acesso indevido à área administrativa.
- **Alto:** XSS comprovadamente explorável, ausência de headers essenciais (como CORS mal configurado resultando em impacto real) ou rotas sensíveis respondendo publicamente.
- **Médio:** Configurações fracas, ausência formal de header securitário ou exibição de stack traces técnicos no client.
- **Baixo:** Recomendações genéricas de hardening ou falsos positivos prováveis apontados pelo crawler.

## 6. Critérios de Aprovação
O FluxAI OS™ somente receberá a chancela de "Aprovado no OWASP ZAP" e avançará se, e somente se:
- Não houver comprovação de bypass de login.
- Não for confirmada a exposição de token/sessão.
- Não for possível um usuário de role `CLIENT` ou `anônimo` acessar as restrições hierárquicas designadas ao `ADMIN`.
- Não houver XSS injetável passível de execução em código vivo.
- Achados de categorização Média ou Baixa forem todos documentados para resolução contínua (Backlog Técnico de Segurança).

## 7. Próximo Passo
A execução mandatória imediata é rodar o **OWASP ZAP Baseline Scan**. Este scan inicial deve ser primordialmente passivo (Passive Scan), mapeando a árvore da infraestrutura da URL principal antes que se autorize qualquer Active Scan contra as interfaces sensíveis.
