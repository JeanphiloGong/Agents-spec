#!/usr/bin/env python3

import sys
from collections import Counter
from pathlib import Path

import yaml


FORBIDDEN_COUNT_KEYS = {
    "min_page_count",
    "min_slide_count",
    "minimum_page_count",
    "minimum_slide_count",
    "page_count",
    "preferred_page_count",
    "preferred_slide_count",
    "requested_page_count",
    "requested_slide_count",
    "slide_count",
    "target_page_count",
    "target_slide_count",
}


def _duplicates(values):
    return sorted(value for value, count in Counter(values).items() if value and count > 1)


def _forbidden_count_paths(value, path=""):
    paths = []
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}" if path else str(key)
            if key in FORBIDDEN_COUNT_KEYS:
                paths.append(child_path)
            paths.extend(_forbidden_count_paths(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            paths.extend(_forbidden_count_paths(child, f"{path}[{index}]"))
    return paths


def _question_matches(left, right):
    if not isinstance(left, dict) or not isinstance(right, dict):
        return False
    return left.get("id") == right.get("id") and left.get("text") == right.get("text")


def validate_plan(plan):
    errors = []
    warnings = []
    if not isinstance(plan, dict):
        return ["plan root must be a mapping"], []

    if plan.get("schema_version") != "0.3":
        errors.append('schema_version must be "0.3"')
    if plan.get("skill_version") != "0.3.2":
        errors.append('skill_version must be "0.3.2"')
    if plan.get("artifact_type") != "html_report_deck":
        errors.append("artifact_type must be html_report_deck")
    if plan.get("output", {}).get("canvas") != "1600x900":
        errors.append("output.canvas must be 1600x900")

    count_paths = _forbidden_count_paths(plan)
    if count_paths:
        errors.append(
            "target slide count is forbidden; derive pages from required claims and evidence: "
            + ", ".join(count_paths)
        )

    argument = plan.get("argument")
    if not isinstance(argument, dict):
        argument = {}
        errors.append("argument must be a mapping")
    if argument.get("method") != "minto_pyramid":
        errors.append("argument.method must be minto_pyramid")
    governing_question = argument.get("governing_question")
    if not isinstance(governing_question, dict) or not governing_question.get("id") or not governing_question.get("text"):
        errors.append("argument.governing_question requires id and text")
        governing_question = {}
    governing_claim_id = argument.get("governing_answer_claim_id")
    if not governing_claim_id:
        errors.append("argument.governing_answer_claim_id is required")
    if not argument.get("audience_decision"):
        errors.append("argument.audience_decision is required")
    if argument.get("reasoning_mode") not in {"deductive", "inductive"}:
        errors.append("argument.reasoning_mode must be deductive or inductive")
    key_line_claim_ids = argument.get("key_line_claim_ids")
    if not isinstance(key_line_claim_ids, list) or not key_line_claim_ids:
        errors.append("argument.key_line_claim_ids must contain at least one claim")
        key_line_claim_ids = []
    for claim_id in _duplicates(key_line_claim_ids):
        errors.append(f"argument key line repeats claim {claim_id}")

    claims = plan.get("claims")
    if not isinstance(claims, list) or not claims:
        claims = []
        errors.append("claims must contain at least one claim")
    claim_ids = [claim.get("id") for claim in claims if isinstance(claim, dict)]
    for claim_id in _duplicates(claim_ids):
        errors.append(f"duplicate claim id: {claim_id}")
    claims_by_id = {
        claim.get("id"): claim
        for claim in claims
        if isinstance(claim, dict) and claim.get("id")
    }
    if governing_claim_id and governing_claim_id not in claims_by_id:
        errors.append(f"governing answer references unknown claim {governing_claim_id!r}")

    evidence_ids = set()
    source_context = plan.get("source_context")
    if isinstance(source_context, dict):
        for group in ("inspected", "needs_verification"):
            entries = source_context.get(group, [])
            if isinstance(entries, list):
                evidence_ids.update(
                    entry.get("id") for entry in entries if isinstance(entry, dict) and entry.get("id")
                )

    support_parent = {}
    for claim_id, claim in claims_by_id.items():
        parent = claim.get("supports_claim_id")
        support_parent[claim_id] = parent
        if parent and parent not in claims_by_id:
            errors.append(f"claim {claim_id}: supports unknown claim {parent!r}")
        if claim.get("type") not in {"fact", "inference", "recommendation", "unknown"}:
            errors.append(f"claim {claim_id}: invalid type")
        if not claim.get("statement"):
            errors.append(f"claim {claim_id}: statement is required")
        if claim.get("type") in {"inference", "recommendation"} and not claim.get("rationale"):
            errors.append(f"claim {claim_id}: rationale is required")
        for evidence_id in claim.get("evidence_ids", []):
            if evidence_id not in evidence_ids:
                errors.append(f"claim {claim_id}: references unknown evidence {evidence_id!r}")

    if governing_claim_id in support_parent and support_parent[governing_claim_id] is not None:
        errors.append("governing answer claim must not support another claim")

    cycle_reported = set()
    for start in claims_by_id:
        path = []
        current = start
        while current:
            if current in path:
                cycle = tuple(path[path.index(current):] + [current])
                signature = frozenset(cycle)
                if signature not in cycle_reported:
                    errors.append("claim support cycle: " + " -> ".join(cycle))
                    cycle_reported.add(signature)
                break
            if current not in claims_by_id:
                break
            path.append(current)
            current = support_parent.get(current)

    for claim_id in claims_by_id:
        if claim_id == governing_claim_id:
            continue
        visited = set()
        current = claim_id
        while current and current not in visited and current != governing_claim_id:
            visited.add(current)
            current = support_parent.get(current)
        if current != governing_claim_id:
            errors.append(f"claim {claim_id}: does not support the governing answer")

    for claim_id in key_line_claim_ids:
        if claim_id not in claims_by_id:
            errors.append(f"argument key line references unknown claim {claim_id!r}")
        elif support_parent.get(claim_id) != governing_claim_id:
            errors.append(f"key-line claim {claim_id}: must directly support the governing answer")

    slides = plan.get("slides")
    if not isinstance(slides, list) or not slides:
        slides = []
        errors.append("slides must contain at least one slide")
    slide_ids = [slide.get("id") for slide in slides if isinstance(slide, dict)]
    for slide_id in _duplicates(slide_ids):
        errors.append(f"duplicate slide id: {slide_id}")
    slides_by_id = {
        slide.get("id"): slide
        for slide in slides
        if isinstance(slide, dict) and slide.get("id")
    }

    chapters = plan.get("chapters")
    if not isinstance(chapters, list) or not chapters:
        chapters = []
        errors.append("chapters must contain at least one chapter")
    chapter_ids = [chapter.get("id") for chapter in chapters if isinstance(chapter, dict)]
    for chapter_id in _duplicates(chapter_ids):
        errors.append(f"duplicate chapter id: {chapter_id}")
    chapters_by_id = {
        chapter.get("id"): chapter
        for chapter in chapters
        if isinstance(chapter, dict) and chapter.get("id")
    }
    chapter_main_ids = []
    chapter_for_main_id = {}
    for chapter in chapters:
        if not isinstance(chapter, dict):
            errors.append("every chapter must be a mapping")
            continue
        chapter_id = chapter.get("id") or "unknown"
        if not chapter.get("id"):
            errors.append("chapter id is required")
        if not chapter.get("title"):
            errors.append(f"chapter {chapter_id}: title is required")
        if not chapter.get("purpose"):
            errors.append(f"chapter {chapter_id}: purpose is required")
        main_slide_ids = chapter.get("main_slide_ids")
        if not isinstance(main_slide_ids, list) or not main_slide_ids:
            errors.append(f"chapter {chapter_id}: main_slide_ids must contain at least one slide")
            continue
        for main_slide_id in main_slide_ids:
            if main_slide_id in chapter_for_main_id:
                errors.append(f"main slide {main_slide_id}: belongs to more than one chapter")
            else:
                chapter_for_main_id[main_slide_id] = chapter_id
            chapter_main_ids.append(main_slide_id)

    main_slides = []
    divider_slides = []
    appendix_slides = []
    seen_appendix = False
    for slide in slides:
        if not isinstance(slide, dict):
            errors.append("every slide must be a mapping")
            continue
        slide_id = slide.get("id") or "unknown"
        section = slide.get("story_section")
        if section == "main":
            if seen_appendix:
                errors.append("appendix slides must follow all main and divider slides")
            main_slides.append(slide)
        elif section == "divider":
            if seen_appendix:
                errors.append("appendix slides must follow all main and divider slides")
            divider_slides.append(slide)
        elif section == "front_matter":
            pass
        elif section == "appendix":
            seen_appendix = True
            appendix_slides.append(slide)
        else:
            errors.append(
                f"slide {slide_id}: story_section must be front_matter, main, divider, or appendix"
            )

        if section in {"main", "appendix"}:
            claim_id = slide.get("answer_claim_id")
            claim = claims_by_id.get(claim_id)
            if not claim:
                errors.append(f"slide {slide_id}: references unknown answer claim {claim_id!r}")
            elif slide.get("action_title") != claim.get("statement"):
                errors.append(f"slide {slide_id}: action_title must equal its answer claim statement")
            for evidence_id in slide.get("evidence_ids", []):
                if evidence_id not in evidence_ids:
                    errors.append(f"slide {slide_id}: references unknown evidence {evidence_id!r}")
        elif any(
            key in slide
            for key in ("answer_claim_id", "evidence_ids", "question_in", "question_out", "concept_ids")
        ):
            errors.append(f"slide {slide_id}: navigation slides must not declare narrative fields")

    front_matter_positions = [
        index for index, slide in enumerate(slides)
        if isinstance(slide, dict) and slide.get("story_section") == "front_matter"
    ]
    front_matter_roles = [
        slides[index].get("role") for index in front_matter_positions
    ]
    if front_matter_positions != [0, 1] or front_matter_roles != ["cover", "contents"]:
        errors.append("plan must start with exactly two front matter slides: cover and contents")

    contents_slide = slides[1] if len(slides) > 1 and isinstance(slides[1], dict) else {}
    if contents_slide.get("story_section") == "front_matter" and contents_slide.get("role") == "contents":
        contents_chapter_ids = contents_slide.get("chapter_ids")
        if contents_chapter_ids != chapter_ids:
            errors.append("contents chapter_ids must exactly match chapter order")

    if not main_slides:
        errors.append("plan must contain at least one main slide")
    else:
        ordered_main_ids = [slide.get("id") for slide in main_slides]
        if chapter_main_ids != ordered_main_ids:
            errors.append("chapter main_slide_ids must exactly match main slide order")
        for slide in main_slides:
            slide_id = slide.get("id") or "unknown"
            chapter_id = slide.get("chapter_id")
            if chapter_id not in chapters_by_id:
                errors.append(f"slide {slide_id}: references unknown chapter {chapter_id!r}")
            elif chapter_for_main_id.get(slide_id) != chapter_id:
                errors.append(f"slide {slide_id}: chapter_id does not match chapter membership")

        first_question = main_slides[0].get("question_in")
        if not _question_matches(first_question, governing_question):
            errors.append("first main slide must answer the governing question")
        if main_slides[0].get("answer_claim_id") != governing_claim_id:
            errors.append("first main slide must use the governing answer claim")
        main_claim_ids = [slide.get("answer_claim_id") for slide in main_slides]
        for claim_id in _duplicates(main_claim_ids):
            errors.append(f"main story repeats answer claim {claim_id}")
        question_in_ids = []
        for index, slide in enumerate(main_slides):
            slide_id = slide.get("id") or f"main position {index + 1}"
            if not isinstance(slide.get("question_in"), dict):
                errors.append(f"slide {slide_id}: question_in is required")
            else:
                question_in_ids.append(slide["question_in"].get("id"))
            if index < len(main_slides) - 1:
                question_out = slide.get("question_out")
                next_question = main_slides[index + 1].get("question_in")
                if not _question_matches(question_out, next_question):
                    errors.append(
                        f"question handoff breaks between {slide_id} and "
                        f"{main_slides[index + 1].get('id') or index + 2}"
                    )
            elif slide.get("question_out") is not None:
                errors.append(f"slide {slide_id}: final main slide must close the question chain")
        for question_id in _duplicates(question_in_ids):
            errors.append(f"main story reuses incoming question {question_id}")

        slide_positions_by_id = {
            slide.get("id"): index
            for index, slide in enumerate(slides)
            if isinstance(slide, dict) and slide.get("id")
        }
        for index, slide in enumerate(main_slides):
            slide_id = slide.get("id") or f"main position {index + 1}"
            position = slide_positions_by_id.get(slide.get("id"), -1)
            previous = slides[position - 1] if position > 0 and isinstance(slides[position - 1], dict) else {}
            if index == 0:
                if previous.get("story_section") == "divider":
                    errors.append("first chapter must follow contents without a divider")
                continue
            previous_chapter_id = main_slides[index - 1].get("chapter_id")
            chapter_id = slide.get("chapter_id")
            if chapter_id != previous_chapter_id and previous.get("story_section") != "divider":
                errors.append(f"chapter change requires a divider before slide {slide_id}")

    for divider in divider_slides:
        divider_id = divider.get("id") or "unknown"
        position = slides.index(divider)
        next_slide = slides[position + 1] if position + 1 < len(slides) and isinstance(slides[position + 1], dict) else {}
        if divider.get("role") != "section_divider":
            errors.append(f"slide {divider_id}: divider role must be section_divider")
        chapter_id = divider.get("chapter_id")
        chapter = chapters_by_id.get(chapter_id)
        if not chapter:
            errors.append(f"slide {divider_id}: references unknown chapter {chapter_id!r}")
        else:
            if divider.get("title") != chapter.get("title"):
                errors.append(f"slide {divider_id}: title must match its chapter title")
            if divider.get("purpose") != chapter.get("purpose"):
                errors.append(f"slide {divider_id}: purpose must match its chapter purpose")
        if next_slide.get("story_section") != "main":
            errors.append(f"slide {divider_id}: divider must immediately precede a main slide")
            continue
        if divider.get("next_main_slide_id") != next_slide.get("id"):
            errors.append(f"slide {divider_id}: next_main_slide_id must match the following main slide")
        next_main_index = main_slides.index(next_slide)
        if next_main_index == 0:
            errors.append("first chapter must follow contents without a divider")
        else:
            previous_chapter_id = main_slides[next_main_index - 1].get("chapter_id")
            if next_slide.get("chapter_id") == previous_chapter_id:
                errors.append(f"slide {divider_id}: divider is only allowed at a chapter change")
        if chapter_id != next_slide.get("chapter_id"):
            errors.append(f"slide {divider_id}: chapter_id must match the following main slide")

    main_ids = {slide.get("id") for slide in main_slides if slide.get("id")}
    for slide in appendix_slides:
        slide_id = slide.get("id") or "unknown"
        references = slide.get("appendix_for_slide_ids")
        if not isinstance(references, list) or not references:
            errors.append(f"slide {slide_id}: appendix_for_slide_ids is required")
            continue
        unknown = sorted(set(references) - main_ids)
        if unknown:
            errors.append(f"slide {slide_id}: appendix references unknown main slides: {', '.join(unknown)}")

    concept_ledger = plan.get("concept_ledger")
    if not isinstance(concept_ledger, list):
        concept_ledger = []
        errors.append("concept_ledger must be a list")
    concept_ids = [concept.get("id") for concept in concept_ledger if isinstance(concept, dict)]
    for concept_id in _duplicates(concept_ids):
        errors.append(f"duplicate concept id: {concept_id}")
    concepts_by_id = {
        concept.get("id"): concept
        for concept in concept_ledger
        if isinstance(concept, dict) and concept.get("id")
    }
    slide_positions = {slide_id: index for index, slide_id in enumerate(slide_ids) if slide_id}
    introduced_by_slide = Counter()
    for concept_id, concept in concepts_by_id.items():
        status = concept.get("status")
        if status not in {"given", "introduced"}:
            errors.append(f"concept {concept_id}: status must be given or introduced")
            continue
        introduced_slide_id = concept.get("introduced_on_slide_id")
        required_question_id = concept.get("required_by_question_id")
        if status == "given":
            if introduced_slide_id is not None or required_question_id is not None:
                errors.append(f"concept {concept_id}: given concepts must not declare an introduction")
            continue
        slide = slides_by_id.get(introduced_slide_id)
        if not slide:
            errors.append(f"concept {concept_id}: introduced_on_slide_id is unknown")
            continue
        introduced_by_slide[introduced_slide_id] += 1
        if slide.get("story_section") in {"front_matter", "divider"}:
            errors.append(f"concept {concept_id}: navigation slides must not introduce concepts")
        if concept_id not in slide.get("concept_ids", []):
            errors.append(f"concept {concept_id}: introduction slide must use the concept")
        if slide.get("story_section") == "main":
            incoming_id = (slide.get("question_in") or {}).get("id")
            if required_question_id != incoming_id:
                errors.append(f"concept {concept_id}: not licensed by its incoming question")

    for slide in slides:
        if not isinstance(slide, dict):
            continue
        slide_id = slide.get("id") or "unknown"
        for concept_id in slide.get("concept_ids", []):
            concept = concepts_by_id.get(concept_id)
            if not concept:
                errors.append(f"slide {slide_id}: references unknown concept {concept_id!r}")
                continue
            intro_id = concept.get("introduced_on_slide_id")
            if intro_id and slide_positions.get(slide_id, -1) < slide_positions.get(intro_id, -1):
                errors.append(f"slide {slide_id}: uses concept {concept_id} before it is introduced")
    for slide_id, count in introduced_by_slide.items():
        slide = slides_by_id.get(slide_id, {})
        if slide.get("story_section") == "main" and count > 1:
            warnings.append(f"slide {slide_id}: introduces {count} new concepts; prefer one")

    checks = plan.get("storyline_checks")
    if not isinstance(checks, dict):
        checks = {}
        errors.append("storyline_checks must be a mapping")
    if checks.get("titles_only", {}).get("reads_as_argument") is not True:
        errors.append("titles-only check must pass")
    if checks.get("question_chain", {}).get("closed") is not True:
        errors.append("question-chain check must pass")
    if checks.get("concept_continuity", {}).get("passes") is not True:
        errors.append("concept-continuity check must pass")
    if checks.get("appendix_separation", {}).get("passes") is not True:
        errors.append("appendix-separation check must pass")
    if checks.get("chapter_navigation", {}).get("passes") is not True:
        errors.append("chapter-navigation check must pass")

    deletion = checks.get("deletion_test", {})
    indispensable = set(deletion.get("indispensable_main_slide_ids", []))
    removable = set(deletion.get("removable_main_slide_ids", []))
    if removable:
        errors.append("removable main slide detected: " + ", ".join(sorted(removable)))
    if indispensable != main_ids:
        missing = sorted(main_ids - indispensable)
        extra = sorted(indispensable - main_ids)
        detail = []
        if missing:
            detail.append("missing " + ", ".join(missing))
        if extra:
            detail.append("unknown " + ", ".join(extra))
        errors.append("deletion test must mark every main slide indispensable: " + "; ".join(detail))

    return errors, warnings


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if len(argv) != 1:
        print("Usage: validate_report_plan.py <report.plan.yaml|->", file=sys.stderr)
        return 2

    source = argv[0]
    try:
        text = sys.stdin.read() if source == "-" else Path(source).read_text(encoding="utf-8")
        plan = yaml.safe_load(text)
    except (OSError, yaml.YAMLError) as exc:
        print(f"ERROR: cannot read plan {source}: {exc}", file=sys.stderr)
        return 2

    errors, warnings = validate_plan(plan)
    for warning in warnings:
        print(f"WARN: {warning}")
    for error in errors:
        print(f"ERROR: {error}")
    if errors:
        print(f"FAIL: {len(errors)} error(s), {len(warnings)} warning(s)")
        return 1
    print(f"PASS: v0.3 report plan, {len(warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
