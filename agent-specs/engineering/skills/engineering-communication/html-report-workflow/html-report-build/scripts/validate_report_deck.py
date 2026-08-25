#!/usr/bin/env python3

import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}

RESOURCE_ATTRIBUTES = {
    ("audio", "src"),
    ("embed", "src"),
    ("iframe", "src"),
    ("img", "src"),
    ("link", "href"),
    ("object", "data"),
    ("script", "src"),
    ("source", "src"),
    ("video", "poster"),
    ("video", "src"),
}

REQUIRED_IDS = {
    "report-deck",
    "previous-slide",
    "next-slide",
    "slide-overview",
    "slide-counter",
    "print-deck",
    "fullscreen-deck",
    "overview-dialog",
}

REQUIRED_SCRIPT_MARKERS = {
    "ArrowRight",
    "ArrowLeft",
    "Home",
    "End",
    "requestFullscreen",
    "window.print",
}

TOPIC_LABEL_TITLES = {
    "analysis",
    "background",
    "conclusion",
    "current state",
    "findings",
    "introduction",
    "methodology",
    "next steps",
    "recommendations",
    "results",
    "summary",
}


def _attrs_dict(attrs):
    return {name: value or "" for name, value in attrs}


def _class_names(attrs):
    return set(attrs.get("class", "").split())


class ReportDeckParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.has_html_doctype = False
        self.tags = set()
        self.html_lang = ""
        self.title_parts = []
        self.title_depth = 0
        self.stack = []
        self.ids = []
        self.dependencies = []
        self.slides = []
        self.current_slide = None
        self.slide_section_depth = 0
        self.heading_depth = 0
        self.source_depth = 0
        self.parse_errors = []

    def handle_decl(self, declaration):
        if declaration.strip().lower() == "doctype html":
            self.has_html_doctype = True

    def _inspect_resource(self, tag, attrs):
        for name, value in attrs.items():
            if (tag, name) not in RESOURCE_ATTRIBUTES or not value:
                continue
            if value.startswith("data:"):
                continue
            self.dependencies.append(f"<{tag}> {name}={value!r}")

    def handle_starttag(self, tag, attrs_list):
        tag = tag.lower()
        attrs = _attrs_dict(attrs_list)
        classes = _class_names(attrs)
        parent = self.stack[-1] if self.stack else None

        self.tags.add(tag)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "html":
            self.html_lang = attrs.get("lang", "").strip()
        self._inspect_resource(tag, attrs)

        if tag == "title":
            self.title_depth += 1

        if tag == "section" and "slide" in classes:
            if self.current_slide is not None:
                self.parse_errors.append("slide sections must not be nested")
            self.current_slide = {
                "id": attrs.get("id", "").strip(),
                "claim_id": attrs.get("data-claim-id", "").strip(),
                "evidence_ids": attrs.get("data-evidence-ids", "").strip(),
                "headings": [],
                "active_heading": None,
                "source_parts": [],
                "page_number_count": 0,
                "direct_child": bool(parent and parent[1].get("id") == "report-deck"),
            }
            self.slide_section_depth = 1
        elif self.current_slide is not None and tag == "section":
            self.slide_section_depth += 1

        if self.current_slide is not None:
            if tag in {"h1", "h2"}:
                self.current_slide["headings"].append([])
                self.current_slide["active_heading"] = len(self.current_slide["headings"]) - 1
                self.heading_depth = 1
            elif self.heading_depth:
                self.heading_depth += 1

            if "source-note" in classes:
                self.source_depth = 1
            elif self.source_depth:
                self.source_depth += 1

            if "page-number" in classes:
                self.current_slide["page_number_count"] += 1

        if tag not in VOID_TAGS:
            self.stack.append((tag, attrs))

    def handle_startendtag(self, tag, attrs_list):
        tag = tag.lower()
        attrs = _attrs_dict(attrs_list)
        self.tags.add(tag)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        self._inspect_resource(tag, attrs)

    def handle_data(self, data):
        if self.title_depth:
            self.title_parts.append(data)
        if self.current_slide is not None and self.heading_depth:
            index = self.current_slide["active_heading"]
            self.current_slide["headings"][index].append(data)
        if self.current_slide is not None and self.source_depth:
            self.current_slide["source_parts"].append(data)

    def handle_endtag(self, tag):
        tag = tag.lower()

        if tag == "title" and self.title_depth:
            self.title_depth -= 1

        if self.current_slide is not None:
            if self.heading_depth:
                self.heading_depth -= 1
                if self.heading_depth == 0:
                    self.current_slide["active_heading"] = None
            if self.source_depth:
                self.source_depth -= 1

            if tag == "section":
                self.slide_section_depth -= 1
                if self.slide_section_depth == 0:
                    self.slides.append(self.current_slide)
                    self.current_slide = None

        if tag not in VOID_TAGS and self.stack:
            while self.stack and self.stack[-1][0] != tag:
                self.stack.pop()
            if self.stack:
                self.stack.pop()


