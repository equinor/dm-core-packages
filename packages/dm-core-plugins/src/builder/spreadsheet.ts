import * as XLSX from 'xlsx'

/** Upper bounds so a huge sheet can't bloat the saved page. Pagination keeps
 * rendering fast, so this can be generous. */
export const MAX_ROWS = 5000
export const MAX_COLS = 30

export type TParsedSpreadsheet = {
  rows: string[][]
  totalRows: number
  totalCols: number
  truncated: boolean
}

/**
 * Parse an uploaded CSV/TSV/Excel file into a grid of cells. The first row is
 * treated as the header. Excel files are read with SheetJS; CSV/TSV are parsed
 * as text so they work without loading a workbook. Output is capped to
 * `MAX_ROWS`/`MAX_COLS` so a large file stays snappy; `truncated` flags when the
 * cap was hit.
 */
export const parseSpreadsheet = async (
  file: File
): Promise<TParsedSpreadsheet> => {
  const name = file.name.toLowerCase()
  let grid: string[][]
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      blankrows: false,
      defval: '',
    })
    grid = rows.map((row) => row.map((cell) => String(cell ?? '')))
  } else {
    const text = await file.text()
    const separator = text.includes('\t') ? '\t' : ','
    grid = text
      .replace(/\r/g, '')
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.split(separator).map((cell) => cell.trim()))
  }

  const totalRows = grid.length
  const totalCols = grid.reduce((max, row) => Math.max(max, row.length), 0)
  const rows = grid.slice(0, MAX_ROWS).map((row) => row.slice(0, MAX_COLS))
  return {
    rows,
    totalRows,
    totalCols,
    truncated: totalRows > MAX_ROWS || totalCols > MAX_COLS,
  }
}
