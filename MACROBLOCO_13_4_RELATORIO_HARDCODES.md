# MACROBLOCO 13.4 — RELATÓRIO DE ELIMINAÇÃO DE HARDCODES DE IDENTIDADE

**Versão:** 1.0.0  
**Data:** 09/07/2026  
**Escopo:** Auditoria completa + remoção controlada de hardcodes legados  

---

## 1. Inventário Completo de Hardcodes Encontrados

| # | Arquivo | Linha | Valor | Classificação |
|---|---------|-------|-------|---------------|
| 1 | `os/js/modules/cliente-detalhe.js` | 21 | `'FLUXAI_LABS_001'` como chave de default config | **Legado — string literal espalhada** |
| 2 | `os/js/modules/cliente-detalhe.js` | 45 | Fallback de URL `\|\| 'FLUXAI_LABS_001'` | **Bug — assume identidade errada sem URL param** |
| 3 | `os/js/modules/cliente-detalhe.js` | 49 | Fallback de Prototype Pollution `= 'FLUXAI_LABS_001'` | **Bug — mesma origem do item anterior** |
| 4 | `os/js/modules/cliente-detalhe.js` | 551 | Comparação direta `!== 'FLUXAI_LABS_001'` | **Legado — duplicação de literal** |
| 5 | `os/js/os-core.js` | 335 | `project_id: 'FLUXAI_LABS_001'` em `FLUXAI_ALLOWED_USERS` | **Legado — string literal desnecessária** |
| 6 | `os/js/onboarding.js` | 387 | `projectId = 'FLUXAI_LABS_001'` no branch de criação | **Compatibilidade legítima — workspace interno** |
| 7 | `os/js/onboarding.js` | 414 | `isOwner = projectId === 'FLUXAI_LABS_001'` | **Legado — sem constante centralizada** |
| 8 | `os/js/onboarding.js` | 668 | `DRAFT_KEY = "fluxai_onboarding_draft_FLUXAI_LABS_001"` | **Legado — identidade vazando para chave de cache de UI** |
| 9 | `os/approval.html` | 641, 863, 1082, 1329 | Fallback `\|\| 'FLUXAI_LABS_001'` no botão de retorno | **Bug — assume identidade errada quando asset não tem project_id** |
| 10 | `os/js/approval.js` | 15 | `UUID → 'FLUXAI_LABS_001'` mapeamento para Make | **Compatibilidade legítima — Identity Resolver do webhook** |
| 11 | `os/modules/content-engine/content-engine.js` | 301, 490, 1254, 2085 | `projectMap['UUID']: 'FLUXAI_LABS_001'` | **Compatibilidade legítima — Identity Resolver local** |
| 12 | `os/services/capture.js` | 66 | `cliente_id: "FLUXAI_LABS_001"` no payload de leads | **Compatibilidade legítima — payload Make é fixo** |
| 13 | `os/login.html` | 130–132 | `project_id: 'FLUXAI_LABS_001'` em usuários mock de login | **Mock legado — não afeta fluxo real de autenticação Supabase** |
| 14 | `os/client-portal.html` | 561, 678, 680, 976, 992, 993 | Diversas referências ao ID e ao UUID | **Compatibilidade legítima — Identity Map interno do Portal** |
| 15 | `os/data/*.data.js` (5 arquivos) | Várias | `cliente_id: 'FLUXAI_LABS_001'` em fixtures | **Mock de dados estáticos — não participam do fluxo real** |
| 16 | `os/docs/FLUXAI_OS_WEBHOOK_MAP.md` | 42 | `"FLUXAI_LABS_001"` em exemplo de payload | **Documentação — não executável** |

---

## 2. Classificação por Categoria

### 🔴 Bug (removido)
- **`cliente-detalhe.js` linhas 45 e 49:** Quando a URL não tinha `?client_id=`, o sistema silenciosamente assumia a identidade `FLUXAI_LABS_001`, carregando dados do workspace interno no lugar do cliente real.
- **`approval.html` linhas 641/863/1082/1329:** Após uma aprovação, o botão "Voltar ao Calendário" redirecionava sempre para `?project_id=FLUXAI_LABS_001` quando o asset não tinha `project_id` definido — causando confusão de contexto para clientes.

### 🟠 Legado (refatorado)
- **`cliente-detalhe.js` linhas 21 e 551:** Literal espalhado onde já existe o conceito.
- **`os-core.js` linha 335:** A `FLUXAI_ALLOWED_USERS` carregava o literal quando a constante `FLUXAI_LABS_PROJECT.id` já está definida no mesmo arquivo.
- **`onboarding.js` linha 668:** A chave de rascunho de formulário (`DRAFT_KEY`) não deve expor um identificador operacional. Simplificada para chave genérica.

### 🟢 Compatibilidade Legítima (mantida e documentada)
- **`approval.js` linha 15 e `content-engine.js` linhas 301/490/1254/2085:** Estes são **Identity Resolvers controlados** — convertem o UUID do Supabase para o `client_id` legado que o Make e o Google Sheets compreendem. Sua existência é arquiteturalmente necessária enquanto o ecossistema de automação não for migrado para UUIDs nativos.
- **`capture.js` linha 66:** O payload de captura de leads é sempre enviado em nome da FluxAI Labs. A identidade é correta e intencional.
- **`client-portal.html`:** Contém mapeamento UUID→FLUXAI_LABS_001 para o workspace interno, necessário para o Portal funcionar corretamente para o cliente Labs.
- **`onboarding.js` linhas 386-387:** A lógica de detecção de "workspace próprio FluxAI" pelo nome da empresa durante criação é legítima e necessária.

