import typer

from ..config import resolve_collab_root, resolve_db_path
from ..domain.models import ChannelMessage
from ..use_cases.channel_list import list_channel
from ..use_cases.channel_send import send_channel


router = typer.Typer(help="channel commands")


@router.command("send")
def send(
    sender: str = typer.Option(..., "--from"),
    channel: str = typer.Option(..., "--channel"),
    thread: str = typer.Option("general", "--thread"),
    msg_type: str = typer.Option("request", "--type"),
    priority: str = typer.Option("P2", "--priority"),
    body: str = typer.Option(..., "--body"),
    status: str = typer.Option("open", "--status"),
    relates: list[str] = typer.Option([], "--relates"),
    root: str = typer.Option("", "--root"),
    db: str = typer.Option("", "--db"),
    no_db: bool = typer.Option(False, "--no-db"),
) -> None:
    collab_root = resolve_collab_root(root if root else None)
    db_path = resolve_db_path(db if db else None)
    payload = ChannelMessage(
        sender=sender,
        channel=channel,
        thread=thread,
        msg_type=msg_type,
        priority=priority,
        body=body,
        status=status,
        relates=relates,
    )
    send_channel(collab_root, db_path, payload, use_db=not no_db)


@router.command("list")
def list_messages(
    channel: str = typer.Option(..., "--channel"),
    last: int = typer.Option(0, "--last"),
    root: str = typer.Option("", "--root"),
) -> None:
    collab_root = resolve_collab_root(root if root else None)
    entries = list_channel(collab_root, channel, last=last)
    for entry in entries:
        print("\n".join(entry))
        print("")
