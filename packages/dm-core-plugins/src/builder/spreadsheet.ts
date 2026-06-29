import * as XLSX from 'xlsx'

/**
 * Parse an uploaded CSV/TSV/Excel file into a grid of cells. The first row is
 * treated as the header. Excel files are read with SheetJS; CSV/TSV are parsed
 * as text so they work without loading a workbook.
 */
export const parseSpreadsheet = async (file: File): Promise<string[][]> => {
  const name = file.name.toLowerCase()
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      blankrows: false,
      defval: '',
    })
    return rows.map((row) => row.map((cell) => String(cell ?? '')))
  }
  const text = await file.text()
  const separator = text.includes('\t') ? '\t' : ','
  return text
    .replace(/\r/g, '')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split(separator).map((cell) => cell.trim()))
}

/** Convert a grid of cells into a GitHub-flavoured markdown table. */
export const toMarkdownTable = (rows: string[][]): string => {
  if (rows.length === 0) return ''
  const width = Math.max(...rows.map((row) => row.length))
  const pad = (row: string[]) => {
    const cells = [...row]
    while (cells.length < width) cells.push('')
    return cells.map((cell) => cell.replace(/\|/g, '\\|'))
  }
  const [header, ...body] = rows
  const lines = [
    `| ${pad(header).join(' | ')} |`,
    `| ${Array(width).fill('---').join(' | ')} |`,
    ...body.map((row) => `| ${pad(row).join(' | ')} |`),
  ]
  return lines.join('\n')
}
