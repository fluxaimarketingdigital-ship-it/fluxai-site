const https = require('https');

const url = 'https://hook.us2.make.com/fc8vuj93w8xd3iq4aotpqm2aanjlarxk';
const payload = JSON.stringify({
  "calendario_id": "CAL_FLUXAI_2026_06_001",
  "planejamento_id": "PLAN_FLUXAI_2026_06_001",
  "client_id": "FLUXAI_LABS_001",
  "client_name": "FluxAI Labs",
  "mes_referencia": "2026-06",
  "semana_referencia": "2026-W24",
  "canal": "instagram",
  "formato_conteudo": "carrossel",
  "tema": "Por que marcas sem sistema de crescimento ficam reféns de conteúdo solto",
  "data_prevista": "2026-06-12",
  "data_publicacao": "",
  "horario_previsto": "09:00",
  "status_postagem": "agendado_interno",
  "responsavel": "Kassia",
  "link_briefing_drive": "",
  "link_entrega_drive": "",
  "observacao": "Teste permitido do cenário 16 calendário de postagens."
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(payload);
req.end();
