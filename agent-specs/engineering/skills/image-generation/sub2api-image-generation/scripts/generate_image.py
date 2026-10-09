#!/usr/bin/env python3
"""Generate one image through the configured OpenAI-compatible Sub2API endpoint."""

from __future__ import annotations

import argparse
import base64
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request


MAX_DOWNLOAD_BYTES = 32 * 1024 * 1024
IMAGE_SIGNATURES = (
    b"\x89PNG\r\n\x1a\n",
    b"\xff\xd8\xff",
    b"RIFF",
    b"GIF87a",
    b"GIF89a",
)


def load_config() -> tuple[str, str]:
    auth_path = pathlib.Path(os.environ.get("CODEX_AUTH_FILE", "~/.codex/auth.json")).expanduser()
    config_path = pathlib.Path(os.environ.get("CODEX_CONFIG_FILE", "~/.codex/config.toml")).expanduser()
    try:
        auth = json.loads(auth_path.read_text(encoding="utf-8"))
        api_key = auth.get("OPENAI_API_KEY", "")
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"could not read Codex auth file: {exc}") from exc
    if not isinstance(api_key, str) or not api_key.strip():
        raise RuntimeError("OPENAI_API_KEY is missing from the Codex auth file")

    base_url = os.environ.get("OPENAI_API_BASE", "").strip()
    if not base_url:
        try:
            text = config_path.read_text(encoding="utf-8")
        except OSError as exc:
            raise RuntimeError(f"could not read Codex config file: {exc}") from exc
        provider_match = next(
            (line.split("=", 1)[1].strip().strip('"') for line in text.splitlines()
             if line.strip().startswith("base_url") and "=" in line),
            "",
        )
        base_url = provider_match
    if not base_url:
        raise RuntimeError("provider base_url is missing from Codex config")
    return api_key.strip(), base_url.rstrip("/")


def endpoint_for(base_url: str) -> str:
    if base_url.endswith("/v1"):
        return base_url + "/images/generations"
    return base_url + "/v1/images/generations"


def safe_error(body: bytes, status: int) -> str:
    try:
        payload = json.loads(body)
        message = payload.get("error", {}).get("message")
        if isinstance(message, str) and message.strip():
            return message.strip()
    except (json.JSONDecodeError, AttributeError):
        pass
    return f"image generation request failed with HTTP {status}"


def read_limited(response: urllib.response) -> bytes:
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = response.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > MAX_DOWNLOAD_BYTES:
            raise RuntimeError("image response exceeds 32 MiB limit")
        chunks.append(chunk)
    return b"".join(chunks)


def fetch_image(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"Accept": "image/*,*/*;q=0.8"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return read_limited(response)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("prompt")
    parser.add_argument("-o", "--output", required=True, type=pathlib.Path)
    parser.add_argument("-m", "--model", default="gpt-image-2")
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--quality", default="low")
    parser.add_argument("--response-format", choices=("b64_json", "url"), default="b64_json")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        api_key, base_url = load_config()
        payload = {
            "model": args.model,
            "prompt": args.prompt,
            "size": args.size,
            "quality": args.quality,
            "response_format": args.response_format,
        }
        request = urllib.request.Request(
            endpoint_for(base_url),
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=300) as response:
            status = response.status
            body = read_limited(response)
    except urllib.error.HTTPError as exc:
        body = exc.read(1024 * 1024)
        print(f"error: {safe_error(body, exc.code)}", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError, OSError, RuntimeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    try:
        result = json.loads(body)
        item = result["data"][0]
        encoded = item.get("b64_json")
        image = base64.b64decode(encoded, validate=True) if encoded else fetch_image(item["url"])
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError,
            urllib.error.URLError, TimeoutError, OSError, RuntimeError) as exc:
        print(f"error: invalid image response: {exc}", file=sys.stderr)
        return 1

    if not image or not image.startswith(IMAGE_SIGNATURES):
        print("error: response did not contain a recognized image", file=sys.stderr)
        return 1
    output = args.output.expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(image)
    print(json.dumps({"status": status, "model": args.model, "output": str(output), "bytes": len(image)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
