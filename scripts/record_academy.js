const express = require('express');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const SITE_DIR = path.join(__dirname, '..');

app.use(express.static(SITE_DIR));

const server = app.listen(PORT, () => {
    console.log(`Mock Server running on http://localhost:${PORT}`);
    runRecording().catch(err => {
        console.error(err);
        server.close();
    });
});

const MOCK_LOCAL_STORAGE = {
    'fluxai_auth': JSON.stringify({ role: 'ADMIN', name: 'Administrador' }),
    'fluxai_active_client': JSON.stringify({ id: 'FLUXAI_LABS_001', name: 'FluxAI Labs', status: 'ativo' }),
    'fluxai_clients': JSON.stringify([
        { id: 'FLUXAI_LABS_001', name: 'FluxAI Labs', status: 'ativo', mrr: 15000, leads: 42 }
    ]),
    'fluxai_demands': JSON.stringify([
        { id: 'D01', client_id: 'FLUXAI_LABS_001', title: 'Campanha Q3', status: 'Em Andamento', type: 'Design' },
        { id: 'D02', client_id: 'FLUXAI_LABS_001', title: 'Relatório Mensal', status: 'Aprovação', type: 'Growth' }
    ])
};

async function recordPage(browser, url, destPath, scroll = true) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Set localStorage before loading so the JS picks it up
    await page.evaluateOnNewDocument((mockData) => {
        for (const key in mockData) {
            localStorage.setItem(key, mockData[key]);
        }
    }, MOCK_LOCAL_STORAGE);

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Ensure dest directory exists
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const recorder = new PuppeteerScreenRecorder(page);
    console.log(`Started recording ${destPath}...`);
    await recorder.start(destPath);

    // Simulate some time and scrolling
    await page.waitForTimeout(1000);
    if (scroll) {
        await page.evaluate(() => {
            window.scrollBy({ top: 300, left: 0, behavior: 'smooth' });
        });
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            window.scrollBy({ top: 300, left: 0, behavior: 'smooth' });
        });
    }
    await page.waitForTimeout(2000);

    await recorder.stop();
    console.log(`Saved ${destPath}`);
    await page.close();
}

async function runRecording() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });

    const basePath = path.join(SITE_DIR, 'docs', 'academy', 'videos_estrutura');

    try {
        await recordPage(
            browser, 
            `http://localhost:${PORT}/os/command-center.html`, 
            path.join(basePath, '00_visao_geral', 'visao_geral.mp4')
        );

        await recordPage(
            browser, 
            `http://localhost:${PORT}/os/content-engine.html`, 
            path.join(basePath, '01_primeiros_passos', 'primeiros_passos.mp4')
        );

        await recordPage(
            browser, 
            `http://localhost:${PORT}/os/client-portal.html`, 
            path.join(basePath, '02_gestao_demandas', 'gestao_demandas.mp4')
        );

        await recordPage(
            browser, 
            `http://localhost:${PORT}/pages/analytics-intelligence.html`, 
            path.join(basePath, '03_analise_metricas', 'analise_metricas.mp4')
        );
    } catch(err) {
        console.error("Recording error:", err);
    } finally {
        await browser.close();
        server.close();
        console.log('All recordings finished!');
    }
}
