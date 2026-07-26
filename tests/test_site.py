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


if __name__ == "__main__":
    unittest.main()
