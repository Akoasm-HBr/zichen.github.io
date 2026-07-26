# zichenpku.github.io

Bilingual academic profile of Zichen Zhang, hosted with GitHub Pages.

## Structure

- `index.html` — English page
- `zh.html` — Chinese page
- `styles.css` — shared A2 academic editorial design
- `script.js` — mobile navigation and current-year enhancement
- `photo.jpg` — profile photograph
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

The deployable site intentionally omits the UHPB event photograph until the approved source file is supplied again. Do not substitute an unrelated or generated image.
