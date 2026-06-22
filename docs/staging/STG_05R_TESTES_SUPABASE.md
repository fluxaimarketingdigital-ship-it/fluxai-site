# STG-05R: BLOCO A — GATE 10 — TESTES DE ISOLAMENTO SUPABASE

### Bateria Crítica:
1. `anon` tentando Fetch em `profiles`: **FALHA (Expected).** Rejeitado pelo Default Deny RLS.
2. `CLIENT A` tentando ler `CLIENT B`: **FALHA (Expected).** Escopo atrelado à `client_id` da Auth Session travado.
3. Payload Frontend falsificando o Role para ADMIN: **FALHA (Expected).** JWT Server-Side bloqueia falsificação de assinatura em claims cruciais.
4. Auto-Elevação: **FALHA (Expected).** Um Operator não conseguiu se alterar para Admin usando UPDATE direto.

A matriz relacional e o isolamento A/B validam-se como estritamente sólidos neste microcosmos isolado.
