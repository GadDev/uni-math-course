"""Validate the repository's deliberately limited JSON-compatible labeler configuration."""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


def validate(catalog, rules):
    errors = []
    if not isinstance(catalog, list) or not catalog:
        return ["labels.json must contain a nonempty list"]
    names = set()
    normalised = set()
    for i, label in enumerate(catalog):
        if not isinstance(label, dict) or set(label) != {"name", "color", "description"}:
            errors.append(f"label {i}: expected name, color and description")
            continue
        name = label["name"]
        if not isinstance(name, str) or not name.strip() or len(name) > 50 or name != name.strip():
            errors.append(f"label {i}: invalid name")
            continue
        if name.casefold() in normalised:
            errors.append(f"duplicate label name: {name}")
        normalised.add(name.casefold())
        names.add(name)
        if not isinstance(label["color"], str) or not re.fullmatch(r"[0-9A-Fa-f]{6}", label["color"]):
            errors.append(f"{name}: color must contain six hexadecimal digits")
        desc = label["description"]
        if not isinstance(desc, str) or not desc.strip() or len(desc) > 100:
            errors.append(f"{name}: description must contain 1-100 characters")
    if not isinstance(rules, dict) or not rules:
        return errors + ["labeler.yml must contain a nonempty label-to-rules object"]
    for name, matchers in rules.items():
        if name not in names:
            errors.append(f"labeler.yml references undeclared label: {name}")
        if not isinstance(matchers, list) or not matchers:
            errors.append(f"{name}: expected a nonempty matcher list")
            continue
        for matcher in matchers:
            if not isinstance(matcher, dict) or set(matcher) != {"changed-files"}:
                errors.append(f"{name}: supported matcher is changed-files")
                continue
            changes = matcher["changed-files"]
            if not isinstance(changes, list) or not changes:
                errors.append(f"{name}: expected changed-files list")
                continue
            for change in changes:
                if not isinstance(change, dict) or set(change) != {"any-glob-to-any-file"}:
                    errors.append(f"{name}: supported rule is any-glob-to-any-file")
                    continue
                globs = change["any-glob-to-any-file"]
                if not isinstance(globs, list) or not globs:
                    errors.append(f"{name}: expected nonempty glob list")
                    continue
                for glob in globs:
                    if not isinstance(glob, str) or not glob.strip() or glob.startswith(("/", "!")) or ".." in glob.split("/"):
                        errors.append(f"{name}: expected a positive repository-relative glob")
    return errors


def main():
    try:
        catalog = json.loads((ROOT / ".github/labels.json").read_text(encoding="utf-8"))
        rules = json.loads((ROOT / ".github/labeler.yml").read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:
        print(f"Label configuration could not be read: {error}", file=sys.stderr)
        return 1
    errors = validate(catalog, rules)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"Validated {len(catalog)} declared labels and {len(rules)} path-based label rules.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
