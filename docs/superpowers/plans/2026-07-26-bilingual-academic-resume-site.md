# Bilingual Academic Resume Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a polished bilingual academic resume website for Zichen Zhang using the approved A2 modern academic editorial design.

**Architecture:** Use two complete static HTML documents (`index.html` and `zh.html`) that share one responsive stylesheet and one small progressive-enhancement script. Language switching is implemented with ordinary links, all primary content remains usable without JavaScript, and standard-library Python tests validate facts, semantics, links, local assets, and safety attributes.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Python 3 standard-library `unittest`, GitHub Pages

## Global Constraints

- English is the default page at `index.html`; Simplified Chinese is the complete equivalent page at `zh.html`.
- Use the approved A2 palette: white canvas, restrained red in the `#8f1d22` family, slate-gray text, serif headings, and system sans-serif body text.
- Do not add a package manager, framework, build pipeline, database, analytics service, or external font dependency.
- Do not publish the internal nickname “Cancer Boat Bridge”.
- Treat the cancer-project website title as descriptive and provisional, not as the final manuscript title.
- Do not state sample sizes, final findings, confirmed biomarkers, or a journal submission outcome.
- Do not describe AI work as foundation-model training or model-weight fine-tuning.
- List only the confirmed publication and two confirmed awards.
- Do not invent clinical rotations, other awards, researcher identifiers, social profiles, or a downloadable CV.
- Keep `photo.jpg`; do not delete or overwrite the source UHPB photograph.
- The missing UHPB photograph must not be replaced with a fabricated image. Until the source is supplied again, omit the figure from the deployable page and retain the complete poster description in text.
- Both pages must remain functional without JavaScript and without network access.
- Support keyboard navigation, visible focus, reduced motion, and 320 CSS-pixel viewports without horizontal overflow.

---

## File Structure

- `index.html` — complete English page, metadata, semantic content, and navigation.
- `zh.html` — complete Simplified Chinese page with equivalent structure and facts.
- `styles.css` — A2 design tokens, layout, navigation, cards, responsive behavior, focus styles, and reduced-motion behavior.
- `script.js` — accessible mobile-menu enhancement and footer-year update only.
- `photo.jpg` — existing profile photograph, retained unchanged.
- `tests/test_site.py` — dependency-free regression tests for shared assets, copy, metadata, local references, links, and forbidden claims.
- `README.md` — concise maintenance and local-preview instructions.

---

### Task 1: Shared Visual and Interaction Foundation

**Files:**
- Create: `styles.css`
- Create: `script.js`
- Create: `tests/test_site.py`

**Interfaces:**
- Consumes: the class and attribute contract defined below.
- Produces: CSS classes used by both pages and JavaScript behavior for `[data-menu-toggle]`, `[data-site-nav]`, and `[data-current-year]`.

- [ ] **Step 1: Write the failing shared-asset tests**

Create `tests/test_site.py` with:

