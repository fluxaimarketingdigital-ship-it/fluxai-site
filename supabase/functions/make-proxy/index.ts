const ALLOWED_ORIGINS = [
  "https://www.fluxaidigital.com.br",
  "https://fluxaidigital.com.br",
  "http://localhost:3000",
  "http://localhost:5173"
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Permite domínios de preview/staging da Vercel (ex: *.vercel.app)
  if (origin.endsWith(".vercel.app") || /^https:\/\/fluxai-site-.*\.vercel\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(requestOrigin: string | null) {
  const origin = (requestOrigin && isOriginAllowed(requestOrigin)) ? requestOrigin : "https://www.fluxaidigital.com.br";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-fluxai-proxy-key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const WEBHOOK_SECRET_MAP: Record<string, string> = {
  DEMAND_SUBMISSION:     "MAKE_WEBHOOK_DEMAND_SUBMISSION",
  LEAD_CAPTURE:          "MAKE_WEBHOOK_LEAD_CAPTURE",
  CLIENT_ONBOARDING:     "MAKE_WEBHOOK_CLIENT_ONBOARDING",
  SERVICE_EXTRA_REQUEST: "MAKE_WEBHOOK_SERVICE_EXTRA_REQUEST",
  IA_CREDITOS_CONTROLE:  "MAKE_WEBHOOK_IA_CREDITOS_CONTROLE",
  AI_OPERATIONAL_CONTROL:"MAKE_WEBHOOK_AI_OPERATIONAL_CONTROL",
  SERVICE_EXTRA_APPROVAL:"MAKE_WEBHOOK_SERVICE_EXTRA_APPROVAL",
  IA_GUARDRAIL:          "MAKE_WEBHOOK_IA_GUARDRAIL",
  PLANEJAMENTO_CONTEUDO: "MAKE_WEBHOOK_PLANEJAMENTO_CONTEUDO",
  CALENDARIO_POSTAGENS:  "MAKE_WEBHOOK_CALENDARIO_POSTAGENS",
  GPT_GERACOES_LOG:      "MAKE_WEBHOOK_GPT_GERACOES_LOG",
};

function jsonResponse(body: unknown, status = 200, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  const reqOrigin = req.headers.get("Origin") || req.headers.get("origin");
  const corsHeaders = getCorsHeaders(reqOrigin);

  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed", requestId }, 405, corsHeaders);
    }

    // 1. Validação física de Origin / Domínio permitido
    if (reqOrigin && !isOriginAllowed(reqOrigin)) {
      console.log("make-proxy:origin-forbidden", { requestId, reqOrigin });
      return jsonResponse({ ok: false, error: "Forbidden origin", requestId }, 403, corsHeaders);
    }

    const proxyKeySecret = Deno.env.get("FLUXAI_PROXY_ACCESS_KEY");
    const proxyKeyHeader = req.headers.get("x-fluxai-proxy-key");

    if (!proxyKeySecret) {
      console.log("make-proxy:missing-proxy-key-secret", { requestId });
      return jsonResponse({ ok: false, error: "Missing proxy key configuration", requestId }, 500, corsHeaders);
    }

    if (!proxyKeyHeader) {
      console.log("make-proxy:missing-proxy-key-header", { requestId });
      return jsonResponse({ ok: false, error: "Unauthorized access", requestId }, 401, corsHeaders);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON body", requestId }, 400, corsHeaders);
    }

    const route = body?.route;
    const payload = body?.payload;

    console.log("make-proxy:start", { requestId, route, hasPayload: Boolean(payload) });

    if (!route || typeof route !== "string") {
      return jsonResponse({ ok: false, error: "Missing route", requestId }, 400, corsHeaders);
    }

    // 2. Aceita apenas a rota específica para a chave pública 'fluxai-proxy-public-2026'
    // Bloqueia qualquer acesso de chave pública a outras rotas administrativas ou críticas
    if (route === "LEAD_CAPTURE") {
      if (proxyKeyHeader !== "fluxai-proxy-public-2026" && proxyKeyHeader !== proxyKeySecret) {
        console.log("make-proxy:suspicious-unauthorized-lead-key", { requestId, route, origin: reqOrigin });
        return jsonResponse({ ok: false, error: "Unauthorized key for lead capture", requestId }, 401, corsHeaders);
      }
    } else {
      if (proxyKeyHeader !== proxyKeySecret) {
        console.log("make-proxy:suspicious-unauthorized-admin-route-access", { requestId, route, origin: reqOrigin });
        return jsonResponse({ ok: false, error: "Unauthorized admin route access", requestId }, 401, corsHeaders);
      }
    }

    const secretName = WEBHOOK_SECRET_MAP[route];

    if (!secretName) {
      console.log("make-proxy:invalid-route", { requestId, route });
      return jsonResponse({ ok: false, error: "Invalid route", route, requestId }, 400, corsHeaders);
    }

    // 3. Validação de campos obrigatórios, formato de e-mail e sanitização de schema no backend
    let sanitizedPayload = payload ?? {};
    if (route === "LEAD_CAPTURE") {
      const { name, email, company, revenue, spend, gap } = sanitizedPayload;

      // Bloqueia se algum campo essencial estiver em branco
      if (!name || !email || !company || !revenue || !spend || !gap) {
        console.log("make-proxy:missing-required-fields", { requestId, origin: reqOrigin });
        return jsonResponse({ ok: false, error: "Missing required lead fields", requestId }, 400, corsHeaders);
      }

      // Valida formato de e-mail básico no backend
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(email).trim())) {
        console.log("make-proxy:invalid-email-format", { requestId, email, origin: reqOrigin });
        return jsonResponse({ ok: false, error: "Invalid email format", requestId }, 400, corsHeaders);
      }

      // Sanitiza payload para conter apenas os campos definidos no schema do lead (prevenção de injeção)
      sanitizedPayload = {
        name: String(name).trim().substring(0, 100),
        email: String(email).trim().substring(0, 100),
        company: String(company).trim().substring(0, 100),
        revenue: String(revenue).trim().substring(0, 30),
        spend: String(spend).trim().substring(0, 30),
        gap: String(gap).trim().substring(0, 50),
        description: String(sanitizedPayload.description || "").trim().substring(0, 1000)
      };
    }

    const webhookUrl = Deno.env.get(secretName);

    if (!webhookUrl || !webhookUrl.startsWith("https://")) {
      console.log("make-proxy:invalid-secret", { requestId, route });
      return jsonResponse({ ok: false, error: "Invalid webhook configuration", route, requestId }, 500, corsHeaders);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let makeResponse: Response;

    try {
      makeResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-FluxAI-Proxy": "supabase-edge-function",
          "X-FluxAI-Route": route,
          "X-FluxAI-Request-Id": requestId,
        },
        body: JSON.stringify(sanitizedPayload),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      console.log("make-proxy:make-fetch-error", {
        requestId,
        route,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return jsonResponse({ ok: false, error: "Make webhook request failed", route, requestId }, 502, corsHeaders);
    }

    clearTimeout(timeout);

    const responseText = await makeResponse.text();

    console.log("make-proxy:make-response", {
      requestId,
      route,
      status: makeResponse.status,
      ok: makeResponse.ok,
    });

    return jsonResponse(
      {
        ok: makeResponse.ok,
        route,
        requestId,
        makeStatus: makeResponse.status,
        makeResponse: responseText.slice(0, 500),
      },
      makeResponse.ok ? 200 : 502,
      corsHeaders
    );

  } catch (error) {
    console.log("make-proxy:unhandled-error", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonResponse({ ok: false, error: "Unhandled proxy error", requestId }, 500, corsHeaders);
  }
});