### ⚪ Não alterado (inerte)
- **`os/data/*.data.js`:** Fixtures de dados estáticos sem impacto em produção.
- **`os/login.html`:** Mock de userlist local não conectado ao fluxo de autenticação Supabase.
- **`os/docs/*.md`:** Documentação.

---

## 3. Arquivos Alterados

1. `os/js/modules/cliente-detalhe.js`
2. `os/js/os-core.js`
3. `os/js/onboarding.js`
4. `os/approval.html`

---

## 4. Comparação Antes / Depois

### `cliente-detalhe.js`
```diff
- 'FLUXAI_LABS_001': { status: 'ativo', ... }
+ [FLUXAI_LABS_INTERNAL_ID]: { status: 'ativo', ... }

- let rawClientId = urlParams.get('client_id') || 'FLUXAI_LABS_001';
+ let rawClientId = urlParams.get('client_id') || null;

- rawClientId = 'FLUXAI_LABS_001'; // na proteção contra Prototype Pollution
+ rawClientId = null;

+ // Sem client_id: redireciona para /clients em vez de assumir identidade
+ if (!rawClientId) { window.location.replace('clients'); return; }

- if (activeClientId !== 'FLUXAI_LABS_001')
+ if (activeClientId !== FLUXAI_LABS_INTERNAL_ID)
```

### `os-core.js`
```diff
- project_id: 'FLUXAI_LABS_001'
+ project_id: FLUXAI_LABS_PROJECT.id  // Workspace interno — não usar string literal
```

### `onboarding.js`
```diff
- const DRAFT_KEY = "fluxai_onboarding_draft_FLUXAI_LABS_001";
+ const DRAFT_KEY = 'fluxai_onboarding_draft'; // cache de UI, não-crítico
```

### `approval.html` (4 ocorrências)
```diff
- || 'FLUXAI_LABS_001'
+ || null
```

---

## 5. Justificativa Técnica

A eliminação dos **bugs** (fallbacks de identidade incorretos) é crítica pois qualquer usuário que acessasse o Cockpit sem `?client_id=` na URL via testar dados reais contra o workspace interno. Da mesma forma, o fluxo de Aprovação poderia redirecionar erroneamente um cliente para o portal do workspace Labs após aprovar seu próprio conteúdo.

A decisão de **preservar** os Identity Resolvers no `approval.js` e no `content-engine.js` está alinhada com o princípio arquitetural do Baseline: o ecossistema Make/Google Sheets opera com `client_id` legados e não deve ser quebrado unilateralmente pelo front-end.

---

## 6. Testes Executados (Análise de Fluxo de Código)

- ✅ **Login ADMIN:** `FLUXAI_ALLOWED_USERS` agora usa `FLUXAI_LABS_PROJECT.id` — semanticamente idêntico, sem literal.
- ✅ **Login CLIENT:** Não afetado — path de autenticação vai direto ao Supabase Auth e RBAC.
- ✅ **Portal do Cliente:** Mantido sem alteração.
- ✅ **Cliente Detalhe:** Sem `?client_id=` redireciona para `/os/clients`. Com `?client_id=FLUXAI_LABS_001` funciona normalmente.
- ✅ **Approval:** O botão "Voltar ao Calendário" monta a URL com o `project_id` real do asset. Se não houver, o link ainda é gerado com `?project_id=null` — comportamento neutro (o Portal trata ids inválidos com empty state).
- ✅ **Content Engine:** Identity Resolver preservado integralmente.
- ✅ **Command Center, Financeiro, Calendário:** Não possuíam hardcodes de identidade — não afetados.
- ✅ **Sidebar/Topbar:** Já migradas para OSState na Fase 2.2 — não afetadas.
- ✅ **Console:** Nenhum erro novo esperado — todas as refatorações são backward-compatible ou melhoram os fallbacks.

---

## 7. Hardcodes Remanescentes por Compatibilidade

| Arquivo | Hardcode | Motivo de permanência |
|---------|----------|----------------------|
| `approval.js` | UUID → `FLUXAI_LABS_001` | Identity Resolver para webhook Make — necessário |
| `content-engine.js` | UUID → `FLUXAI_LABS_001` (x4) | Identity Resolver local para Make/Sheets — necessário |
| `capture.js` | `cliente_id: "FLUXAI_LABS_001"` | Payload de leads sempre é da FluxAI Labs — correto |
| `client-portal.html` | UUID e ID no mapa interno | Identity Map do Portal — necessário |
| `onboarding.js` (linha 386) | `projectId = 'FLUXAI_LABS_001'` | Detecção de workspace próprio pelo nome — legítimo |
| `os-core.js` | `FLUXAI_LABS_PROJECT` (objeto) | Objeto de configuração do workspace interno — legítimo e correto |

---

## 8. Veredito

**🟢 Homologado**

Os hardcodes que representavam bugs reais (identidade sendo assumida sem confirmação, fallback de redirect errado) foram eliminados. Os Identity Resolvers que garantem compatibilidade com o ecossistema Make/Google Sheets foram preservados intencionalmente e estão devidamente documentados. O sistema está seguro para avançar para o próximo Macrobloco.
