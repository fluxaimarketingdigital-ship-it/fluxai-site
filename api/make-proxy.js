export default async function handler(req, res) {
  // 8. Só aceitar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Only POST is allowed.' });
  }

  const { routeId, payload } = req.body;

  if (!routeId || !payload) {
    return res.status(400).json({ error: 'Bad Request. Missing routeId or payload.' });
  }

  // 6. Allowlist rígida
  // 2. Usar variáveis de ambiente da Vercel
  const allowedRoutes = {
    'ROTA_OS_01_PORTAL_DEMANDAS': process.env.MAKE_WEBHOOK_ROTA_OS_01_PORTAL_DEMANDAS,
    'ROTA_OS_02_LEADS_SITE': process.env.MAKE_WEBHOOK_ROTA_OS_02_LEADS_SITE,
    'ROTA_OS_14_ARQUIVOS': process.env.MAKE_WEBHOOK_ROTA_OS_14_ARQUIVOS
  };

  // 7. Qualquer routeId desconhecido deve ser bloqueado
  if (!allowedRoutes.hasOwnProperty(routeId)) {
    // 9. Não registrar webhook completo em console/log
    console.warn(`[Make Proxy] Blocked attempt to access unknown route: ${routeId}`);
    return res.status(403).json({ error: 'Forbidden. Route is not allowed or not implemented.' });
  }

  const webhookUrl = allowedRoutes[routeId];

  if (!webhookUrl) {
    console.error(`[Make Proxy] Webhook não configurado para esta rota na Vercel: ${routeId}`);
    return res.status(500).json({ error: 'Webhook não configurado para esta rota.' });
  }

  try {
    const makeRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await makeRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { text, ok: makeRes.ok };
    }

    // 9. Não registrar webhook completo em console/log
    console.info(`[Make Proxy] Forwarded ${routeId}. Status: ${makeRes.status}`);

    return res.status(makeRes.status).json(data);
  } catch (error) {
    console.error(`[Make Proxy] Network error when forwarding route: ${routeId}`);
    return res.status(502).json({ error: 'Bad Gateway. Failed to reach upstream service.' });
  }
}
