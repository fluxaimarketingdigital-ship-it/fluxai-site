# MANUAL DO OPERADOR — FluxAI OS™
## Guia de Execução Diária, Produção e Publicação Assistida

---

## 1. Escopo de Atuação do Operador (OPERATOR)
O perfil **OPERATOR** é responsável pela execução operacional diária da FluxAI: acompanhamento de onboardings de clientes, processamento de demandas, revisão e curadoria do motor de conteúdo de IA, publicação manual assistida de posts e sincronização de métricas de tráfego/ads.

---

## 2. Command Center e Operations Center
A rotina de trabalho do operador deve seguir a seguinte ordem de conferência:

1.  **Abertura de Turno (Command Center - `command-center.html`):**
    *   Verificar a lista de **Alertas Operacionais** (alertas de criticidade alta ou média exigem atenção prioritária).
    *   Conferir a tabela de **Client Health** para identificar se algum cliente ativo mudou de status ou se apresenta APIs desconfiguradas/tokens expirados.
2.  **Monitoramento Sistêmico (Operations Center - `operations-center.html`):**
    *   Conferir a **Carga de IA** por cliente (ocupado vs limite). Se um cliente estiver perto da cota, alertar o ADMIN para avaliar upgrade.
    *   Verificar o **Backlog de Conteúdo & Relatórios** pendentes de revisão interna.
    *   Analisar a **Fila de Erros e Falhas** para garantir que as automações do Make.com estejam rodando sem gargalos.

---

## 3. Fluxo do Motor de Conteúdo e IA (`content-engine.html`)
O motor de conteúdo funciona sob um ciclo rigoroso de governança operacional:

```
  [ Rascunho IA ] ──► [ Em Revisão (Equipe) ] ──► [ Aprovado Interno (Cota Reservada) ]
                                                            │
  [ Publicado (Consumido) ] ◄── [ Publicação Manual ] ◄─────┘
```

1.  **Geração:** O rascunho de IA gerado não consome limite operacional do cliente.
2.  **Revisão:** A peça permanece em revisão interna. A edição de legendas e caminhos de arquivo no Canva/Drive deve ser feita pelo operador.
3.  **Aprovação:** Ao aprovar o post internamente, ele é movido para o status `aprovado` e passa a ocupar cota do ciclo do cliente de forma temporária.
4.  **Descarte:** Se o post for descartado **antes** da publicação, ele libera o espaço de cota ocupado no ciclo de entregas.

---

## 4. Roteiro de Publicação Manual Assistida
O sistema **não realiza disparos automáticos** para o Instagram. O operador deve executar a publicação assistida:

1.  No painel de conteúdo, localize a peça com status `aguardando_publicacao` e clique em **Publicar**.
2.  O modal de publicação assistida exibirá a legenda consolidada, hashtags, CTA e o caminho do arquivo de mídia.
3.  Clique no botão **Copiar Legenda** (o texto completo é copiado automaticamente para a sua área de transferência).
4.  Clique nos botões de atalho correspondentes para abrir a pasta de entregas no Google Drive (ou Canva) e baixar o arquivo de mídia.
5.  Clique no botão **Abrir Instagram** para abrir o gerenciador ou a página do cliente em nova aba.
6.  Realize a publicação de forma manual (suba o arquivo baixado e cole a legenda copiada).
7.  Após concluir o post na plataforma, retorne ao FluxAI OS™ e clique em **Confirmar Publicação Manual** para registrar o operador, a data/hora exata e consolidar o consumo do limite de entrega.
