# MAPA DE ABAS DO GOOGLE SHEETS — FluxAI OS™
## Arquitetura de Tabelas e Modelagem do Banco de Dados Operacional

---

## 1. Planilha Oficial de Operações
*   **Nome do Documento no Google Drive:** `FluxAI_Intelligence_Base_Ecossistema_Make`
*   **Acesso:** Compartilhado exclusivamente com a conta de serviço do Make.com e com o e-mail administrativo oficial da agência.
*   **Propósito:** Atua como o banco de dados operacional síncrono. O OS faz leituras e disparos de webhook, e o Make realiza as escritas físicas.

---

## 2. Dicionário de Abas e Colunas

### 1. `CLIENTES_CONFIG`
*   **Finalidade:** Cadastro mestre de clientes e informações de contato.
*   **Colunas Principais:** `cliente_id`, `nome_interno`, `nome_comercial`, `email`, `telefone` (WhatsApp), `website`, `instagram_profile`, `status_ativo`, `data_entrada`.
*   **Origem dos Dados:** Formulário de onboarding (`CLIENT_ONBOARDING`) processado via Make.
*   **Destino dos Dados:** Sidebar, cockpit do cliente, portal de cliente e faturamento.
*   **Cenário Make Relacionado:** `02 - Onboarding Cliente`
*   **Sensibilidade (LGPD):** **Alta (Dados Pessoais/Comerciais)**. Apenas admins e operadores veem.

### 2. `CONTRATOS_CLIENTES`
*   **Finalidade:** Gestão de mensalidades, vigência de contrato e links de arquivos.
*   **Colunas Principais:** `contrato_id`, `cliente_id`, `valor_recorrente`, `vigencia_meses`, `dia_vencimento`, `data_inicio`, `status_contrato`, `drive_contrato_url`.
*   **Origem dos Dados:** Cadastro financeiro realizado pelo ADMIN.
*   **Destino dos Dados:** Painel Executivo (`executive-center.html`) e cobranças assistidas.
*   **Cenário Make Relacionado:** `02 - Onboarding Cliente`
*   **Sensibilidade (LGPD):** **Alta (Dados Financeiros)**. Restrito ao perfil ADMIN.

### 3. `SERVICOS_EXTRAS_CLIENTES`
*   **Finalidade:** Controle de demandas extras fora do fee mensal.
*   **Colunas Principais:** `id_extra`, `cliente_id`, `servico_id`, `nome_servico`, `status`, `valor_estimado`, `valor_aprovado`, `impacto_gpt`, `creditos_extras`, `data_solicitacao`, `data_entrega`.
*   **Origem dos Dados:** Portal do Cliente (`SERVICE_EXTRA_REQUEST`) ou cadastro manual do operador.
*   **Destino dos Dados:** Portal do Cliente e faturamento executivo.
*   **Cenário Make Relacionado:** `03 - Solicitacao de Servico Extra` e `04 - Aprovacao de Orcamento Extra`
*   **Sensibilidade (LGPD):** **Média (Dados de Negócios)**. Acessado por ADMIN, operadores e o próprio cliente dono do dado.

### 4. `DEMANDAS_CLIENTES`
*   **Finalidade:** Repositório de pautas de conteúdo e tarefas.
*   **Colunas Principais:** `id_demanda`, `cliente_id`, `titulo`, `descricao`, `prioridade`, `status`, `responsavel`, `prazo`, `data_solicitacao`.
*   **Origem dos Dados:** Portal do Cliente ou cadastrado pelo operador no Command Center.
*   **Destino dos Dados:** Command Center, backlogs da equipe e portal de clientes.
*   **Cenário Make Relacionado:** `05 - Alterar Status Demanda`
*   **Sensibilidade (LGPD):** **Baixa (Dados de Produção)**.

### 5. `IA_CREDITOS_CLIENTE`
*   **Finalidade:** Controle do limite operacional contratado de gerações IA.
*   **Colunas Principais:** `cliente_id`, `creditos_contrato`, `creditos_extras`, `creditos_consumidos`, `creditos_disponiveis` (fórmula), `mes_referencia`.
*   **Origem dos Dados:** Configurações de Onboarding e consumo de posts via confirmação de publicação.
*   **Destino dos Dados:** Operations Center, motor de IA e portal do cliente.
*   **Cenário Make Relacionado:** `06 - Confirmar Publicacao` e `04 - Aprovacao de Orcamento Extra`
*   **Sensibilidade (LGPD):** **Média (Controle de Custos)**. Apenas equipe interna.

### 6. `LEADS_SITE`
*   **Finalidade:** Banco de dados de oportunidades comerciais capturadas.
*   **Colunas Principais:** `id_lead`, `nome_lead`, `empresa`, `email`, `telefone`, `servico_interesse`, `canal_origem`, `campanha`, `status`, `data_entrada`.
*   **Origem dos Dados:** Formulário institucional da FluxAI.
*   **Destino dos Dados:** CRM Comercial (`leads.html` / `executive-center.html`).
*   **Cenário Make Relacionado:** `01 - Lead Capture Site`
*   **Sensibilidade (LGPD):** **Alta (Dados Pessoais de Prospecção)**. Restrito ao perfil ADMIN.

---

## 3. Diretrizes de Governança das Planilhas
1.  **Fórmulas Inteligentes:** Colunas calculadas (ex: `creditos_disponiveis = creditos_contrato + creditos_extras - creditos_consumidos`) devem estar protegidas contra escrita acidental.
2.  **Chaves Primárias Únicas:** IDs como `cliente_id` ou `contrato_id` devem ser strings imutáveis geradas sistematicamente (ex: `CLI_XXXX_001`). Nunca use IDs sequenciais simples (`1`, `2`, `3`) para evitar conflito de indexação.
3.  **Higienização Periódica:** Mídias ou PDFs antigos não devem ser anexados nas células. Salve o arquivo no Drive e insira apenas o link de acesso na célula correspondente.
4.  **Criptografia:** O compartilhamento de arquivos e planilhas é feito de forma privada via contas institucionais, mantendo as permissões de compartilhamento desativadas para e-mails externos.