```python
from __future__ import annotations

import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "zh.html")


def read_text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self.ids: set[str] = set()
        self.images: list[dict[str, str]] = []
        self.html_lang = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if "id" in values:
            self.ids.add(values["id"])
        if tag == "a":
            self.links.append(values)
        elif tag == "img":
            self.images.append(values)
        elif tag == "html":
            self.html_lang = values.get("lang", "")


class SharedAssetTests(unittest.TestCase):
    def test_shared_assets_exist(self) -> None:
        self.assertTrue((ROOT / "styles.css").is_file())
        self.assertTrue((ROOT / "script.js").is_file())

    def test_a2_design_tokens_and_responsive_rules_exist(self) -> None:
        css = read_text("styles.css")
        required = (
            "--color-accent: #8f1d22",
            "--font-serif:",
            "--font-sans:",
            ":focus-visible",
            "@media (max-width: 52rem)",
            "@media (prefers-reduced-motion: reduce)",
        )
        for token in required:
            self.assertIn(token, css)

    def test_mobile_menu_is_accessible(self) -> None:
        script = read_text("script.js")
        for token in (
            'document.documentElement.classList.add("js")',
            "data-menu-toggle",
            "aria-expanded",
            "data-site-nav",
            "Escape",
            "data-current-year",
        ):
            self.assertIn(token, script)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the shared-asset tests and confirm failure**

Run:

```bash
python3 -m unittest tests.test_site.SharedAssetTests -v
```

Expected: FAIL because `styles.css` and `script.js` do not exist.

- [ ] **Step 3: Implement the shared stylesheet**

Create `styles.css` with the exact public class contract below:

```css
:root {
  --color-accent: #8f1d22;
  --color-accent-dark: #6f1519;
  --color-ink: #1c2838;
  --color-slate: #5e6a79;
  --color-soft: #f4f6f8;
  --color-line: #d9dfe6;
  --color-white: #ffffff;
  --font-serif: Georgia, "Times New Roman", "Songti SC", STSong, serif;
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --max-width: 74rem;
  --shadow: 0 1.5rem 5rem rgba(23, 35, 52, 0.12);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
body {
  margin: 0;
  color: var(--color-ink);
  background: #e9edf2;
  font-family: var(--font-sans);
  line-height: 1.65;
}
img { display: block; max-width: 100%; }
a { color: inherit; }
.skip-link {
  position: fixed;
  top: 0;
  left: 1rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  color: #fff;
  background: var(--color-accent);
  transform: translateY(-120%);
}
.skip-link:focus { transform: translateY(0); }
:focus-visible { outline: 3px solid #2563eb; outline-offset: 3px; }
.site-shell {
  width: min(100% - 2rem, var(--max-width));
  margin: 1.75rem auto;
  overflow: hidden;
  background: var(--color-white);
  box-shadow: var(--shadow);
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-top: 5px solid var(--color-accent);
  border-bottom: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4.5rem;
  padding: 0 3.5rem;
}
.brand {
  font: 700 1.125rem/1 var(--font-serif);
  text-decoration: none;
}
.brand span { margin-left: 0.5rem; color: var(--color-accent); font-weight: 500; }
.site-nav { display: flex; align-items: center; gap: 1.5rem; }
.site-nav a {
  color: #526071;
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}
.site-nav a:hover { color: var(--color-accent); }
.language-link {
  padding: 0.45rem 0.65rem;
  border: 1px solid #bac2cc;
  color: var(--color-accent) !important;
}
.menu-toggle { display: none; min-width: 2.75rem; min-height: 2.75rem; }
.hero { display: grid; grid-template-columns: 1.23fr 0.77fr; border-bottom: 1px solid var(--color-line); }
.hero-copy { display: flex; flex-direction: column; justify-content: center; padding: 4.5rem 3.9rem; }
.eyebrow, .section-number, .meta {
  color: var(--color-accent);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.hero h1 { margin: 0; font: 700 clamp(3.2rem, 7vw, 5.1rem)/0.95 var(--font-serif); letter-spacing: -0.045em; }
.name-cn { margin-top: 0.9rem; color: var(--color-accent); font: 500 1.4rem/1 var(--font-serif); letter-spacing: 0.14em; }
.lede { max-width: 38rem; margin: 1.8rem 0 0; color: #4c5a6b; font: 400 1.08rem/1.7 var(--font-serif); }
.hero-actions { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 1.8rem; }
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0 1rem;
  border: 1px solid var(--color-accent);
  color: #fff;
  background: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}
.button.secondary { color: var(--color-accent); background: #fff; }
.button:hover { background: var(--color-accent-dark); color: #fff; }
.hero-photo { min-height: 31rem; overflow: hidden; background: #cfd5dc; }
.hero-photo img { width: 100%; height: 100%; min-height: 31rem; object-fit: cover; object-position: center 20%; }
.facts { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--color-line); background: var(--color-soft); }
.fact { min-height: 6rem; padding: 1.35rem 1.5rem; border-right: 1px solid var(--color-line); }
.fact:last-child { border-right: 0; }
.fact strong { display: block; margin-bottom: 0.4rem; color: var(--color-accent); font: 700 0.8rem/1 var(--font-serif); }
.fact span { color: #596575; font-size: 0.72rem; }
.content-section { display: grid; grid-template-columns: 14.5rem 1fr; gap: 3rem; padding: 4.25rem 3.9rem; border-bottom: 1px solid var(--color-line); }
.content-section:nth-of-type(even) { background: #fcfcfd; }
.section-heading h2 { margin: 0; font: 700 1.6rem/1.1 var(--font-serif); letter-spacing: -0.02em; }
.section-heading p { margin: 0.9rem 0 0; color: #6a7583; font-size: 0.76rem; }
.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.card { padding: 1.75rem; border: 1px solid var(--color-line); background: #fff; }
.card.featured { grid-column: 1 / -1; border-top: 4px solid var(--color-accent); }
.card h3, .publication h3 { margin: 0.65rem 0 0; font: 700 1.25rem/1.3 var(--font-serif); }
.card p, .publication p { margin: 0.75rem 0 0; color: #596575; font-size: 0.8rem; }
.tags { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 1rem; }
.tag { padding: 0.3rem 0.5rem; border: 1px solid #ccd3dc; color: #4e5a68; background: #f7f8fa; font-size: 0.62rem; font-weight: 700; }
.publication { padding: 2rem 0; border-top: 4px solid var(--color-accent); border-bottom: 1px solid var(--color-line); }
.publication h3 { max-width: 43rem; font-size: 1.55rem; }
.doi-link { display: inline-block; margin-top: 1rem; color: var(--color-accent); font-size: 0.72rem; font-weight: 800; }
.skills-grid, .awards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.awards-grid { grid-template-columns: 1fr 1fr; }
.skill-group, .award-card { padding: 1.5rem; border: 1px solid var(--color-line); background: var(--color-soft); }
.skill-group { border-top: 3px solid var(--color-accent); }
.skill-group h3, .award-card h3 { margin: 0; font: 700 1rem/1.3 var(--font-serif); }
.skill-group p, .award-card p { margin: 0.8rem 0 0; color: #596575; font-size: 0.72rem; }
.award-result { color: var(--color-accent); font: 700 1.25rem/1 var(--font-serif); }
.site-footer { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 2.5rem; padding: 3.7rem 3.9rem; color: #fff; background: #202d3d; }
.site-footer h2 { margin: 0; font: 700 2rem/1.1 var(--font-serif); }
.site-footer p { color: #c3cbd4; }
.footer-links { display: flex; flex-direction: column; justify-content: center; gap: 0.6rem; }
.copyright { margin-top: 1rem; font-size: 0.7rem; }

@media (max-width: 52rem) {
  html { scroll-padding-top: 4.25rem; }
  .site-shell { width: 100%; margin: 0; }
  .header-inner { min-height: 4.25rem; padding: 0 1.3rem; }
  .site-nav { flex-wrap: wrap; justify-content: flex-end; }
  html.js .menu-toggle { display: inline-grid; place-items: center; border: 1px solid var(--color-line); background: #fff; }
  html.js .site-nav {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0.5rem 1.3rem 1rem;
    border-bottom: 1px solid var(--color-line);
    background: #fff;
  }
  html.js .site-nav[data-open="true"] { display: flex; }
  .site-nav a { padding: 0.8rem 0; }
  .hero { grid-template-columns: 1fr; }
  .hero-photo { min-height: 23rem; order: -1; }
  .hero-photo img { min-height: 23rem; }
  .hero-copy { padding: 3.5rem 1.7rem 3rem; }
  .facts { grid-template-columns: 1fr 1fr; }
  .fact:nth-child(2) { border-right: 0; }
  .fact:nth-child(-n + 2) { border-bottom: 1px solid var(--color-line); }
  .content-section { grid-template-columns: 1fr; gap: 1.8rem; padding: 3.2rem 1.7rem; }
  .card-grid, .awards-grid, .skills-grid, .site-footer { grid-template-columns: 1fr; }
  .site-footer { padding: 3rem 1.7rem; }
}

@media (max-width: 24rem) {
  .facts { grid-template-columns: 1fr; }
  .fact { border-right: 0; border-bottom: 1px solid var(--color-line); }
  .hero-actions { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
}
```

- [ ] **Step 4: Implement the progressive-enhancement script**

Create `script.js` with:

```javascript
document.documentElement.classList.add("js");

const menuButton = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

function setMenu(open) {
  if (!menuButton || !siteNav) return;
  menuButton.setAttribute("aria-expanded", String(open));
  siteNav.dataset.open = String(open);
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      menuButton.focus();
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
```

- [ ] **Step 5: Run the shared-asset tests**

Run:

```bash
python3 -m unittest tests.test_site.SharedAssetTests -v
```

Expected: 3 tests PASS.

- [ ] **Step 6: Commit the shared foundation**

```bash
git add styles.css script.js tests/test_site.py
git commit -m "feat: add academic site visual foundation"
```

---

### Task 2: English Academic Resume Page

**Files:**
- Modify: `index.html`
- Modify: `tests/test_site.py`

**Interfaces:**
- Consumes: all public classes from `styles.css` and data attributes from `script.js`.
- Produces: section IDs `main-content`, `research`, `publication`, `awards`, and `skills`; these IDs are the English navigation contract.

- [ ] **Step 1: Add failing English-page tests**

Insert into `tests/test_site.py` before the final `if __name__` block:

```python
class EnglishPageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.html = read_text("index.html")
        cls.parser = LinkCollector()
        cls.parser.feed(cls.html)

    def test_language_and_required_sections(self) -> None:
        self.assertEqual(self.parser.html_lang, "en")
        for section_id in ("main-content", "research", "publication", "awards", "skills"):
            self.assertIn(section_id, self.parser.ids)

    def test_confirmed_identity_and_education(self) -> None:
        required = (
            "Zichen Zhang",
            "Peking University Health Science Center",
            "Clinical Medicine, five-year program",
            "Expected June 2028",
            "IELTS Academic 7.5",
        )
        for text in required:
            self.assertIn(text, self.html)

    def test_research_copy_is_specific_and_cautious(self) -> None:
        required = (
            "April 2026–Present",
            "Manuscript in preparation",
            "Undergraduate Honors Program in Biology",
            "March 2024–March 2027",
            "Comparison between Different Repli-HiC Fountains",
            "October 2025",
        )
        for text in required:
            self.assertIn(text, self.html)
        for forbidden in ("Cancer Boat Bridge", "foundation model training", "fine-tuned model weights"):
            self.assertNotIn(forbidden, self.html)

    def test_publication_is_formally_cited(self) -> None:
        required = (
            "cGAS–STING Signaling Pathway in Cancer Immunotherapy",
            "Chinese Journal of Biochemistry and Molecular Biology",
            "42(2): 184–192",
            "10.13865/j.cnki.cjbmb.2025.08.1219",
            "[in Chinese]",
        )
        for text in required:
            self.assertIn(text, self.html)

    def test_confirmed_awards_and_skills_are_present(self) -> None:
        required = (
            "9th Xieying Cup",
            "Champion",
            "16th Yimeng Cup",
            "Excellent Award",
            "Python",
            "Hi-C / Repli-HiC",
            "OpenAI Codex",
            "Ollama",
        )
        for text in required:
            self.assertIn(text, self.html)

    def test_no_dead_placeholder_links(self) -> None:
        self.assertNotIn('href="#"', self.html)
```

- [ ] **Step 2: Run the English-page tests and confirm failure**

Run:

```bash
python3 -m unittest tests.test_site.EnglishPageTests -v
```

Expected: FAIL because the existing English page lacks the approved structure and corrected facts.

- [ ] **Step 3: Replace `index.html` with the approved semantic structure**

The document must contain this exact head contract:

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Zichen Zhang | Clinical Medicine, Bioinformatics & Biomedical AI</title>
  <meta name="description" content="Academic profile of Zichen Zhang, a clinical medicine student at Peking University Health Science Center working across bioinformatics, multi-omics, immunology, neuroscience, and biomedical research agents.">
  <meta name="theme-color" content="#8f1d22">
  <link rel="canonical" href="https://zichenpku.github.io/">
  <link rel="alternate" hreflang="en" href="https://zichenpku.github.io/">
  <link rel="alternate" hreflang="zh-CN" href="https://zichenpku.github.io/zh.html">
  <link rel="alternate" hreflang="x-default" href="https://zichenpku.github.io/">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="Zichen Zhang | Academic Profile">
  <meta property="og:description" content="Clinical medicine, bioinformatics, multi-omics, and biomedical research-agent workflows.">
  <meta property="og:url" content="https://zichenpku.github.io/">
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>
```

Use this exact body skeleton and class contract:

```html
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <div class="site-shell">
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#main-content">Zichen Zhang <span lang="zh-CN">张梓宸</span></a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation" data-menu-toggle>Menu</button>
        <nav class="site-nav" id="site-nav" aria-label="Primary navigation" data-site-nav>
          <a href="#research">Research</a>
          <a href="#publication">Publication</a>
          <a href="#awards">Awards</a>
          <a href="#skills">Skills</a>
          <a class="language-link" href="zh.html" lang="zh-CN">中文</a>
        </nav>
      </div>
    </header>
    <main id="main-content">
      <section class="hero" aria-labelledby="hero-title"></section>
      <section class="facts" aria-label="Academic profile at a glance"></section>
      <section class="content-section" id="research" aria-labelledby="research-title"></section>
      <section class="content-section" id="publication" aria-labelledby="publication-title"></section>
      <section class="content-section" id="awards" aria-labelledby="awards-title"></section>
      <section class="content-section" id="skills" aria-labelledby="skills-title"></section>
    </main>
    <footer class="site-footer" aria-labelledby="contact-title"></footer>
  </div>
</body>
```

Populate the skeleton with the following exact fact contract:

| Section | Required public copy |
|---|---|
| Hero | “Medical student at Peking University Health Science Center, exploring how clinical data, multi-omics, and research-agent workflows can advance biomedical research.” |
| Facts | “Clinical Medicine, five-year program”; “September 2023–Expected June 2028”; “Bioinformatics · Neuroscience · Immunology”; “IELTS Academic 7.5 · 6 June 2026” |
| Cancer research | “Clinical and Multi-omic Study of Postoperative Intra-abdominal Infection after Gastrointestinal Cancer Surgery”; “Peking University Cancer Hospital · Wu Zhouqiao Research Group · April 2026–Present”; “Manuscript in preparation” |
| Cancer contributions | Clinical and multi-omic statistical analysis; literature review; manuscript writing; local LLM deployment; prompt and research-workflow design; scientific-automation Skills refinement |
| UHPB | March 2024–March 2027; four seminars per semester; weekly literature reading; monthly lectures; annual meeting; poster presentation |
| Poster | “Comparison between Different Repli-HiC Fountains”; October 2025; independently completed literature review, analysis, interpretation, poster preparation, and presentation under faculty and doctoral-student mentorship |
| Publication | Zichen Zhang, Xin Wu, Xia Yi; cautious translated title; journal; 2026; 42(2): 184–192; `[in Chinese]`; DOI |
| Award 1 | “9th Xieying Cup (撷英杯) Medical Competition”; Team Captain; Champion; March 2026; Peking University School of Basic Medical Sciences; medical knowledge and case-based clinical reasoning |
| Award 2 | “16th Yimeng Cup (医盟杯) Five-School Medical Knowledge Competition”; Team Captain; Excellent Award; April 2026; Peking Union Medical College |
| Skills | The complete computational, experimental, and research-agent skill lists from the design specification |
| Footer | Bioinformatics; neuroscience; immunology; biomedical research agents and bioinformatics workflow automation; `silele2004@163.com`; `https://github.com/zichenpku` |

Use `<img src="photo.jpg" alt="Portrait of Zichen Zhang">` in `.hero-photo`. Do not add a poster `<img>` until the approved source asset is available again.

Add JSON-LD limited to confirmed fields:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Zichen Zhang",
  "alternateName": "张梓宸",
  "url": "https://zichenpku.github.io/",
  "email": "mailto:silele2004@163.com",
  "sameAs": ["https://github.com/zichenpku"],
  "affiliation": {
    "@type": "CollegeOrUniversity",
    "name": "Peking University Health Science Center"
  }
}
</script>
```

- [ ] **Step 4: Run the English-page tests**

Run:

```bash
python3 -m unittest tests.test_site.EnglishPageTests -v
```

Expected: all English-page tests PASS.

- [ ] **Step 5: Commit the English page**

```bash
git add index.html tests/test_site.py
git commit -m "feat: build English academic resume page"
```

---

### Task 3: Complete Chinese Page

**Files:**
- Create: `zh.html`
- Modify: `tests/test_site.py`

**Interfaces:**
- Consumes: the same CSS classes and JavaScript data attributes as `index.html`.
- Produces: the same section IDs as the English page and reciprocal language link `index.html`.

- [ ] **Step 1: Add failing Chinese-page tests**

Insert into `tests/test_site.py`:

```python
class ChinesePageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.html = read_text("zh.html") if (ROOT / "zh.html").exists() else ""
        cls.parser = LinkCollector()
        cls.parser.feed(cls.html)

    def test_language_and_required_sections(self) -> None:
        self.assertEqual(self.parser.html_lang, "zh-CN")
        for section_id in ("main-content", "research", "publication", "awards", "skills"):
            self.assertIn(section_id, self.parser.ids)

    def test_confirmed_identity_and_education(self) -> None:
        required = ("张梓宸", "北京大学医学部", "临床医学专业（五年制）", "预计2028年6月毕业", "雅思总分7.5")
        for text in required:
            self.assertIn(text, self.html)

    def test_research_and_poster_copy(self) -> None:
        required = (
            "北京大学肿瘤医院",
            "吴舟桥课题组",
            "2026年4月至今",
            "论文撰写中",
            "生物学本科生荣誉项目",
            "2024年3月至2027年3月",
            "Comparison between Different Repli-HiC Fountains",
            "2025年10月",
        )
        for text in required:
            self.assertIn(text, self.html)
        self.assertNotIn("Cancer Boat Bridge", self.html)

    def test_formal_publication_and_awards(self) -> None:
        required = (
            "cGAS-STING信号通路在肿瘤免疫治疗中的作用",
            "中国生物化学与分子生物学报",
            "42(2)：184–192",
            "第九届“撷英杯”医学竞赛",
            "队长",
            "冠军",
            "第十六届“医盟杯”五校医学知识竞赛",
            "优秀奖",
        )
        for text in required:
            self.assertIn(text, self.html)
```

- [ ] **Step 2: Run the Chinese-page tests and confirm failure**

Run:

```bash
python3 -m unittest tests.test_site.ChinesePageTests -v
```

Expected: FAIL because `zh.html` does not exist.

- [ ] **Step 3: Create the complete Chinese page**

Mirror the English page’s semantic structure and section IDs. Use this exact head contract:

```html
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>张梓宸｜临床医学、生物信息学与生物医学人工智能</title>
  <meta name="description" content="张梓宸的学术主页：北京大学医学部临床医学专业本科生，关注生物信息学、多组学、免疫学、神经科学及生物医学科研智能体。">
  <meta name="theme-color" content="#8f1d22">
  <link rel="canonical" href="https://zichenpku.github.io/zh.html">
  <link rel="alternate" hreflang="en" href="https://zichenpku.github.io/">
  <link rel="alternate" hreflang="zh-CN" href="https://zichenpku.github.io/zh.html">
  <link rel="alternate" hreflang="x-default" href="https://zichenpku.github.io/">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="张梓宸｜学术主页">
  <meta property="og:description" content="临床医学、生物信息学、多组学与生物医学科研智能体。">
  <meta property="og:url" content="https://zichenpku.github.io/zh.html">
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>
```

Use the English page’s structure with these exact Chinese equivalents:

| Section | Required public copy |
|---|---|
| Hero | “北京大学医学部临床医学专业本科生，探索如何以临床数据、多组学和科研智能体工作流推动生物医学研究。” |
| Facts | “临床医学专业（五年制）”; “2023年9月—预计2028年6月毕业”; “生物信息学 · 神经科学 · 免疫学”; “雅思总分7.5 · 2026年6月6日” |
| Cancer research | “胃肠道肿瘤术后腹腔感染的临床与多组学研究”; “北京大学肿瘤医院 · 吴舟桥课题组 · 2026年4月至今”; “论文撰写中” |
| Cancer contributions | 临床数据与多组学统计分析、文献综述、论文写作、本地大语言模型部署、提示词与科研工作流设计、科研自动化Skills开发与优化 |
| UHPB | 生物学本科生荣誉项目（UHPB）; 2024年3月至2027年3月; 每学期四次小班研讨; 每周阅读一篇文献; 每月一次讲座; 每年一次年会; 墙报展示 |
| Poster | “Comparison between Different Repli-HiC Fountains”; 2025年10月UHPB年会; 在指导老师和博士生同学指导下独立完成文献综述、分析、结果解读、墙报制作和展示 |
| Publication | 张梓宸，武欣，易霞; 完整正式中文题目; 期刊; 2026; 42(2)：184–192; DOI |
| Award 1 | 第九届“撷英杯”医学竞赛; 北京大学基础医学院; 2026年3月; 队长; 冠军; 医学专业知识与病例分析 |
| Award 2 | 第十六届“医盟杯”五校医学知识竞赛; 北京协和医学院; 2026年4月; 队长; 优秀奖 |
| Skills | 设计规格中的完整计算分析、实验技术和科研智能体能力 |
| Footer | 生物信息学、神经科学、免疫学、生物医学科研智能体与生信工作流自动化；邮箱和GitHub |

The language link must be `<a class="language-link" href="index.html" lang="en">English</a>`. Use `<img src="photo.jpg" alt="张梓宸个人照片">`.

- [ ] **Step 4: Run the Chinese-page tests**

Run:

```bash
python3 -m unittest tests.test_site.ChinesePageTests -v
```

Expected: all Chinese-page tests PASS.

- [ ] **Step 5: Commit the Chinese page**

```bash
git add zh.html tests/test_site.py
git commit -m "feat: add complete Chinese academic resume"
```

---

### Task 4: Link, Asset, Metadata, and Accessibility Hardening

**Files:**
- Modify: `index.html`
- Modify: `zh.html`
- Modify: `tests/test_site.py`

**Interfaces:**
- Consumes: reciprocal page links, local asset paths, section IDs, and metadata added in Tasks 2–3.
- Produces: fully validated internal/external links and accessible page mechanics.

- [ ] **Step 1: Add failing cross-page validation tests**

Insert into `tests/test_site.py`:

```python
class CrossPageValidationTests(unittest.TestCase):
    def parsed(self, page: str) -> tuple[str, LinkCollector]:
        html = read_text(page)
        parser = LinkCollector()
        parser.feed(html)
        return html, parser

    def test_local_links_assets_and_internal_anchors_resolve(self) -> None:
        for page in PAGES:
            html, parser = self.parsed(page)
            for image in parser.images:
                src = image.get("src", "")
                self.assertTrue(image.get("alt", "").strip(), f"{page}: missing image alt")
                if src and not urlparse(src).scheme:
                    self.assertTrue((ROOT / src).is_file(), f"{page}: missing {src}")
            for link in parser.links:
                href = link.get("href", "")
                if href.startswith("#"):
                    self.assertIn(href[1:], parser.ids, f"{page}: missing anchor {href}")
                elif href and not urlparse(href).scheme and not href.startswith("mailto:"):
                    target = href.split("#", 1)[0]
                    self.assertTrue((ROOT / target).is_file(), f"{page}: missing {target}")

    def test_external_blank_targets_are_safe(self) -> None:
        for page in PAGES:
            _, parser = self.parsed(page)
            for link in parser.links:
                if link.get("target") == "_blank":
                    rel = set(link.get("rel", "").split())
                    self.assertTrue({"noopener", "noreferrer"}.issubset(rel), f"{page}: unsafe target")

    def test_reciprocal_language_links_and_shared_assets(self) -> None:
        english = read_text("index.html")
        chinese = read_text("zh.html")
        self.assertIn('href="zh.html"', english)
        self.assertIn('href="index.html"', chinese)
        for html in (english, chinese):
            self.assertIn('href="styles.css"', html)
            self.assertIn('src="script.js"', html)
            self.assertIn('href="https://doi.org/10.13865/j.cnki.cjbmb.2025.08.1219"', html)
            self.assertIn('href="mailto:silele2004@163.com"', html)
            self.assertIn('href="https://github.com/zichenpku"', html)

    def test_metadata_and_semantics_exist(self) -> None:
        for page in PAGES:
            html = read_text(page)
            for token in (
                'rel="canonical"',
                'hreflang="en"',
                'hreflang="zh-CN"',
                'hreflang="x-default"',
                'property="og:title"',
                'type="application/ld+json"',
                'class="skip-link"',
                'data-menu-toggle',
                'aria-controls="site-nav"',
            ):
                self.assertIn(token, html, f"{page}: missing {token}")
            self.assertEqual(len(re.findall(r"<h1(?:\\s|>)", html)), 1, f"{page}: expected one h1")
```

- [ ] **Step 2: Run cross-page tests and confirm any missing safety details**

Run:

```bash
python3 -m unittest tests.test_site.CrossPageValidationTests -v
```

Expected: FAIL if any internal anchor, local file, external-link safety attribute, language link, or metadata field is missing.

- [ ] **Step 3: Fix both documents to satisfy the validation contract**

Use these exact external link forms in both pages:

```html
<a class="doi-link"
   href="https://doi.org/10.13865/j.cnki.cjbmb.2025.08.1219"
   target="_blank"
   rel="noopener noreferrer">DOI: 10.13865/j.cnki.cjbmb.2025.08.1219</a>

<a href="mailto:silele2004@163.com">silele2004@163.com</a>

<a href="https://github.com/zichenpku"
   target="_blank"
   rel="noopener noreferrer">github.com/zichenpku</a>
```

Ensure the menu button has `aria-expanded="false"`, `aria-controls="site-nav"`, and `data-menu-toggle`; the matching navigation has `id="site-nav"` and `data-site-nav`.

- [ ] **Step 4: Run the full regression suite**

Run:

```bash
python3 -m unittest discover -s tests -v
```

Expected: all tests PASS.

- [ ] **Step 5: Commit the hardening work**

```bash
git add index.html zh.html tests/test_site.py
git commit -m "test: validate bilingual site links and semantics"
```

---

### Task 5: Documentation, Local Rendering, and Final Quality Gate

**Files:**
- Modify: `README.md`
- Modify if QA finds defects: `index.html`
- Modify if QA finds defects: `zh.html`
- Modify if QA finds defects: `styles.css`
- Modify if QA finds defects: `script.js`

**Interfaces:**
- Consumes: the complete static site and regression suite.
- Produces: maintainable usage instructions and a visually verified release candidate.

- [ ] **Step 1: Replace the README with exact maintenance instructions**

Use:

````markdown
# zichenpku.github.io

Bilingual academic profile of Zichen Zhang, hosted with GitHub Pages.

## Structure

- `index.html` — English page
- `zh.html` — Chinese page
- `styles.css` — shared A2 academic editorial design
- `script.js` — mobile navigation and current-year enhancement
- `photo.jpg` — profile photograph
- `tests/test_site.py` — dependency-free regression tests

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` and `http://localhost:8000/zh.html`.

## Validation

```bash
python3 -m unittest discover -s tests -v
```

The deployable site intentionally omits the UHPB event photograph until the approved source file is supplied again. Do not substitute an unrelated or generated image.
````

- [ ] **Step 2: Run automated regression and repository hygiene checks**

Run:

```bash
python3 -m unittest discover -s tests -v
git diff --check
git status --short
```

Expected: all tests PASS; `git diff --check` has no output; only intended website and documentation files are modified.

- [ ] **Step 3: Start the local site**

Run:

```bash
python3 -m http.server 8000
```

Expected: local server reports it is serving the repository directory on port 8000.

- [ ] **Step 4: Perform visual and interaction QA**

Inspect both `http://localhost:8000/` and `http://localhost:8000/zh.html` at:

- 1440 × 1000;
- 820 × 1180;
- 390 × 844;
- 320 × 720.

Verify:

1. the A2 red/white/slate visual hierarchy matches the approved preview;
2. the existing profile image crops without hiding the face;
3. the language switch changes pages;
4. each navigation link reaches its section;
5. the mobile menu opens, closes after selecting a link, and closes with Escape;
6. keyboard focus is visible;
7. there is no horizontal overflow;
8. the DOI, email, and GitHub links use the intended targets;
9. both pages remain readable with JavaScript disabled;
10. no fake UHPB image or pending placeholder appears in the deployable pages.

- [ ] **Step 5: Stop the local server and rerun the final suite**

Run:

```bash
python3 -m unittest discover -s tests -v
git diff --check
```

Expected: all tests PASS and no whitespace errors.

- [ ] **Step 6: Commit the release candidate**

```bash
git add README.md index.html zh.html styles.css script.js tests/test_site.py
git commit -m "docs: document bilingual academic site"
```

- [ ] **Step 7: Compare with GitHub before publication**

When GitHub connectivity is restored:

```bash
git ls-remote origin refs/heads/main
```

Expected upstream head before reconciliation: `c09d949802d15876140bfc33db42dcdc199407a1`. If it differs, inspect the remote changes before publishing. Do not force-push.

The local repository was initialized from a GitHub archive snapshot because two standard clone attempts failed. Reconcile the local commits onto the current remote `main` history before push; do not publish the synthetic snapshot commit as a replacement history.
