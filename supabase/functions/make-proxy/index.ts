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
  if (origin.endsWith(".vercel.app") || (origin.startsWith("https://fluxai-site-") && origin.endsWith(".vercel.app"))) return true;
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

function isValidEmailBasic(email: unknown): boolean {
  if (typeof email !== 'string') return false;

  const value = email.trim();

  if (value.length < 3 || value.length > 254) return false;
  if (value.includes(' ')) return false;

  const parts = value.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;

  if (!localPart || !domain) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (!domain.includes('.')) return false;

  return true;
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
      const isHome = sanitizedPayload.origem_site === "site_fluxai" || sanitizedPayload.origem_site === "home_fluxai";

      if (isHome) {
        // Modelo B: Home Page
        const nomeLead = sanitizedPayload.nome_lead || sanitizedPayload.name || sanitizedPayload.nome;
        const telefoneLead = sanitizedPayload.telefone || sanitizedPayload.phone || "";
        const empresaLead = sanitizedPayload.empresa || sanitizedPayload.instagram || sanitizedPayload.company || "Não informado";
        const emailLead = sanitizedPayload.email || "";
        const observacaoInput = sanitizedPayload.observacao || sanitizedPayload.desafio || sanitizedPayload.description || "";
        const instagramText = String(sanitizedPayload.instagram || "").trim().substring(0, 100);
        const segmentoText = String(sanitizedPayload.segmento || "").trim().substring(0, 100);
        const gargaloText = String(sanitizedPayload.gargalo || "").trim().substring(0, 100);
        const desafioText = String(observacaoInput).trim().substring(0, 1000);
        
        // Monta observação rica para a Home
        const observacaoText = `Instagram/Site: ${instagramText} | Segmento: ${segmentoText} | Gargalo: ${gargaloText} | ${desafioText}`;

        // Valida campos essenciais mínimos para a Home Page
        if (!nomeLead) {
          console.log("make-proxy:missing-required-fields-home", { requestId, origin: reqOrigin });
          return jsonResponse({ ok: false, error: "Missing required lead fields for homepage", requestId }, 400, corsHeaders);
        }

        // Valida formato de e-mail básico no backend SE fornecido
        if (emailLead && !isValidEmailBasic(emailLead)) {
          console.log("make-proxy:invalid-email-format-home", { requestId, email: emailLead, origin: reqOrigin });
          return jsonResponse({ ok: false, error: "Invalid email format", requestId }, 400, corsHeaders);
        }

        const leadId = sanitizedPayload.lead_id || `LEAD-${crypto.randomUUID()}`;

        sanitizedPayload = {
          lead_id: leadId,
          cliente_id: "FLUXAI_LABS_001",
          cliente_nome: "FluxAI Labs",
          origem_site: "site_fluxai",
          nome_lead: String(nomeLead).trim().substring(0, 100),
          email: String(emailLead).trim().substring(0, 100),
          telefone: String(telefoneLead).trim().substring(0, 30),
          empresa: String(empresaLead).trim().substring(0, 100),
          servico_interesse: "Diagnóstico Estratégico FluxAI",
          canal_origem: "site",
          campanha: "home_fluxai",
          pagina_origem: "/",
          status_lead: "novo",
          responsavel: "FluxAI",
          observacao: observacaoText
        };
      } else {
        // Modelo A: Landing Page /giaas
        const { name, email, company, revenue, spend, gap } = sanitizedPayload;

        // Bloqueia se algum campo essencial estiver em branco
        if (!name || !email || !company || !revenue || !spend || !gap) {
          console.log("make-proxy:missing-required-fields-landing", { requestId, origin: reqOrigin });
          return jsonResponse({ ok: false, error: "Missing required lead fields", requestId }, 400, corsHeaders);
        }

        // Valida formato de e-mail básico no backend
        if (!isValidEmailBasic(email)) {
          console.log("make-proxy:invalid-email-format-landing", { requestId, email, origin: reqOrigin });
          return jsonResponse({ ok: false, error: "Invalid email format", requestId }, 400, corsHeaders);
        }

        // Constrói o identificador do lead de forma segura
        const leadId = `LEAD-${crypto.randomUUID()}`;

        // Monta a observação concatenando as informações comerciais
        const faturamentoText = String(revenue).trim().substring(0, 30);
        const midiaText = String(spend).trim().substring(0, 30);
        const gargaloText = String(gap).trim().substring(0, 50);
        const descricaoText = String(sanitizedPayload.description || "").trim().substring(0, 1000);
        const observacaoText = `Faturamento: ${faturamentoText} | Mídia: ${midiaText} | Gargalo: ${gargaloText} | ${descricaoText}`;

        // Transforma o payload no formato achatado exigido pelo cenário 02 do Make
        sanitizedPayload = {
          lead_id: leadId,
          cliente_id: "FLUXAI_LABS_001",
          cliente_nome: "FluxAI Labs",
          origem_site: "landing_sistema_crescimento",
          nome_lead: String(name).trim().substring(0, 100),
          email: String(email).trim().substring(0, 100),
          telefone: String(sanitizedPayload.phone || sanitizedPayload.telefone || "").trim().substring(0, 30),
          empresa: String(company).trim().substring(0, 100),
          servico_interesse: "Sistema de Crescimento FluxAI",
          canal_origem: "site",
          campanha: "landing_sistema_crescimento",
          pagina_origem: String(sanitizedPayload.page_url || "/giaas").trim().substring(0, 100),
          status_lead: "novo",
          responsavel: "FluxAI",
          observacao: observacaoText
        };
      }
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
