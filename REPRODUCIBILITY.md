# Rebuild the folio

Prepared with Node.js 24.22.1. The core targets Node.js 20+ and browsers with Web Crypto. Runtime, data generation, tests, receipt generation and the offline build use no third-party package.

```sh
npm run data
npm run build
npm test
npm run check
```

The reference generator is deterministic and contains authored numeric observations rather than a random stream. It produces 80 events, six files and derived outputs. Regenerating the same data and source should reproduce the linked event head and receipt. Preserve the exact JSON if external tooling may encode numbers or strings differently.

## Optional image capture

```sh
npm install --no-save --package-lock=false @napi-rs/canvas
npm run screenshots
```

The renderer references local DejaVu Sans, Sans Mono and Serif fonts, including bold variants. Set `POHKO_FONT_DIR` to their directory and `POHKO_CANVAS_MODULE` to an existing native renderer installation if needed. Those dependencies are not bundled. The default font directory is `/usr/share/fonts/truetype/dejavu`.

Capture checks text against the outer image bounds. It does not replace visual inspection of the page. Browser pixels can differ from native Canvas pixels because of font availability and rendering engines.

## File integrity

`npm run integrity` compares package files with `MANIFEST.sha256`. After deliberate changes, regenerate affected outputs, inspect them, run checks, then refresh the manifest with `node manifest.mjs`. The manifest excludes itself, local Git metadata and node_modules.

The package's file manifest, journal head and review receipt each cover different bytes. None authenticates an author or creates an on-chain record.

## Interface verification

The included DOM harness executes the complete offline bundle and exercises view controls, an owner write, persistence, rejected imports, exports and the empty-journal state. It is not a browser layout engine. Native captures are visually inspected separately; cross-browser accessibility and layout checks remain useful follow-up validation.
