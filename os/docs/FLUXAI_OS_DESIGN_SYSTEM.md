# FLUXAI OS™ — DESIGN SYSTEM OFICIAL
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_DESIGN_SYSTEM.md`

---

## 1. Princípios

O design do FluxAI OS™ não é estético — é funcional. Cada decisão visual serve à operação.

| Princípio | Descrição |
|-----------|-----------|
| **Sobriedade Executiva** | Menos cor, mais estrutura. O sistema não chama atenção, ele entrega clareza. |
| **Silêncio Visual** | Espaço em branco é informação. O que não está na tela também é uma decisão. |
| **Hierarquia de Informação** | O olho deve saber onde ir sem esforço. Dado crítico é grande. Contexto é pequeno. |
| **Permanência** | Nada pisca, pulsa ou anima sem propósito. Animações existem para guiar, não entreter. |

---

## 2. Tokens Oficiais

**Arquivo de referência:** `/os/styles/interface.css`

### Cores
| Token | Valor | Uso |
|-------|-------|-----|
| `--os-primary` | `#8e9e68` | Destaque, ativo, ações principais |
| `--os-primary-dim` | `#6b7a45` | Hover de primário |
| `--os-primary-glow` | `rgba(142,158,104,0.12)` | Background de estados ativos |
| `--os-primary-border` | `rgba(142,158,104,0.18)` | Bordas de elementos ativos |
| `--os-bg` | `#080a08` | Background absoluto |
| `--os-surface` | `rgba(12,15,12,0.75)` | Cards, widgets |
| `--os-surface-raised` | `rgba(18,22,18,0.85)` | Modais, dropdowns |
| `--os-sidebar-bg` | `rgba(8,10,8,0.92)` | Sidebar |
| `--os-topbar-bg` | `rgba(8,10,8,0.70)` | Topbar |
| `--os-border` | `rgba(142,158,104,0.12)` | Borda padrão |
| `--os-border-strong` | `rgba(142,158,104,0.25)` | Borda ativa |
| `--os-border-subtle` | `rgba(255,255,255,0.04)` | Divisores internos |
| `--os-text` | `#e8e8e6` | Texto principal |
| `--os-text-muted` | `#6b6b6b` | Labels, metadados |
| `--os-text-dim` | `#4a4a4a` | Placeholders, desabilitados |
| `--os-success` | `#5cb87a` | Positivo |
| `--os-warning` | `#c9973a` | Atenção |
| `--os-danger` | `#c25454` | Crítico |
| `--os-info` | `#4f88c6` | Informação |

### Tipografia
| Token | Valor |
|-------|-------|
| `--os-font-sans` | `'Inter', -apple-system, sans-serif` |
| `--os-font-mono` | `'JetBrains Mono', monospace` |
| `--os-text-2xs` | `0.65rem` |
| `--os-text-xs` | `0.75rem` |
| `--os-text-sm` | `0.85rem` |
| `--os-text-base` | `0.95rem` |
| `--os-text-md` | `1.1rem` |
| `--os-text-lg` | `1.4rem` |
| `--os-text-xl` | `1.75rem` |
| `--os-text-2xl` | `2.2rem` |

### Radius
| Token | Valor | Uso |
|-------|-------|-----|
| `--os-radius-sm` | `4px` | Botões, inputs, badges, toasts |
| `--os-radius-md` | `8px` | Cards internos, service-boxes |
| `--os-radius-lg` | `12px` | Cards principais, modais |
| `--os-radius-full` | `999px` | Pills, avatares |

### Layout
| Token | Valor |
|-------|-------|
| `--os-sidebar-w` | `264px` |
| `--os-topbar-h` | `64px` |

---

## 3. Componentes Oficiais

### Botões
```html
<!-- Primário -->
<button class="os-btn os-btn-primary">Ação Principal</button>

<!-- Outline -->
<button class="os-btn os-btn-outline">Ação Secundária</button>

<!-- Ghost (navegação, cancelar) -->
<button class="os-btn os-btn-ghost">Cancelar</button>

<!-- Danger -->
<button class="os-btn os-btn-danger">Excluir</button>

<!-- Tamanhos -->
<button class="os-btn os-btn-primary os-btn-sm">Pequeno</button>
<button class="os-btn os-btn-primary os-btn-lg">Grande</button>
```

### Badges de Status
```html
<span class="os-badge os-badge-success">Ativo</span>
<span class="os-badge os-badge-warning">Atenção</span>
<span class="os-badge os-badge-danger">Crítico</span>
<span class="os-badge os-badge-info">Informação</span>
<span class="os-badge os-badge-neutral">Neutro</span>
<span class="os-badge os-badge-primary">Destaque</span>
```

### Inputs
```html
<div class="os-form-group">
    <label class="os-label">Campo Obrigatório</label>
    <input class="os-input" type="text" placeholder="Valor..." />
</div>

<div class="os-form-group">
    <label class="os-label">Seleção</label>
    <select class="os-select">
        <option value="">Selecionar...</option>
    </select>
</div>
```

### Tabela
```html
<div class="os-table-wrapper">
    <table class="os-table">
        <thead>
            <tr><th>Coluna</th><th>Valor</th></tr>
        </thead>
        <tbody>
            <tr>
                <td class="cell-primary">Dado Principal</td>
                <td>Dado Secundário</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Estados
```html
<!-- Loading -->
<div class="os-state">
    <div class="os-spinner"></div>
    <span class="os-state-text">Sincronizando...</span>
</div>

<!-- Vazio -->
<div class="os-state">
    <i class="fa-solid fa-inbox os-state-icon"></i>
    <span class="os-state-text">Nenhum registro encontrado.</span>
</div>

<!-- Erro -->
<div class="os-state os-state-error">
    <i class="fa-solid fa-triangle-exclamation os-state-icon"></i>
    <span class="os-state-text">Erro ao carregar dados.</span>
</div>
```

### Modal
```html
<div class="os-modal-overlay" id="meu-modal">
    <div class="os-modal">
        <h2 class="os-modal-title">Título da Ação</h2>
        <button class="os-modal-close"><i class="fa-solid fa-xmark"></i></button>
        <!-- conteúdo -->
        <div class="os-modal-footer">
            <button class="os-btn os-btn-ghost">Cancelar</button>
            <button class="os-btn os-btn-primary">Confirmar</button>
        </div>
    </div>
</div>
```

---

## 4. Regras de Uso

### ✅ Permitido
- Usar tokens via variáveis CSS
- Usar classes de componente do `interface.css`
- Adicionar `<style>` na página para layout específico (grid-column, position)
- Usar valores de `os-config.js` para lógica JS

### ❌ Proibido
- Definir `:root` inline em qualquer página
- Hardcodar cores, radius, shadows
- Criar `.btn` fora do padrão `.os-btn`
- Criar `.badge` com estilos próprios
- Usar `backdrop-filter: blur()` com valor acima de `12px`
- Usar gradientes coloridos (`linear-gradient(blue, purple)`)
- Criar animações pulsantes ou loops sem propósito funcional
