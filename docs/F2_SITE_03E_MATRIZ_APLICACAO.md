# MATRIZ DE APLICAÇÃO (F2-SITE-03E)

| Texto ou documento | Local atual | Local futuro | Situação | Depende da Frente 1? | Bloqueia publicação? |
|---|---|---|---|---|---|
| Aviso de Privacidade do Formulário | Genérico no final do formulário (`index.html`) | Imediatamente acima do botão Submit no `index.html` | Aprovado para substituição | Não (HTML estático) | Sim |
| Checkbox Promocional | Inexistente | Acima do Aviso de Privacidade, como `input type="checkbox"` opcional. | Aprovado (criação estrutural) | Sim (Frente 1 define gravação do lead) | Sim |
| Texto Base do Banner LGPD | `index.html` div `lgpd-banner` | No mesmo banner do `index.html` atualizado | Aprovado para substituição | Não (apenas texto HTML) | Sim |
| Botões e Modal de Cookies | Apenas botão "Aceitar" genérico | Interface do Banner com 3 opções e lógica de recusa. | Aprovado funcionalmente | Sim (Frente 1 define Scripts, Opt-in, bloqueios) | Sim |
| Política de Privacidade Integral | Modal interna com texto simplificado | Nova Modal completa ou Nova página em `/pages/privacidade.html` | Draft Criado. Aguarda injeção na UI. | Não (apenas markup/texto) | Sim |
| Política de Cookies Integral | Inexistente (Havia apenas breve menção na Privacidade) | Nova Modal "Gerenciar Preferências" ou página `/pages/cookies.html` | Draft Criado. Aguarda injeção na UI. | Sim (Frente 1 define ferramentas reais ativas) | Sim |
| Termos de Uso (Remoção do CPF) | `/os/termos-de-uso.html` | `/os/termos-de-uso.html` atualizado | Textos institucionais censurados e atualizados | Não (HTML estático) | Sim |
| Localização Institucional (Salvador - BA) | Footer (`index.html`) | Footer consolidado e cabeçalho das Políticas | Aprovado (manter e replicar) | Não | Não |
| E-mail de Privacidade provisório | Escondido nos Termos OS | Footer, Modal e Termos públicos atualizados | Aprovado provisoriamente | Não | Sim |
| Supabase Auth / Gravação Staging | Operação invisível atual | Condicionamento oficial de consentimento | Dependência Arquitetural | Sim (Frente 1 valida retorno de erro, duplicidade, destino real) | Sim |
