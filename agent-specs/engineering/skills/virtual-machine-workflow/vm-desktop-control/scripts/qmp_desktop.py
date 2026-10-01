#!/usr/bin/env python3
"""Inspect and operate a QEMU desktop through its private QMP Unix socket."""

import argparse
import json
import os
from pathlib import Path
import socket
import struct
import sys
import time


class QMP:
    def __init__(self, path):
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(10)
        self.stream = None
        self.request_id = 0
        try:
            self.sock.connect(str(path))
            self.stream = self.sock.makefile("rwb")
            greeting = self.read()
            if "QMP" not in greeting:
                raise RuntimeError("The socket did not return a QMP greeting")
            self.execute("qmp_capabilities")
        except Exception:
            self.close()
            raise

    def read(self):
        line = self.stream.readline()
        if not line:
            raise RuntimeError("QMP connection closed")
        return json.loads(line)

    def execute(self, command, arguments=None):
        self.request_id += 1
        request = {"execute": command, "id": self.request_id}
        if arguments is not None:
            request["arguments"] = arguments
        self.stream.write((json.dumps(request) + "\n").encode())
        self.stream.flush()
        while True:
            reply = self.read()
            if reply.get("id") != self.request_id:
                continue
            if "error" in reply:
                raise RuntimeError(reply["error"].get("desc", str(reply["error"])))
            return reply["return"]

    def close(self):
        if self.stream is not None:
            self.stream.close()
        self.sock.close()


def ascii_keys(text):
    mapping = dict(zip(
        " -=[]\\;',./`\n\t",
        ["spc", "minus", "equal", "bracket_left", "bracket_right", "backslash",
         "semicolon", "apostrophe", "comma", "dot", "slash", "grave_accent",
         "ret", "tab"],
    ))
    shifted = dict(zip('!@#$%^&*()_+{}|:"<>?~', '1234567890-=[]\\;\',./`'))
    if any(not (c.isascii() and (c.isalnum() or c in mapping or c in shifted)) for c in text):
        raise ValueError("Only supported US-layout ASCII characters can be typed")
    result = []
    for char in text:
        base = shifted.get(char, char.lower())
        result.append((["shift"] if char.isupper() or char in shifted else [])
                      + [mapping.get(base, base)])
    return result


def send_key(qmp, keys):
    qmp.execute("send-key", {
        "keys": [{"type": "qcode", "data": key} for key in keys],
        "hold-time": 80,
    })
    time.sleep(0.18)


def position(x, y, width, height):
    if not (width > 1 and height > 1 and 0 <= x < width and 0 <= y < height):
        raise ValueError("Coordinates must lie within the actual screenshot dimensions")
    return [
        {"type": "abs", "data": {"axis": axis, "value": value}}
        for axis, value in (("x", round(x * 32767 / (width - 1))),
                            ("y", round(y * 32767 / (height - 1))))
    ]


def button(qmp, name, down):
    qmp.execute("input-send-event", {
        "events": [{"type": "btn", "data": {"button": name, "down": down}}],
    })


def main():
    runtime = Path(os.environ.get("XDG_RUNTIME_DIR", f"/run/user/{os.getuid()}"))
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--socket", default=os.environ.get("QMP_SOCKET", str(runtime / "windows11/qmp.sock")))
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("status")
    screenshot = sub.add_parser("screenshot")
    screenshot.add_argument("path", help="PNG output path on the QEMU host")
    key = sub.add_parser("key")
    key.add_argument("keys", help="QEMU qcodes joined by '+', e.g. meta_l+r")
    typing = sub.add_parser("type", help="US-layout ASCII from stdin or a file")
    typing.add_argument("--text-file")
    for name in ("move", "click", "drag"):
        mouse = sub.add_parser(name)
        coordinates = ("x1", "y1", "x2", "y2") if name == "drag" else ("x", "y")
        for coordinate in (*coordinates, "width", "height"):
            mouse.add_argument(coordinate, type=int)
        if name != "move":
            mouse.add_argument("--button", choices=("left", "right", "middle"), default="left")
        if name == "drag":
            mouse.add_argument("--duration", type=float, default=1.0)
    scroll = sub.add_parser("scroll")
    scroll.add_argument("direction", choices=("up", "down"))
    scroll.add_argument("steps", type=int, nargs="?", default=1)
    args = parser.parse_args()

    try:
        # Validate all input before any key or mouse events reach the guest.
        if args.command == "type":
            text = Path(args.text_file).read_text(encoding="utf-8") if args.text_file else sys.stdin.read()
            typed_keys = ascii_keys(text)
        elif args.command in ("move", "click"):
            events = position(args.x, args.y, args.width, args.height)
        elif args.command == "drag":
            events = position(args.x1, args.y1, args.width, args.height)
            position(args.x2, args.y2, args.width, args.height)
            if not 0 < args.duration <= 10:
                raise ValueError("Drag duration must be greater than zero and at most 10 seconds")
        elif args.command == "scroll" and not 1 <= args.steps <= 100:
            raise ValueError("Scroll steps must be between 1 and 100")
        elif args.command == "screenshot":
            output = Path(args.path).resolve()
            if output.suffix.lower() != ".png":
                raise ValueError("Screenshot output must have a .png extension")
            if not output.parent.is_dir():
                raise ValueError("Screenshot parent directory does not exist")

        qmp = QMP(args.socket)
        try:
            if args.command == "status":
                print(json.dumps(qmp.execute("query-status")))
            elif args.command == "screenshot":
                qmp.execute("screendump", {"filename": str(output), "format": "png"})
                with output.open("rb") as stream:
                    header = stream.read(24)
                if header[:8] != b"\x89PNG\r\n\x1a\n" or len(header) != 24:
                    raise RuntimeError("QEMU did not produce a PNG screenshot")
                width, height = struct.unpack(">II", header[16:24])
                print(json.dumps({"path": str(output), "width": width, "height": height}))
            elif args.command == "key":
                send_key(qmp, args.keys.split("+"))
            elif args.command == "type":
                for keys in typed_keys:
                    send_key(qmp, keys)
            elif args.command in ("move", "click", "drag"):
                qmp.execute("input-send-event", {"events": events})
                time.sleep(0.25)
                if args.command != "move":
                    button(qmp, args.button, True)
                    try:
                        if args.command == "drag":
                            steps = max(2, round(args.duration * 30))
                            for i in range(1, steps + 1):
                                x = round(args.x1 + (args.x2 - args.x1) * i / steps)
                                y = round(args.y1 + (args.y2 - args.y1) * i / steps)
                                qmp.execute("input-send-event", {"events": position(x, y, args.width, args.height)})
                                time.sleep(args.duration / steps)
                        else:
                            time.sleep(0.12)
                    finally:
                        button(qmp, args.button, False)
            elif args.command == "scroll":
                for _ in range(args.steps):
                    button(qmp, "wheel-" + args.direction, True)
                    button(qmp, "wheel-" + args.direction, False)
                    time.sleep(0.15)
        finally:
            qmp.close()
    except (OSError, RuntimeError, ValueError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
