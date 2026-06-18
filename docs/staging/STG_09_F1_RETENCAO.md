# POLÍTICA DE RETENÇÃO - STG-09

Os logs não podem crescer indefinidamente sem estratégia de expurgo ou armazenamento arquivado.

## Regras
- **Event Store (Transacional):** Imutável. Retenção permanente ou migração para Cold Storage após fechamento do ciclo financeiro.
- **System Logs (DEBUG/INFO):** Limpeza programada autorizada após X dias para manter performance do banco de dados (exige função de expurgo autenticada).
- **Incidentes:** Retidos indefinidamente, porém podem ser compactados em agregações analíticas (Data Warehousing/Cold Storage) após a resolução final.
- **Nenhum Frontend ou Endpoint Público pode invocar a exclusão.**
