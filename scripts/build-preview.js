// Bundles the preview build (MemoryRouter, no service worker) into one self-contained HTML file.
// Usage: npm run build:preview  ->  preview/vsb-forums.html
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'build-preview', 'static');
const pick = (sub, ext) => {
    const file = fs.readdirSync(path.join(dir, sub)).find((f) => f.startsWith('main.') && f.endsWith(ext));
    return fs.readFileSync(path.join(dir, sub, file), 'utf8');
};

const js = pick('js', '.js').replace(/\/\/# sourceMappingURL=.*$/gm, '');
const css = pick('css', '.css').replace(/\/\*# sourceMappingURL=.*?\*\//g, '');
if (/<\/script/i.test(js) || js.includes('<!--')) throw new Error('Bundle contains text that would break an inline <script>.');

const fonts = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap';
const html = `<title>VSB Forums</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>${css}</style>
<noscript>VSB Forums needs JavaScript to run.</noscript>
<div id="app"></div>
<script>${js}</script>
`;

fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
fs.writeFileSync(path.join(root, 'preview', 'vsb-forums.html'), html);
console.log(`preview/vsb-forums.html written (${Math.round(html.length / 1024)} KB)`);
