const https = require('https');

const data = JSON.stringify({
  "cliente_id": "FLUXAI_LABS_001",
  "client_id": "FLUXAI_LABS_001",
  "cliente_nome": "FluxAI Labs",
  "client_name": "FluxAI Labs",
  "responsavel": "Kassia",
  "responsavel_fluxai": "Kassia",
  "responsavel_comercial": "Kassia",
  "tipo_cliente": "cliente_interno_validacao",
  "status_cliente": "ativo",
  "segmento": "consultoria estratégica de crescimento, automação e infraestrutura operacional",
  "objetivo_principal": "Validar o fluxo oficial de onboarding do FluxAI OS com cliente interno controlado.",
  "proposta_valor": "Sistema estratégico de crescimento que integra posicionamento, conteúdo, dados, automação e governança operacional.",
  "diferenciais": "Infraestrutura própria, visão executiva, automação com governança, inteligência estratégica e operação centralizada no FluxAI OS.",
  "tom_de_voz": "executivo, analítico, direto, premium e humano",
  "posicionamento_editorial": "consultoria premium de crescimento e infraestrutura operacional",
  "pilares_editoriais": "1. Engenharia de Automação, 2. Cultura Analítica, 3. Escala Estratégica, 4. Visão Executiva.",
  "linguagem_permitida": "Termos técnicos precisos (KPI, ROI, automação, infraestrutura), tom proativo e resolutivo.",
  "linguagem_proibida": "Gírias, promessas infundadas, jargões clichês de marketing genérico.",
  "roadmap_ia": "1. Governança de prompts, 2. Automação de pipelines, 3. Escala de conteúdo validado.",
  "cta_padrao": "Acesse a documentação do FluxAI OS para implementar esta esteira na sua operação.",
  "contrato_id": "CONTRATO_FLUXAI_LABS_001_2026",
  "data_inicio": "2026-06-06",
  "dia_vencimento": "10",
  "fee_mensal": 0,
  "modulos_contratados": "FluxAI OS Full Suite",
  "escopo_setup": "Implantação e validação do core arquitetural da operação interna.",
  "drive_folder_url": "https://drive.google.com/drive/u/0/folders/1abc123xyz_labs",
  "link_contrato_drive": "https://drive.google.com/file/d/contrato_interno_labs",
  "mes_referencia": "2026-06",
  "tipo_entrega": "conteudo_estrategico",
  "origem_limite": "contrato_interno",
  "limite_operacional_mensal": 30
});

const options = {
  hostname: 'hook.us2.make.com',
  path: '/lla4xs6a6cq1u3l0j68mpy6ykahe2r2b',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
