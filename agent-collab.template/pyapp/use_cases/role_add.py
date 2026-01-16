from pathlib import Path

from ..domain.models import RoleSpec
from ..infra.file_store import role_template_dir


def add_role(collab_root: Path, spec: RoleSpec) -> None:
    template_dir = role_template_dir(collab_root)
    if not template_dir.exists():
        raise FileNotFoundError(template_dir)

    target_dir = collab_root / "agents" / Path(spec.agent_id)
    if target_dir.exists():
        raise FileExistsError(target_dir)

    target_dir.mkdir(parents=True)
    for template_file in sorted(template_dir.iterdir()):
        if not template_file.is_file():
            continue
        content = template_file.read_text(encoding="utf-8")
        content = content.replace("ai/<dept>/rep-01", spec.agent_id)
        (target_dir / template_file.name).write_text(content, encoding="utf-8")
