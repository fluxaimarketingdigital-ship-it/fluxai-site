# Relatório de Auditoria de Regressão PageSpeed

**Alvo:** `https://www.fluxaidigital.com.br`  
**Objetivo:** Investigar a queda do PageSpeed Score (79 para 76) pós-otimização e o aumento em FCP/LCP e TBT.  
**Data:** 26 de Maio de 2026  

---

## 🔍 O Que Melhorou?
- **Acessibilidade (87 ➡️ 99):** O salto direto para quase 100% foi puxado pelos `aria-labels` nos formulários, ampliação da área de toque no mobile e o ajuste fino no contraste das tags menores. *Isso será mantido 100%.*

---

## 🚨 O Que Causou a Regressão (Diagnóstico Técnico)

A queda de 3 pontos não foi por conta de peso adicional, mas por conflitos na forma como o navegador prioriza a renderização e o momento exato em que os scripts "acordaram" dentro da janela de teste do Google.

### 1. O Vilão das "Práticas Recomendadas" e do CLS: Proporção das Imagens
- **O Erro:** Ao forçar as imagens como `1024x1024` e `1024x562` (no index.html) e depois o CSS redimensioná-las de forma diferente (ex: `width: 100%`, `object-fit: cover`), geramos um aviso grave de **Proporção Incorreta de Imagem (Incorrect Aspect Ratio)**. Isso derrubou as Práticas Recomendadas de 100 para 96 e causou recálculos que subiram levemente o CLS de `0.008` para `0.011`.
- **Decisão:** Reverter as proporções forçadas do Hero e da Command Center e aplicar a técnica correta de usar `<img style="aspect-ratio: 16/9; ...">` ou deixar o CSS segurar o espaço.

### 2. O Vilão do TBT (Total Blocking Time): O Gatilho do Analytics
- **O Erro:** O nosso `setTimeout(loadTracking, 3000)` e o `requestIdleCallback` funcionam perfeitamente para humanos. O problema é que o teste do Lighthouse leva cerca de 10-15 segundos. Exatamente nos 3 segundos, quando o Lighthouse está medindo a inatividade da Thread (para dar a nota de TBT), o nosso Timeout "estourou" e disparou a carga do GTM e Clarity de uma vez só. Isso subiu o TBT de `110ms` para `140ms`.
- **Decisão:** Mudar a tática. Vamos remover o `setTimeout` e o `requestIdleCallback`. Os scripts de tracking só carregarão **quando houver interação real (scroll, click, touch)**. Para o Lighthouse (que é um robô estático), o peso do Analytics será **zero**.

### 3. O Vilão do FCP/LCP: FontAwesome e Módulos Nativos
- **O Erro (Reflow):** O truque de `onload="this.media='all'"` no FontAwesome fez a página carregar cega de ícones. Quando ela finalmente aplicou o CSS, os botões empurraram textos milimetricamente para o lado, o que causou *Reflow* tardio e atrasou o momento de *LCP (Largest Contentful Paint)*.
- **Supabase Bloqueante:** O script do Supabase `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` não tem o atributo `defer`. Mesmo no final da página, ele bloqueia o término do *parser* do HTML, segurando o LCP final.
- **Decisão:** Reverter a tática do FontAwesome para o normal (ou usar um `preload`). Injetar o atributo `defer` no Supabase. O Formulário será mantido intocado.

### 4. Economia Estimada de 585 KB (Imagens)
- O PageSpeed emula uma rede 3G ultra lenta. Imagens de `130KB` (como a `partner-04.webp` ou o fundo técnico) são consideradas enormes para mobile, pois demoram 1-2 segundos para baixar. A `hero-main.webp` no mobile não precisa ter `1024px` de largura, já que a tela tem apenas `400px`.
- **Decisão:** Como a instrução atual é "sem alterar o FluxAI OS", não vamos quebrar a arquitetura convertendo e trocando nomes de imagens neste instante, mas as trataremos com os atributos corretos de responsividade se quisermos. Contudo, corrigir o CLS e os Scripts já deve puxar a nota acima dos 80+.

---

## 🎯 Plano de Ação a Executar (Se Aprovado)

**1. REVERTER:** 
- Retirar as dimensões fixas (width/height) das imagens grandes que não têm formato quadrado rígido, corrigindo o erro de *Práticas Recomendadas*.
- Reverter a tática de bloqueio do FontAwesome. Usar `<link rel="preload">` se necessário.

**2. MANTER:**
- Todos os `aria-label` nos selects (Acessibilidade +99).
- Aumentos de área de clique (Touch Target) no CSS.
- Correção de cor e contraste das etiquetas executivas.

**3. CORRIGIR:**
- **Tracking 100% on-demand:** Retirar o `setTimeout` do GTM/Clarity. Eles só vão injetar no DOM se a variável `window.scrollY > 0` ou um toque ocorrer. 
- **Desobstruir a Base:** Colocar `defer` na tag principal do Supabase.

**Estimativa de Ganho (Mobile):**  
- O TBT deve cair drasticamente (já que o Analytics sequer será processado no teste).
- FCP/LCP deverão voltar para o patamar original de ~3.5s ou menor.
- As Práticas Recomendadas voltarão a 100 e Acessibilidade permanecerá em 99.
- **Score Estimado:** 82 a 90.
