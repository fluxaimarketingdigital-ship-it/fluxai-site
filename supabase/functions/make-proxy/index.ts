import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://fluxaidigital.com.br",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const ROUTE_ENV_MAP: Record<string, string> = {
  DEMAND_SUBMISSION: "MAKE_WEBHOOK_DEMAND_SUBMISSION",
  LEAD_CAPTURE: "MAKE_WEBHOOK_LEAD_CAPTURE",
  CLIENT_ONBOARDING: "MAKE_WEBHOOK_CLIENT_ONBOARDING",
  SERVICE_EXTRA_REQUEST: "MAKE_WEBHOOK_SERVICE_EXTRA_REQUEST",
  IA_CREDITOS_CONTROLE: "MAKE_WEBHOOK_IA_CREDITOS_CONTROLE",
  AI_OPERATIONAL_CONTROL: "MAKE_WEBHOOK_AI_OPERATIONAL_CONTROL",
  SERVICE_EXTRA_APPROVAL: "MAKE_WEBHOOK_SERVICE_EXTRA_APPROVAL",
  IA_GUARDRAIL: "MAKE_WEBHOOK_IA_GUARDRAIL",
  PLANEJAMENTO_CONTEUDO: "MAKE_WEBHOOK_PLANEJAMENTO_CONTEUDO",
  CALENDARIO_POSTAGENS: "MAKE_WEBHOOK_CALENDARIO_POSTAGENS",
  GPT_GERACOES_LOG: "MAKE_WEBHOOK_GPT_GERACOES_LOG"
}

const PUBLIC_ROUTES = ["LEAD_CAPTURE"]

serve(async (req) => {
  // 1. CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  try {
    // 2. Validate Method
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
        status: 405, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      })
    }

    // 3. Validate Content-Type
    const contentType = req.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Unsupported Media Type" }), { 
        status: 415, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      })
    }

    // 4. Parse Body
    let body;
    try {
      body = await req.json()
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), { 
        status: 400, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      })
    }

    const { route, client_id, source, payload } = body

    // 5. Validate Required Fields
    if (!route || !source || !payload) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      })
    }

    // 6. Validate Source
    if (source !== "fluxai_os") {
      return new Response(JSON.stringify({ error: "Invalid source" }), { 
        status: 403, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      })
    }

    // 7. Validate Route against Allowlist
    const envKey = ROUTE_ENV_MAP[route]
    if (!envKey) {
      return new Response(JSON.stringify({ error: "Forbidden route" }), { 
        status: 403, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      })
    }

    // 8. Auth Validation
    const isPublic = PUBLIC_ROUTES.includes(route)
    if (!isPublic) {
      const authHeader = req.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { 
          status: 401, 
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
        })
      }
      // TODO (Fase 03.1E/03.1F): Validar o JWT usando o Supabase Auth Client
    }

    // 9. Read Environment Variable
    const webhookUrl = Deno.env.get(envKey)
    if (!webhookUrl) {
      // Retorna 500 generico sem expor nomes de variavel ou detalhes
      return new Response(JSON.stringify({ error: "Webhook route is not configured" }), { 
        status: 500, 
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" } 
      })
    }

    // 10. Forward to Make
    const sanitizedPayload = {
      route,
      client_id: client_id || "ANONYMOUS",
      source,
      payload,
      received_at: new Date().toISOString()
    }

    try {
      const makeResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sanitizedPayload)
      })

      if (!makeResponse.ok) {
        throw new Error(`Upstream returned ${makeResponse.status}`)
      }

      return new Response(JSON.stringify({ ok: true, route, status: "forwarded" }), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      })

    } catch (error) {
      return new Response(JSON.stringify({ ok: false, error: "Upstream webhook failed" }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      })
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    })
  }
})
