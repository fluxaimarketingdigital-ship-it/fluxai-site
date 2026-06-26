/**
 * Endpoint de Telemetria (Bloco 07)
 * Receptor dedicado para logs e eventos transacionais, garantindo desacoplamento do proxy principal.
 * Autenticado exclusivamente via X-Telemetry-Key.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Autenticação Estrita
  const authHeader = req.headers['authorization'] || req.headers['x-telemetry-key'];
  const expectedSecret = process.env.TELEMETRY_SECRET;

  if (!expectedSecret) {
    console.error('[Telemetry] TELEMETRY_SECRET não configurado na Vercel.');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  const token = authHeader?.replace('Bearer ', '');
  if (token !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized. Invalid Telemetry Key.' });
  }

  const { correlation_id, event_name, source_system, metadata } = req.body;

  if (!correlation_id || !event_name) {
    return res.status(400).json({ error: 'Bad Request. Missing correlation_id or event_name.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Internal Server Error. Supabase not configured.' });
  }

  try {
    // 1. Opcional/Recomendado: Descobrir o transaction_id a partir do correlation_id
    // Isso é útil para amarrar perfeitamente a Foreign Key, embora tenhamos o correlation_id duplicado na tabela events.
    const fetchTx = await fetch(`${supabaseUrl}/rest/v1/transactions?correlation_id=eq.${correlation_id}&select=transaction_id`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    let transactionId = null;
    if (fetchTx.ok) {
      const data = await fetchTx.json();
      if (data && data.length > 0) {
        transactionId = data[0].transaction_id;
      }
    }

    // 2. Gravar o Evento em transaction_events
    const eventRes = await fetch(`${supabaseUrl}/rest/v1/transaction_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        correlation_id: correlation_id,
        event_name: event_name,
        source_system: source_system || 'MAKE',
        metadata: metadata || {},
        to_status: 'unknown' // preenchimento mínimo exigido pelo schema antigo
      })
    });

    if (!eventRes.ok) {
      console.error('[Telemetry] Falha ao gravar evento:', await eventRes.text());
      return res.status(500).json({ error: 'Failed to record telemetry event.' });
    }

    // 3. Atualização Automática de Status Principal (Master Status)
    if (transactionId) {
      let finalStatus = null;
      if (event_name === 'business_completed') {
        finalStatus = 'completed';
      } else if (event_name === 'business_failed' || event_name === 'system_timeout' || event_name === 'system_cancelled') {
        finalStatus = 'failed';
      }

      if (finalStatus) {
        await fetch(`${supabaseUrl}/rest/v1/transactions?transaction_id=eq.${transactionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ 
            status: finalStatus,
            updated_at: new Date().toISOString(),
            ...(finalStatus === 'completed' ? { completed_at: new Date().toISOString() } : {})
          })
        });
        console.info(`[Telemetry] Transação ${correlation_id} fechada com status ${finalStatus}.`);
      }
    }

    return res.status(200).json({ success: true, message: 'Event logged successfully' });
  } catch (err) {
    console.error('[Telemetry] Erro fatal:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
