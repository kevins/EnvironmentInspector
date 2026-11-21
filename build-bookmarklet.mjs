// Builds the bookmarklet from environment-inspector.js: minifies it and writes
//   environment-inspector.bookmarklet.txt   the javascript: URL
//   environment-inspector.min.js            the minified code (can also be pasted into the browser console)
//   Install Environment Inspector.html      a page with a link to drag to the favourites bar
// Run: npm run build (or node build-bookmarklet.mjs; uses terser from ./node_modules)
//
// Optional: inspector.settings.json next to this file names your own environments (see the README):
//   { "developmentEnvironments": "^contoso-dev\\d*$", "productionEnvironments": "^contoso(-preprod)?$" }
// Each value is a regular expression (case-insensitive) matched against the environment's name, the first part of
// its address. Deleting is turned off in development environments; the delete confirmation names production ones in
// red. The file is never published (.gitignore), and a build made with it is for your own organization only.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(here, 'package.json'))
const { minify } = require('terser')
const { version } = JSON.parse(fs.readFileSync(path.join(here, 'package.json'), 'utf8'))

let src = fs.readFileSync(path.join(here, 'environment-inspector.js'), 'utf8')
const put = (from, to) => { if (!src.includes(from)) throw new Error(`environment-inspector.js no longer contains: ${from}`); src = src.replace(from, to) }
put("const VERSION = '__VERSION__'", `const VERSION = ${JSON.stringify(version)}`)
const settingsFile = path.join(here, 'inspector.settings.json')
// (up to 1.0.0 the file was scanner.settings.json: a build without its rules would allow deleting where they forbid it)
if (!fs.existsSync(settingsFile) && fs.existsSync(path.join(here, 'scanner.settings.json'))) throw new Error('scanner.settings.json is now called inspector.settings.json: rename it, then build again.')
const settings = fs.existsSync(settingsFile) ? JSON.parse(fs.readFileSync(settingsFile, 'utf8')) : {}
const RULES = ['developmentEnvironments', 'productionEnvironments']
if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('inspector.settings.json must be a JSON object, as in inspector.settings.example.json')
// A misspelled name would otherwise be ignored and leave, for example, deleting allowed in a development environment.
const unknown = Object.keys(settings).filter((k) => !RULES.includes(k))
if (unknown.length) throw new Error(`inspector.settings.json: unknown setting${unknown.length > 1 ? 's' : ''} ${unknown.join(', ')}. The settings are: ${RULES.join(', ')}.`)
const applied = []
for (const key of RULES) {
  const pattern = settings[key]
  if (pattern == null || pattern === '') continue
  if (typeof pattern !== 'string') throw new Error(`inspector.settings.json: ${key} must be a regular expression written as a string`)
  new RegExp(pattern, 'i')   // stops the build on an invalid pattern
  put(`${key}: null,`, `${key}: new RegExp(${JSON.stringify(pattern)}, 'i'),`)
  applied.push(`${key} /${pattern}/i`)
}
const local = applied.length > 0
if (local) console.log(`Built with your environment rules from inspector.settings.json (${applied.join('; ')}): for your organization only, do not publish this build.`)
else if (fs.existsSync(settingsFile)) console.log('inspector.settings.json names no environment: built without environment rules.')
// The minifier's own names are one character, or have a digit second (a0, b7, c3x, ...), so none of them can spell a
// word by chance (the release checks the published files for names that must not be in them). The characters are
// ordered by how often the code uses them, as terser does.
const names = (() => {
  const lead = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'], digits = [...'0123456789']
  let freq, first = lead, second = digits, rest = [...lead, ...digits]
  const reset = () => { freq = new Map([...lead, ...digits].map((c) => [c, 0])) }
  const consider = (s, delta) => { for (const c of s) if (freq.has(c)) freq.set(c, freq.get(c) + delta) }
  const sort = () => { const by = (a, b) => freq.get(b) - freq.get(a); first = [...lead].sort(by); second = [...digits].sort(by); rest = [...first, ...second] }
  const get = (n) => {
    if (n < first.length) return first[n]
    n -= first.length
    let len = 2, count = first.length * second.length
    while (n >= count) { n -= count; len++; count *= rest.length }
    let name = first[n % first.length]; n = Math.floor(n / first.length)
    name += second[n % second.length]; n = Math.floor(n / second.length)
    for (let i = 2; i < len; i++) { name += rest[n % rest.length]; n = Math.floor(n / rest.length) }
    return name
  }
  reset()
  return { get, consider, reset, sort }
})()
const min = await minify(src, { ecma: 2020, compress: { passes: 2 }, mangle: { nth_identifier: names }, format: { comments: false } })
// The line breaks and indentation kept in the HTML and CSS templates become single spaces.
const code = min.code.replace(/\\n +/g, ' ')
fs.writeFileSync(path.join(here, 'environment-inspector.min.js'), code)

