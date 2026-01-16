from pathlib import Path
from typing import Iterable, List

from ..domain.models import LogEntry
from ..infra.file_store import agent_log_path, append_block
from ..utils import today_str


def _format_line(label: str, items: Iterable[str]) -> str:
    values: List[str] = [item for item in items if item]
    if not values:
        return f"- {label}:"
    if len(values) == 1:
        return f"- {label}: {values[0]}"
    return f"- {label}: " + "; ".join(values)


def add_log(collab_root: Path, entry: LogEntry) -> None:
    log_file = agent_log_path(collab_root, entry.agent_id)
    date = entry.date or today_str()

    block = (
        f"## {date}\n"
        f"{_format_line('Done', entry.done)}\n"
        f"{_format_line('In progress', entry.in_progress)}\n"
        f"{_format_line('Next', entry.next_steps)}\n"
        f"{_format_line('Blockers', entry.blockers)}\n"
    )

    append_block(log_file, block)
