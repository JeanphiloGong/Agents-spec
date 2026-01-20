import typer

from ..config import resolve_collab_root
from ..domain.models import RoleSpec
from ..use_cases.role_add import add_role


router = typer.Typer(help="role commands")


@router.command("add")
def add(
    agent_id: str = typer.Option(..., "--id"),
    root: str = typer.Option("", "--root"),
) -> None:
    collab_root = resolve_collab_root(root if root else None)
    spec = RoleSpec(agent_id=agent_id)
    add_role(collab_root, spec)
