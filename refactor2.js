const fs = require('fs');
let code = fs.readFileSync('orc-script.js', 'utf8');

// Fix a few more timeouts
code = code.replace(/setTimeout\(\(\) => window\.scrollTo\(\{ top: y, behavior: "auto" \}\), 60\);/g, 'requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));');

// Fix remaining XSS
code = code.replace(/itemWrap\.innerHTML = \`<span class="top10-side-num" aria-hidden="true">\$\{idx \+ 1\}<\/span>\`;/g, 'itemWrap.innerHTML = `<span class="top10-side-num" aria-hidden="true">${esc(String(idx + 1))}</span>`;');
code = code.replace(/pbar\.innerHTML = \`<div class="card-progress-fill" style="width:\$\{Math\.min\(it\._progress, 100\)\}%"><\/div>\`;/g, 'pbar.innerHTML = `<div class="card-progress-fill" style="width:${esc(String(Math.min(it._progress, 100)))}%"></div>`;');

fs.writeFileSync('orc-script.js', code);
console.log('Refactor pass 2 completed.');
