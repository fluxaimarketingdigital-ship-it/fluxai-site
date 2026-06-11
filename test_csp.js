const payload = {
    lead_id: "LEAD_2026_06_1234",
    cliente_id: "",
    cliente_nome: "",
    origem_site: "site_fluxai",
    nome_lead: "Antigravity Teste CSP",
    email: "", 
    telefone: "11999999999",
    empresa: "FluxAI CSP Test",
    servico_interesse: "Diagnóstico FluxAI",
    canal_origem: "formulario_site",
    campanha: "",
    pagina_origem: "landing_diagnostico",
    status_lead: "novo",
    responsavel: "",
    observacao: "Teste CSP validado."
};

fetch('https://hook.us2.make.com/au4ko54wey2q3b98crpfmo55w8viy481', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
})
.then(async (res) => {
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response recebida com", text.length, "bytes.");
})
.catch(console.error);
