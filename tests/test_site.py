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

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
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


class EnglishPageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.html = read_text("index.html")
        cls.parser = LinkCollector()
        cls.parser.feed(cls.html)

    def test_language_and_required_sections(self) -> None:
        self.assertEqual(self.parser.html_lang, "en")
        for section_id in (
            "main-content",
            "research",
            "publication",
            "awards",
            "skills",
        ):
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
        for forbidden in (
            "Cancer Boat Bridge",
            "foundation model training",
            "fine-tuned model weights",
        ):
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


if __name__ == "__main__":
    unittest.main()
