# CHECKPOINT STG-01: INVENTÁRIO DE PRODUÇÃO

## 11.1 Resumo Executivo
* **O que foi analisado:** Repositório, infraestrutura (Vercel), banco de dados (Supabase schemas/policies), rotas frontend, proxies e webhooks mapeados na Matriz Mestra.
* **O que foi encontrado:** Ampla aderência arquitetural, mas com bloqueadores em controle de acesso e processamento assíncrono enganoso no frontend (Falso Sucesso).
* **Principais Riscos:** Supabase RLS sem escopo, e Vercel Proxy atuando sem barreira de Autenticação.
* **Possibilidade de Staging:** O ambiente base possui maturidade estrutural, permitindo e exigindo o isolamento em ambiente de STAGING para validar as alterações corretivas sem dano colateral à Produção.

## 11.2 Inventário de Produção (Extrato)
* **Frontend:** Framework client-side acoplado ao `makeClient.js` para comunicações externas.
* **Vercel:** Edge Functions utilizadas via `make-proxy.js`.
* **Supabase:** Core Database; 18 policies abertas em homologação técnica. Auth utilizado na camada de sessão web.
* **Make:** 24 cenários oficiais ativos, dependendo de blindagem e respostas síncronas.
* **Sheets / Drive:** Bases secundárias de persistência e governança em operação.

## 11.3 Componentes Desconhecidos
* **INCONCLUSIVO — EVIDÊNCIA INSUFICIENTE:** Não foi possível validar nativamente, via código, se a `service_role` ou as chaves sensíveis de APIs de terceiros estão expostas em arquivos não trackeados do repositório, embora os patterns sugiram que não. As permissões exatas da Service Account do Google no Make também permanecem "Black Box" para esta etapa.

## 11.4 Dependências Congeladas
Não será executada NENHUMA ação sobre:
* Cenário 10 Oficial (`5186459`)
* Cenário 17 (`5187193`)
* Cenário 19 (`5389103`)
* Sandbox de Serviço Extra (`5406168`)

## 11.5 Bloqueadores para Staging
Nesta avaliação preliminar, **nenhum item é um bloqueador crítico para a *criação* do ambiente de Staging**. A criação de Staging é justamente a mitigação exigida. No entanto, os itens "RLS Bypass" e "Proxy Unauthenticated" são **Bloqueadores Críticos para a Virada da Produção**.

## 11.6 Recomendação Arquitetural Preliminar
Para o ambiente futuro de Staging, é imperativo utilizar **Supabase Project Separado** e **Estrutura Make Separada (Pastas/Webhooks Isolados)**, inviabilizando qualquer chance de contaminação com bases da Operação Real. Uso do Vercel Preview Environments será suportado.

## 11.7 Decisão
`APTO PARA DESENHAR STAGING`

---

# CHECKPOINT FINAL OBRIGATÓRIO

## CONCLUÍDO
* Inventário e mapeamento 360º de Infraestrutura, Supabase, Rotas, Proxies e Integrações.
* Documentação estruturada dos achados.

## EM EXECUÇÃO
* Nenhuma tarefa (Status de pausa para análise do usuário).

## BLOQUEADO
* Alterações e deploy bloqueados nesta fase.

## EVIDÊNCIAS ENCONTRADAS
* Risco do Proxy sem Auth; Risco de RLS; Falso Sucesso via HTTP 200 no Frontend.

## EVIDÊNCIAS AUSENTES
* Valores absolutos de Segredos e arquitetura granular das Service Accounts externas. (Blindado).

## ALTERAÇÕES REALIZADAS
`Nenhuma alteração realizada. Auditoria exclusivamente de leitura.`

## RISCOS RESIDUAIS
* Ambiente de Produção operando atualmente sob as vulnerabilidades documentadas (RLS e Proxy), sem impacto em massa relatado até o momento, mas exposto.

## DECISÃO DA ETAPA
O ambiente atual encontra-se exaustivamente diagnosticado em seus déficits transacionais.

## PRÓXIMA AÇÃO RECOMENDADA
Aprovar os planos propostos e iniciar os trabalhos na "Fase 2: Preparação de Staging" para clonagem segura da infraestrutura e aplicação pontual das contenções nas policies SQL e no proxy Vercel Edge.
