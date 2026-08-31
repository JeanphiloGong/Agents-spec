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


def _duplicates(values):
    return sorted(value for value, count in Counter(values).items() if value and count > 1)


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
        self.report_schema = ""
        self.slides = []
        self.current_slide = None
        self.slide_section_depth = 0
        self.heading_depth = 0
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
        if attrs.get("id") == "report-deck":
            self.report_schema = attrs.get("data-report-schema", "").strip()
        self._inspect_resource(tag, attrs)

        if tag == "title":
            self.title_depth += 1

        if tag == "section" and "slide" in classes:
            if self.current_slide is not None:
                self.parse_errors.append("slide sections must not be nested")
            self.current_slide = {
                "id": attrs.get("id", "").strip(),
                "story_section": attrs.get("data-story-section", "").strip(),
                "front_matter_role": attrs.get("data-front-matter-role", "").strip(),
                "chapter_id": attrs.get("data-chapter-id", "").strip(),
                "chapter_ids": attrs.get("data-chapter-ids", "").strip(),
                "next_main_slide_id": attrs.get("data-next-main-slide-id", "").strip(),
                "question_in_id": attrs.get("data-question-in-id", "").strip(),
                "has_question_in": "data-question-in-id" in attrs,
                "question_out_id": attrs.get("data-question-out-id", "").strip(),
                "has_question_out": "data-question-out-id" in attrs,
                "claim_id": attrs.get("data-claim-id", "").strip(),
                "supports_claim_id": attrs.get("data-supports-claim-id", "").strip(),
                "has_supports_claim": "data-supports-claim-id" in attrs,
                "evidence_ids": attrs.get("data-evidence-ids", "").strip(),
                "appendix_for": attrs.get("data-appendix-for", "").strip(),
                "headings": [],
                "active_heading": None,
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
    def handle_endtag(self, tag):
        tag = tag.lower()

        if tag == "title" and self.title_depth:
            self.title_depth -= 1

        if self.current_slide is not None:
            if self.heading_depth:
                self.heading_depth -= 1
                if self.heading_depth == 0:
                    self.current_slide["active_heading"] = None
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
    if parser.report_schema != "0.3":
        errors.append("#report-deck must declare report schema 0.3")

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

    main_slides = []
    divider_slides = []
    appendix_slides = []
    seen_appendix = False
    for position, slide in enumerate(parser.slides, start=1):
        label = slide["id"] or f"position {position}"
        if not slide["direct_child"]:
            errors.append(f"slide {label}: must be a direct child of #report-deck")
        if not slide["id"]:
            errors.append(f"slide at position {position}: missing id")
        story_section = slide["story_section"]
        if story_section == "main":
            if seen_appendix:
                errors.append("appendix slides must follow all main and divider slides")
            main_slides.append(slide)
            if not slide["chapter_id"]:
                errors.append(f"slide {label}: missing data-chapter-id")
            if not slide["question_in_id"]:
                errors.append(f"slide {label}: missing data-question-in-id")
            if not slide["has_question_out"]:
                errors.append(f"slide {label}: missing data-question-out-id")
            if slide["appendix_for"]:
                errors.append(f"slide {label}: main slide must not declare data-appendix-for")
        elif story_section == "divider":
            if seen_appendix:
                errors.append("appendix slides must follow all main and divider slides")
            divider_slides.append(slide)
            if not slide["chapter_id"]:
                errors.append(f"slide {label}: missing data-chapter-id")
            if not slide["next_main_slide_id"]:
                errors.append(f"slide {label}: missing data-next-main-slide-id")
        elif story_section == "front_matter":
            pass
        elif story_section == "appendix":
            seen_appendix = True
            appendix_slides.append(slide)
            if not slide["appendix_for"]:
                errors.append(f"slide {label}: appendix slide requires data-appendix-for")
            if slide["has_question_in"] or slide["has_question_out"]:
                errors.append(f"slide {label}: appendix slide must not declare question attributes")
        else:
            errors.append(
                f"slide {label}: data-story-section must be 'front_matter', 'main', 'divider', or 'appendix'"
            )

        if story_section in {"main", "appendix"}:
            if not slide["claim_id"]:
                errors.append(f"slide {label}: missing data-claim-id")
            if not slide["has_supports_claim"]:
                errors.append(f"slide {label}: missing data-supports-claim-id")
            if not slide["evidence_ids"]:
                errors.append(f"slide {label}: missing data-evidence-ids")
        elif any(
            (
                slide["claim_id"],
                slide["has_supports_claim"],
                slide["evidence_ids"],
                slide["has_question_in"],
                slide["has_question_out"],
                slide["appendix_for"],
            )
        ):
            errors.append(f"slide {label}: navigation slides must not declare narrative attributes")

        headings = [_normalized_text(parts) for parts in slide["headings"]]
        headings = [heading for heading in headings if heading]
        if len(headings) != 1:
            errors.append(f"slide {label}: expected exactly one h1/h2 action title, found {len(headings)}")
        elif story_section in {"main", "appendix"} and headings[0].lower().strip(" .:-") in TOPIC_LABEL_TITLES:
            warnings.append(f"slide {label}: action title appears to be a topic label: {headings[0]!r}")

        if slide["page_number_count"] != 1:
            errors.append(
                f"slide {label}: expected exactly one .page-number target, found {slide['page_number_count']}"
            )
    front_matter_positions = [
        index for index, slide in enumerate(parser.slides)
        if slide["story_section"] == "front_matter"
    ]
    front_matter_roles = [parser.slides[index]["front_matter_role"] for index in front_matter_positions]
    if front_matter_positions != [0, 1] or front_matter_roles != ["cover", "contents"]:
        errors.append("deck must start with exactly two front matter slides: cover and contents")

    if not main_slides:
        errors.append("deck must contain at least one main slide")
    else:
        if main_slides[0]["supports_claim_id"]:
            errors.append("opening main slide must not support another claim")
        question_in_ids = [slide["question_in_id"] for slide in main_slides]
        for question_id in _duplicates(question_in_ids):
            errors.append(f"main story reuses data-question-in-id {question_id}")
        for index, slide in enumerate(main_slides):
            label = slide["id"] or f"main position {index + 1}"
            if index > 0 and not slide["supports_claim_id"]:
                errors.append(f"slide {label}: non-opening main slide requires data-supports-claim-id")
            if index < len(main_slides) - 1:
                if not slide["question_out_id"]:
                    errors.append(f"slide {label}: non-final main slide requires a next question")
                next_slide = main_slides[index + 1]
                if slide["question_out_id"] != next_slide["question_in_id"]:
                    errors.append(
                        f"question handoff breaks between {label} and {next_slide['id'] or index + 2}: "
                        f"{slide['question_out_id']!r} != {next_slide['question_in_id']!r}"
                    )
            elif slide["question_out_id"]:
                errors.append(f"slide {label}: final main slide must close the question chain")

        chapter_order = []
        for slide in main_slides:
            if not chapter_order or slide["chapter_id"] != chapter_order[-1]:
                chapter_order.append(slide["chapter_id"])
        for chapter_id in _duplicates(chapter_order):
            errors.append(f"main story re-enters chapter {chapter_id}")

        contents_slide = parser.slides[1] if len(parser.slides) > 1 else {}
        if (
            contents_slide.get("story_section") == "front_matter"
            and contents_slide.get("front_matter_role") == "contents"
        ):
            contents_chapter_ids = contents_slide.get("chapter_ids", "").split()
            if contents_chapter_ids != chapter_order:
                errors.append("contents chapter IDs must exactly match main chapter order")

        slide_positions = {id(slide): index for index, slide in enumerate(parser.slides)}
        for index, slide in enumerate(main_slides):
            label = slide["id"] or f"main position {index + 1}"
            position = slide_positions[id(slide)]
            previous = parser.slides[position - 1] if position > 0 else {}
            if index == 0:
                if previous.get("story_section") == "divider":
                    errors.append("first chapter must follow contents without a divider")
                continue
            previous_chapter_id = main_slides[index - 1]["chapter_id"]
            if slide["chapter_id"] != previous_chapter_id and previous.get("story_section") != "divider":
                errors.append(f"chapter change requires a divider before slide {label}")

    slide_positions = {id(slide): index for index, slide in enumerate(parser.slides)}
    for divider in divider_slides:
        label = divider["id"] or "unknown"
        position = slide_positions[id(divider)]
        next_slide = parser.slides[position + 1] if position + 1 < len(parser.slides) else {}
        if next_slide.get("story_section") != "main":
            errors.append(f"slide {label}: divider must immediately precede a main slide")
            continue
        if divider["next_main_slide_id"] != next_slide["id"]:
            errors.append(f"slide {label}: data-next-main-slide-id must match the following main slide")
        next_main_index = main_slides.index(next_slide)
        if next_main_index == 0:
            errors.append("first chapter must follow contents without a divider")
        elif next_slide["chapter_id"] == main_slides[next_main_index - 1]["chapter_id"]:
            errors.append(f"slide {label}: divider is only allowed at a chapter change")
        if divider["chapter_id"] != next_slide["chapter_id"]:
            errors.append(f"slide {label}: data-chapter-id must match the following main slide")

    main_ids = {slide["id"] for slide in main_slides if slide["id"]}
    narrative_slides = main_slides + appendix_slides
    for claim_id in _duplicates(slide["claim_id"] for slide in narrative_slides):
        errors.append(f"duplicate data-claim-id: {claim_id}")
    claim_ids = {slide["claim_id"] for slide in narrative_slides if slide["claim_id"]}
    for slide in narrative_slides:
        label = slide["id"] or "unknown"
        if slide["supports_claim_id"] and slide["supports_claim_id"] not in claim_ids:
            errors.append(
                f"slide {label}: data-supports-claim-id references unknown claim {slide['supports_claim_id']!r}"
            )
    for slide in appendix_slides:
        label = slide["id"] or "unknown"
        references = set(slide["appendix_for"].split())
        unknown = sorted(references - main_ids)
        if unknown:
            errors.append(f"slide {label}: data-appendix-for references unknown main slides: {', '.join(unknown)}")

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
