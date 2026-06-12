# CHECKLIST: VIRADA DA FASE 2A (ONBOARDING RASCUNHO SEGURO)

A Fase 2A.1 garante a inclusão do novo cliente de forma passiva nas planilhas, com status de rascunho em contratos e IA bloqueada. Não envolve criação no banco Supabase ou ativação real na operação.

### [ ] Passo 1: Correção do Payload de Envio (Frontend)
- Garantir que o JS execute a chamada ao Proxy ou diretamente à Rota 09 usando charset `UTF-8` para prevenir perda de acentos nos dados do cliente (especialmente segmento, posicionamento e descrição).
- Assegurar a estrutura do body idêntica ao payload testado e aprovado.

### [ ] Passo 2: Saneamento Textual e Narrativo (Concluído no Pacote 02)
- Remoção do jargão de ativação forçada ("Ativação de Ecossistema de Alto Padrão" -> "Preparação Segura do Ecossistema").
- Alinhamento da expectativa na UI para "Revisão Interna", mitigando ansiedade comercial do lead/cliente recém-onboardado.

### [ ] Passo 3: Rotação do Webhook (Backend/Proxy)
- Trocar o Webhook de testes pelo Webhook oficial do Make na variável de ambiente local (`.env`) ou no `os-config.js` correspondente à ROTA 09.

### [ ] Passo 4: Disparo Canary Final (Homologação Prática)
- Preencher o formulário do `onboarding.html` através da interface.
- Submeter e aguardar o HTTP 200 OK.
- Verificar a criação instantânea e sincronizada da linha nas abas: `01_CLIENTES_ESTRATEGIA`, `04_CLIENTES_CONFIG`, `03_SERVICOS_CLIENTES`, `02_CONTRATOS_CLIENTES`, `11_DNA_CLIENTE_GPT`, e `CLIENTES_ARQUIVOS`.

### [ ] Passo 5: Confirmação de Duplicidade
- Apertar o botão pela segunda vez e validar se a API retorna o Erro 409 (Cliente já existe).
- Se não criar a segunda linha e falhar silenciosamente/comunicar, a Fase 2A está oficializada e blindada na produção.
