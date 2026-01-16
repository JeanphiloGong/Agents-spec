from pathlib import Path

from ..domain.models import ChannelMessage
from ..infra.db.models import Message
from ..infra.file_store import append_block, channel_path
from ..infra.sqlite.session import session_scope
from ..utils import format_relates, make_event_id, now_iso, safe_body


def _build_channel_block(
    timestamp: str,
    sender: str,
    thread: str,
    msg_type: str,
    priority: str,
    body: str,
    status: str,
    relates,
) -> str:
    relates_str = format_relates(relates)
    body = safe_body(body)
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


def send_channel(collab_root: Path, db_path: Path, payload: ChannelMessage, use_db: bool = True) -> None:
    timestamp = now_iso()
    channel_file = channel_path(collab_root, payload.channel)

    block = _build_channel_block(
        timestamp,
        payload.sender,
        payload.thread,
        payload.msg_type,
        payload.priority,
        payload.body,
        payload.status,
        payload.relates,
    )
    append_block(channel_file, block)

    if not use_db:
        return

    record = {
        "ts": timestamp,
        "kind": "channel",
        "actor": payload.sender,
        "target": str(channel_file),
        "thread": payload.thread,
        "msg_type": payload.msg_type,
        "priority": payload.priority,
        "status": payload.status,
        "body": safe_body(payload.body),
        "relates": format_relates(payload.relates),
    }
    record["id"] = make_event_id(record)

    with session_scope(db_path) as session:
        session.add(Message(**record))
