/**
 * Convert between the table widget's cell grid (`string[][]`, first row = the
 * header) and a GitHub-style markdown table string. This lets authors write a
 * table by hand in the inspector instead of uploading a file, while the runtime
 * plugin keeps consuming the same `rows` shape.
 */

/** Escape a single cell so pipes and newlines survive the markdown encoding. */
const escapeCell = (cell: string): string =>
  cell.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')

/** Split one markdown table line into trimmed cells, honoring escaped pipes. */
const splitRow = (line: string): string[] => {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)

  const cells: string[] = []
  let current = ''
  for (let i = 0; i < s.length; i += 1) {
    const char = s[i]
    if (char === '\\' && (s[i + 1] === '|' || s[i + 1] === '\\')) {
      current += s[i + 1]
      i += 1
      continue
    }
    if (char === '|') {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += char
  }
  cells.push(current.trim())
  return cells
}

/** True when a line is a markdown header separator (e.g. `| --- | :--: |`). */
const isSeparatorRow = (cells: string[]): boolean =>
  cells.length > 0 && cells.every((cell) => /^:?-{1,}:?$/.test(cell.trim()))

/**
 * Render a cell grid as a GitHub-style markdown table. Rows are padded to the
 * widest row so the output is always well-formed; an empty grid yields an empty
 * string.
 */
export const rowsToMarkdown = (rows: string[][]): string => {
  if (rows.length === 0) return ''
  const columnCount = Math.max(1, ...rows.map((row) => row.length))
  const pad = (row: string[]): string[] =>
    Array.from({ length: columnCount }, (_, index) =>
      escapeCell(row[index] ?? '')
    )

  const [header, ...body] = rows
  const headerLine = `| ${pad(header).join(' | ')} |`
  const separatorLine = `| ${Array(columnCount).fill('---').join(' | ')} |`
  const bodyLines = body.map((row) => `| ${pad(row).join(' | ')} |`)

  return [headerLine, separatorLine, ...bodyLines].join('\n')
}

/**
 * Parse a GitHub-style markdown table into a cell grid (first row = header).
 * The separator row is optional and ignored, surrounding pipes are optional,
 * and blank lines are skipped. Returns an empty grid for empty input.
 */
export const markdownToRows = (markdown: string): string[][] => {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const rows: string[][] = []
  for (const line of lines) {
    const cells = splitRow(line)
    // Drop the separator, but only once a header row has been seen so a table
    // that legitimately starts with dashes is not mistaken for a separator.
    if (rows.length === 1 && isSeparatorRow(cells)) continue
    rows.push(cells)
  }
  return rows
}
