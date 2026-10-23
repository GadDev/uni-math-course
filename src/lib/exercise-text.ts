// A small, deliberately non-HTML format for authored exercise strings.
// Unsupported markup stays literal. No links, raw HTML or executable content.
export type InlineToken = {
  kind: 'text' | 'math' | 'code' | 'strong';
  text: string;
};
export function inlineTokens(text: string): InlineToken[] {
  return text
    .split(/(`[^`]+`|\$[^$]+\$|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`'))
        return { kind: 'code', text: part.slice(1, -1) };
      if (part.startsWith('$') && part.endsWith('$'))
        return { kind: 'math', text: part.slice(1, -1) };
      if (part.startsWith('**') && part.endsWith('**'))
        return { kind: 'strong', text: part.slice(2, -2) };
      return { kind: 'text', text: part };
    });
}
export type TextBlock =
  | { kind: 'text'; text: string }
  | { kind: 'table'; headers: string[]; rows: string[][] };
const cells = (line: string) =>
  line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
const tableLine = (line: string) => /^\s*\|.*\|\s*$/.test(line);
export function exerciseTextBlocks(text: string): TextBlock[] {
  const lines = text.split('\n');
  const blocks: TextBlock[] = [];
  let prose: string[] = [];
  const flush = () => {
    if (prose.length) blocks.push({ kind: 'text', text: prose.join('\n') });
    prose = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (tableLine(line) && i + 1 < lines.length && tableLine(lines[i + 1]!)) {
      const headers = cells(line);
      const separator = cells(lines[i + 1]!);
      if (
        headers.length === separator.length &&
        separator.every((cell) => /^:?-{3,}:?$/.test(cell))
      ) {
        const rows: string[][] = [];
        let end = i + 2;
        while (end < lines.length && tableLine(lines[end]!)) {
          const row = cells(lines[end]!);
          if (row.length !== headers.length) break;
          rows.push(row);
          end++;
        }
        if (rows.length) {
          flush();
          blocks.push({ kind: 'table', headers, rows });
          i = end - 1;
          continue;
        }
      }
    }
    prose.push(line);
  }
  flush();
  return blocks;
}
