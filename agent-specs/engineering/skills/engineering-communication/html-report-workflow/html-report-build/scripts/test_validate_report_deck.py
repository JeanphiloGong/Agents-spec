import unittest

from validate_report_deck import validate_html


def valid_deck_html():
    return """<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Decision report</title>
<style>:root { --canvas-w: 1600px; --canvas-h: 900px; }</style></head>
<body>
  <div id="report-deck">
    <section class="slide" id="S1" data-claim-id="C1" data-evidence-ids="E1">
      <h1>The evidence supports one immediate decision.</h1>
      <p>Evidence</p>
      <p class="source-note">Source: E1</p>
      <p class="page-number"></p>
    </section>
    <section class="slide" id="S2" data-claim-id="C2" data-evidence-ids="">
      <h2>The remaining uncertainty requires one follow-up check.</h2>
      <p class="source-note">Unverified: owner confirmation is pending.</p>
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


class ValidateReportDeckTests(unittest.TestCase):
    def test_accepts_a_complete_self_contained_deck(self):
        errors, warnings, slide_count = validate_html(valid_deck_html())

        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])
        self.assertEqual(slide_count, 2)

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
            '<section class="slide" id="S1" data-claim-id="C1" data-evidence-ids="E1">',
            '<section class="slide" id="S1">',
        ).replace(
            "<h1>The evidence supports one immediate decision.</h1>",
            "",
        ).replace(
            '<p class="source-note">Source: E1</p>',
            "",
        )

        errors, _, _ = validate_html(html)

        self.assertTrue(any("data-claim-id" in error for error in errors))
        self.assertTrue(any("action title" in error for error in errors))
        self.assertTrue(any("source note" in error for error in errors))

    def test_rejects_duplicate_ids(self):
        html = valid_deck_html().replace('id="S2"', 'id="S1"')

        errors, _, _ = validate_html(html)

        self.assertTrue(any("duplicate id" in error for error in errors))

    def test_warns_about_topic_label_titles(self):
        html = valid_deck_html().replace(
            "The evidence supports one immediate decision.",
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


if __name__ == "__main__":
    unittest.main()
