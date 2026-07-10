# BASELINE OFICIAL DO FLUXAI OS™

**Versão:** 1.0.0
**Codinome:** Baseline Operacional Oficial
**Data:** 09/07/2026
**Status:** 🟢 Plataforma Estabilizada
**Documento:** Oficial
**Tipo:** Baseline Arquitetural

---

## 1. PRINCÍPIOS DO FLUXAI OS™

1. **Supabase é a única Fonte da Verdade.**
2. **Toda mudança de estado deve passar obrigatoriamente pela Máquina de Estados.**
3. **Toda autenticação deve utilizar a identidade oficial do Supabase.**
4. **Google Sheets nunca pode substituir o banco.** É apenas espelho operacional.
5. **Make atua exclusivamente como executor.** Nunca como motor de regras de negócio.
6. **Compatibilidade com legado deverá existir somente através das camadas oficiais.** Nunca por hardcodes espalhados pelo sistema.
7. **Toda evolução deverá preservar este Baseline.**

---

## 2. ARQUITETURA OFICIAL DE IDENTIDADE

A estrutura de identidade da plataforma foi consolidada, reconhecendo as diferentes naturezas dos identificadores. A arquitetura oficial de chaves e relacionamentos passa a ser:

*   **Usuário:** → `auth.users.id` (UUID) - *Base de autenticação nativa Supabase.*
*   **Projeto:** → `projects.id` (UUID) - *Identificador único de projetos.*
*   **Cliente:** → `client_id` (Identificador de Negócio) - *Chave textual de referência comercial.*
*   **Planejamento:** → `planejamento_id` - *Referência da pauta global.*
*   **Conteúdo:** → `content_asset_id` - *Referência do ativo unitário de mídia.*
*   **Contrato:** → `contrato_id` - *Identificador de acordo formal.*
*   **Financeiro:** → `financeiro_id` - *Identificador de faturamento e fluxo.*

> O **Identity Resolver** permanece estritamente como a camada de compatibilidade, traduzindo as chamadas de interface do legado e garantindo conformidade segura entre o identificador de negócio e a validação oficial do UUID.

---

## 3. COMPONENTES ESTRATÉGICOS

O núcleo operacional é suportado pelas seguintes engrenagens:

### Identity Resolver
*   **Responsabilidade:** Converter identificadores legados para UUID real mapeado no Supabase.
*   **Entradas:** Identificador de negócio (ex: `FLUXAI_LABS_001`).
*   **Saídas:** `auth.users.id` (UUID) para validação.
*   **Dependências:** Sessão autenticada ativa no Supabase.

### Máquina de Estados (`status-system`)
*   **Responsabilidade:** Governar o ciclo de vida e transições de status do ecossistema.
*   **Entradas:** Requisições de mudança de status (aprovar, rejeitar, revisar).
*   **Saídas:** Status mapeado, validado e padronizado.
*   **Dependências:** Nenhuma (Módulo agnóstico e central).

### Portal do Cliente
*   **Responsabilidade:** Ambiente vitrine principal voltado ao usuário final (Tenant).
*   **Entradas:** Interações de navegação e consumo do usuário.
*   **Saídas:** Requisições de busca para o banco de dados.
*   **Dependências:** Módulos de Autenticação, RLS, Camada Supabase.

### Motor de Conteúdo
*   **Responsabilidade:** Abstração de gerenciamento, leitura e parsing de pautas de conteúdo.
*   **Entradas:** Requisições do Portal ou do Motor de Aprovação.
*   **Saídas:** Estruturas de dados consolidadas de `PLANEJAMENTO_CONTEUDO`.
*   **Dependências:** Supabase Database (Tabelas de Conteúdo).

### Motor de Aprovação
*   **Responsabilidade:** Lógica interativa para revisão, aprovação e feedback de ativos.
*   **Entradas:** Ações do usuário final (aprovações, comentários, ressalvas).
*   **Saídas:** Eventos de atualização no banco de dados.
*   **Dependências:** Motor de Conteúdo, Máquina de Estados, RLS.

### Financeiro
*   **Responsabilidade:** Camada de visualização contratual e fluxos de faturamento.
*   **Entradas:** Solicitações de listagem de contratos/faturas.
*   **Saídas:** Dados restritos unicamente ao tenant autenticado.
*   **Dependências:** Supabase Database, Identity Resolver.

### Camada RLS (Row Level Security)
*   **Responsabilidade:** Matriz de políticas no PostgreSQL que garante o isolamento dos dados.
*   **Entradas:** Token JWT contendo `auth.uid()` em cada transação.
*   **Saídas:** Filtro implícito que permite ou bloqueia a leitura/escrita de registros.
*   **Dependências:** Engine do banco de dados (Supabase PostgreSQL).

### Supabase
*   **Responsabilidade:** Espinha dorsal de infraestrutura para persistência e autorização.
*   **Entradas:** Requisições HTTP (REST) do frontend web.
*   **Saídas:** Respostas JSON de queries e controle de sessão via JWT.
*   **Dependências:** Nenhuma (Fonte da Verdade máxima).

### Make
*   **Responsabilidade:** Executor autônomo de automações downstream operacionais.
*   **Entradas:** Eventos acionados a partir do Supabase ou webhooks paralelos.
*   **Saídas:** Integrações para serviços terceiros, alimentação de relatórios.
*   **Dependências:** APIs externas, Webhooks habilitados.

### Google Sheets (Espelho Operacional)
*   **Responsabilidade:** Refletir a visão tabular legada das operações sem deter lógica de negócio primária.
*   **Entradas:** Lotes de dados gravados pela automação (Make).
*   **Saídas:** Visualização de linhas e planilhas para a equipe interna.
*   **Dependências:** Disparos de sincronização bem-sucedidos do Make.

---

## 4. GOVERNANÇA DO NÚCLEO

*   **Nenhuma alteração estrutural poderá ser feita sem auditoria.**
*   **Toda alteração deverá ser registrada.**
*   **Todo Macrobloco deverá atualizar este Baseline.**
*   **Todo componente novo deverá obedecer às regras arquiteturais.**
*   **Toda alteração crítica deverá possuir rollback documentado.**

---

## 5. VERSIONAMENTO FUTURO

| Versão | Data       | Descrição                                 | Responsável | Situação   |
|--------|------------|-------------------------------------------|-------------|------------|
| v1.0.0 | 09/07/2026 | Primeiro Baseline Oficial do FluxAI OS™   | Equipe Core | Homologado |

---

## 6. DÍVIDA TÉCNICA E PRÓXIMO MACROBLOCO

**Macrobloco 13: "Refatoração Arquitetural e Performance"**
O próximo ciclo oficial endereçará débitos estruturais remanescentes:
*   Remoção definitiva de mocks hardcoded e `SELECT *`.
*   Padronização de IDs para mitigação progressiva da dependência do Identity Resolver.
*   Expurgo definitivo do cache e fluxo legado atrelado puramente ao `localStorage`.
*   Aperfeiçoamento contínuo de RLS, performance de banco e paginação em views massivas.

---

--------------------------------------------------------

DOCUMENTO CONTROLADO

Baseline Oficial do FluxAI OS™

Versão:
1.0.0

Status:
Oficial

Toda alteração arquitetural deverá gerar nova versão deste documento.

Este documento passa a ser a principal referência técnica da plataforma.

Nenhuma evolução estrutural poderá contrariar as regras aqui estabelecidas.

--------------------------------------------------------
