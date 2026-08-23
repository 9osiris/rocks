const fs = require('fs');
const js = fs.readFileSync('orc-script.js', 'utf8');
const lines = js.split('\n');

let issues = [];
lines.forEach((line, i) => {
  const ln = i + 1;
  // 1. Potential XSS: innerHTML with unescaped template literal
  if (line.match(/\.innerHTML\s*=\s*.*?\$\{.*?\}/) && !line.includes('esc(') && !line.includes('ICONS')) {
    issues.push({ line: ln, type: 'Security (XSS)', desc: 'innerHTML with unescaped template literal', code: line.trim() });
  }
  // 2. DOM Thrashing: appendChild inside a loop without DocumentFragment
  if (line.match(/\.appendChild\(/) && !line.match(/fragment|docFrag/i) && line.match(/^\s{6,}/)) {
    issues.push({ line: ln, type: 'Performance (DOM)', desc: 'appendChild inside a likely loop without DocumentFragment', code: line.trim() });
  }
  // 3. Unsafe localStorage/sessionStorage access
  if (line.match(/(localStorage|sessionStorage)\.[s|g]etItem/) && !js.substring(Math.max(0, js.indexOf(line)-200), js.indexOf(line)).includes('try')) {
    issues.push({ line: ln, type: 'Reliability', desc: 'Unsafe storage access (can crash in incognito)', code: line.trim() });
  }
  // 4. Unmanaged setTimeout
  if (line.match(/setTimeout\(/) && !line.match(/const |let |var |timer|rt|id|heroTimer/)) {
    issues.push({ line: ln, type: 'Memory Leak', desc: 'Unmanaged setTimeout (potential memory leak if component unmounts)', code: line.trim() });
  }
  // 5. Missing AbortController on fetch
  if (line.match(/fetch\(/) && !line.match(/signal:|AbortController/)) {
    issues.push({ line: ln, type: 'Network Race Condition', desc: 'Fetch call without AbortController (stale requests can overwrite new data)', code: line.trim() });
  }
  // 6. Hardcoded API URLs
  if (line.match(/fetch\(['"]http/) && !line.includes('TMDB') && !line.includes('SUPABASE')) {
    issues.push({ line: ln, type: 'Maintainability', desc: 'Hardcoded external API URL', code: line.trim() });
  }
  // 7. console.log left in production
  if (line.match(/console\.log\(/) && !line.match(/\/\/.*console\.log/)) {
    issues.push({ line: ln, type: 'Code Smell', desc: 'console.log left in production code', code: line.trim() });
  }
  // 8. Unoptimized string concatenations
  if (line.match(/\w+\s*\+=\s*['"`<]/) && line.match(/^\s{6,}/)) {
    issues.push({ line: ln, type: 'Performance (Memory)', desc: 'String concatenation inside loop instead of array join', code: line.trim() });
  }
});

fs.writeFileSync('lint_results.json', JSON.stringify(issues, null, 2));
console.log('Total identified by script:', issues.length);
