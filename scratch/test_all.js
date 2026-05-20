global.window = global;
global.document = {
    getElementById: () => ({ innerHTML: '', style: {} }),
    addEventListener: () => {},
    querySelector: () => null,
};
global.navigator = { clipboard: { writeText: () => {} } };
global.location = { href: '', search: '' };
global.localStorage = { getItem: () => null, setItem: () => {} };
global.sessionStorage = { getItem: () => null, setItem: () => {} };
global.history = { pushState: () => {} };
global.alert = () => {};
global.confirm = () => true;
global.prompt = () => '';

async function test() {
    try {
        console.log("Importing os-core.js...");
        await import('../os/js/os-core.js');
        console.log("Importing supabase-client.js...");
        await import('../os/services/supabase-client.js');
        console.log("Importing content-engine.js...");
        await import('../os/modules/content-engine/content-engine.js');
        console.log("All imported successfully!");
    } catch (e) {
        console.error("ERROR:", e);
    }
}

test();