// The link carries the code compressed (deflate, base64) and unpacks it with the browser's own DecompressionStream, so
// it stays short (Edge takes addresses of up to about 2 million characters). Environment pages have no script policy
// and the maker portal allows eval, so the unpacked code runs with eval; if a page ever forbids eval, it is loaded
// as a script from a blob: address instead, and if that is refused too, an alert says so.
const packed = zlib.deflateRawSync(Buffer.from(code, 'utf8'), { level: 9 }).toString('base64')
const loader = `void (async()=>{try{const t=await new Response(new Blob([Uint8Array.from(atob('${packed}'),(c)=>c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();try{(0,eval)(t)}catch(e){if(!(e instanceof EvalError))throw e;const s=document.createElement('script');s.src=URL.createObjectURL(new Blob([t],{type:'text/javascript'}));s.onerror=()=>alert('This page does not allow Environment Inspector to run.');document.head.appendChild(s)}}catch(e){alert('Environment Inspector could not start: '+e.message)}})()`
// Only what a javascript: link needs is escaped: % (so decoding gives back exactly the code), # and ? and characters
// outside printable ASCII (the base64 text has none of them).
const bookmarklet = 'javascript:' + loader.replace(/[%#?\x00-\x1f\x7f-\u{10ffff}]/gu, (c) => encodeURIComponent(c))
fs.writeFileSync(path.join(here, 'environment-inspector.bookmarklet.txt'), bookmarklet)

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Environment Inspector</title>
<style>
  body{font:15px/1.55 "Segoe UI",system-ui,sans-serif;color:#242424;background:#f5f5f5;margin:0}
  main{max-width:760px;margin:40px auto;padding:0 20px}
  h1{font-size:26px;margin:0 0 6px} h2{font-size:18px;margin-top:28px}
  .lede{color:#424242;margin-top:0}
  .card{background:#fff;border-radius:8px;padding:20px 22px;box-shadow:0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.14)}
  a.bm{display:inline-block;background:#0f6cbd;color:#fff;text-decoration:none;padding:8px 16px;border-radius:4px;font-weight:600;cursor:grab}
  ol li{margin:6px 0} code{background:#f0f0f0;padding:1px 5px;border-radius:4px;font-size:13px}
  textarea{width:100%;height:90px;font:12px Consolas,monospace;border:1px solid #d1d1d1;border-radius:4px;padding:8px;box-sizing:border-box}
  button{font:inherit;border:1px solid #d1d1d1;background:#fff;border-radius:4px;padding:5px 12px;cursor:pointer}
  .note{border-left:4px solid #c50f1f;background:#fdf3f4;padding:10px 14px;border-radius:4px}
</style></head><body><main>
<h1>Environment Inspector</h1>
<p class="lede">A tool for Microsoft Dataverse environments. <b>Unmanaged layers</b> finds the components of the managed solutions you choose that have an unmanaged layer on top, shows what changed, and deletes the layers you select. <b>Compare environments</b> compares the components of your solutions, and the changes made in each environment, with a snapshot of another environment. <b>Compare data</b> compares the records of the tables you choose with a data snapshot of another environment. It runs in Edge with your own sign-in; nothing is installed in the environment.</p>
<div class="card">
<h2 style="margin-top:0">Install</h2>
<ol>
  <li>Show the favourites bar (Ctrl+Shift+B).</li>
  <li>Drag this button onto the favourites bar: <a class="bm" href="${esc(bookmarklet)}">Environment Inspector</a></li>
</ol>
<p>If dragging does not work: create a new favourite named <b>Environment Inspector</b> and paste this as its URL.</p>
<textarea id="code" readonly>${esc(bookmarklet)}</textarea>
<p><button id="copy">Copy</button> <span id="copied"></span></p>
</div>
<h2>Use</h2>
<ol>
  <li>Open a page of the environment (for example <code>https://contoso.crm.dynamics.com</code>) or its Solutions page in the maker portal (make.powerapps.com).</li>
  <li>Click <b>Environment Inspector</b> in the favourites bar.</li>
  <li><b>Unmanaged layers:</b> choose the managed solutions (and, if you like, object types or tables), then <b>Scan</b>. Filter any column, open a component's solution layers or its changes, export, or tick components and select <b>Delete unmanaged layer</b>.</li>
  <li><b>Compare environments:</b> in one environment, choose the solutions and select <b>Save snapshot</b>; in the other, open that file under <b>Compare with</b> and select <b>Compare</b>. Nothing is changed in either environment.</li>
  <li><b>Compare data:</b> the same, with the tables you choose: <b>Save snapshot</b> in one environment, then <b>Compare</b> with that file in the other.</li>
</ol>
<p class="note"><b>Deleting an unmanaged layer cannot be undone.</b> It is the same as "Remove active customizations" in the maker portal: the component goes back to what its managed solution defines. Each component is checked before and after, and a log of the removed changes can be downloaded.${settings.developmentEnvironments ? ' Deleting is turned off in development environments.' : ''}</p>
<p style="color:#616161;font-size:13px">Version ${esc(version)} · built ${new Date().toISOString().slice(0, 10)} · ${(bookmarklet.length / 1024).toFixed(1)} KB link (${(code.length / 1024).toFixed(1)} KB unpacked)</p>
</main>
<script>document.getElementById('copy').onclick=async()=>{await navigator.clipboard.writeText(document.getElementById('code').value);document.getElementById('copied').textContent='Copied.'}</script>
</body></html>`
fs.writeFileSync(path.join(here, 'Install Environment Inspector.html'), html)
console.log(`bookmarklet ${version}: ${bookmarklet.length} characters (${(code.length / 1024).toFixed(1)} KB unpacked)`)
