# STG-06: GATE 1 — MODELO REAL DE IDENTIDADE

| Tabela | Coluna | Tipo | Origem Segura? | Quem Escreve | Leitura Autorizada | Lacuna Histórica Tratada |
|---|---|---|---|---|---|---|
| `auth.users` | `id` | UUID | Sim (Token) | Supabase API | Todos | ID era ignorado em queries abertas. |
| `profiles` | `id` | UUID | Sim (Trigger/Backend) | Backend/Admin | Usuário Próprio | N/A |
| `profiles` | `role`| Text | Sim (Restrita) | Admin | Usuário Próprio | O Role agora deriva da tabela `profiles`, e não de claims vulneráveis injetadas pelo Frontend. |

**Conclusão:** O núcleo identificador passa a ser a função de autorização `public.current_user_role(auth.uid())` que tranca a identidade do usuário no Backend.
