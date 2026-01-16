from pathlib import Path
from typing import Optional


BASE_DIR = Path(__file__).resolve().parent
COLLAB_ROOT = BASE_DIR.parent
CLI_DIR = BASE_DIR / "cli"
DB_PATH = CLI_DIR / "db" / "collab.sqlite"


def resolve_collab_root(root: Optional[str] = None) -> Path:
    return Path(root).resolve() if root else COLLAB_ROOT


def resolve_db_path(db_path: Optional[str] = None) -> Path:
    return Path(db_path).resolve() if db_path else DB_PATH
