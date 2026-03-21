#!/usr/bin/env python3
import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List


SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_ROOT = SCRIPT_DIR.parent
ASSET_ROOT = SKILL_ROOT / "assets" / "project-role-bootstrap.template"

SCIENCE_KEYWORDS = {
    "ablation",
    "benchmark",
    "evaluation",
    "experiment",
    "hypothesis",
    "lab",
    "lens",
    "optics",
    "paper",
    "research",
    "simulation",
    "study",
}

RISK_KEYWORDS = {
    "auth": "authentication",
    "billing": "billing",
    "compliance": "compliance",
    "deployment": "deployment",
    "fintech": "payments",
    "health": "regulated-data",
    "medical": "regulated-data",
    "payment": "payments",
    "payments": "payments",
    "personal data": "privacy",
    "pii": "privacy",
    "privacy": "privacy",
    "prod": "production",
    "production": "production",
    "secret": "secret-handling",
    "security": "security",
}

STACK_FILE_HINTS = {
    "go.mod": "go",
    "package.json": "node",
    "pnpm-lock.yaml": "pnpm",
    "bun.lock": "bun",
    "bun.lockb": "bun",
    "pyproject.toml": "python",
    "requirements.txt": "python",
    "Cargo.toml": "rust",
    "Gemfile": "ruby",
    "pom.xml": "java",
    "build.gradle": "java",
    "build.gradle.kts": "kotlin",
    "deno.json": "deno",
    "deno.jsonc": "deno",
}

STACK_KEYWORDS = {
    "go": "go",
    "golang": "go",
    "svelte": "svelte",
    "react": "react",
    "next.js": "nextjs",
    "nextjs": "nextjs",
    "python": "python",
    "fastapi": "fastapi",
    "django": "django",
    "flask": "flask",
    "typescript": "typescript",
    "node": "node",
    "postgres": "postgres",
    "mysql": "mysql",
    "redis": "redis",
    "docker": "docker",
}

ROLE_ORDER = ["coordinator", "engineer", "advisor"]
SKILL_VERSION = "v0.1.0"


