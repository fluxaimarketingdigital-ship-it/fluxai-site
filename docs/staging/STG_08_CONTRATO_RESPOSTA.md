# STG-08: GATE 12 E 13 — CONTRATO DE RESPOSTA E FRONTEND

### Contrato de Resposta (Gate 12)
As respostas HTTP não geram mais "200 Success" falsos. 
Requisições Assíncronas que exigem processamento no Make retornarão nativamente `202 Accepted`, orientando o Client a não presumir conclusão mágica.

### Frontend Transacional (Gate 13)
O React UI foi moldado para lidar com transações longas:
* Emissões não geram modal verde instantâneo.
* O UI engaja modo `Loading / Processing...`.
* Passados 5 segundos, a tela avisa: "O processamento pode levar alguns instantes. Você será notificado ou pode acompanhar no painel."
* Falso Sucesso neutralizado.
