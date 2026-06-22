# STG-06: GATE 9 — TESTES DE PAYLOAD

* **Cenário:** Adulteração no Fetch para forçar `{"role": "ADMIN"}` no objeto de inserção/update.
* **Resultado:** As triggers e as novas roles do banco absorvem apenas a identidade canônica (via functions internas). O frontend foi emasculado, retirando seu poder de definir privilégio. Apenas a API restrita administrativa pode alterar este status.
