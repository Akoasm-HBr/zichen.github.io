# Zichen Zhang Academic Resume Website — Design Specification

Date: 2026-07-26  
Status: Approved for implementation  
Visual direction: A2 — modern academic editorial style

## 1. Objective

Replace the current single-page placeholder-like resume with a polished bilingual academic website for:

1. international research and laboratory applications; and
2. domestic scholarship, award, postgraduate, and clinical-research evaluation.

The result should present Zichen Zhang as a clinical-medicine student with credible computational, multi-omic, experimental, and biomedical research-agent experience. It must not overstate seniority, invent research findings, or imply independent principal-investigator status.

## 2. Implementation Approach

Use a dependency-free static-site architecture:

- `index.html`: English default page;
- `zh.html`: complete Chinese page;
- `styles.css`: shared responsive visual system;
- `script.js`: small progressive-enhancement layer for mobile navigation and current-year display;
- `photo.jpg`: retain the existing profile photograph;
- `assets/uhpb-poster.jpg`: optimized copy of the approved UHPB poster photograph when the source file is available.

The language selector must be a normal link between `index.html` and `zh.html`, so it remains functional without JavaScript. This is preferred over a JavaScript-only content toggle because it is simpler to maintain, more resilient, and gives each language a directly addressable page.

No framework, package manager, build pipeline, database, analytics service, or external font dependency is required.

## 3. Information Architecture

Both language versions use the same content hierarchy:

1. sticky header and navigation;
2. hero introduction and profile photograph;
3. at-a-glance academic facts;
4. research and academic work;
5. publication;
6. awards and leadership;
7. technical toolkit;
8. contact and research-interest footer.

The English page is the canonical default. The Chinese page contains equivalent—not abbreviated—content.

## 4. Visual Design

Use the approved A2 direction:

- white primary canvas;
- restrained Peking-University-inspired red accent (`#8f1d22` family);
- slate-gray text and separators;
- serif headings paired with a highly legible system sans-serif body;
- square or minimally rounded academic cards;
- generous whitespace and clear editorial rules;
- no decorative scientific imagery, animated background, terminal aesthetic, or exaggerated metrics.

The visual tone should resemble a modern academic journal or university profile rather than a commercial product landing page.

The existing portrait appears in the hero. The UHPB event photograph appears only with its corresponding poster item, with an informative caption and alt text.

## 5. Public Content

### 5.1 Identity and Education

- Name: Zichen Zhang / 张梓宸
- Institution: Peking University Health Science Center / 北京大学医学部
- Program: Clinical Medicine, five-year program / 临床医学专业（五年制）
- Dates: September 2023 – expected June 2028
- IELTS Academic: overall 7.5, test date 6 June 2026

### 5.2 Research Interests

Ordered priorities:

1. bioinformatics;
2. neuroscience;
3. immunology;
4. biomedical research agents and bioinformatics workflow automation.

### 5.3 Cancer Research Project

Institutional description:

- research group led by Wu Zhouqiao at Peking University Cancer Hospital;
- April 2026 – present;
- ongoing, manuscript in preparation.

Public-facing scope:

- clinical-data and multi-omic statistical analysis;
- literature-review preparation;
- manuscript writing;
- local large-language-model deployment;
- prompt and workflow design;
- scientific-automation Skills development and refinement.

The internal nickname “Cancer Boat Bridge” must not appear on the public website.

Provisional public English title:

> Clinical and Multi-omic Study of Postoperative Intra-abdominal Infection after Gastrointestinal Cancer Surgery

Provisional Chinese title:

> 胃肠道肿瘤术后腹腔感染的临床与多组学研究

These are descriptive website titles, not a final manuscript title. Do not state sample sizes, final conclusions, confirmed biomarkers, or a journal submission outcome.

AI-tool wording should describe practical research engineering:

- OpenAI Codex;
- Anthropic Claude;
- Ollama-hosted local DeepSeek models;
- local deployment, prompting, agent workflows, and Skills refinement.

Do not describe this work as training a foundation model or fine-tuning model weights.

### 5.4 UHPB

- Undergraduate Honors Program in Biology (UHPB);
- March 2024 – March 2027;
- structured academic-training program, not a standalone research project;
- four small-group seminars per semester;
- one research paper read per week;
- one lecture per month;
- one annual meeting per year;
- poster presentation.

Poster:

- event: UHPB Annual Meeting;
- date: October 2025;
- title: “Comparison between Different Repli-HiC Fountains”;
- contribution: independently completed literature review, analysis, interpretation, poster preparation, and presentation under faculty and doctoral-student mentorship.

The website must not imply that guidance by the faculty mentor and doctoral student constituted co-completion of the user’s listed work.

### 5.5 Publication

