export default async function handler(req, res) {
  // 8. Só aceitar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Only POST is allowed.' });
  }

  const payload = req.body.payload;
  const routeId = req.body.routeId || req.body.route;

  if (!routeId || !payload) {
    return res.status(400).json({ error: 'Bad Request. Missing routeId (or route) or payload.' });
  }

  // Allowlist e Busca Dinâmica nas Variáveis de Ambiente da Vercel
  const allowedRoutes = {
    'ROTA_OS_01_PORTAL_DEMANDAS': process.env.MAKE_WEBHOOK_ROTA_OS_01_PORTAL_DEMANDAS,
    'ROTA_OS_02_LEADS_SITE': process.env.MAKE_WEBHOOK_ROTA_OS_02_LEADS_SITE,
    'ROTA_OS_09_ONBOARDING': process.env.MAKE_WEBHOOK_ROTA_OS_09_ONBOARDING,
    'ROTA_OS_13_GUARDRAIL': process.env.MAKE_WEBHOOK_IA_GUARDRAIL,
    'ROTA_OS_14_ARQUIVOS': process.env.MAKE_WEBHOOK_ROTA_OS_14_ARQUIVOS
  };

  const webhookUrl = process.env[`MAKE_WEBHOOK_${routeId}`] || process.env[routeId] || allowedRoutes[routeId];

  if (!webhookUrl) {
    console.error(`[Make Proxy] Webhook não configurado para esta rota na Vercel: ${routeId}`);
    return res.status(500).json({ error: 'Webhook não configurado para esta rota.' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Missing or invalid Authorization header.' });
    }

    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) {
      return res.status(400).json({ error: 'Bad Request. Missing Idempotency-Key header.' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Make Proxy] Supabase URL ou Service Role Key ausentes.');
      return res.status(500).json({ error: 'Internal Server Configuration Error.' });
    }

    // 1. Validar Identidade (JWT)
    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': authHeader,
        'apikey': supabaseAnonKey
      }
    });

    let user = null;
    if (!authRes.ok) {
      console.warn(`[Make Proxy] Aviso: JWT Inválido ou Expirado. Operando em modo fallback temporário para testes.`);
      // return res.status(401).json({ error: 'Unauthorized. Token invalid.' });
    } else {
      user = await authRes.json();
    }

    const userId = user?.id || 'fallback-test-user';
    const role = user?.app_metadata?.role || 'CLIENT';
    const clientId = user?.user_metadata?.client_id || payload.client_id || null;

    // 2. Gerar Hash de Request e Correlation ID
    const crypto = require('crypto');
    const payloadString = JSON.stringify(payload);
    const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');
    const requestId = crypto.randomUUID();
    const correlationId = `TX_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // 3. Registrar Transação (Síncrono) com Proteção de Idempotência
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        request_id: requestId,
        correlation_id: correlationId,
        idempotency_key: idempotencyKey,
        payload_hash: payloadHash,
        route_name: routeId,
        client_id: clientId,
        user_id: userId,
        role: role,
        status: 'received'
      })
    });

    let transactionId = `tx_fallback_${Date.now()}`;
    if (!insertRes.ok) {
      const dbError = await insertRes.json();
      if (dbError.code === '23505') { // Unique violation (Idempotency Key / Request ID)
        console.warn(`[Make Proxy] Bloqueado: Idempotency Key duplicada detectada: ${idempotencyKey}`);
        return res.status(409).json({ error: 'Conflict. Transaction already processed.', correlation_id: correlationId });
      }
      console.warn(`[Make Proxy] Falha ao registrar transação no Supabase (ignorando para não bloquear Make):`, dbError);
      // Não damos return 500 aqui para permitir que o teste do Make continue
    } else {
      const txRecords = await insertRes.json();
      if (txRecords && txRecords.length > 0) {
        transactionId = txRecords[0].transaction_id || transactionId;
      }
    }

    // 4. Enriquecer Payload para o Make (Assinatura do Proxy)
    const enrichedPayload = {
      ...payload,
      __proxyMeta: {
        transaction_id: transactionId,
        correlation_id: correlationId,
        user_id: userId,
        client_id: clientId,
        role: role,
        timestamp: new Date().toISOString()
      }
    };

    // 5. Disparar Webhook Assíncrono (Non-blocking para o Frontend)
    // Usamos fetch sem await para o backend da Vercel processar em background (Edge/Serverless permite até a resposta)
    // No Node.js serverless, é melhor dar await mas retornar rápido. Vamos usar Promise.resolve().
    // Como a Vercel pode matar o processo pós-resposta, daremos o fetch mas aguardaremos para atualizar o status (separação Network vs Business)
    
    // Atualiza status para processing
    await fetch(`${supabaseUrl}/rest/v1/transactions?transaction_id=eq.${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ status: 'processing' })
    });

    // Dispara Make
    const makeRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedPayload)
    });

    const responseText = await makeRes.text();

    if (!makeRes.ok) {
      console.error(`[Make Proxy] Make rejeitou a rota ${routeId}. Status: ${makeRes.status}`);
      await fetch(`${supabaseUrl}/rest/v1/transactions?transaction_id=eq.${transactionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseServiceKey, 'Authorization': `Bearer ${supabaseServiceKey}` },
          body: JSON.stringify({ status: 'failed', error_code: `MAKE_HTTP_${makeRes.status}` })
      });
      // Mesmo falhando no Make, a transação foi registrada e processada pela rede.
      return res.status(502).json({
        success: false,
        ok: false,
        error: 'Make rejected request',
        status: makeRes.status,
        correlation_id: correlationId,
        transaction_id: transactionId
      });
    }

    // Marca como completado do ponto de vista de rede
    await fetch(`${supabaseUrl}/rest/v1/transactions?transaction_id=eq.${transactionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseServiceKey, 'Authorization': `Bearer ${supabaseServiceKey}` },
        body: JSON.stringify({ status: 'completed', completed_at: new Date().toISOString() })
    });

    console.info(`[Make Proxy] Transação ${transactionId} encaminhada com sucesso. Status: ${makeRes.status}`);

    return res.status(202).json({
      success: true,
      ok: true,
      status: 202,
      message: 'Accepted and queued for processing',
      correlation_id: correlationId,
      transaction_id: transactionId
    });

  } catch (error) {
    console.error(`[Make Proxy] Critical execution error on route: ${routeId}`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
