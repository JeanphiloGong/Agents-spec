from pathlib import Path

from ..domain.models import MailMessage
from ..infra.db.models import Message
from ..infra.file_store import agent_box_path, append_block
from ..infra.sqlite.session import session_scope
from ..utils import format_relates, make_event_id, now_iso, safe_body


def _build_mail_block(
    timestamp: str,
    sender: str,
    recipient: str,
    thread: str,
    msg_type: str,
    priority: str,
    body: str,
    status: str,
    relates,
    box: str,
) -> str:
    relates_str = format_relates(relates)
    body = safe_body(body)
    if box == "inbox":
        return (
            f"- timestamp: {timestamp}\n"
            f"  from: {sender}\n"
            f"  thread: {thread}\n"
            f"  type: {msg_type}\n"
            f"  priority: {priority}\n"
            f"  body: {body}\n"
            f"  status: {status}\n"
            f"  relates: {relates_str}\n"
        )
    return (
        f"- timestamp: {timestamp}\n"
        f"  to: {recipient}\n"
        f"  thread: {thread}\n"
        f"  type: {msg_type}\n"
        f"  priority: {priority}\n"
        f"  body: {body}\n"
        f"  status: {status}\n"
        f"  relates: {relates_str}\n"
    )


def send_mail(collab_root: Path, db_path: Path, payload: MailMessage, use_db: bool = True) -> None:
    timestamp = now_iso()
    inbox_path = agent_box_path(collab_root, payload.recipient, "inbox")
    outbox_path = agent_box_path(collab_root, payload.sender, "outbox")

    inbox_block = _build_mail_block(
        timestamp,
        payload.sender,
        payload.recipient,
        payload.thread,
        payload.msg_type,
        payload.priority,
        payload.body,
        payload.status_inbox,
        payload.relates,
        "inbox",
    )
    outbox_block = _build_mail_block(
        timestamp,
        payload.sender,
        payload.recipient,
        payload.thread,
        payload.msg_type,
        payload.priority,
        payload.body,
        payload.status_outbox,
        payload.relates,
        "outbox",
    )

    append_block(inbox_path, inbox_block)
    append_block(outbox_path, outbox_block)

    if not use_db:
        return

    base = {
        "ts": timestamp,
        "actor": payload.sender,
        "target": payload.recipient,
        "thread": payload.thread,
        "msg_type": payload.msg_type,
        "priority": payload.priority,
        "body": safe_body(payload.body),
        "relates": format_relates(payload.relates),
    }
    inbox_record = dict(base, kind="mail_inbox", status=payload.status_inbox)
    outbox_record = dict(base, kind="mail_outbox", status=payload.status_outbox)
    inbox_record["id"] = make_event_id(inbox_record)
    outbox_record["id"] = make_event_id(outbox_record)

    with session_scope(db_path) as session:
        session.add(Message(**inbox_record))
        session.add(Message(**outbox_record))
