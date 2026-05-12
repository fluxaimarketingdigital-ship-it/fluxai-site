# Documentação Técnica: Arquitetura FluxAI OS™ (v2.0)

Esta documentação descreve a infraestrutura pragmática da FluxAI OS™, focada em modularidade, governança e escalabilidade.

## 1. Princípios de Design
- **Domain-Driven Modules**: Cada recurso reside em sua própria pasta com lógica e dados isolados.
- **Shell-Component Pattern**: A interface (Sidebar, Topbar) é injetada dinamicamente para garantir consistência.
- **RBAC (Role-Based Access Control)**: Controle de acesso granular baseado em papéis (`ADMIN`, `OPERATOR`, `CLIENT`).
- **Silent Intelligence**: Camadas de IA (GPT/Intelligence) integradas como infraestrutura, não como chat.

## 2. Estrutura de Pastas
```text
/os
  /core         -> Motor central (Auth, Router, State, ErrorHandler)
  /components   -> Componentes UI reutilizáveis
  /modules      -> Recursos independentes (CRM, Content, etc)
  /services     -> Abstrações técnicas (API, Storage, Notifications)
  /config       -> Definições globais (Routes, Config)
  /styles       -> Design System CSS
```

## 3. Fluxo de Autenticação e RBAC
O `OS_AUTH` gerencia a sessão no `localStorage`.
- As rotas em `routes.js` definem quais papéis têm acesso a cada módulo.
- O `SidebarOS` filtra os links visíveis dinamicamente.
- O `check()` do Auth é executado na inicialização de cada módulo.

## 4. Camada de Dados e Persistência
- **ApiService**: Wrapper de `fetch` com suporte a interceptores e tokens.
- **StorageService**: Camada de persistência que prepara os dados para sincronização em nuvem (Cloud Ready).
- **Mock Sync**: Dados estáticos residem em `*.data.js` para prototipagem rápida, mas são consumidos como se fossem APIs.

## 5. Governança e Monitoramento
- **ErrorHandler**: Captura exceções globais e promessas rejeitadas.
- **Telemetry**: Logs operacionais são armazenados para auditoria técnica.
- **Toasts**: Feedback de sistema institucional e discreto.
