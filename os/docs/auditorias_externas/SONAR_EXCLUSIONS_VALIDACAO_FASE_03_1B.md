# SONAR_EXCLUSIONS_VALIDACAO_FASE_03_1B

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Validação e Correção de Exclusões (Fase 03.1B)

## 1. Status do Quality Gate
O Quality Gate do SonarCloud rodou e atingiu o status de **Passed**, o que certifica que a base aprovada no CodeQL mantém sua integridade sistêmica. Contudo, observou-se que o escopo avaliado ainda estava sujo.

## 2. O Problema Identificado
Os arquivos que deveriam ter sido excluídos (ex.: `6d4r246u11q1ip40r8qngkra2nfe57.html`, `old_portal.html`, pastas `os/_deprecated_*`) continuaram pontuando negativamente no total de Open Issues (baixando de 707 apenas para 696). Isso significa que as expressões regulares do `sonar.exclusions` não estavam sendo reconhecidas globalmente pelo scanner do SonarCloud.

Não houve nenhuma quebra no sistema, apenas um vício de leitura no motor do Sonar.

## 3. Ajustes de Configuração Realizados

Para forçar o scanner a dropar a leitura desses arquivos mortos, as seguintes infraestruturas foram ajustadas:

**A. No `sonar-project.properties`:**
- A chave `sonar.sources` foi alterada para `.` (para abraçar a raiz e indexar coerentemente os patterns com wildcard `**/`).
- A regra `sonar.exclusions` recebeu padrões `**/` explícitos e globais de wildcard para evitar conflitos de caminhos absolutos vs relativos.
- Adicionada a diretiva `sonar.coverage.exclusions` clonando as exclusões, para evitar falsos positivos de Cobertura nesses arquivos mortos.

**B. No GitHub Actions (`.github/workflows/sonar.yml`):**
- Foi incluída a diretiva `projectBaseDir: .` no step do SonarSource, garantindo que o runner aplique as regras relativas a partir da raiz verdadeira.

## 4. Preservação do Código Funcional
Reafirma-se categoricamente a Regra Absoluta do projeto: **nenhum código funcional foi alterado**.
As camadas intocáveis (Auth, RBAC, Supabase, `os-core.js`, roteamento, `interface.css` e storage) seguem 100% blindadas e em estado original aprovado.

## 5. Próxima Etapa
Um novo `push` foi feito. O commit `chore(sonar): enforce exclusions for legacy files` acionará outra varredura. Espera-se que a contagem massiva de issues nestes arquivos suprimidos desabe, refletindo exclusivamente a saúde dos arquivos limpos do FluxAI OS™. Nenhuma correção de issue ativa será feita até o escopo se confirmar limpo.