def _normalized_text(parts):
    return re.sub(r"\s+", " ", "".join(parts)).strip()


def validate_html(html):
    errors = []
    warnings = []
    parser = ReportDeckParser()

    try:
        parser.feed(html)
        parser.close()
    except Exception as exc:
        return [f"HTML parsing failed: {exc}"], [], 0

    if not parser.has_html_doctype:
        errors.append("missing <!doctype html>")
    for tag in ("html", "head", "title", "body"):
        if tag not in parser.tags:
            errors.append(f"missing <{tag}> element")
    if not parser.html_lang:
        errors.append("missing non-empty <html lang> value")
    if not _normalized_text(parser.title_parts):
        errors.append("missing non-empty document title")

    canvas_width = re.search(r"--canvas-w\s*:\s*1600px\s*;", html, flags=re.IGNORECASE)
    canvas_height = re.search(r"--canvas-h\s*:\s*900px\s*;", html, flags=re.IGNORECASE)
    if not canvas_width or not canvas_height:
        errors.append("fixed canvas must be 1600 x 900 using --canvas-w and --canvas-h")

    placeholders = sorted(set(re.findall(r"\{\{[^{}]+\}\}", html)))
    for placeholder in placeholders:
        errors.append(f"unresolved placeholder: {placeholder}")

    placeholder_patterns = (
        (r"\bTODO\b", "TODO"),
        (r"\bTBD\b", "TBD"),
        (r"\blorem ipsum\b", "lorem ipsum"),
        (r"\[insert[^\]]*\]", "[insert ...]"),
    )
    for pattern, label in placeholder_patterns:
        if re.search(pattern, html, flags=re.IGNORECASE):
            errors.append(f"unresolved placeholder text: {label}")

    dependencies = list(parser.dependencies)
    for match in re.finditer(r"url\(([^)]+)\)", html, flags=re.IGNORECASE):
        value = match.group(1).strip().strip("\"'")
        if value and not value.startswith(("data:", "#")):
            dependencies.append(f"CSS url({value})")
    if re.search(r"@import\s+", html, flags=re.IGNORECASE):
        dependencies.append("CSS @import")
    for dependency in sorted(set(dependencies)):
        errors.append(f"external dependency is not allowed: {dependency}")

    id_counts = Counter(parser.ids)
    for element_id, count in sorted(id_counts.items()):
        if count > 1:
            errors.append(f"duplicate id: {element_id!r}")

    missing_ids = sorted(REQUIRED_IDS - set(parser.ids))
    for element_id in missing_ids:
        errors.append(f"missing required deck control id: {element_id}")
    for marker in sorted(REQUIRED_SCRIPT_MARKERS):
        if marker not in html:
            errors.append(f"missing required deck behavior: {marker}")

    errors.extend(parser.parse_errors)
    if not parser.slides:
        errors.append("no direct report slides were found")

    for position, slide in enumerate(parser.slides, start=1):
        label = slide["id"] or f"position {position}"
        if not slide["direct_child"]:
            errors.append(f"slide {label}: must be a direct child of #report-deck")
        if not slide["id"]:
            errors.append(f"slide at position {position}: missing id")
        if not slide["claim_id"]:
            errors.append(f"slide {label}: missing data-claim-id")

        headings = [_normalized_text(parts) for parts in slide["headings"]]
        headings = [heading for heading in headings if heading]
        if len(headings) != 1:
            errors.append(f"slide {label}: expected exactly one h1/h2 action title, found {len(headings)}")
        elif headings[0].lower().strip(" .:-") in TOPIC_LABEL_TITLES:
            warnings.append(f"slide {label}: action title appears to be a topic label: {headings[0]!r}")

        source_note = _normalized_text(slide["source_parts"])
        if not source_note:
            errors.append(f"slide {label}: missing visible source note")
        if slide["page_number_count"] != 1:
            errors.append(
                f"slide {label}: expected exactly one .page-number target, found {slide['page_number_count']}"
            )
        if not slide["evidence_ids"] and "unverified" not in source_note.lower():
            errors.append(
                f"slide {label}: missing data-evidence-ids; use a visible Unverified source note for a known gap"
            )

    return errors, warnings, len(parser.slides)


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if len(argv) != 1:
        print("Usage: validate_report_deck.py <report.html|->", file=sys.stderr)
        return 2

    source = argv[0]
    try:
        html = sys.stdin.read() if source == "-" else Path(source).read_text(encoding="utf-8")
    except OSError as exc:
        print(f"ERROR: cannot read {source}: {exc}", file=sys.stderr)
        return 2

    errors, warnings, slide_count = validate_html(html)
    for warning in warnings:
        print(f"WARN: {warning}")
    for error in errors:
        print(f"ERROR: {error}")

    if errors:
        print(f"FAIL: {len(errors)} error(s), {len(warnings)} warning(s), {slide_count} slide(s)")
        return 1

    print(f"PASS: {slide_count} slide(s), {len(warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
