#!/usr/bin/env python3
"""Losslessly optimize PNG images in place.

Requires Pillow: python -m pip install Pillow
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow is required. Install it with: python -m pip install Pillow", file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    parser = argparse.ArgumentParser(description="Losslessly compress PNG images in place.")
    parser.add_argument(
        "paths",
        nargs="*",
        type=Path,
        default=[Path("public/images"), Path("src/assets")],
        help="files or directories to optimize (default: public/images src/assets)",
    )
    args = parser.parse_args()

    images: set[Path] = set()
    for path in args.paths:
        if path.is_file() and path.suffix.lower() == ".png":
            images.add(path)
        elif path.is_dir():
            images.update(path.rglob("*.png"))

    if not images:
        print("No PNG images found.")
        return 0

    saved_total = 0
    for image_path in sorted(images):
        temporary = image_path.with_name(f"{image_path.stem}.optimizing.png")
        before = image_path.stat().st_size
        try:
            with Image.open(image_path) as image:
                # PNG recompression is lossless: pixels, transparency, and dimensions
                # remain exactly the same. We only replace the source if it is smaller.
                image.save(temporary, format="PNG", optimize=True, compress_level=9)
            after = temporary.stat().st_size
            if after < before:
                temporary.replace(image_path)
                saved = before - after
                saved_total += saved
                print(f"Optimized {image_path}: {before / 1024:.1f} KB -> {after / 1024:.1f} KB")
            else:
                temporary.unlink(missing_ok=True)
                print(f"Kept {image_path}: already as small or smaller")
        except Exception as error:
            temporary.unlink(missing_ok=True)
            print(f"Failed to optimize {image_path}: {error}", file=sys.stderr)
            return 1

    print(f"Done. Saved {saved_total / 1024:.1f} KB with no quality loss.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