Use the formally published citation:

> 张梓宸，武欣，易霞. cGAS-STING信号通路在肿瘤免疫治疗中的作用[J]. 中国生物化学与分子生物学报，2026，42(2)：184–192. DOI: 10.13865/j.cnki.cjbmb.2025.08.1219.

English display:

- use a cautious translated title;
- mark the article as `[in Chinese]`;
- identify Zichen Zhang as first author through author ordering and restrained metadata;
- link the DOI to `https://doi.org/10.13865/j.cnki.cjbmb.2025.08.1219`.

No additional publication, accepted manuscript, or preprint should be listed.

### 5.6 Awards and Leadership

1. Ninth Xieying Cup (撷英杯) Medical Competition
   - Peking University School of Basic Medical Sciences;
   - March 2026;
   - team captain;
   - champion;
   - assessed medical knowledge and case-based clinical reasoning.

2. Sixteenth Yimeng Cup (医盟杯) Five-School Medical Knowledge Competition
   - Peking Union Medical College;
   - April 2026;
   - team captain;
   - Excellent Award.

No other award or clinical rotation should be inferred.

### 5.7 Technical Toolkit

Computational:

- Python, R, and Linux;
- data cleaning and quality control;
- statistical testing;
- regression analysis;
- data visualization;
- differential analysis;
- enrichment analysis;
- multi-omics integration;
- basic machine learning.

Experimental:

- cell culture;
- PCR/qPCR;
- Western blot;
- flow cytometry;
- immunofluorescence;
- Hi-C/Repli-HiC library preparation and analysis.

Research agents:

- Codex and Claude;
- Ollama-based local DeepSeek deployment;
- local deployment;
- prompt and workflow design;
- biomedical research-agent workflows;
- bioinformatics automation;
- scientific-automation Skills refinement.

### 5.8 Contact

- Email: `silele2004@163.com`
- GitHub: `https://github.com/zichenpku`

Do not add ORCID, Google Scholar, ResearchGate, LinkedIn, phone number, address, or downloadable CV until the user provides and approves them.

## 6. Interaction Design

- Header navigation scrolls to the corresponding section.
- English/中文 switches between the two language pages.
- Research and publication hero buttons scroll to those sections.
- DOI opens in a new tab with safe `rel` attributes.
- Email launches the system mail handler.
- GitHub opens the profile in a new tab with safe `rel` attributes.
- Mobile navigation opens and closes through an accessible button.
- Pressing Escape closes the mobile menu.
- Skip-to-content link is available for keyboard and assistive-technology users.
- All interactive elements have visible focus states.
- Respect `prefers-reduced-motion`.

## 7. Responsive Behavior

Desktop:

- two-column hero;
- four-column at-a-glance strip;
- two-column research cards where appropriate;
- three-column skills grid.

Tablet:

- reduced spacing;
- two-column summary strip;
- stacked or two-column content according to available width.

Mobile:

- photograph above the hero copy;
- single-column sections;
- compact header with menu button;
- full-width buttons and readable tap targets;
- no horizontal overflow at 320 CSS pixels.

## 8. Accessibility and Semantics

- semantic landmarks: `header`, `nav`, `main`, `section`, `article`, and `footer`;
- one `h1` per page and logically nested headings;
- descriptive alt text for both photographs;
- sufficient text/background contrast;
- keyboard-operable navigation;
- visible focus indicators;
- no essential information conveyed by color alone;
- English page uses `lang="en"`; Chinese page uses `lang="zh-CN"`.

## 9. Metadata and Discoverability

Each language page includes:

- localized `<title>` and meta description;
- canonical URL;
- reciprocal `hreflang` annotations for English, Simplified Chinese, and `x-default`;
- Open Graph title, description, type, and page URL;
- a theme color consistent with A2;
- JSON-LD `Person` metadata limited to confirmed public facts.

No fabricated institutional affiliation detail, researcher identifier, or social profile should be included.

## 10. Verification

Before publication:

1. validate internal anchors and local asset references;
2. verify the DOI, email, GitHub, and language links;
3. check both pages without JavaScript;
4. run HTML/CSS syntax checks available locally;
5. test at desktop, tablet, and 320-pixel mobile widths;
6. check keyboard navigation and focus visibility;
7. verify no horizontal overflow;
8. check alt text and heading order;
9. inspect the rendered pages visually;
10. compare the remote branch head with the recorded upstream snapshot before pushing.

## 11. Known Pending Item

The original UHPB poster photograph was previously supplied through a temporary WeChat path that is no longer present on disk. Implementation may use an explicit placeholder only in the local draft. The public deployment must either:

1. receive the image again and include an optimized copy; or
2. omit the photograph without inventing a substitute.

The original image must never be deleted or overwritten.
