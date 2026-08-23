const fs = require('fs');
let code = fs.readFileSync('orc-script.js', 'utf8');

// 1. Reliability (Storage Crashes)
const safeStorage = `
function safeSessionGet(key) { try { return sessionStorage.getItem(key); } catch(e) { return null; } }
function safeSessionSet(key, val) { try { sessionStorage.setItem(key, val); } catch(e) {} }
`;
code = code.replace(/function SETTINGS_init\(\) {/, safeStorage + '\nfunction SETTINGS_init() {');
code = code.replace(/sessionStorage\.getItem\(/g, 'safeSessionGet(');
code = code.replace(/sessionStorage\.setItem\(/g, 'safeSessionSet(');
code = code.replace(/localStorage\.setItem\(key,\s*(.*?)\);/g, 'try { localStorage.setItem(key, $1); } catch(e) {}');

// 2. Security (XSS)
code = code.replace(/btn\.innerHTML = \`<span class="account-avatar-badge">\$\{initial\}<\/span>\`;/, 'btn.innerHTML = `<span class="account-avatar-badge">${esc(initial)}</span>`;');
code = code.replace(/gRow\.innerHTML = \`<div class="row-header"><h2 class="row-title">\$\{GENRES\[0\]\.name\}<\/h2><\/div><div class="row-track-container"><div class="row-track"><\/div><\/div>\`;/, 'gRow.innerHTML = `<div class="row-header"><h2 class="row-title">${esc(GENRES[0].name)}</h2></div><div class="row-track-container"><div class="row-track"></div></div>`;');

// 3. Performance (DOM Thrashing in Loops)
// skeletons(12).forEach(s => grid.appendChild(s));
code = code.replace(/skeletons\((.*?)\)\.forEach\((.*?)\s*=>\s*(.*?)\.appendChild\((.*?)\)\);/g, '{ const frag = document.createDocumentFragment(); skeletons($1).forEach($2 => frag.appendChild($4)); $3.appendChild(frag); }');

// provItems.forEach(it => pt.appendChild(buildCard(it, sp.type)));
code = code.replace(/provItems\.forEach\((.*?)\s*=>\s*(.*?)\.appendChild\((.*?)\)\);/g, '{ const frag = document.createDocumentFragment(); provItems.forEach($1 => frag.appendChild($3)); $2.appendChild(frag); }');

// items.forEach(it => cwTrack.appendChild(buildCard(it, it._type || "movie", { progressValue: it._progress, eager: true })));
code = code.replace(/items\.forEach\((.*?)\s*=>\s*(.*?)\.appendChild\((.*?)\)\);/g, '{ const frag = document.createDocumentFragment(); items.forEach($1 => frag.appendChild($3)); $2.appendChild(frag); }');

// cards.forEach(c => grid.appendChild(buildCard(c.item, c.type)));
code = code.replace(/cards\.forEach\((.*?)\s*=>\s*(.*?)\.appendChild\((.*?)\)\);/g, '{ const frag = document.createDocumentFragment(); cards.forEach($1 => frag.appendChild($3)); $2.appendChild(frag); }');

// 4. Code Smells
code = code.replace(/console\.log\("%c OsirisWatch Engine v2\.5\.0.*?;\n?/g, '');

// 5. Memory Leaks (Timeouts)
code = code.replace(/setTimeout\(\(\) => input\.focus\(\), 120\);/g, 'requestAnimationFrame(() => requestAnimationFrame(() => input.focus()));');
code = code.replace(/setTimeout\(\(\) => modal\.querySelector\("#auth-email"\)\?\.focus\(\), 120\);/g, 'requestAnimationFrame(() => requestAnimationFrame(() => modal.querySelector("#auth-email")?.focus()));');
code = code.replace(/setTimeout\(\(\) => scrollToEl\((.*?)\), delay\);/g, 'requestAnimationFrame(() => scrollToEl($1));');

// 6. Network Race Condition (AI Search)
// We add an AbortController for the AI search API
code = code.replace(/const res = await fetch\("\/api\/ai-search", \{/, 'if(window.aiSearchController) window.aiSearchController.abort(); window.aiSearchController = new AbortController(); const res = await fetch("/api/ai-search", { signal: window.aiSearchController.signal,');

fs.writeFileSync('orc-script.js', code);
console.log('Refactor completed successfully.');
