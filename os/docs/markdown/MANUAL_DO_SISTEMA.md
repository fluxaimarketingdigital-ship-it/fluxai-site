# MANUAL DO SISTEMA — FluxAI OS™
## Visão Geral e Arquitetura de Operações

---

## 1. Visão Geral do FluxAI OS™
O **FluxAI OS™** é o Sistema Operacional Corporativo definitivo da **FluxAI**. Ele atua como painel de comando e governança, centralizando a operação de clientes, produção de conteúdo estratégico baseado em IA, faturamento de contratos, CRM comercial e monitoramento sistêmico de conexões.

O objetivo do sistema é unir a flexibilidade operacional à segurança de nível enterprise, estabelecendo barreiras rígidas para evitar vazamentos de dados, estouros de custos operacionais e falhas de sincronização.

---

## 2. Camadas do Sistema
O FluxAI OS™ é dividido em 4 camadas estruturais de tecnologia e responsabilidade:

1.  **Camada de Interface e Apresentação (Frontend):** Desenvolvida em HTML e Vanilla Javascript, estruturada estritamente sob o design system [interface.css](../../styles/interface.css) para garantir silêncio visual, tempos de resposta ultrarrápidos e coerência de design.
2.  **Camada de Governança, Autenticação e Usuários:** Gerenciada via **Supabase**. O banco Supabase gratuito armazena exclusivamente metadados de autenticação, roles e sessões de usuários (ADMIN, OPERATOR, CLIENT) e IDs de vínculo mínimo de projetos.
3.  **Camada de Persistência Operacional (Banco de Dados):** Centralizada no **Google Sheets**. A planilha operacional atua como repositório dinâmico para os dados de faturamento, andamento de demandas, leads e planejamento editorial. Arquivos pesados, mídias e contratos PDF são armazenados exclusivamente no **Google Drive**.
4.  **Camada de Integração e Automação (Middleware):** Orquestrada pelo **Make.com**. Webhooks transacionais recebem payloads da interface do OS, executam as atualizações em tempo real nas planilhas e retornam confirmações de sucesso.

---

## 3. Os Três Centros Oficiais de Controle
A interface de equipe é dividida em três centros de controle com base nas atribuições de segurança (RBAC):

```
                     ┌──────────────────────────────────────────┐
                     │          FluxAI OS™ Topbar               │
                     └────────────────────┬─────────────────────┘
                                          │
                  ┌───────────────────────┼───────────────────────┐
                  ▼                       ▼                       ▼
      ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
      │    Command Center     │  │   Operations Center   │  │   Executive Center    │
      │   (Operação Diária)   │  │   (Gargalos/Status)   │  │  (Faturamento/MRR)    │
      │   Roles: ADMIN/OP     │  │   Roles: ADMIN/OP     │  │   Roles: ADMIN Only   │
      └───────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

1.  **Command Center (`command-center.html`):** O cockpit da rotina diária rápida. Exibe KPIs de coletas pendentes de faturamento, alertas imediatos de status crítico de clientes e a tabela de saúde geral do portfólio.
2.  **Operations Center (`operations-center.html`):** O monitoramento sistêmico da equipe. Acompanha a ocupação dos limites operacionais de IA, o backlog de relatórios mensais e demandas, a fila de posts aguardando publicação manual assistida e falhas/erros de webhook.
3.  **Executive Center (`executive-center.html`):** A visão corporativa da diretoria. Mostra métricas agregadas de receita recorrente (MRR), forecasts de faturamento, inadimplência e churn, gestão de leads comerciais (CRM) e controle de vigência contratual.

---

## 4. Diretrizes Fundamentais de Operação
*   **Sem Automações de Disparo (WhatsApp/Instagram):** Toda publicação no Instagram e envio de lembretes/cobranças no WhatsApp ocorrem de forma **manual assistida**. O sistema gera os links, copia as legendas e caminhos de arquivo automaticamente para a área de transferência do operador, mas cabe a ele acionar o gatilho final.
*   **Consistência Transacional:** Nenhuma alteração no status de entregas ou faturamento é persistida localmente antes de o webhook correspondente no Make retornar sucesso HTTP 200.
*   **Google Drive como Repositório de Arquivos:** Mídias pesadas, criativos brutas, PDFs de contratos assinados e relatórios exportados ficam no Drive, mantendo o banco operacional Sheets e o Supabase leves.
