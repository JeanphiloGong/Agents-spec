import unittest

from validate_report_plan import validate_plan


def valid_plan():
    return {
        "schema_version": "0.3",
        "skill_version": "0.3.0",
        "artifact_type": "html_report_deck",
        "report_job": {
            "topic": "Tender discovery",
            "goal": "Choose the smallest useful V1",
            "delivery_mode": "both",
        },
        "audience": {
            "primary_reader": "Product owner",
            "decision_context": "V1 scope review",
            "audience_action": "Approve the V1 boundary",
        },
        "output": {
            "directory": "/tmp",
            "filename": "report.html",
            "language": "en",
            "canvas": "1600x900",
        },
        "argument": {
            "method": "minto_pyramid",
            "governing_question": {"id": "Q0", "text": "What should V1 prove first?"},
            "governing_answer_claim_id": "C0",
            "audience_decision": "Approve the keyword loop",
            "reasoning_mode": "deductive",
            "key_line_claim_ids": ["C1"],
        },
        "source_context": {
            "inspected": [
                {
                    "id": "E1",
                    "source": "repository",
                    "location": "routes.py",
                    "supports": ["C0", "C1", "C2"],
                }
            ],
            "needs_verification": [],
        },
        "claims": [
            {
                "id": "C0",
                "type": "recommendation",
                "statement": "Adopt the smallest user loop before expanding the platform.",
                "supports_claim_id": None,
                "evidence_ids": ["E1"],
                "rationale": "It tests the user outcome with the fewest dependencies.",
            },
            {
                "id": "C1",
                "type": "fact",
                "statement": "The current search cannot keep executing user intent.",
                "supports_claim_id": "C0",
                "evidence_ids": ["E1"],
                "rationale": "",
            },
            {
                "id": "C2",
                "type": "fact",
                "statement": "The API contract preserves user isolation.",
                "supports_claim_id": "C1",
                "evidence_ids": ["E1"],
                "rationale": "",
            },
        ],
        "concept_ledger": [
            {
                "id": "K0",
                "term": "user intent",
                "status": "given",
                "introduced_on_slide_id": None,
                "required_by_question_id": None,
            },
            {
                "id": "K1",
                "term": "continuous search",
                "status": "introduced",
                "introduced_on_slide_id": "S2",
                "required_by_question_id": "Q1",
            },
        ],
        "slides": [
            {
                "id": "S1",
                "story_section": "main",
                "role": "answer",
                "question_in": {"id": "Q0", "text": "What should V1 prove first?"},
                "action_title": "Adopt the smallest user loop before expanding the platform.",
                "answer_claim_id": "C0",
                "evidence_ids": ["E1"],
                "concept_ids": ["K0"],
                "content_points": ["Prove the user outcome first."],
                "visual_role": "text-summary",
                "so_what": "Approve the smallest V1.",
                "question_out": {"id": "Q1", "text": "Why is the current flow insufficient?"},
                "source_note": "Source: E1",
            },
            {
                "id": "S2",
                "story_section": "main",
                "role": "diagnosis",
                "question_in": {"id": "Q1", "text": "Why is the current flow insufficient?"},
                "action_title": "The current search cannot keep executing user intent.",
                "answer_claim_id": "C1",
                "evidence_ids": ["E1"],
                "concept_ids": ["K0", "K1"],
                "content_points": ["Requests end without a saved rule."],
                "visual_role": "comparison",
                "so_what": "A persistent loop is required.",
                "question_out": None,
                "source_note": "Source: E1",
            },
            {
                "id": "A1",
                "story_section": "appendix",
                "role": "appendix",
                "action_title": "The API contract preserves user isolation.",
                "answer_claim_id": "C2",
                "evidence_ids": ["E1"],
                "concept_ids": [],
                "content_points": ["Identity comes from trusted context."],
                "visual_role": "table",
                "so_what": "Implementation can preserve ownership.",
                "appendix_for_slide_ids": ["S2"],
                "source_note": "Source: E1",
            },
        ],
        "storyline_checks": {
            "titles_only": {"reads_as_argument": True, "first_break": None},
            "question_chain": {"closed": True, "first_break": None},
            "deletion_test": {
                "indispensable_main_slide_ids": ["S1", "S2"],
                "removable_main_slide_ids": [],
            },
            "concept_continuity": {"passes": True, "first_unlicensed_concept": None},
            "appendix_separation": {"passes": True, "misplaced_slide_ids": []},
        },
    }


