const fs = require('fs');

const inputFile = '10_FLUXAI_SERVICO_EXTRA_REQUEST.blueprint.json';

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const blueprint = JSON.parse(rawData);
    
    let searchRow = null;
    let addRow = null;
    let updateRow = null;
    let ignoreHandler = null;

    function traverse(nodes) {
        if (!nodes) return;
        for (const m of nodes) {
            if (m.module === "google-sheets:searchRows" && !searchRow) searchRow = m;
            if (m.module === "google-sheets:addRow" && !addRow) addRow = m;
            if (m.module === "google-sheets:updateRow" && !updateRow) updateRow = m;
            if (m.module === "builtin:Ignore" && !ignoreHandler) ignoreHandler = m;

            // some modules have an error route directly attached
            if (m.routes) {
                for (const route of m.routes) {
                    if (route.isErrorRoute) {
                         // Found error handler
                         ignoreHandler = route.flow[0];
                    }
                    traverse(route.flow);
                }
            }
        }
    }

    traverse(blueprint.flow);

    console.log("=== SEARCH ROWS ===");
    console.log(JSON.stringify(searchRow ? { module: searchRow.module, parameters: searchRow.parameters } : null, null, 2));
    
    console.log("=== ADD ROW ===");
    console.log(JSON.stringify(addRow ? { module: addRow.module, parameters: addRow.parameters } : null, null, 2));
    
    console.log("=== UPDATE ROW ===");
    console.log(JSON.stringify(updateRow ? { module: updateRow.module, parameters: updateRow.parameters } : null, null, 2));

    console.log("=== ERROR HANDLER ===");
    console.log(JSON.stringify(ignoreHandler, null, 2));

} catch (e) {
    console.error(e);
}
