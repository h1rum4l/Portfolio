import { mkdir, readdir, readFile, copyFile, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
// Rebuild only this script's fixed output directory; never publish the source tree.
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
let html = await readFile(join(root, 'index.html'), 'utf8');
if (process.env.SITE_URL) {
  const url = new URL(process.env.SITE_URL);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('SITE_URL must be a plain HTTPS site URL');
  const base = url.href.replace(/\/?$/, '/');
  html = html.replaceAll('https://h1rum4l.github.io/Portfolio/', base);
}
await writeFile(join(out, 'index.html'), html);
await writeFile(join(out, '.nojekyll'), '');
try { await copyFile(join(root, 'google1ecd677dfe433742.html'), join(out, 'google1ecd677dfe433742.html')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const [folder, extension] of [['assets', /\.(webp|png|jpg|jpeg|svg)$/i], ['fonts', /\.(woff2|ttf)$/i]]) {
  await mkdir(join(out, folder), { recursive: true });
  let entries;
  try { entries = await readdir(join(root, folder), { withFileTypes: true }); }
  catch (error) { if (folder === 'fonts' && error.code === 'ENOENT') continue; throw error; }
  for (const file of entries) {
    if (file.isFile() && extension.test(file.name)) await copyFile(join(root, folder, file.name), join(out, folder, file.name));
  }
}
console.log('Built dist/: HTML, verification file, top-level images, optional fonts only. No source exports or archives.');