class ValidateReportPlanTests(unittest.TestCase):
    def test_accepts_a_closed_argument_plan(self):
        errors, warnings = validate_plan(valid_plan())

        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_rejects_a_requested_slide_count(self):
        plan = valid_plan()
        plan["output"]["target_slide_count"] = 12

        errors, _ = validate_plan(plan)

        self.assertTrue(any("target slide count" in error for error in errors))

    def test_rejects_a_preferred_page_count(self):
        plan = valid_plan()
        plan["output"]["preferred_page_count"] = 12

        errors, _ = validate_plan(plan)

        self.assertTrue(any("target slide count" in error for error in errors))

    def test_requires_an_audience_decision_and_key_line(self):
        plan = valid_plan()
        plan["argument"]["audience_decision"] = ""
        plan["argument"]["key_line_claim_ids"] = []

        errors, _ = validate_plan(plan)

        self.assertTrue(any("audience_decision" in error for error in errors))
        self.assertTrue(any("key_line_claim_ids" in error for error in errors))

    def test_requires_the_opening_slide_to_answer_with_the_governing_claim(self):
        plan = valid_plan()
        plan["slides"][0]["action_title"] = plan["claims"][1]["statement"]
        plan["slides"][0]["answer_claim_id"] = "C1"

        errors, _ = validate_plan(plan)

        self.assertTrue(any("governing answer claim" in error for error in errors))

    def test_rejects_a_governing_claim_with_a_parent(self):
        plan = valid_plan()
        plan["claims"].append(
            {
                "id": "C3",
                "type": "fact",
                "statement": "The governing answer cannot support another parent.",
                "supports_claim_id": "C0",
                "evidence_ids": ["E1"],
                "rationale": "",
            }
        )
        plan["claims"][0]["supports_claim_id"] = "C3"

        errors, _ = validate_plan(plan)

        self.assertTrue(any("governing answer claim must not support" in error for error in errors))

    def test_rejects_repeated_main_claims_and_questions(self):
        plan = valid_plan()
        plan["slides"][1]["answer_claim_id"] = "C0"
        plan["slides"][1]["action_title"] = plan["claims"][0]["statement"]
        plan["slides"][1]["question_in"] = plan["slides"][0]["question_in"].copy()
        plan["slides"][0]["question_out"] = plan["slides"][1]["question_in"].copy()

        errors, _ = validate_plan(plan)

        self.assertTrue(any("repeats answer claim" in error for error in errors))
        self.assertTrue(any("reuses incoming question" in error for error in errors))

    def test_rejects_a_broken_question_handoff(self):
        plan = valid_plan()
        plan["slides"][1]["question_in"] = {"id": "Q9", "text": "A new topic?"}

        errors, _ = validate_plan(plan)

        self.assertTrue(any("question handoff" in error for error in errors))

    def test_rejects_a_claim_that_does_not_reach_the_governing_answer(self):
        plan = valid_plan()
        plan["claims"][1]["supports_claim_id"] = None

        errors, _ = validate_plan(plan)

        self.assertTrue(any("does not support the governing answer" in error for error in errors))

    def test_rejects_a_claim_cycle(self):
        plan = valid_plan()
        plan["claims"][0]["supports_claim_id"] = "C1"

        errors, _ = validate_plan(plan)

        self.assertTrue(any("claim support cycle" in error for error in errors))

    def test_rejects_an_unlicensed_main_story_concept(self):
        plan = valid_plan()
        plan["concept_ledger"][1]["required_by_question_id"] = "Q9"

        errors, _ = validate_plan(plan)

        self.assertTrue(any("not licensed by its incoming question" in error for error in errors))

    def test_rejects_a_removable_main_slide(self):
        plan = valid_plan()
        plan["storyline_checks"]["deletion_test"] = {
            "indispensable_main_slide_ids": ["S1"],
            "removable_main_slide_ids": ["S2"],
        }

        errors, _ = validate_plan(plan)

        self.assertTrue(any("removable main slide" in error for error in errors))

    def test_rejects_appendix_content_inside_the_main_sequence(self):
        plan = valid_plan()
        plan["slides"][1]["story_section"] = "appendix"
        plan["slides"][1]["appendix_for_slide_ids"] = ["S1"]
        plan["slides"][2]["story_section"] = "main"
        plan["slides"][2]["question_in"] = {"id": "Q1", "text": "Why is the current flow insufficient?"}
        plan["slides"][2]["question_out"] = None

        errors, _ = validate_plan(plan)

        self.assertTrue(any("appendix slides must follow" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
