from pathlib import Path
from typing import List, Optional

from ..infra.file_store import agent_box_path, parse_entry, read_entries


def list_mail(
    collab_root: Path, agent_id: str, status: Optional[str] = None, last: int = 0
) -> List[List[str]]:
    inbox_path = agent_box_path(collab_root, agent_id, "inbox")
    entries = read_entries(inbox_path)

    if status:
        filtered = []
        for entry in entries:
            data = parse_entry(entry)
            if data.get("status") == status:
                filtered.append(entry)
        entries = filtered

    if last and last > 0:
        return entries[-last:]
    return entries
