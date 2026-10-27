# Hirumal Marasinghe — portfolio

One standalone index.html with inline CSS and JavaScript, local images and optional fonts. Your logo, portrait feathering, event photographs and contact composer are retained. Three.js and Lenis load from pinned CDNs; Google Fonts supplies the fallback typography. There is no React app, npm dependency installation or required build step.

## Preview and checks

Open index.html directly for a basic preview, or with Node installed:

    node --test tests/site.test.mjs
    node scripts/build.mjs
    node scripts/serve.mjs --base /Portfolio/

Visit http://127.0.0.1:3000/Portfolio/. Optional npm test / npm run build / npm run preview aliases do the same; npm install is unnecessary. The local server binds only to your computer. Delete and rebuild dist to refresh it; it is generated output.

## Publish

Upload ONLY the contents of dist to your hosting provider. For GitHub Pages, publish that folder with your chosen Pages deployment method. The page also works at a repository URL because all local asset references are relative. No deployment or push has been performed by this repair.

The canonical and sharing URLs assume https://h1rum4l.github.io/Portfolio/. If using a custom domain, set SITE_URL to its full HTTPS address before running the packaging script; it rewrites those URLs in dist/index.html. Alternatively edit those three meta/link values in index.html. For Netlify manual hosting, drop dist into its deployment UI.

Do not upload project backups, raw LinkedIn exports, extracted/, .aistudio/ or ZIPs. Packaging copies only index.html, top-level image assets and optional font files. Previously committed exports may remain in Git history or existing deployments; removing working files does not erase history or unpublish an old site.

## Fonts

Add your licensed Pirulen files at fonts/pirulen.woff2 and optionally fonts/pirulen.ttf. They were not supplied. Michroma is the intended fallback; missing Pirulen requests do not prevent the site working. Do not download or commit an unlicensed font.

## Contact form

The form validates name, contact and message, then opens the visitor's default email application. It does not submit to a backend or guarantee delivery. Copy Message is an alternative when no mail application is configured.

## Facts still needed

- Artha 2.0: year/date, finance responsibilities and verified project outcomes.
- Cre8X 2.0: year/date, finance responsibilities and verified event outcomes.
- Step Into Industry 4.0: year/date, logistics responsibilities and verified event outcomes.
- BCS Assistant Treasurer: confirm 2025–2026 or 2026/27 term; responsibilities and outcomes.
- Membership Task Force: exact affiliation, chair term, responsibilities and outcomes.
- IEEE Young Professionals Sri Lanka: dates, role, contributions and outcomes.

Unverified event and membership metrics have been removed. March 2026 volunteer recognition, the March 2025 certification and education dates remain as documented. Image placeholders appear only if an image is missing.

## Motion and resilience

System reduced motion skips the preloader and GPU scene and disables entrance/ambient animation. The footer button pauses ambient motion; hidden tabs also stop GPU rendering. If WebGL is unavailable, the static ocean background remains. Navigation and content still work if the animation CDN cannot be reached.
