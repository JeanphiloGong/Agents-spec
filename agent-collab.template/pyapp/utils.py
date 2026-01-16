import hashlib
import json
from datetime import datetime
from typing import Iterable


def now_iso() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def today_str() -> str:
    return datetime.now().astimezone().date().isoformat()


def safe_body(body: str) -> str:
    return body.replace("\n", "\\n")


def format_relates(relates: Iterable[str]) -> str:
    return json.dumps(list(relates), ensure_ascii=True)


def make_event_id(record: dict) -> str:
    payload = json.dumps(record, sort_keys=True, ensure_ascii=True)
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()
