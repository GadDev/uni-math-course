"""Markdown validation adapted from the GadDev repository playbook (MIT; copyright 2026 GadDev)."""
from pathlib import Path
import re
import sys
import subprocess
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parents[1]
errors = []
required = ["README.md","LICENSE","CONTRIBUTING.md","CODE_OF_CONDUCT.md","SECURITY.md","CHANGELOG.md","AGENTS.md","CLAUDE.md","CONTENT_LICENSE.md",".github/CODEOWNERS",".github/PULL_REQUEST_TEMPLATE.md",".github/workflows/check.yml",".github/dependabot.yml",".github/ISSUE_TEMPLATE/config.yml",".github/ISSUE_TEMPLATE/bug_report.yml",".github/ISSUE_TEMPLATE/feature_request.yml",".github/ISSUE_TEMPLATE/content_correction.yml","docs/REPOSITORY_SETUP.md"]
for name in required:
    if not (root / name).is_file():
        errors.append(f'{name}: required file is missing')

planning = [root / "docs" / (name + ".md") for name in ("MISSION", "CONSTITUTION", "ROADMAP", "TECHSTACK")]
if any(path.exists() for path in planning):
    for path in planning:
        if not path.is_file() or not path.read_text(encoding="utf-8").strip():
            errors.append(f"{path.relative_to(root)}: required planning file is missing or empty")

files = sorted(p for p in root.rglob('*.md') if '.git' not in p.parts)
documents = {}
fence_pattern = re.compile(r'^ {0,3}(`{3,}|~{3,})(.*)$')
heading_pattern = re.compile(r'^ {0,3}(#{1,6})\s+(.+?)\s*$')
inline_code = re.compile(r'(`+).*?\1')
definition_pattern = re.compile(r'^ {0,3}\[([^\]]+)\]:\s*(<[^>]+>|\S+)')
inline_link = re.compile(r'!?\[[^\]\n]+\]\((<[^>\n]+>|[^\s)]+)(?:\s+["\'][^\n]*?["\'])?\)')
reference_link = re.compile(r'!?\[([^\]\n]+)\]\[([^\]\n]*)\]')

def label_key(value):
    return ' '.join(value.split()).casefold()

for path in files:
    name = path.relative_to(root).as_posix()
    text = path.read_text(encoding='utf-8')
    if not text.endswith('\n'):
        errors.append(f'{name}: missing final newline')
    visible, anchors, used, definitions = [], set(), set(), {}
    fence = None
    h1_count = 0
    for number, line in enumerate(text.splitlines(), 1):
        marker = fence_pattern.match(line)
        if fence:
            if marker and marker[1][0] == fence[0] and len(marker[1]) >= fence[1] and not marker[2].strip():
                fence = None
            continue
        if marker:
            fence = (marker[1][0], len(marker[1]), number)
            continue
        if '\t' in line:
            errors.append(f'{name}:{number}: tab outside a code fence')
        trailing = len(line) - len(line.rstrip(' '))
        if trailing and trailing != 2:
            errors.append(f'{name}:{number}: accidental trailing whitespace')
        visible.append((number, line))
        heading = heading_pattern.match(line)
        if heading:
            h1_count += len(heading[1]) == 1
            title = re.sub(r'\s+#+\s*$', '', heading[2])
            title = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', title)
            base = re.sub(r'[^\w\- ]', '', title.lower()).replace(' ', '-')
            slug, suffix = base, 0
            while slug in used:
                suffix += 1
                slug = f'{base}-{suffix}'
            anchors.add(slug)
            used.add(slug)
        definition = definition_pattern.match(line)
        if definition:
            definitions[label_key(definition[1])] = definition[2].strip('<>')
    if fence:
        errors.append(f'{name}:{fence[2]}: unclosed code fence')
    if h1_count != 1:
        errors.append(f'{name}: expected one top-level heading, found {h1_count}')
    documents[path.resolve()] = (visible, anchors, definitions)

def check_target(path, number, target):
    target = target.strip('<>')
    try:
        url = urlsplit(target)
    except ValueError:
        errors.append(f'{path.relative_to(root)}:{number}: malformed link {target!r}')
        return
    if url.scheme or url.netloc:
        return
    dest = (root / unquote(url.path).lstrip('/')) if url.path.startswith('/') else (path.parent / unquote(url.path))
    if not url.path:
        dest = path
    dest = dest.resolve()
    if not dest.is_relative_to(root):
        errors.append(f'{path.relative_to(root)}:{number}: link leaves repository: {target}')
    elif not dest.exists():
        errors.append(f'{path.relative_to(root)}:{number}: missing link target: {target}')
    elif url.fragment and dest.suffix.lower() == '.md':
        fragment = unquote(url.fragment)
        target_anchors = documents.get(dest, (None, set(), None))[1]
        if fragment not in target_anchors:
            errors.append(f'{path.relative_to(root)}:{number}: missing heading anchor: {target}')

for path, (visible, anchors, definitions) in documents.items():
    for number, line in visible:
        if definition_pattern.match(line):
            continue
        clean = inline_code.sub('', line)
        for link in inline_link.finditer(clean):
            check_target(path, number, link[1])
        for link in reference_link.finditer(clean):
            key = label_key(link[2] or link[1])
            if key not in definitions:
                errors.append(f'{path.relative_to(root)}:{number}: undefined link reference: {key}')
            else:
                check_target(path, number, definitions[key])
    for target in definitions.values():
        check_target(path, 1, target)

if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
if (root / ".github/labels.json").exists() or (root / ".github/labeler.yml").exists():
    result = subprocess.run([sys.executable, str(root / "scripts/check_labels.py")], check=False)
    if result.returncode:
        sys.exit(result.returncode)
print(f'Validated {len(files)} Markdown files: structure and internal links passed.')
