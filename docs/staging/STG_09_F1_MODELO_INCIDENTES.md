# MODELO DE INCIDENTES - STG-09

A tabela `operational_incidents` agrega e acompanha anomalias até sua resolução.

## Severidades de Incidente
- `SEV-1`: Indisponibilidade total, falso sucesso massivo ou acesso cruzado confirmado.
- `SEV-2`: Falha parcial em módulo crítico ou timeout frequente.
- `SEV-3`: Inconsistência de reconciliação de dados não-crítica.
- `SEV-4`: Aviso técnico, healthcheck intermitente, ou limite de deduplicação alcançado.

## Deduplicação e Agrupamento
Sempre que um incidente ocorre, sua chave de deduplicação (`incident_key`) é testada. Se existir incidente `open`, a métrica `occurrence_count` é incrementada e o `last_detected_at` é atualizado, evitando ruído de alerta.
