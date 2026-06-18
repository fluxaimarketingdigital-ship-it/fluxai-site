# STG-06: GATE 3 — MATRIZ DE TABELAS E SENSIBILIDADE

| Tabela | Sensibilidade | Role Mínimo | Risco Lateral Tratado |
|---|---|---|---|
| `profiles` | Alta (Governança) | ADMIN | Autoelevação: Mitigada. Os updates requerem trigger admin validation. |
| `crm_leads`| Média (Operacional)| OPERATOR | Vazamento Cliente-A e Cliente-B: Mitigado via Row Level filtering. |
