# OWASP_P0_WEBHOOKS_MAKE_EXPOSTOS_FASE_03_1B

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Contenção de Incidente P0 (Webhooks Make Expostos)

## 1. Arquivo Afetado e Tipo de Dado Exposto
**Arquivo:** `os/config/os-config.js`
**Tipo de Dado:** URLs operacionais de recepção de Webhooks do provedor Make.com, configuradas de forma estática (hardcoded) no objeto `WEBHOOK_CONFIG` que é servido publicamente para o cliente (frontend).

## 2. Classificação de Risco
**P0 CRÍTICO BLOQUEANTE.** 
A presença destas rotas desprotegidas no frontend é considerada falha crassa de arquitetura e atua como vetor direto de fraude e abuso operacional.

## 3. Impacto Operacional
Qualquer usuário malicioso que intercepte a carga do arquivo Javascript público no navegador pode isolar as URLs do Make e disparar requisições automatizadas externamente (cURL, Postman). Isso culmina em:
- Disparo massivo não autorizado para as rotinas do Make.
- Contaminação e corrupção silenciosa da base de dados (Planilhas e bancos subjacentes).
- Consumo indevido da quota contratada de operações do Make (Esgotamento financeiro).
- Consumo indevido de créditos de IA conectados às esteiras enganadas.
- Risco operacional irreversível nos fluxos lógicos e de resposta de clientes do FluxAI OS™.
- Possibilidade real de abuso automatizado (Spam, Phishing usando a própria esteira do cliente).

## 4. Inventário das Chaves Expostas (Sem Expor a Rota)
As chaves abaixo foram mapeadas apontando para `https://hook.us2.make.com/...` e devem ser consideradas **COMPROMETIDAS**:
- `DEMAND_SUBMISSION`: https://hook.\<masked\>
- `LEAD_CAPTURE`: https://hook.\<masked\>
- `CLIENT_ONBOARDING`: https://hook.\<masked\>
- `SERVICE_EXTRA_REQUEST`: https://hook.\<masked\>
- `IA_CREDITOS_CONTROLE`: https://hook.\<masked\>
- `AI_OPERATIONAL_CONTROL`: https://hook.\<masked\>
- `SERVICE_EXTRA_APPROVAL`: https://hook.\<masked\>
- `IA_GUARDRAIL`: https://hook.\<masked\>
- `PLANEJAMENTO_CONTEUDO`: https://hook.\<masked\>
- `CALENDARIO_POSTAGENS`: https://hook.\<masked\>
- `GPT_GERACOES_LOG`: https://hook.\<masked\>

## 5. Plano de Contenção Imediata (Incident Response)
Para estancar a superfície de ataque atual:
1. **Pausar Cenários Make:** Interromper imediatamente todos os cenários operacionais vinculados às chaves detectadas.
2. **Regenerar Webhooks:** Acionar a revogação e regeneração massiva dos endereços dos Webhooks no Make.com.
3. **Invalidar URLs Antigas:** A simples regeneração deve invalidar as URLs que atualmente constam expostas no commit público.
4. **Isolar Frontend:** **NUNCA MAIS** reinserir ou reutilizar rotas estáticas cruas de webhooks no frontend. Todo fluxo que interage com Make deverá passar por ofuscação de backend.

## 6. Plano de Arquitetura Segura (Remediação)
Para resolver definitivamente a comunicação Frontend -> Make sem expor segredos, propomos as seguintes soluções:

**Opção A — Supabase Edge Function (RECOMENDADO)**
- **Como Funciona:** O Frontend manda os dados para uma Edge Function do Supabase (que atua como Proxy Backend). A Edge Function intercepta, valida se o payload está sadio, confere o Token de Sessão Auth (Supabase JWT), aplica *Rate Limiting* e, se aprovado, usa a URL do Make (protegida como Variável de Ambiente privada) para fazer o disparo invisível ao cliente.
- **Vantagem:** Casamento perfeito com o Auth que já foi solidificado no OS. Segurança extrema.

**Opção B — Vercel Serverless Function**
- **Como Funciona:** O frontend chama internamente a rota `/api/make-proxy`. O backend Serverless hospedado na Vercel injeta as Variáveis de Ambiente do Hook e executa o *POST* blindado.
- **Vantagem:** Excelente caso a infraestrutura de deploy do cliente esteja puramente alocada na Vercel e dispensar manipulação adicional do console Supabase.

**Opção C — Cloudflare Worker**
- **Como Funciona:** Funciona como um gateway proxy robusto que redireciona e escuda as chamadas HTTP anexando as credenciais no caminho.
- **Vantagem:** Ideal para performance global e controle de Anti-DDoS agressivo antes de chegar no Make.

## 7. Decisão e Conclusão
O desenvolvimento está em **estado de contenção**. 
A esteira de auditoria do projeto **NÃO AVANÇA** para a Fase 03.2 (Implementação de Headers CSP, CORS, etc.) até que a Remediação (Fase 03.1C) deste alerta P0 seja orquestrada e aplicada.
Nenhum arquivo funcional foi alterado até que a decisão arquitetural seja tomada pela gestão técnica.
