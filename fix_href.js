const fs = require('fs');

let content = fs.readFileSync('os/approval.html', 'utf8');

// Line 959
content = content.replace(
    /window\.location\.href = `\/os\/client-portal\.html\?project_id=\$\{c\.project_id\}`;/g,
    `window.location.href = '/os/client-portal.html?project_id=' + encodeURIComponent(c.project_id);`
);

// Line 1005
// a.href = refLink;
// We can do: a.href = new URL(refLink, window.location.origin).href; or just validate it's not javascript
content = content.replace(
    /a\.href = refLink;/g,
    `a.href = refLink.startsWith('http') ? refLink : '#';`
);

fs.writeFileSync('os/approval.html', content, 'utf8');
