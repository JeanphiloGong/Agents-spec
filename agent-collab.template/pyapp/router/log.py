import typer

from ..config import resolve_collab_root
from ..domain.models import LogEntry
from ..use_cases.log_add import add_log


router = typer.Typer(help="log commands")


@router.command("add")
def add(
    agent_id: str = typer.Option(..., "--agent"),
    date: str = typer.Option("", "--date"),
    done: list[str] = typer.Option([], "--done"),
    in_progress: list[str] = typer.Option([], "--in-progress"),
    next_steps: list[str] = typer.Option([], "--next"),
    blockers: list[str] = typer.Option([], "--blockers"),
    root: str = typer.Option("", "--root"),
) -> None:
    collab_root = resolve_collab_root(root if root else None)
    entry = LogEntry(
        agent_id=agent_id,
        date=date if date else None,
        done=done,
        in_progress=in_progress,
        next_steps=next_steps,
        blockers=blockers,
    )
    add_log(collab_root, entry)
