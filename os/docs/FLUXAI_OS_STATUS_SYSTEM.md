# FLUXAI OS™ — SISTEMA DE STATUS
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_STATUS_SYSTEM.md`

---

## Princípio

Status não é apenas cor. Status é **estado operacional real**.
Todo status tem: chave técnica, label legível, cor semântica e implicação de ação.

---

## Mapa Completo de Status

### Clientes

| Chave | Label | Badge | Implicação |
|-------|-------|-------|-----------|
| `onboarding` | Em Onboarding | `warning` | Dados incompletos, não operacional ainda |
| `ativo` | Ativo | `success` | Make rodando, coleta ativa |
| `pausado` | Pausado | `neutral` | Operação parada temporariamente |
| `inativo` | Inativo | `danger` | Contrato encerrado |

### Leads

| Chave | Label | Badge | Próxima Ação |
|-------|-------|-------|-------------|
| `novo` | Novo | `success` | Operador deve contatar |
| `contatado` | Contatado | `info` | Aguardar resposta |
| `em_negociacao` | Em Negociação | `warning` | Enviar proposta |
| `proposta_enviada` | Proposta Enviada | `info` | Aguardar decisão |
| `convertido` | Convertido | `success` | Iniciar onboarding |
| `perdido` | Perdido | `danger` | Registrar motivo |

### Demandas

| Chave | Label | Badge | SLA |
|-------|-------|-------|-----|
| `aberta` | Aberta | `info` | Aguarda início |
| `em_andamento` | Em Andamento | `warning` | Em execução |
| `aguardando` | Aguardando | `neutral` | Bloqueada por terceiro |
| `entregue` | Entregue | `success` | Concluída |
| `cancelada` | Cancelada | `danger` | Interrompida |

### Serviços Extras

| Chave | Label | Badge | Quem Age |
|-------|-------|-------|---------|
| `solicitado` | Solicitado | `info` | FluxAI deve orçar |
| `em_orcamento` | Em Orçamento | `neutral` | FluxAI calculando |
| `orcamento_enviado` | Orçamento Enviado | `warning` | Cliente deve aprovar |
| `aprovado` | Aprovado | `primary` | FluxAI deve executar |
| `em_producao` | Em Produção | `info` | Em execução |
| `entregue` | Entregue | `success` | Cliente deve aprovar |
| `cancelado` | Cancelado | `danger` | — |
| `recusado` | Recusado | `danger` | — |

### Relatórios Mensais

| Chave | Label | Badge | Fluxo |
|-------|-------|-------|-------|
| `rascunho` | Rascunho | `neutral` | Make gerou, operador deve revisar |
| `em_revisao` | Em Revisão | `info` | Operador revisando |
| `aprovado_internamente` | Aprovado Internamente | `warning` | Pronto para enviar ao cliente |
| `enviado_ao_cliente` | Enviado ao Cliente | `success` | Cliente pode visualizar |

### Gerações de IA

| Chave | Label | Badge | Crédito | Quem Pode Alterar |
|-------|-------|-------|---------|------------------|
| `rascunho` | Rascunho | `neutral` | 0 | Operador/Admin |
| `em_revisao` | Em Revisão | `info` | 0 | Operador/Admin |
| `aprovado` | Aprovado | `warning` | 1 consumido | Operador/Admin |
| `publicado` | Publicado | `success` | definitivo | Operador/Admin |
| `descartado` | Descartado | `neutral` | 0 (pré-aprovação) | Operador/Admin |

### Tokens / Integrações

| Chave | Label | Badge |
|-------|-------|-------|
| `ativo` | Ativo | `success` |
| `ausente` | Não Configurado | `neutral` |
| `aguardando_autorizacao` | Aguardando Autorização | `warning` |
| `expirado` | Expirado | `danger` |

---

## Como Usar no Código

```js
import { STATUS_CONFIG } from '/os/config/os-config.js';

// Resolver label e badge de um status
const { label, badge } = STATUS_CONFIG.resolve('LEAD', 'em_negociacao');
// → { label: 'Em Negociação', badge: 'warning' }

// Renderizar badge
function renderBadge(category, statusKey) {
    const { label, badge } = STATUS_CONFIG.resolve(category, statusKey);
    return `<span class="os-badge os-badge-${badge}">${label}</span>`;
}
```

---

## Mapeamento de Badges

| Badge Class | Cor | Uso |
|-------------|-----|-----|
| `os-badge-success` | Verde | Positivo, concluído, ativo |
| `os-badge-warning` | Âmbar | Atenção, aguardando ação |
| `os-badge-danger` | Vermelho | Crítico, cancelado, erro |
| `os-badge-info` | Azul | Informação, em andamento |
| `os-badge-neutral` | Cinza | Neutro, inativo, sem ação |
| `os-badge-primary` | Verde FluxAI | Destaque, aprovado |
