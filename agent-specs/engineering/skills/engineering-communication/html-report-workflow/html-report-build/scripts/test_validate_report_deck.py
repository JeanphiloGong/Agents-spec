import unittest

from validate_report_deck import validate_html


def valid_deck_html():
    return """<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Decision report</title>
<style>:root { --canvas-w: 1600px; --canvas-h: 900px; }</style></head>
<body>
  <div id="report-deck" data-report-schema="0.3">
    <section class="slide" id="F1" data-story-section="front_matter"
      data-front-matter-role="cover">
      <h1>Tender discovery V1</h1>
      <p class="page-number"></p>
    </section>
    <section class="slide" id="F2" data-story-section="front_matter"
      data-front-matter-role="contents" data-chapter-ids="CH1">
      <h2>Argument map</h2>
      <p class="page-number"></p>
    </section>
    <section class="slide" id="S1" data-story-section="main"
      data-chapter-id="CH1"
      data-question-in-id="Q0" data-question-out-id="Q1"
      data-claim-id="C0" data-supports-claim-id="" data-evidence-ids="E1">
      <h1>Adopt the smallest user loop before expanding the platform.</h1>
      <p>Evidence</p>
      <p class="page-number"></p>
    </section>
    <section class="slide" id="S2" data-story-section="main"
      data-chapter-id="CH1"
      data-question-in-id="Q1" data-question-out-id=""
      data-claim-id="C1" data-supports-claim-id="C0" data-evidence-ids="E2">
      <h2>The current search cannot keep executing user intent.</h2>
      <p class="page-number"></p>
    </section>
    <section class="slide" id="A1" data-story-section="appendix"
      data-appendix-for="S2" data-claim-id="C2"
      data-supports-claim-id="C1" data-evidence-ids="E3">
      <h2>The API contract preserves user isolation.</h2>
      <p class="page-number"></p>
    </section>
  </div>
  <button id="previous-slide">Previous</button>
  <button id="next-slide">Next</button>
  <button id="slide-overview">Overview</button>
  <span id="slide-counter"></span>
  <button id="print-deck">Print</button>
  <button id="fullscreen-deck">Fullscreen</button>
  <dialog id="overview-dialog"></dialog>
  <script>
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    document.documentElement.requestFullscreen();
    window.print();
  </script>
</body>
</html>"""


def two_chapter_deck_html(include_divider=True):
    html = valid_deck_html().replace('data-chapter-ids="CH1"', 'data-chapter-ids="CH1 CH2"')
    html = html.replace(
        'id="S2" data-story-section="main"\n      data-chapter-id="CH1"',
        'id="S2" data-story-section="main"\n      data-chapter-id="CH2"',
    )
    if include_divider:
        divider = """    <section class="slide" id="D2" data-story-section="divider"
      data-chapter-id="CH2" data-next-main-slide-id="S2">
      <h2>Current gap</h2>
      <p class="page-number"></p>
    </section>
"""
        html = html.replace('    <section class="slide" id="S2"', divider + '    <section class="slide" id="S2"')
    return html


