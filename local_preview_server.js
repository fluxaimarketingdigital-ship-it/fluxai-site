// Servidor HTTP estático nativo — zero dependência externa
// Serve o worktree como site estático para preview local
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = 'D:\\FLUXAI_DATA\\01_PROJETOS\\FluxAI_OS_WORKTREES\\PRODUCT_CC_REAL_IMPLEMENTATION';
const PORT = 7721;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.txt': 'text/plain',
};

function resolvePath(reqPath) {
    let filePath = path.join(ROOT, reqPath);
    // cleanUrls: try exact, then .html, then index.html in dir
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath;
    if (fs.existsSync(filePath + '.html')) return filePath + '.html';
    if (fs.existsSync(path.join(filePath, 'index.html'))) return path.join(filePath, 'index.html');
    return null;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const reqPath = decodeURIComponent(parsedUrl.pathname);
    const resolved = resolvePath(reqPath);

    if (!resolved) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: ' + reqPath);
        return;
    }

    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    // CORS headers for module scripts
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

    fs.readFile(resolved, (err, data) => {
        if (err) {
            res.writeHead(500); res.end('500 Error'); return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`[FluxAI Local Preview] Running at http://localhost:${PORT}`);
    console.log(`[FluxAI Local Preview] Command Center: http://localhost:${PORT}/os/command-center`);
    console.log('[FluxAI Local Preview] READY. Press Ctrl+C to stop.');
});
