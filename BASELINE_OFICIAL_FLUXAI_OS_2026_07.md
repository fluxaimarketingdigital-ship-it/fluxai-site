# BASELINE OFICIAL DO FLUXAI OS™

**Data:** 09 de Julho de 2026
**Status:** 🟢 Plataforma Estabilizada — Baseline Operacional Oficial 2026.07

Este documento é a referência técnica e arquitetural definitiva do FluxAI OS™, estabelecendo o núcleo operacional consolidado após a homologação das fases estruturais. Nenhuma alteração no núcleo poderá ocorrer sem seguir as regras e padrões documentados aqui.

---

## 1. ARQUITETURA OFICIAL DE IDENTIDADE

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

## 2. COMPONENTES ESTRATÉGICOS CONSOLIDADOS

O núcleo operacional é suportado pelas seguintes engrenagens:

*   **Identity Resolver:** Módulo responsável por converter identificadores de legado (ex: `FLUXAI_LABS_001`) para o UUID real mapeado no Supabase de forma transparente para o RLS.
*   **Máquina de Estados (`status-system`):** Dicionário centralizado que governa o ciclo de vida e as transições de status da plataforma (Aprovado, Reprovado, Revisão, etc).
*   **Motor de Aprovação:** Interface unificada que orquestra a lógica interativa para que os clientes revisem e aprovem ativos diretamente integrados ao banco.
*   **Motor de Conteúdo:** Abstração de gerenciamento, leitura e parse da base de `PLANEJAMENTO_CONTEUDO`, nutrindo a interface.
*   **Portal do Cliente:** O ambiente vitrine voltado ao usuário final, operando via Supabase e provendo segurança por isolamento.
*   **Financeiro:** O núcleo de visualização contratual e faturamentos sob o mesmo modelo rígido de acesso restrito.
*   **RLS (Row Level Security):** A matriz de políticas mitigadas dentro do banco de dados que garante a blindagem tenant-to-tenant.
*   **Camada Supabase:** A espinha dorsal de infraestrutura para persistência (Banco), acesso (Auth) e autorização do FluxAI OS™.
*   **Integração Make:** A engrenagem acessória encarregada da execução robótica das automações conectadas aos eventos da plataforma.
*   **Google Sheets (Espelho Operacional):** Camada herdada que reflete de maneira downstream o status de operação sem ditar a lógica principal.

---

## 3. REGRAS ARQUITETURAIS OFICIAIS

Para garantir a estabilidade perene deste Baseline, todo novo desenvolvimento **deve** obedecer as seguintes leis:

1.  **Supabase é a única Fonte da Verdade.** Nenhuma operação pode conflitar com o estado armazenado lá.
2.  **Google Sheets é apenas espelho operacional.** Não deve ser tratado como banco de dados em rotinas do *Frontend*.
3.  **Make atua exclusivamente como executor de automações.** Ele não dita regras de acesso, apenas engatilha as consequências lógicas.
4.  **Nenhum módulo pode utilizar dados mockados em Produção.** JSON estáticos ou *hardcodes* provisórios são proibidos.
5.  **Toda mudança de status deve passar pela Máquina de Estados.** Fluxos não podem criar "status fantasma" de fora do `status-system.js`.
6.  **Nenhum módulo pode gravar dados críticos ignorando RLS.** Bypass via chaves de serviço ou falhas na política são estritamente vetados.
7.  **Todo módulo novo deverá consumir a camada oficial de identidade.** Consumindo `auth.users.id` atrelado aos demais fluxos de identificação unificada.
8.  **Toda evolução deverá preservar compatibilidade com o Baseline Oficial.** Nenhuma feature deverá quebrar este núcleo base estabilizado.

---

## 4. SISTEMAS HOMOLOGADOS

A certificação abrange todos os seguintes vértices:

✅ **Portal do Cliente**
✅ **Motor de Aprovação**
✅ **Motor de Conteúdo**
✅ **Financeiro**
✅ **Identity Resolver**
✅ **Máquina de Estados**
✅ **Metadata**
✅ **RLS**
✅ **Fluxo Supabase**

---

## 5. DÍVIDA TÉCNICA PLANEJADA

Os seguintes débitos estão formalmente reconhecidos no backlog do produto para resolução gradual e constante:

*   Remoção definitiva dos mocks
*   Eliminação dos `SELECT *`
*   Padronização gradual dos IDs
*   Remoção futura do fluxo legado `localStorage`
*   Auditoria contínua de RLS
*   Otimização de consultas
*   Paginação
*   Performance

---

## 6. CONGELAMENTO DO NÚCLEO

O núcleo operacional do FluxAI OS™ encontra-se **estabilizado e congelado**.

A partir deste baseline:
*   Nenhuma alteração estrutural poderá ocorrer sem auditoria.
*   Novas funcionalidades deverão ser impreterivelmente implementadas **sobre** esta base, respeitando seus limites.
*   Este documento passa a ser a referência oficial máxima de arquitetura do produto.

---

## 7. PRÓXIMO MACROBLOCO

O ciclo de desenvolvimento futuro entrará diretamente em:

**MACROBLOCO 13: "Refatoração Arquitetural e Performance"**

**Objetivos:**
*   Eliminar dívida técnica do backlog.
*   Aumentar performance visual e de latência.
*   Padronizar as consultas em banco de dados (`select` estrito).
*   Remover dependência e fluxos de legado.
*   Fortalecer ainda mais a governança do RLS.
*   Preparar a plataforma base para a expansão em escala vertical (novos painéis como *Analytics*, *IA Planner*, *GovOS*, *OdontoOS* e demais módulos vitais do negócio).
