# SONAR_ESCOPO_FASE_03_1

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Refinamento de Escopo (Fase 03.1)

## 1. Motivo da Limpeza de Escopo
A primeira análise do SonarCloud identificou aproximadamente 707 issues brutos (incluindo 4 Security Hotspots e uma alta carga de Duplications). O diagnóstico constatou que a ferramenta contabilizou arquivos soltos não-oficiais, páginas legadas, relatórios deprecados e mock-ups obsoletos que não compõem a esteira ativa de compilação ou do runtime real do OS. Esse ruído impede a criação de uma baseline verídica sobre a manutenibilidade do sistema.

## 2. Nenhuma Correção Funcional Efetuada
De acordo com os protocolos de congelamento da base funcional homologada pelo CodeQL, **nenhuma refatoração de código, alteração lógica ou ajuste em componentes do sistema foi feita**. O isolamento do Supabase, Auth, RBAC e estilos globais foi integralmente mantido.

## 3. Arquivos e Pastas Excluídos
A chave `sonar.exclusions` no `sonar-project.properties` foi expandida. Além dos arquivos isolados por padrão (Node/Dist/Build/Mocks), foram adicionados os seguintes blocos legados e inúteis à auditoria:
- `os/_deprecated_*/**`
- `os/_deprecated_20260520_1104/**`
- `portal_antigo.html`
- `old_portal.html`
- `6d4r246u11q1ip40r8qngkra2nfe57.html`
- `**/*antigo*.html`
- `**/*old*.html`

*(Os ignores parciais baseados em ruleKeys para áreas congeladas como `os-core.js` permanecem ativos conforme fase anterior, sem adição de novos).*

## 4. Diretriz sobre Arquivos Antigos
Quaisquer falhas remanescentes, security hotspots ou issues críticas sinalizadas pelo Sonar que eventualmente residam nestas áreas excluídas (legadas, antigas ou obsoletas) **não devem orientar refatoração**. O esforço de blindagem é reservado puramente ao código ativo servido ao cliente em produção.

## 5. Próxima Etapa
A próxima análise (disparada em decorrência do commit desta documentação) trará um laudo saneado, expurgando dezenas/centenas de falsos positivos decorrentes de sucatas da raiz do projeto. O diagnóstico passará a espelhar a **qualidade real e manutenibilidade do runtime ativo**. Nenhuma aprovação de fase do Sonar é declarada até os resultados retornarem processados e auditados.
