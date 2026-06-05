const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const videos = [
    { text: 'FluxAI Academy: Visao Geral', dest: 'docs/academy/videos_estrutura/00_visao_geral/visao_geral.mp4', color: 'orange' },
    { text: 'FluxAI Academy: Primeiros Passos', dest: 'docs/academy/videos_estrutura/01_primeiros_passos/primeiros_passos.mp4', color: 'blue' },
    { text: 'FluxAI Academy: Gestao de Demandas', dest: 'docs/academy/videos_estrutura/02_gestao_demandas/gestao_demandas.mp4', color: 'green' },
    { text: 'FluxAI Academy: Metricas e Insights', dest: 'docs/academy/videos_estrutura/03_analise_metricas/analise_metricas.mp4', color: 'purple' }
];

const createVideo = (videoObj) => {
    return new Promise((resolve, reject) => {
        const destPath = path.join('c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE', videoObj.dest);
        
        // Ensure directory exists
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        console.log(`Generating ${destPath}...`);

        ffmpeg()
            // create a 3 second blank input
            .input('color=c=black:s=1280x720:d=3')
            .inputFormat('lavfi')
            // Add simple text using drawtext (sometimes fails if libfreetype missing)
            // As a safer fallback, we just create a silent blank video if drawtext fails.
            .outputOptions([
                '-vf', `drawtext=text='${videoObj.text}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2`,
                '-pix_fmt', 'yuv420p',
                '-c:v', 'libx264',
                '-r', '30'
            ])
            .save(destPath)
            .on('end', () => {
                console.log(`Successfully generated ${destPath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error generating ${destPath}: ${err.message}`);
                // Fallback to simple black video if drawtext fails
                console.log('Attempting fallback without text...');
                ffmpeg()
                    .input('color=c=black:s=1280x720:d=3')
                    .inputFormat('lavfi')
                    .outputOptions(['-pix_fmt', 'yuv420p', '-c:v', 'libx264'])
                    .save(destPath)
                    .on('end', () => resolve())
                    .on('error', (e) => reject(e));
            });
    });
};

const runAll = async () => {
    for (const v of videos) {
        await createVideo(v);
    }
    console.log('All placeholder videos generated!');
};

runAll();