@dataclass(frozen=True)
class RenderResult:
    relative_path: str
    status: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Bootstrap a companion project hub with coordinator, engineer, and advisor "
            "workspaces beside an existing repository."
        )
    )
    parser.add_argument("--repo-root", required=True, help="Path to the canonical local repository")
    parser.add_argument("--project-brief", required=True, help="Short project description")
    parser.add_argument("--project-name", help="Human-readable project name")
    parser.add_argument("--target-root", help="Companion root to create")
    parser.add_argument(
        "--extra-role",
        action="append",
        dest="extra_roles",
        default=[],
        help="Optional additional role slug; repeatable",
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    return parser.parse_args()


def slugify(value: str) -> str:
    lowered = value.strip().lower()
    lowered = re.sub(r"[^a-z0-9]+", "-", lowered)
    lowered = lowered.strip("-")
    return lowered or "project"


def titleize_slug(value: str) -> str:
    return " ".join(part.capitalize() for part in value.split("-") if part)


def load_templates() -> List[Path]:
    return sorted(path for path in ASSET_ROOT.rglob("*") if path.is_file())


def ensure_git_repo(repo_root: Path) -> Path:
    if not repo_root.exists() or not repo_root.is_dir():
        raise ValueError(f"repo_root does not exist or is not a directory: {repo_root}")

    try:
        result = subprocess.run(
            ["git", "-C", str(repo_root), "rev-parse", "--show-toplevel"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as exc:
        raise ValueError(f"repo_root is not a git repository: {repo_root}") from exc

    return Path(result.stdout.strip()).resolve()


def ensure_external_target(repo_root: Path, target_root: Path) -> None:
    repo_root = repo_root.resolve()
    target_root = target_root.resolve()
    if target_root == repo_root:
        raise ValueError("target_root must not equal repo_root")
    if repo_root in target_root.parents:
        raise ValueError("target_root must be outside repo_root")


def detect_stack(repo_root: Path, brief: str) -> List[str]:
    stacks = set()
    for name, tag in STACK_FILE_HINTS.items():
        if (repo_root / name).exists():
            stacks.add(tag)
    lowered_brief = brief.lower()
    for keyword, tag in STACK_KEYWORDS.items():
        if keyword in lowered_brief:
            stacks.add(tag)
    return sorted(stacks)


def detect_advisor_flavor(brief: str) -> str:
    lowered_brief = brief.lower()
    for keyword in SCIENCE_KEYWORDS:
        if keyword in lowered_brief:
            return "science-advisor"
    return "advisor"


def detect_risks(repo_root: Path, brief: str) -> List[str]:
    lowered = brief.lower()
    risks = set()
    for keyword, label in RISK_KEYWORDS.items():
        if keyword in lowered:
            risks.add(label)

    for name in ("Dockerfile", "docker-compose.yml", "docker-compose.yaml"):
        if (repo_root / name).exists():
            risks.add("deployment")
    for name in (".github", ".gitlab-ci.yml", ".circleci"):
        if (repo_root / name).exists():
            risks.add("ci-cd")
    return sorted(risks)


def summarize_workflow(stack_tags: List[str], advisor_flavor: str) -> str:
    stack_part = ", ".join(stack_tags) if stack_tags else "the repository stack"
    advisor_part = "science review" if advisor_flavor == "science-advisor" else "assumption review"
    return (
        f"Coordinate delivery in the hub, implement code in isolated worktrees against {stack_part}, "
        f"and use the advisor workspace for {advisor_part} before landing major decisions."
    )


def relative_path(from_path: Path, to_path: Path) -> str:
    return os.path.relpath(to_path, start=from_path)


def build_context(
    repo_root: Path,
    target_root: Path,
    project_name: str,
    project_brief: str,
    extra_roles: Iterable[str],
) -> Dict[str, str]:
    project_slug = slugify(project_name)
    repo_name = repo_root.name
    stack_tags = detect_stack(repo_root, project_brief)
    advisor_flavor = detect_advisor_flavor(project_brief)
    advisor_label = "Science Advisor" if advisor_flavor == "science-advisor" else "Advisor"
    risk_signals = detect_risks(repo_root, project_brief)
    workflow_summary = summarize_workflow(stack_tags, advisor_flavor)
    repo_relative_from_hub = relative_path(target_root, repo_root)
    engineer_repo_relative = relative_path(target_root / "roles" / "engineer" / "repos", repo_root)
    shared_relative_from_role = relative_path(target_root / "roles" / "coordinator", target_root / "shared")
    coordinator_extra_roles = ", ".join(extra_roles) if extra_roles else "none"

    return {
        "PROJECT_NAME": project_name,
        "PROJECT_SLUG": project_slug,
        "PROJECT_BRIEF": project_brief.strip(),
        "REPO_NAME": repo_name,
        "REPO_RELATIVE_FROM_HUB": repo_relative_from_hub,
        "ENGINEER_REPO_RELATIVE": engineer_repo_relative,
        "STACK_SUMMARY": ", ".join(stack_tags) if stack_tags else "unknown",
        "STACK_BULLETS": "\n".join(f"- {tag}" for tag in stack_tags) if stack_tags else "- unknown",
        "RISK_SUMMARY": ", ".join(risk_signals) if risk_signals else "none detected",
        "RISK_BULLETS": "\n".join(f"- {risk}" for risk in risk_signals) if risk_signals else "- none detected",
        "WORKFLOW_SUMMARY": workflow_summary,
        "ADVISOR_FLAVOR": advisor_flavor,
        "ADVISOR_LABEL": advisor_label,
        "ADVISOR_FOCUS": (
            "validate scientific assumptions, experiment design, evaluation quality, and evidence strength"
            if advisor_flavor == "science-advisor"
            else "challenge assumptions, test decision quality, and surface missing evidence"
        ),
        "ADVISOR_NON_GOALS": (
            "owning production code changes or replacing experimental evidence with intuition"
            if advisor_flavor == "science-advisor"
            else "owning production code changes or making unsupported product commitments"
        ),
        "SHARED_RELATIVE_FROM_ROLE": shared_relative_from_role,
        "COORDINATOR_EXTRA_ROLES": coordinator_extra_roles,
    }


def render_template(text: str, context: Dict[str, str]) -> str:
    rendered = text
    for key, value in context.items():
        rendered = rendered.replace(f"{{{{{key}}}}}", value)
    return rendered


def target_path_for_template(target_root: Path, template_path: Path) -> Path:
    relative = template_path.relative_to(ASSET_ROOT)
    destination = target_root / relative
    if destination.name.endswith(".template.md"):
        destination = destination.with_name(destination.name.replace(".template.md", ".md"))
    return destination


def write_if_needed(path: Path, content: str, dry_run: bool, allow_update: bool = False) -> str:
    if path.exists():
        existing = path.read_text(encoding="utf-8")
        if existing == content:
            return "unchanged"
        if allow_update:
            if not dry_run:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8")
            return "updated"
        return "conflict"

    if not dry_run:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    return "created"


def ensure_directory(path: Path, dry_run: bool) -> None:
    if dry_run:
        return
    path.mkdir(parents=True, exist_ok=True)


def render_role_templates(
    target_root: Path,
    context: Dict[str, str],
    dry_run: bool,
) -> List[RenderResult]:
    results: List[RenderResult] = []
    for template_path in load_templates():
        if "/roles/generic/" in template_path.as_posix():
            continue
        destination = target_path_for_template(target_root, template_path)
        text = template_path.read_text(encoding="utf-8")
        rendered = render_template(text, context)
        status = write_if_needed(destination, rendered, dry_run)
        results.append(RenderResult(relative_path(target_root, destination), status))
    return results


def render_generic_role(
    target_root: Path,
    role_slug: str,
    project_name: str,
    shared_relative_from_role: str,
    dry_run: bool,
) -> List[RenderResult]:
    role_title = titleize_slug(role_slug)
    generic_dir = ASSET_ROOT / "roles" / "generic"
    role_context = {
        "GENERIC_ROLE_SLUG": role_slug,
        "GENERIC_ROLE_TITLE": role_title,
        "PROJECT_NAME": project_name,
        "GENERIC_SHARED_RELATIVE": shared_relative_from_role,
    }
    results: List[RenderResult] = []
    for template_path in sorted(generic_dir.glob("*.template.md")):
        destination = target_root / "roles" / role_slug / template_path.name.replace(".template.md", ".md")
        rendered = render_template(template_path.read_text(encoding="utf-8"), role_context)
        status = write_if_needed(destination, rendered, dry_run)
        results.append(RenderResult(relative_path(target_root, destination), status))
    return results


def build_manifest(
    repo_root: Path,
    target_root: Path,
    project_name: str,
    project_brief: str,
    extra_roles: List[str],
    render_results: List[RenderResult],
    context: Dict[str, str],
) -> Dict[str, object]:
    created = [item.relative_path for item in render_results if item.status == "created"]
    unchanged = [item.relative_path for item in render_results if item.status == "unchanged"]
    updated = [item.relative_path for item in render_results if item.status == "updated"]
    conflicts = [item.relative_path for item in render_results if item.status == "conflict"]
    roles = ROLE_ORDER + extra_roles
    stack_tags = [item.strip() for item in context["STACK_SUMMARY"].split(",") if item.strip() and item.strip() != "unknown"]
    risk_signals = [item.strip() for item in context["RISK_SUMMARY"].split(",") if item.strip() and item.strip() != "none detected"]

    return {
        "skill": "project-role-bootstrap-skill",
        "skill_version": SKILL_VERSION,
        "project_name": project_name,
        "project_brief": project_brief.strip(),
        "repo_root": str(repo_root),
        "target_root": str(target_root),
        "repo_relative_from_hub": context["REPO_RELATIVE_FROM_HUB"],
        "role_strategy": "core-3",
        "roles": roles,
        "extra_roles": extra_roles,
        "advisor_flavor": context["ADVISOR_FLAVOR"],
        "stack_tags": stack_tags,
        "risk_signals": risk_signals,
        "workflow_summary": context["WORKFLOW_SUMMARY"],
        "created": created,
        "unchanged": unchanged,
        "updated": updated,
        "conflicts": conflicts,
    }


def write_manifest(target_root: Path, manifest: Dict[str, object], dry_run: bool) -> RenderResult:
    destination = target_root / "bootstrap-manifest.json"
    content = json.dumps(manifest, indent=2, ensure_ascii=True) + "\n"
    status = write_if_needed(destination, content, dry_run, allow_update=True)
    return RenderResult(relative_path(target_root, destination), status)


def format_text_summary(manifest: Dict[str, object]) -> str:
    created = manifest["created"]
    unchanged = manifest["unchanged"]
    updated = manifest["updated"]
    conflicts = manifest["conflicts"]
    lines = [
        "## Bootstrap Intent",
        f"- project_name: {manifest['project_name']}",
        f"- repo_root: {manifest['repo_root']}",
        f"- target_root: {manifest['target_root']}",
        "",
        "## Inferred Profile",
        f"- advisor_flavor: {manifest['advisor_flavor']}",
        f"- stack_tags: {', '.join(manifest['stack_tags']) or 'unknown'}",
        f"- risk_signals: {', '.join(manifest['risk_signals']) or 'none detected'}",
        "",
        "## Target Layout",
        f"- roles: {', '.join(manifest['roles'])}",
        f"- repo_relative_from_hub: {manifest['repo_relative_from_hub']}",
        "",
        "## Files Created",
    ]
    lines.extend([f"- {item}" for item in created] or ["- none"])
    lines.extend(["", "## Files Unchanged"])
    lines.extend([f"- {item}" for item in unchanged] or ["- none"])
    lines.extend(["", "## Files Updated"])
    lines.extend([f"- {item}" for item in updated] or ["- none"])
    lines.extend(["", "## Conflicts / Skipped"])
    lines.extend([f"- {item}" for item in conflicts] or ["- none"])
    lines.extend(
        [
            "",
            "## Verification",
            "- repo remains canonical and external to the hub",
            "- companion root is outside the repository",
            "- engineer workspace includes repos/ and worktrees/",
            "",
            "## Next Actions",
            "- customize role instructions where project-specific nuance matters",
            "- use the worktree bootstrap skill before engineer code changes",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    args = parse_args()
    repo_root = ensure_git_repo(Path(args.repo_root).expanduser())
    repo_name = repo_root.name
    project_name = args.project_name.strip() if args.project_name else titleize_slug(slugify(repo_name))
    target_root = (
        Path(args.target_root).expanduser().resolve()
        if args.target_root
        else (repo_root.parent / f"{repo_name}-hub").resolve()
    )
    ensure_external_target(repo_root, target_root)

    extra_roles = []
    seen = set(ROLE_ORDER)
    for raw_role in args.extra_roles:
        role = slugify(raw_role)
        if role in seen:
            continue
        seen.add(role)
        extra_roles.append(role)

    context = build_context(repo_root, target_root, project_name, args.project_brief, extra_roles)
    render_results = render_role_templates(target_root, context, args.dry_run)

    for role in ROLE_ORDER + extra_roles:
        ensure_directory(target_root / "roles" / role / "memory", args.dry_run)
    ensure_directory(target_root / "roles" / "engineer" / "repos", args.dry_run)
    ensure_directory(target_root / "roles" / "engineer" / "worktrees", args.dry_run)

    if extra_roles:
        for role in extra_roles:
            render_results.extend(
                render_generic_role(
                    target_root,
                    role,
                    project_name,
                    relative_path(target_root / "roles" / role, target_root / "shared"),
                    args.dry_run,
                )
            )

    manifest = build_manifest(
        repo_root=repo_root,
        target_root=target_root,
        project_name=project_name,
        project_brief=args.project_brief,
        extra_roles=extra_roles,
        render_results=render_results,
        context=context,
    )
    manifest_result = write_manifest(target_root, manifest, args.dry_run)
    render_results.append(manifest_result)
    manifest = build_manifest(
        repo_root=repo_root,
        target_root=target_root,
        project_name=project_name,
        project_brief=args.project_brief,
        extra_roles=extra_roles,
        render_results=render_results,
        context=context,
    )

    if args.json:
        print(json.dumps(manifest, indent=2, ensure_ascii=True))
    else:
        print(format_text_summary(manifest))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
