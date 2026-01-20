import typer

from ..config import resolve_collab_root, resolve_db_path
from ..domain.models import MailMessage
from ..use_cases.mail_list import list_mail
from ..use_cases.mail_send import send_mail


router = typer.Typer(help="mail commands")


@router.command("send")
def send(
    sender: str = typer.Option(..., "--from"),
    recipient: str = typer.Option(..., "--to"),
    thread: str = typer.Option("general", "--thread"),
    msg_type: str = typer.Option("request", "--type"),
    priority: str = typer.Option("P2", "--priority"),
    body: str = typer.Option(..., "--body"),
    status_inbox: str = typer.Option("open", "--status-inbox"),
    status_outbox: str = typer.Option("sent", "--status-outbox"),
    relates: list[str] = typer.Option([], "--relates"),
    root: str = typer.Option("", "--root"),
    db: str = typer.Option("", "--db"),
    no_db: bool = typer.Option(False, "--no-db"),
) -> None:
    collab_root = resolve_collab_root(root if root else None)
    db_path = resolve_db_path(db if db else None)
    payload = MailMessage(
        sender=sender,
        recipient=recipient,
        thread=thread,
        msg_type=msg_type,
        priority=priority,
        body=body,
        status_inbox=status_inbox,
        status_outbox=status_outbox,
        relates=relates,
    )
    send_mail(collab_root, db_path, payload, use_db=not no_db)


@router.command("list")
def list_messages(
    agent_id: str = typer.Option(..., "--agent"),
    status: str = typer.Option("open", "--status"),
    last: int = typer.Option(0, "--last"),
    root: str = typer.Option("", "--root"),
) -> None:
    collab_root = resolve_collab_root(root if root else None)
    entries = list_mail(collab_root, agent_id, status=status, last=last)
    for entry in entries:
        print("\n".join(entry))
        print("")
