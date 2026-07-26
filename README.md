# zichenpku.github.io

Bilingual academic profile of Zichen Zhang, hosted with GitHub Pages.

## Structure

- `index.html` — English page
- `zh.html` — Chinese page
- `styles.css` — shared A2 academic editorial design
- `script.js` — mobile navigation and current-year enhancement
- `photo.jpg` — profile photograph
- `assets/uhpb-poster.jpg` — UHPB poster-presentation photograph
- `tests/test_site.py` — dependency-free regression tests
- `tests/site-browser.cjs` — real-browser interaction and layout tests

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` and `http://localhost:8000/zh.html`.

## Validation

```bash
python3 -m unittest discover -s tests -v
NODE_PATH=/Users/onebright/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  /Users/onebright/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  --test tests/site-browser.cjs
```

The UHPB event photograph is stored at `assets/uhpb-poster.jpg`. Keep the original source unchanged; do not substitute an unrelated or generated image.
