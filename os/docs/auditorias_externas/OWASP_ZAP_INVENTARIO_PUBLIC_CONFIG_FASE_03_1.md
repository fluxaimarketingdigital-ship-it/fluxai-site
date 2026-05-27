# OWASP_ZAP_INVENTARIO_PUBLIC_CONFIG_FASE_03_1

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Inventário Cego de Configurações Públicas Sensíveis (Fase 03.1)

## 1. Resumo Executivo
Foi realizada uma auditoria estática passiva e cega nos arquivos de configuração centrais sinalizados pelo laudo OWASP ZAP (alerta de Base64 Disclosure). O objetivo foi atestar a presença ou ausência de chaves de privilégio real, credenciais administrativas ou tokens restritos que causassem vazamento de dados críticos. A análise identificou chaves públicas benignas do Supabase, mas encontrou exposição de URLs de webhooks operacionais.

## 2. Arquivos Analisados
- `os/config/os-config.js`
- `os/config/secrets/supabase-keys.js`

## 3. Termos Buscados
A varredura algorítmica procurou rigorosamente por: `service_role`, `secret`, `private`, `token`, `webhook`, `bearer`, `api_key`, `anon`, `jwt`, `supabaseUrl`, `supabaseKey`, `authorization`, `password`, `client_secret`, `refresh_token`, `access_token`.

## 4. Achados por Arquivo

**`os/config/os-config.js`**
- `SUPABASE_CONFIG.anonKey`: Valor Base64 detectado (`eyJhbGciOi...<masked>`).
- `WEBHOOK_CONFIG`: Detecção de múltiplas URLs de integração para o Make.com (`https://hook.us2.make.com/...<masked>`), utilizadas para envios como `DEMAND_SUBMISSION`, `CLIENT_ONBOARDING`, etc.
- *Status:* Ausência total de `service_role`, senhas administrativas de banco, `client_secret` ou tokens Bearer privados.

**`os/config/secrets/supabase-keys.js`**
- `SUPABASE_CONFIG.anonKey`: Exatamente o mesmo valor Base64 detectado (`eyJhbGciOi...<masked>`).
- *Status:* Ausência de qualquer outra chave. O arquivo atua apenas como um espelho de desenvolvimento inicial para a chave anônima.

## 5. Classificação de Risco
- **Supabase Anon Public Key (`anonKey`):** *Pública Permitida / Chave pública não sensível*. Foi concebida arquiteturalmente pelo Supabase para residir no client-side junto ao RLS (Row Level Security). O alerta "Base64 Disclosure" do OWASP é, portanto, um **Falso Positivo**.
- **Pasta "secrets":** *Não crítico*. O nome induz crawlers a flagrarem o arquivo, mas não há segredo real embutido. Sugere-se renomear a pasta futuramente.
- **Webhooks Make (`WEBHOOK_CONFIG`):** *Sensível / P0 Crítico*. Como os URLs do Make.com não possuem autenticação em camada de rede e confiam na obscuridade da rota gerada, expô-los no frontend estático Javascript publicamente permite que agentes maliciosos disparem requisições diretas (Spam, esgotamento de quota ou injeção de dados falsos de Lead/Onboarding) burlando a interface do FluxAI OS™.

## 6. Confirmação Explícita
- Existe `service_role` pública? **Não**
- Existe token privado público? **Não**
- Existe webhook secreto público? **Sim** (Múltiplas URLs de hook do Make expostas no client-side)
- Existe apenas anon public key? **Não** (Há chaves anônimas + URLs de webhook)

## 7. Recomendação
**AVISO: Segredo Operacional Encontrado.**
- Como há presença de Segredo Real/Sensível (URLs de webhook desprotegidas expostas em código client-side), a regra determina: **Parar a esteira e classificar a exposição de webhooks como P0.**
- O acesso direto a essas URLs pelo client-side viola as premissas de segurança dinâmica, sendo recomendável refatorar a arquitetura (via Edge Functions do Supabase, Backend For Frontend, ou ocultação server-side) antes de certificar o hardening passivo.
- *Não seguir imediatamente para a Fase 03.2 (Headers)* até deliberação arquitetural sobre o mascaramento desses endpoints do Make.

## 8. Observação
Nenhum valor completo foi exposto neste relatório. As assinaturas JWT e hashes criptográficos de hook foram suprimidos e mascarados. Nenhuma alteração funcional, de código ou de runtime ocorreu no projeto.