class ValidateReportDeckTests(unittest.TestCase):
    def test_accepts_a_complete_deck_with_cover_and_contents(self):
        errors, warnings, slide_count = validate_html(valid_deck_html())

        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])
        self.assertEqual(slide_count, 5)

    def test_rejects_unresolved_placeholders_and_external_assets(self):
        html = valid_deck_html().replace(
            "<style>:root { --canvas-w: 1600px; --canvas-h: 900px; }</style>",
            '<link rel="stylesheet" href="https://cdn.example.com/deck.css">',
        ).replace("Decision report", "{{REPORT_TITLE}}")

        errors, _, _ = validate_html(html)

        self.assertTrue(any("unresolved placeholder" in error for error in errors))
        self.assertTrue(any("external dependency" in error for error in errors))

    def test_rejects_slide_contract_gaps(self):
        html = valid_deck_html().replace(
            'data-story-section="main"\n      data-chapter-id="CH1"\n      data-question-in-id="Q0" data-question-out-id="Q1"\n      data-claim-id="C0" data-supports-claim-id="" data-evidence-ids="E1"',
            'data-story-section="main"',
            1,
        ).replace(
            "<h1>Adopt the smallest user loop before expanding the platform.</h1>",
            "",
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("data-claim-id" in error for error in errors))
        self.assertTrue(any("question-in" in error for error in errors))
        self.assertTrue(any("action title" in error for error in errors))
        self.assertTrue(any("data-evidence-ids" in error for error in errors))

    def test_rejects_a_broken_main_question_handoff(self):
        html = valid_deck_html().replace('data-question-in-id="Q1"', 'data-question-in-id="Q9"')

        errors, _, _ = validate_html(html)

        self.assertTrue(any("question handoff" in error for error in errors))

    def test_rejects_an_appendix_inserted_before_main_story_ends(self):
        html = valid_deck_html().replace(
            'id="S2" data-story-section="main"',
            'id="S2" data-story-section="appendix" data-appendix-for="S1"',
        ).replace(
            'id="A1" data-story-section="appendix"',
            'id="A1" data-story-section="main"',
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("appendix slides must follow" in error for error in errors))

    def test_rejects_an_appendix_without_a_main_slide_reference(self):
        html = valid_deck_html().replace('data-appendix-for="S2"', 'data-appendix-for=""')

        errors, _, _ = validate_html(html)

        self.assertTrue(any("data-appendix-for" in error for error in errors))

    def test_rejects_a_non_v03_deck_contract(self):
        html = valid_deck_html().replace('data-report-schema="0.3"', 'data-report-schema="0.2"')

        errors, _, _ = validate_html(html)

        self.assertTrue(any("schema 0.3" in error for error in errors))

    def test_rejects_an_opening_claim_with_a_parent(self):
        html = valid_deck_html().replace(
            'data-claim-id="C0" data-supports-claim-id=""',
            'data-claim-id="C0" data-supports-claim-id="C1"',
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("opening main slide" in error for error in errors))

    def test_rejects_question_attributes_on_an_appendix(self):
        html = valid_deck_html().replace(
            'id="A1" data-story-section="appendix"',
            'id="A1" data-story-section="appendix" data-question-in-id="" data-question-out-id=""',
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("must not declare question" in error for error in errors))

    def test_rejects_repeated_claims_and_main_questions(self):
        html = valid_deck_html().replace('data-question-in-id="Q1"', 'data-question-in-id="Q0"').replace(
            'data-claim-id="C1"', 'data-claim-id="C0"'
        )
        html = html.replace('data-question-out-id="Q1"', 'data-question-out-id="Q0"')

        errors, _, _ = validate_html(html)

        self.assertTrue(any("duplicate data-claim-id" in error for error in errors))
        self.assertTrue(any("reuses data-question-in-id" in error for error in errors))

    def test_rejects_duplicate_ids(self):
        html = valid_deck_html().replace('id="S2"', 'id="S1"')

        errors, _, _ = validate_html(html)

        self.assertTrue(any("duplicate id" in error for error in errors))

    def test_warns_about_topic_label_titles(self):
        html = valid_deck_html().replace(
            "Adopt the smallest user loop before expanding the platform.",
            "Results",
        )

        errors, warnings, _ = validate_html(html)

        self.assertEqual(errors, [])
        self.assertTrue(any("topic label" in warning for warning in warnings))

    def test_rejects_a_missing_page_number_target(self):
        html = valid_deck_html().replace('<p class="page-number"></p>', "", 1)

        errors, _, _ = validate_html(html)

        self.assertTrue(any("page-number" in error for error in errors))

    def test_rejects_a_nonstandard_canvas(self):
        html = valid_deck_html().replace("--canvas-w: 1600px", "--canvas-w: 1440px")

        errors, _, _ = validate_html(html)

        self.assertTrue(any("1600 x 900" in error for error in errors))

    def test_rejects_a_deck_without_default_cover_and_contents(self):
        html = valid_deck_html()
        start = html.index('    <section class="slide" id="F1"')
        end = html.index('    <section class="slide" id="S1"')
        html = html[:start] + html[end:]

        errors, _, _ = validate_html(html)

        self.assertTrue(any("cover and contents" in error for error in errors))

    def test_accepts_a_divider_at_each_chapter_change(self):
        errors, warnings, slide_count = validate_html(two_chapter_deck_html())

        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])
        self.assertEqual(slide_count, 6)

    def test_rejects_a_missing_divider_at_a_chapter_change(self):
        errors, _, _ = validate_html(two_chapter_deck_html(include_divider=False))

        self.assertTrue(any("chapter change requires a divider" in error for error in errors))

    def test_rejects_contents_that_omit_a_chapter(self):
        html = two_chapter_deck_html().replace('data-chapter-ids="CH1 CH2"', 'data-chapter-ids="CH1"')

        errors, _, _ = validate_html(html)

        self.assertTrue(any("contents chapter IDs" in error for error in errors))

    def test_rejects_a_divider_before_the_first_chapter(self):
        divider = """    <section class="slide" id="D1" data-story-section="divider"
      data-chapter-id="CH1" data-next-main-slide-id="S1">
      <h2>Decision</h2>
      <p class="page-number"></p>
    </section>
"""
        html = valid_deck_html().replace(
            '    <section class="slide" id="S1"', divider + '    <section class="slide" id="S1"'
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("first chapter" in error for error in errors))

    def test_rejects_a_divider_inside_one_chapter(self):
        divider = """    <section class="slide" id="D1" data-story-section="divider"
      data-chapter-id="CH1" data-next-main-slide-id="S2">
      <h2>Current gap</h2>
      <p class="page-number"></p>
    </section>
"""
        html = valid_deck_html().replace(
            '    <section class="slide" id="S2"', divider + '    <section class="slide" id="S2"'
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("only allowed at a chapter change" in error for error in errors))

    def test_rejects_narrative_attributes_on_navigation_slides(self):
        html = valid_deck_html().replace(
            'data-front-matter-role="cover"',
            'data-front-matter-role="cover" data-evidence-ids="E1"',
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("navigation slides" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
