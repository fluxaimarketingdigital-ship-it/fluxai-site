const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-fluxai-proxy-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

function jsonResponse(body: unknown, status = 200) {
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

  try {
    // 1. CORS Preflight
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // 2. Method guard
    if (req.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed", requestId }, 405);
    }

    // 3. Proxy-Key validation
    const proxyKeySecret = Deno.env.get("FLUXAI_PROXY_ACCESS_KEY");
    const proxyKeyHeader = req.headers.get("x-fluxai-proxy-key");

    if (!proxyKeySecret) {
      // Secret não configurado no Supabase — erro interno seguro
      console.log("make-proxy:missing-proxy-key-secret", { requestId });
      return jsonResponse({ ok: false, error: "Missing proxy key configuration", requestId }, 500);
    }

    if (!proxyKeyHeader || proxyKeyHeader !== proxyKeySecret) {
      console.log("make-proxy:invalid-proxy-key", { requestId });
      return jsonResponse({ ok: false, error: "Unauthorized", requestId }, 401);
    }

    // 4. Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON body", requestId }, 400);
    }

    const { route, payload } = body ?? {};

    console.log("make-proxy:start", {
      requestId,
      route,
      hasPayload: Boolean(payload),
    });

    // 5. Route validation
    if (!route || typeof route !== "string") {
      return jsonResponse({ ok: false, error: "Missing route", requestId }, 400);
    }

    const secretName = WEBHOOK_SECRET_MAP[route];

    if (!secretName) {
      console.log("make-proxy:invalid-route", { requestId, route });
      return jsonResponse({ ok: false, error: "Invalid route", route, requestId }, 400);
    }

    // 6. Read webhook URL from env
    const webhookUrl = Deno.env.get(secretName);

    if (!webhookUrl) {
      console.log("make-proxy:missing-secret", { requestId, route });
      return jsonResponse({ ok: false, error: "Missing webhook secret", route, requestId }, 500);
    }

    if (!webhookUrl.startsWith("https://")) {
      console.log("make-proxy:invalid-secret-url", { requestId, route });
      return jsonResponse({ ok: false, error: "Invalid webhook URL", route, requestId }, 500);
    }

    // 7. Forward to Make with timeout
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
        body: JSON.stringify(payload ?? {}),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      console.log("make-proxy:make-fetch-error", {
        requestId,
        route,
        error: error instanceof Error ? error.message : String(error),
      });
      return jsonResponse({ ok: false, error: "Make webhook request failed", route, requestId }, 502);
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
      makeResponse.ok ? 200 : 502
    );

  } catch (error) {
    console.log("make-proxy:unhandled-error", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
    return jsonResponse({ ok: false, error: "Unhandled proxy error", requestId }, 500);
  }
});
