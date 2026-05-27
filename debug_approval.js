const fs = require('fs');

let content = fs.readFileSync('os/approval.html', 'utf8');

// I will just read the file from line 1017 to 1056 and replace it entirely.
// But first let me check what it looks like now.
console.log("Current file content snippet:");
const lines = content.split('\n');
for (let i = 1010; i < 1070; i++) {
    if (lines[i] !== undefined) {
        console.log(i + ": " + lines[i]);
    }
}
