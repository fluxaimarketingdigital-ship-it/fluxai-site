# AUTOMAÇÃO DE VÍDEOS — FluxAI OS™

**Script:** `generate_training_videos.js`  
**Data:** 26 de Maio de 2026  
**Stack:** Node.js + puppeteer-core + ffmpeg-static

---

## Como funciona

```
Servidor HTTP local (porta 4040)
        ↓
Puppeteer abre cada página do OS
        ↓
Injeta sessão mockada (ADMIN / OPERATOR / CLIENT)
        ↓
Navega por cada step do cenário
        ↓
Injeta overlay de caption + highlight visual
        ↓
Captura screenshot PNG de cada step
        ↓
ffmpeg compila PNGs → MP4 (duração por frame)
        ↓
Salva em videos/03_exports_finais/
        ↓
Gera RELATORIO_AUTOMACAO_VIDEOS_TREINAMENTO.md
```

---

## Como executar

```bash
# A partir da raiz do projeto (FLUXAI_SITE/)
node os/docs/treinamento/automation/generate_training_videos.js
```

**Pré-requisitos:**
- Node.js instalado
- Google Chrome em `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `puppeteer-core` e `ffmpeg-static` instalados (`npm install`)

---

## Arquivos gerados

Todos os vídeos são exportados em:
```
os/docs/treinamento/videos/03_exports_finais/
```

Frames intermediários (PNGs por step) ficam em:
```
os/docs/treinamento/videos/04_revisao/frames/video_XX/
```

---

## Estrutura dos cenários (`video_scenarios.js`)

Cada vídeo tem uma lista de `steps`:
```js
{
  page: '/os/command-center.html',   // URL relativa do OS
  caption: 'Texto explicativo',       // Aparece na faixa inferior
  duration: 6,                        // Segundos que esse frame dura no vídeo
  highlight: '.os-sidebar'            // (opcional) CSS selector para destacar
}
```

---

## Sessões mockadas

| Perfil | Nome | E-mail |
|:---|:---|:---|
| ADMIN | Admin FluxAI | admin@fluxaidigital.com.br |
| OPERATOR | João Silva | operador@fluxaidigital.com.br |
| CLIENT | FluxAI Labs | contato@fluxailabs.com.br |

---

## Saída esperada

| Vídeo | Arquivo | Duração |
|:---:|:---|:---:|
| 01 | `FLUXAI_OS_TREINAMENTO_INTERNO_01_VISAO_GERAL.mp4` | ~3.5 min |
| 02 | `FLUXAI_OS_TREINAMENTO_INTERNO_02_CADASTRO_ONBOARDING.mp4` | ~4.5 min |
| 03 | `FLUXAI_OS_TREINAMENTO_INTERNO_03_COCKPIT_DEMANDAS.mp4` | ~4 min |
| 04 | `FLUXAI_OS_TREINAMENTO_INTERNO_04_IA_LIMITE_OPERACIONAL.mp4` | ~4.5 min |
| 05 | `FLUXAI_OS_TREINAMENTO_INTERNO_05_PUBLICACAO_ASSISTIDA_COBRANCAS.mp4` | ~5 min |
| 06 | `FLUXAI_OS_TREINAMENTO_INTERNO_06_LOGS_ERROS_ROLLBACKS.mp4` | ~5 min |
| 07 | `FLUXAI_OS_TREINAMENTO_CLIENTE_01_PORTAL_DEMANDAS.mp4` | ~3 min |
| 08 | `FLUXAI_OS_TREINAMENTO_CLIENTE_02_APROVACOES_RELATORIOS_EXTRAS.mp4` | ~4.5 min |
