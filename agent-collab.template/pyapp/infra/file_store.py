from pathlib import Path
from typing import Dict, Iterable, List


def append_block(path: Path, block: str) -> None:
    if not path.exists():
        raise FileNotFoundError(path)

    needs_newline = True
    with path.open("rb") as handle:
        handle.seek(0, 2)
        if handle.tell() == 0:
            needs_newline = False
        else:
            handle.seek(-1, 2)
            needs_newline = handle.read(1) != b"\n"

    with path.open("a", encoding="utf-8") as handle:
        if needs_newline:
            handle.write("\n")
        handle.write(block)
        if not block.endswith("\n"):
            handle.write("\n")


def agent_box_path(root: Path, agent_id: str, box: str) -> Path:
    return root / "agents" / Path(agent_id) / f"{box}.md"


def agent_log_path(root: Path, agent_id: str) -> Path:
    return root / "agents" / Path(agent_id) / "log.md"


def channel_path(root: Path, channel: str) -> Path:
    candidate = Path(channel)
    if candidate.suffix == ".md" or "/" in channel or "\\" in channel:
        return (root / candidate).resolve() if not candidate.is_absolute() else candidate
    return root / "channels" / f"{channel}.md"


def role_template_dir(root: Path) -> Path:
    return root / "templates" / "role"


def read_entries(path: Path) -> List[List[str]]:
    if not path.exists():
        raise FileNotFoundError(path)

    lines = path.read_text(encoding="utf-8").splitlines()
    entries: List[List[str]] = []
    current: List[str] = []
    for line in lines:
        if line.startswith("- timestamp: "):
            if current:
                entries.append(current)
            current = [line]
        elif current:
            current.append(line)
    if current:
        entries.append(current)
    return entries


def parse_entry(entry: Iterable[str]) -> Dict[str, str]:
    data: Dict[str, str] = {}
    for line in entry:
        line = line.strip()
        if line.startswith("- "):
            line = line[2:]
        if ": " in line:
            key, value = line.split(": ", 1)
            data[key] = value
    return data
