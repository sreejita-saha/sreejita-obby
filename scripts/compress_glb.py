#!/usr/bin/env python3
"""Batch-compress GLB files with the free glTF-Transform CLI.

By default models are replaced in place. Compression is written to a temporary
file first, so a source model is only replaced after a successful run.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compress every .glb below a directory using Meshopt."
    )
    parser.add_argument(
        "source",
        nargs="?",
        type=Path,
        default=Path("public/models"),
        help="directory containing source GLB files (default: public/models)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="directory for compressed copies (default: replace source files)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="replace existing files in --output",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source = args.source.resolve()
    output = args.output.resolve() if args.output else None

    if not source.is_dir():
        print(f"Source directory does not exist: {source}", file=sys.stderr)
        return 1

    # npx downloads @gltf-transform/cli automatically on first run. It is a
    # free, open-source package; no account or paid service is involved.
    npx = shutil.which("npx.cmd") or shutil.which("npx")
    if not npx:
        print("Node.js/npm is required. Install Node.js, then run this again.", file=sys.stderr)
        return 1

    models = sorted(
        path
        for path in source.rglob("*")
        if path.suffix.lower() == ".glb" and ".compressing" not in path.stem
    )
    if not models:
        print(f"No .glb files found in {source}")
        return 0

    failures = 0
    for model in models:
        destination = output / model.relative_to(source) if output else model
        if output and destination.exists() and not args.overwrite:
            print(f"Skipping existing file: {destination}")
            continue

        destination.parent.mkdir(parents=True, exist_ok=True)
        temporary = destination.with_name(f"{destination.stem}.compressing.glb")
        command = [
            npx,
            "--yes",
            "@gltf-transform/cli",
            "optimize",
            str(model),
            str(temporary),
            "--compress",
            "meshopt",
        ]
        print(f"Compressing {model.relative_to(source)}...")
        result = subprocess.run(command, check=False)
        if result.returncode:
            failures += 1
            print(f"Failed: {model}", file=sys.stderr)
            continue

        before = model.stat().st_size
        after = temporary.stat().st_size
        temporary.replace(destination)
        saved = (1 - after / before) * 100 if before else 0
        print(f"  {before / 1024:.1f} KB -> {after / 1024:.1f} KB ({saved:.1f}% saved)")

    if failures:
        print(f"Finished with {failures} failed file(s).", file=sys.stderr)
        return 1
    print(f"Done. {'Compressed copies are in: ' + str(output) if output else 'Source models were replaced.'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
