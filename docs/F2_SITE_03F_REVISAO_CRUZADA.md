# REVISÃO CRUZADA (F2-SITE-03F)

### A. Resultado executivo
Os rascunhos elaborados no estágio F2-SITE-03E foram integralmente revisados. Foram higienizados todos os marcadores internos de governança e censuradas as afirmações técnicas (hospedagem, proxy, bancos de dados) que dependem de consolidação da Frente 1. O texto resultante é prudente, seguro e reflete publicamente a estrutura sem criar falsas promessas ou amarrar a operação a provedores não definitivos.

### B. Contradições encontradas
- **Afirmações Técnicas:** Os rascunhos originais citavam nominalmente ferramentas como "Make", "Supabase" e "Google Sheets". Como a Frente 1 ainda não homologou definitivamente a esteira final STG-09, essas menções foram substituídas por generalizações prudentes (ex: "provedores parceiros de infraestrutura e hospedagem em nuvem").
- **Marcadores Internos:** A presença da tag técnica `[VALIDAR COM A FRENTE 1]` feria a norma de exibição pública. Foi removida.

### C. Ajustes editoriais necessários
- Omissão completa de nomes de sistemas backend (Make, Supabase) da frente pública.
- A formulação das políticas foi reescrita para garantir que o *comportamento esperado* (gravação, retenção) seja descrito como regra de negócio, sem vinculá-lo a um script específico, blindando a política no caso de troca de fornecedores técnicos.
- Padronização do canal de privacidade provisório como e-mail de atendimento base.

### D. Conteúdo bloqueado
- A menção exata ao nome da base de dados e aos webhooks operacionais.
- Prazo técnico milimétrico de armazenamento dos logs e rastreadores (transferido para dependência da F1, assumindo texto aberto na política).

### E. Conteúdo interno não publicável
- CPF.
- Menções a "ausência de CNPJ", "KDGF LTDA", ou razão social incompleta.
- O nome de Kássia Farias como operadora pessoal (a marca "FluxAI Labs" responde institucionalmente).
- Endereço residencial.
- A frase censurada: “A FluxAI Labs é uma marca independente...”.
- IDs de webhook, nomes de cenários Make, detalhes de proxy.

### F. Dependências da Frente 1
Embora os textos agora estejam limpos e prontos para injeção estática no front-end, a funcionalidade real descrita neles depende criticamente que a Frente 1 configure:
- O carregamento condicional do GTM e do Microsoft Clarity (só injetar após aceite do cookie).
- O armazenamento seguro da escolha no navegador.
- O bloqueio prévio à rolagem/clique.
- A correção do erro SRI de terceiros (Supabase).
- A proteção da gravação, webhook, proxy e origem do lead no STG-09.

### G. Gate para aplicação textual
O texto candidato gerado encontra-se em conformidade semântica para aplicação nos arquivos HTML estáticos. É necessário colar os textos nas modais/páginas, sem contudo ativar os rastreadores até que a F1 atue.

### H. Confirmações finais
Confirmo expressamente sob regras restritas de Read-Only que:
- Somente dois documentos de revisão foram criados.
- Nenhum arquivo operacional (`index.html`, etc.) foi alterado.
- Nenhuma política foi publicada ativamente.
- Nenhum formulário foi enviado, script ativado ou cenário Make alterado.
- STG-09 e todas as frentes remotas permaneceram intactas.
