import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tratamento de preflight (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { model, messages, max_tokens, temperature, response_format } = await req.json()

    // O segredo OPENAI_API_KEY deve estar configurado no Supabase Dashboard
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      throw new Error('Chave OPENAI_API_KEY no configurada no servidor.')
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer 
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
        response_format
      })
    })

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text()
      console.error('[OPENAI PROXY ERROR]', errorText)
      return new Response(JSON.stringify({ error: 'Erro na API da OpenAI', details: errorText }), {
        status: openaiRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await openaiRes.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
