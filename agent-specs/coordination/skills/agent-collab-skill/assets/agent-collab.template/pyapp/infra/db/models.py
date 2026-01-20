from typing import Optional

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .init import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    ts: Mapped[str] = mapped_column(String(32), nullable=False)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)
    actor: Mapped[Optional[str]] = mapped_column(String(128))
    target: Mapped[Optional[str]] = mapped_column(String(256))
    thread: Mapped[Optional[str]] = mapped_column(String(128))
    msg_type: Mapped[Optional[str]] = mapped_column(String(32))
    priority: Mapped[Optional[str]] = mapped_column(String(8))
    status: Mapped[Optional[str]] = mapped_column(String(32))
    body: Mapped[Optional[str]] = mapped_column(Text)
    relates: Mapped[Optional[str]] = mapped_column(Text)
