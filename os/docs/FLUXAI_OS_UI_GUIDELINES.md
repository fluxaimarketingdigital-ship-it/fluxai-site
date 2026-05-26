# FLUXAI OS™ — DIRETRIZES DE INTERFACE
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_UI_GUIDELINES.md`

---

## Filosofia Visual

> O FluxAI OS™ deve parecer um sistema caro, silencioso e proprietário.
> Não um SaaS genérico, não uma startup de IA com gradientes coloridos,
> não um dashboard de marketing com muitos widgets coloridos.

---

## Hierarquia Visual

### Níveis de Hierarquia
1. **Título da Página** — `os-text-xl`, peso 800, letra-spacing negativo
2. **Label de Seção** — `os-text-2xs`, uppercase, letter-spacing 2px, `--os-primary`
3. **Dado Principal** — `os-text-sm` a `os-text-md`, peso 600, branco
4. **Dado Secundário** — `os-text-sm`, `--os-text-muted`
5. **Metadado** — `os-text-xs`, `--os-text-dim`, mono

---

## Regras de Densidade

### ✅ Correto
- 1 widget = 1 informação principal + contexto mínimo
- Tabela com 5-6 colunas no máximo
- Formulário com grupos claros (máx 2 colunas)
- Espaçamento generoso entre seções (`--os-space-8`)

### ❌ Proibido
- Widgets com 3+ métricas empilhadas verticalmente sem ritmo
- Tabelas com 8+ colunas sem scroll horizontal
- Formulários com 20+ campos sem divisão em blocos
- Cards com ícones grandes coloridos como destaque

---

## Comportamentos Padrão

### Hover em linhas de tabela
```css
.os-table tbody tr:hover {
    background: var(--os-primary-glow);
}
```
Nunca: `background: rgba(0,0,0,0.5)`, `border`, `scale()`.

### Cards ao hover
```css
.os-widget:hover {
    border-color: var(--os-primary-border);
}
```
Nunca: `transform: translateY(-5px)`, `box-shadow` pesado.

### Botões ao hover
```css
.os-btn-primary:hover {
    background: var(--os-primary-dim);
    box-shadow: 0 4px 12px rgba(142, 158, 104, 0.25);
}
```
Nunca: `scale(1.05)`, mudança de cor para algo fora da paleta.

---

## Estados Obrigatórios

Toda tabela, lista ou grid deve implementar os 4 estados:

### Loading
```html
<div class="os-state">
    <div class="os-spinner"></div>
    <span class="os-state-text">Sincronizando...</span>
</div>
```

### Vazio
```html
<div class="os-state">
    <i class="fa-solid fa-inbox os-state-icon"></i>
    <span class="os-state-text">Nenhum registro encontrado.</span>
</div>
```

### Erro
```html
<div class="os-state os-state-error">
    <i class="fa-solid fa-triangle-exclamation os-state-icon"></i>
    <span class="os-state-text">Erro ao carregar dados. Tente novamente.</span>
</div>
```

### Dados Carregados
Renderizar normalmente.

---

## Layout das Páginas

### Estrutura HTML Obrigatória
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FluxAI OS™ | Nome da Página</title>
    <link rel="stylesheet" href="./styles/interface.css" />
    <link rel="stylesheet" href="./styles/components.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <!-- NUNCA definir :root ou tokens aqui -->
</head>
<body class="os-mode">
    <div class="os-bg-glow"></div>
    <div class="os-shell">
        <aside class="os-sidebar"></aside>
        <div class="os-viewport-wrapper">
            <header class="os-topbar"></header>
            <main class="os-viewport">
                <!-- Conteúdo da página -->
            </main>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script type="module" src="./js/modules/nome-modulo.js"></script>
</body>
</html>
```

---

## Grid de Widgets

| Span | Uso |
|------|-----|
| `span 12` | Widget full-width (tabelas principais) |
| `span 8` | Widget grande (lista, gráfico) |
| `span 6` | Widget médio (half) |
| `span 4` | Widget pequeno (KPI, alerta) |
| `span 3` | Widget mini (contador) |

---

## Animações

### Permitidas
- `os-fade-up` — entrada de widgets ao carregar (0.4s, uma vez)
- `os-spin` — spinner de loading (loop, apenas enquanto carrega)
- `os-toast-in` — entrada de toast (0.3s, uma vez)
- Transição de `border-color` e `background` ao hover (0.2s)

### Proibidas
- Animações em loop nos dados (pulsação de badge, etc.)
- `transform: translateY()` em hover de card
- `scale()` em qualquer elemento ao hover
- `opacity` piscante em dados reais

---

## Tipografia em Valores de Métricas

```html
<!-- KPI numérico -->
<div class="os-metric-value">1.247</div>

<!-- Trend -->
<div class="os-metric-meta">
    <span class="trend-up">+12%</span>
    <span>vs. mês anterior</span>
</div>
```

Valores numéricos operacionais usam `--os-font-mono` para alinhamento visual.

---

## Responsividade

O OS é prioritariamente desktop. Mobile é suportado para acesso de emergência.

| Breakpoint | Comportamento |
|-----------|--------------|
| ≥ 992px | Layout sidebar + content padrão |
| < 992px | Sidebar se torna drawer (overlay) |
| < 600px | Grid vira 1 coluna, tipografia reduzida |
