const fs = require('fs');
const path = require('path');

const trackFunction = `
    <!-- FluxAI Tracking -->
    <script>
        window.dataLayer = window.dataLayer || [];
        function trackEvent(eventName, params = {}) {
            const payload = {
                event: eventName,
                page_path: window.location.pathname,
                page_location: window.location.href,
                timestamp: new Date().toISOString(),
                ...params
            };
            window.dataLayer.push(payload);
        }
    </script>
`;

function injectTracking() {
    const basePath = 'c:\\Users\\BRENDA\\Desktop\\Identidade Visual FluxAI\\FLUXAI_SITE';
    
    // get all html files manually
    const getAllFiles = function(dirPath, arrayOfFiles) {
      let files = fs.readdirSync(dirPath);
      arrayOfFiles = arrayOfFiles || [];
    
      files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
          if(file !== 'os' && file !== '.agent') {
              arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
          }
        } else {
          if(file.endsWith('.html') && file !== 'deck.html') {
              arrayOfFiles.push(path.join(dirPath, "/", file));
          }
        }
      });
      return arrayOfFiles;
    }
    
    const files = getAllFiles(basePath);
    
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove old if exists
        content = content.replace(/<!-- FluxAI Tracking -->[\s\S]*?<\/script>\s*/g, '');
        
        // Insert into head
        if(content.includes('</head>')) {
            content = content.replace('</head>', trackFunction + '</head>');
        }
        
        fs.writeFileSync(file, content, 'utf8');
    });
    console.log('Tracking function injected to all HTML files.');
}

injectTracking();
