from dataclasses import dataclass
from typing import Iterable, Optional


@dataclass(frozen=True)
class RoleSpec:
    agent_id: str


@dataclass(frozen=True)
class MailMessage:
    sender: str
    recipient: str
    thread: str
    msg_type: str
    priority: str
    body: str
    status_inbox: str
    status_outbox: str
    relates: Iterable[str]


@dataclass(frozen=True)
class ChannelMessage:
    sender: str
    channel: str
    thread: str
    msg_type: str
    priority: str
    body: str
    status: str
    relates: Iterable[str]


@dataclass(frozen=True)
class LogEntry:
    agent_id: str
    date: Optional[str]
    done: Iterable[str]
    in_progress: Iterable[str]
    next_steps: Iterable[str]
    blockers: Iterable[str]
