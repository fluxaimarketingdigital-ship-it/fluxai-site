# STG-07: GATE 6 — SCHEMA E VALIDAÇÃO DE PAYLOAD

Para impedir injenções brutas, payloads enormes ou tipos de dados corruptos que encavalariam o Make, o Proxy assumiu validação restrita:
1. Strings Vázias limpas.
2. Campos Administrativos (`role`, `status_fatura`) removidos do Payload de Entrada.
3. Timestamp do disparo carimbado de forma imutável (Server Time `created_at`).

Nenhum campo com sufixos perigosos de Override Backend passará pelas vigas de proteção antes do repasse final do JSON.
