from pathlib import Path
from typing import List

from ..infra.file_store import channel_path, read_entries


def list_channel(collab_root: Path, channel: str, last: int = 0) -> List[List[str]]:
    channel_file = channel_path(collab_root, channel)
    entries = read_entries(channel_file)

    if last and last > 0:
        return entries[-last:]
    return entries
