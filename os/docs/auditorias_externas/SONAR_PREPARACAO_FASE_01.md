# SONAR_PREPARACAO_FASE_01

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Diagnóstico Inicial - Sonar

## 1. Status Atual da Base
A base do FluxAI OS™ encontra-se estabilizada e as regressões de runtime pós-auditoria de segurança foram corrigidas com sucesso. A infraestrutura core de autenticação, roteamento e controle de acesso (RBAC) opera perfeitamente integrada ao Supabase Auth, mantendo o estado 100% em RAM sem depender de web storage vulnerável. O projeto está apto a iniciar a bateria de testes de qualidade de código (Sonar).

## 2. Auditorias Já Aprovadas
- **GitHub CodeQL:** 0 alertas abertos (Aprovado).
- **Snyk (Vulnerabilidades de Dependências):** Aprovado.
- **PageSpeed / Lighthouse:** Aprovado.
- **Runtime Crítico (Console Errors):** Aprovado e estabilizado.

## 3. Áreas Congeladas
Para garantir a estabilidade das aprovações anteriores, as seguintes camadas estão **congeladas** durante a fase do Sonar:
- `os/js/os-core.js` (especificamente o core de Auth, Bootstrap e RBAC)
- `os/login.html`
- A integração com `Supabase Auth` e a configuração pública `SUPABASE_CONFIG`
- As mecânicas de State/Context Management (sem gravação de Auth em Storage)
- Lógicas de rotas limpas
- Estilos globais (CSS / `interface.css`)
- Mecanismo de fallback local mitigador do Client Portal

## 4. Riscos Envolvidos
**Mexer em Auth/RBAC/Supabase:** Modificar essas áreas para agradar métricas cosméticas do Sonar representa risco **CRÍTICO**. O fluxo atual passou por endurecimento contra injeções, exfiltração de JWT via XSS (Storage) e IDOR (validações falsas de cargo). Refatorações arbitrárias podem reabrir falhas já sanadas e reprovar no CodeQL novamente.

## 5. Objetivo da Fase Sonar
O foco absoluto é Qualidade de Código (Code Smells, Complexidade Ciclomática, Duplicações de Código, Bugs de Sintaxe Escura e Cobertura). A fase busca elevar o *Maintainability Rating*, eliminando "débitos técnicos" no frontend sem comprometer as travas de segurança arquiteturais.

## 6. Critérios de Aceite
1. O setup do projeto no SonarCloud deve ser configurado e testado.
2. Nenhuma alteração pode ser injetada no código antes do primeiro relatório (Baseline) do Sonar.
3. Não refatorar, dividir ou reescrever funções globais críticas sem evidência do Sonar e sem um plano de testes prévio.

## 7. Diagnóstico Estrutural
- **Arquitetura Atual:** O sistema é operado de forma majoritariamente estática (HTML/Vanilla JS/CSS). Não existe etapa de transpilação (Build Step/Vite/Webpack) declarada como obrigatória no front, e o `package.json` possui dependências específicas (Puppeteer, FFmpeg) possivelmente voltadas para um serviço de backend secundário.
- **Setup Sonar:** O projeto **ainda não possui** arquivo `sonar-project.properties` e **não possui** workflow do GitHub Actions (`.github/workflows/sonar.yml`) criado para disparo automático. Eles precisarão ser orquestrados na Próxima Fase de Ação.

### Arquivos Candidatos à Análise
- Todo o ecossistema `os/js/*.js` (exceção para dependências externas).
- `os/js/modules/*.js`
- `os/services/*.js`
- Camada HTML estrita para validação de marcação (`os/*.html`).

### Arquivos que Devem Ser Excluídos (Ignore List Recomendada)
Ao criar o arquivo `.properties`, recomenda-se excluir:
- `os/data/*.js` (ex.: `catalogo.data.js` e mocks massivos).
- `os/libs/*` ou scripts injetados de terceiros (CDN localizadas).
- `node_modules/**`
- Qualquer arquivo que apenas contenha *Dummy Data* ou respostas mockadas para fallback.

## 8. Próxima Ação Recomendada
**O projeto está PRONTO para iniciar a instrumentação do Sonar.**

A próxima etapa autorizada é **exclusivamente infraestrutural**:
1. Criar e submeter o arquivo `sonar-project.properties` contendo o setup base do projeto (`sonar.projectKey`, `sonar.sources`, `sonar.exclusions`).
2. Criar e submeter o GitHub Action (`.github/workflows/sonar.yml`) para conectar ao SonarCloud.

*Nenhuma linha de código fonte será alterada durante essa etapa de infraestrutura.*
