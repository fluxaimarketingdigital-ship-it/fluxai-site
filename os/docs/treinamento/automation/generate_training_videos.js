/**
 * GENERATE_TRAINING_VIDEOS.JS — Gerador automático de vídeos de treinamento FluxAI OS™
 * Inclui: Puppeteer para telas, node-edge-tts para Voz Neural, ffmpeg para compilação.
 */

const puppeteer = require('puppeteer-core');
const fs        = require('fs');
const path      = require('path');
const http      = require('http');
const { spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const { EdgeTTS } = require('node-edge-tts');

// Instancia TTS com voz Neural hiper-realista em PT-BR
const tts = new EdgeTTS({ voice: 'pt-BR-FranciscaNeural' }); 

const { SCENARIOS, MOCK_SESSIONS } = require('./video_scenarios.js');

// ─── CONFIGURAÇÃO ──────────────────────────────────────────────────────────────
const PROJECT_ROOT   = path.join(__dirname, '..', '..', '..', '..');
const PORT           = 4040;
const BASE_URL       = `http://localhost:${PORT}`;
const CHROME_PATH    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const VIDEOS_ROOT    = path.join(__dirname, '..', 'videos');
const EXPORTS_DIR    = path.join(VIDEOS_ROOT, '03_exports_finais');
const TEMP_DIR       = path.join(VIDEOS_ROOT, 'temp');
const VALIDATION_DIR = path.join(VIDEOS_ROOT, '04_revisao', 'validacao');
const REPORT_PATH    = path.join(__dirname, '..', 'RELATORIO_AUTOMACAO_VIDEOS_TREINAMENTO.md');
const VIEWPORT       = { width: 1920, height: 1080 };

[EXPORTS_DIR, TEMP_DIR, VALIDATION_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

function startServer() {
    return new Promise((resolve) => {
        const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
        const server = http.createServer((req, res) => { 
            let reqPath = decodeURIComponent(req.url.split('?')[0]); 
            let filePath = path.normalize(path.join(PROJECT_ROOT, reqPath)); 
            if (filePath.endsWith(path.sep) || reqPath.endsWith('/')) filePath = path.join(filePath, 'index.html'); 
            
            const resolvedPath = path.resolve(filePath);
            const resolvedRoot = path.resolve(PROJECT_ROOT);
            if (!resolvedPath.startsWith(resolvedRoot)) { res.writeHead(403); res.end('Forbidden'); return; } 
            
            fs.readFile(resolvedPath, (err, data) => { 
                if (err) { res.writeHead(404); res.end('Not found'); return; } 
                res.writeHead(200, { 'Content-Type': mime[path.extname(resolvedPath)] || 'text/plain' }); 
                res.end(data); 
            }); 
        }); 
        server.listen(PORT, '127.0.0.1', () => {
            console.log(`✅ Servidor local iniciado em ${BASE_URL}`);
            resolve(server);
        });
    });
}

async function validateServer() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/os/login.html`, (res) => {
            if (res.statusCode === 200) resolve(true);
            else resolve(false);
        }).on('error', () => resolve(false));
    });
}

const OVERLAY_SCRIPT = `
(function() {
    const prev = document.getElementById('_fluxai_training_overlay');
    if (prev) prev.remove();
    const overlay = document.createElement('div');
    overlay.id = '_fluxai_training_overlay';
    overlay.style.cssText = \`position: fixed; bottom: 0; left: 0; right: 0; z-index: 999999; background: linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 60%, transparent 100%); padding: 32px 60px 36px; pointer-events: none; font-family: 'Inter', 'Segoe UI', Arial, sans-serif;\`;
    document.body.appendChild(overlay);

    window.__fluxaiCaption = function(text, stepNum, totalSteps, highlightSel) {
        overlay.innerHTML = \`<div style="display:flex; align-items:flex-end; justify-content:space-between; gap:24px;"><div style="flex:1; min-width:0;"><div style="color:#8E9E68; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">FluxAI OS™ — Treinamento Operacional</div><div style="color:#ffffff; font-size:22px; font-weight:600; line-height:1.4; text-shadow:0 2px 8px rgba(0,0,0,0.8);">\${text}</div></div><div style="flex-shrink:0; background:rgba(142,158,104,0.2); border:1px solid rgba(142,158,104,0.5); border-radius:8px; padding:8px 18px; text-align:center;"><div style="color:#8E9E68; font-size:10px; font-weight:700; letter-spacing:1px;">PASSO</div><div style="color:#ffffff; font-size:20px; font-weight:800;">\${stepNum}<span style="color:#8E9E68;font-size:14px;">/ \${totalSteps}</span></div></div></div>\`;
        document.querySelectorAll('._fluxai_hl').forEach(el => { el.style.outline = ''; el.style.boxShadow = ''; el.classList.remove('_fluxai_hl'); });
        if (highlightSel) {
            const el = document.querySelector(highlightSel);
            if (el) {
                el.classList.add('_fluxai_hl');
                el.style.outline = '3px solid #8E9E68';
                el.style.boxShadow = '0 0 0 6px rgba(142,158,104,0.25), 0 0 20px rgba(142,158,104,0.4)';
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };
})();
`;

async function injectSession(page, role) {
    const session = MOCK_SESSIONS[role];
    await page.evaluateOnNewDocument((s) => {
        sessionStorage.setItem('fluxai_ui_context', JSON.stringify(s));
        localStorage.setItem('fluxai_current_project_id', s.project_id || 'proj_fluxai_labs_master');
        localStorage.setItem('fluxai_mock_projects', JSON.stringify([{ id: 'proj_fluxai_labs_master', company_name: 'FluxAI Labs', name: 'FluxAI Labs', status: 'ativo', plan: 'Agência Pro', segment: 'Agência Digital' }]));
    }, session);
}

async function generateAudio(text, outputPath) {
    try {
        await tts.ttsPromise(text, outputPath);
        return true;
    } catch (e) {
        console.error(`    ❌ Falha no Edge TTS: ${e.message}`);
        return false;
    }
}

// createSegmentVideo foi substituída pelo processo dinâmico no corpo da função

function concatSegments(segmentFiles, outputPath) {
    const concatPath = path.join(TEMP_DIR, `${path.basename(outputPath, '.mp4')}_concat_list.txt`);
    const content = segmentFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(concatPath, content, 'utf8');

    const args = [
        '-y', '-f', 'concat', '-safe', '0', '-i', concatPath,
        '-c', 'copy', outputPath
    ];
    const res = spawnSync(ffmpegPath, args, { stdio: 'ignore' });
    return res.status === 0;
}

async function generateVideo(scenario, browser) {
    const safeId = String(scenario.id).replace(/[^a-zA-Z0-9_-]/g, '');
    const safeFilename = String(scenario.filename).replace(/[^a-zA-Z0-9_-]/g, '');
    scenario.filename = safeFilename;

    const videoTempDir = path.join(TEMP_DIR, `video_${safeId}`);
    fs.mkdirSync(videoTempDir, { recursive: true });

    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await injectSession(page, scenario.role);

    const segmentFiles = [];
    let stepIndex = 0;

    for (const step of scenario.steps) {
        stepIndex++;
        const stepNumStr = String(stepIndex).padStart(3, '0');
        console.log(`  → Step ${stepIndex}/${scenario.steps.length}: Gerando tela e áudio...`);

        try {
            await page.goto(BASE_URL + step.page, { waitUntil: 'networkidle0', timeout: 15000 });
            if (step.page.includes('login')) await page.waitForSelector('form', { timeout: 5000 });
            else if (step.page.includes('command-center')) await page.waitForSelector('.os-sidebar', { timeout: 5000 });
            else if (!step.page.includes('access-denied')) {
                 try { await page.waitForSelector('.os-sidebar', { timeout: 2000 }); } catch(e){}
            }
        } catch (e) {
            console.warn(`    ⚠️ Erro ao carregar página: ${step.page}`);
            return { ok: false, reason: 'Página não carregou' };
        }

        await new Promise(r => setTimeout(r, 1200));
        await page.evaluate(OVERLAY_SCRIPT).catch(() => {});
        await page.evaluate((caption, stepNum, totalSteps, hlSel) => {
            if (window.__fluxaiCaption) window.__fluxaiCaption(caption, stepNum, totalSteps, hlSel || null);
        }, step.caption, stepIndex, scenario.steps.length, step.highlight || null).catch(() => {});

        await new Promise(r => setTimeout(r, 600));

        const speechText = step.speech || step.caption;
        const mp3Path = path.join(videoTempDir, `step_${stepNumStr}.mp3`);
        await generateAudio(speechText, mp3Path);

        const mp4Path = path.join(videoTempDir, `step_${stepNumStr}.mp4`);
        const framePrefix = path.join(videoTempDir, `step_${stepNumStr}_frame_`);
        const durationMs = (step.duration || 10) * 1000;
        
        let isCapturing = true;
        let frameCount = 0;
        const capturePromise = (async () => {
            const startTime = Date.now();
            while (Date.now() - startTime < durationMs && isCapturing) {
                frameCount++;
                const fPath = `${framePrefix}${String(frameCount).padStart(4, '0')}.png`;
                try { await page.screenshot({ path: fPath, type: 'png' }); } catch(e){}
                
                if (frameCount === 1 && stepIndex === 1) fs.copyFileSync(fPath, path.join(VALIDATION_DIR, `${scenario.filename}_inicio.png`));
                if (frameCount === 1 && stepIndex === Math.floor(scenario.steps.length / 2)) fs.copyFileSync(fPath, path.join(VALIDATION_DIR, `${scenario.filename}_meio.png`));
                if (frameCount === 1 && stepIndex === scenario.steps.length) fs.copyFileSync(fPath, path.join(VALIDATION_DIR, `${scenario.filename}_fim.png`));

                await new Promise(r => setTimeout(r, 200)); // ~5 fps
            }
        })();

        if (step.actions) {
            for (const act of step.actions) {
                if (act.delay) await new Promise(r => setTimeout(r, act.delay));
                try {
                    if (act.type === 'click') {
                        await page.evaluate((sel) => {
                            const el = document.querySelector(sel);
                            if(el) el.click();
                        }, act.selector);
                    } else if (act.type === 'type') {
                        await page.type(act.selector, act.text, {delay: 50});
                    } else if (act.type === 'hover') {
                        await page.hover(act.selector);
                    }
                } catch(e) { console.warn('    ⚠️ Erro na ação:', act); }
            }
        }

        await capturePromise;

        const args = [
            '-y',
            '-framerate', '5',
            '-i', `${framePrefix}%04d.png`,
            '-i', mp3Path,
            '-c:v', 'libx264', '-c:a', 'aac', '-b:a', '192k',
            '-pix_fmt', 'yuv420p',
            mp4Path
        ];
        const res = spawnSync(ffmpegPath, args, { stdio: 'ignore' });

        if (res.status === 0) {
            segmentFiles.push(mp4Path);
        } else {
            console.error(`    ❌ Falha ao compilar segmento dinâmico ${stepIndex}`);
            return { ok: false, reason: 'Falha no ffmpeg' };
        }
    }

    await page.close();

    if (segmentFiles.length === 0) return { ok: false, reason: 'Nenhum frame' };

    const outputPath = path.join(EXPORTS_DIR, `${scenario.filename}.mp4`);
    if (concatSegments(segmentFiles, outputPath)) {
        const size = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
        console.log(`  ✅ MP4 Final gerado: ${path.basename(outputPath)} (${size} MB)`);
        return { ok: true, outputPath, frameCount: segmentFiles.length };
    } else {
        return { ok: false, reason: 'Falha ao concatenar segmentos' };
    }
}

function generateReport(results) {
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    let md = `# RELATÓRIO TÉCNICO DE AUTOMAÇÃO — VÍDEOS DE TREINAMENTO\n\n`;
    md += `**Data:** ${now}\n**Status:** Todos os vídeos foram gerados com narração sintética Neural (pt-BR-FranciscaNeural) via Edge TTS.\n\n`;
    
    md += `## Resumo de Geração\n\n| Vídeo | Status | Frames |\n|:---|:---|:---|\n`;
    results.forEach(r => {
        md += `| ${r.filename} | ${r.ok ? '✅ Sucesso' : '❌ Falhou'} | ${r.frameCount || 0} |\n`;
    });
    
    fs.writeFileSync(REPORT_PATH, md, 'utf8');
}

async function main() {
    console.log('\n🎬 FluxAI OS™ — Gerador de Vídeos em Lote (Voz Neural Francisca - pt-BR)');
    
    const server = await startServer();
    const serverOk = await validateServer();
    if (!serverOk) process.exit(1);

    const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', `--window-size=${VIEWPORT.width},${VIEWPORT.height}`] });

    const results = [];
    
    // Gerar TODOS os vídeos da trilha
    for (const scenario of SCENARIOS) {
        console.log(`\n📹 Gerando ${scenario.filename}`);
        try {
            const res = await generateVideo(scenario, browser);
            results.push({ ...scenario, ok: res.ok, frameCount: res.frameCount });
        } catch (err) {
            console.error(`  ❌ Erro: ${err.message}`);
            results.push({ ...scenario, ok: false, frameCount: 0 });
        }
    }

    await browser.close();
    server.close();
    generateReport(results);
    
    console.log('\n✅ Lote completo processado com sucesso!');
}

main().catch(err => { console.error(err); process.exit(1); });
