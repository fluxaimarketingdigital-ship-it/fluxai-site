# Auditoria de Segurança Open Source (Snyk) — FluxAI OS™

**Data da Auditoria:** 27 de Maio de 2026
**Módulo Avaliado:** Dependências Nativas (`package.json`)

## 📊 Resumo do Scan
A varredura estática do Snyk identificou **17 vulnerabilidades** associadas ao ambiente de dependências do projeto. 

**Vulnerabilidades por Severidade:**
- **🔴 Critical:** 2
- **🟠 High:** 4
- **🟡 Medium:** 11
- **🟢 Low:** 0

**Pacote Raiz Afetado:** `google-tts-api@2.0.2`
**Dependência Vulnerável (Causa Raiz):** `axios@0.21.4` (Desatualizado)

---

## 🔎 Análise de Impacto e Uso Real
A primeira etapa da auditoria de segurança é determinar se o código malicioso possui algum vetor de execução viável.

**Foi realizada uma varredura em todo o código-fonte por:**
`google-tts-api`, `google`, `axios`, `require`, etc.

**Resultado da Investigação:**
1. **Zero Uso em Produção:** O pacote `google-tts-api` **NÃO** faz parte do FluxAI OS™ nem do Site Institucional. Ambos são front-ends limpos e dependem apenas da API nativa `fetch` e das bibliotecas via CDN seguro (Supabase).
2. **Dependência Órfã:** A biblioteca `google-tts-api` era utilizada pelo nosso script local de automação de vídeos (`generate_training_videos.js`). No entanto, esse script foi atualizado recentemente para utilizar a biblioteca `node-edge-tts` (para obter a voz Neural hiper-realista da Francisca).
3. **Conclusão:** O `google-tts-api` é um código morto (legado de ambiente de desenvolvimento) que ficou esquecido no `package.json`.

---

## ⚖️ Decisão Técnica e Plano de Ação

- **Decisão:** **REMOÇÃO TOTAL.**
- **Substituição:** Não necessária (o script de voz já opera sobre outra tecnologia superior que não acusa vulnerabilidade).
- **Risco de Quebra (Impacto):** **Nulo.** Não há nenhum lugar no código que importe ou utilize o pacote. Nenhuma rota do FluxAI OS ou webhook do Make sofrerá interferência.
- **Risco Residual:** Zero. A eliminação do pacote apaga o vetor.
- **Bloqueia Produção?** Não. Como é um pacote restrito ao ambiente Node.js de build/scripts, o site estático não estava correndo risco de injeção em clientes. Mesmo assim, a higiene do repositório exige a eliminação.

---

## 🎯 Recomendação Final

Solicito autorização para executar o comando de desinfecção segura:

```bash
npm uninstall google-tts-api
npm install
npm audit
npx snyk test
```

## ✅ Execução e Resultados Finais (27/05/2026)

**Arquivos Alterados:**
- `package.json`
- `package-lock.json`

**Resultado da Desinfecção:**
- `npm ls google-tts-api`: Removido com sucesso. `-- (empty)`.
- **Vulnerabilidades antes:** 2 Critical, 4 High, 11 Medium (17 no total).

**Resultado do novo scan no Snyk:**
- **Issues Encontradas:** 0
- **Critical:** 0 | **High:** 0 | **Medium:** 0 | **Low:** 0
- **Dependências analisadas:** 50
- Testado com `package.json` e `package-lock.json`.

**Risco Residual:** Zero. A raiz da vulnerabilidade (`axios@0.21.4` dentro de `google-tts-api`) foi extirpada.

**Veredicto Final:**
**✅ Snyk APROVADO**. Nenhum bloqueio de dependência para produção. A esteira Snyk está oficialmente concluída. Próxima validação no pipeline de segurança: **GitHub CodeQL**.
