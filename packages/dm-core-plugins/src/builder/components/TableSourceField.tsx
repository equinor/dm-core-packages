import { Button, Progress } from '@equinor/eds-core-react'
import { type ChangeEvent, useRef, useState } from 'react'
import * as Styled from '../styles'
import { markdownToRows, rowsToMarkdown } from '../utils/markdownTable'
import { MAX_COLS, MAX_ROWS, parseSpreadsheet } from '../utils/spreadsheet'
import * as S from './TableSourceField.styles'

type TTableSourceFieldProps = {
  label: string
  /** Current table cells (first row = header). */
  value: string[][]
  onChange: (rows: string[][] | undefined) => void
}

type TMode = 'upload' | 'write'

/**
 * Lets the author fill the table widget two ways:
 *
 * - **Import file**: pick a CSV/TSV/Excel file, parsed locally into cells.
 * - **Write table**: type a GitHub-style markdown table by hand. The draft is
 *   seeded from the current cells, so an imported table can be tweaked inline.
 *
 * Both paths produce the same `string[][]` the table widget renders, so no
 * document or scope binding is needed.
 */
export const TableSourceField = ({
  label,
  value,
  onChange,
}: TTableSourceFieldProps): React.ReactElement => {
  const input = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<TMode>('upload')
  const [draft, setDraft] = useState(() => rowsToMarkdown(value))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [notice, setNotice] = useState<string | undefined>()

  const hasContent = Array.isArray(value) && value.length > 0

  // Seed the markdown draft from the current cells whenever the author enters
  // write mode so an uploaded table is shown ready to edit.
  const enterWrite = () => {
    setDraft(rowsToMarkdown(value))
    setError(undefined)
    setNotice(undefined)
    setMode('write')
  }

  const handleDraft = (text: string) => {
    setDraft(text)
    const rows = markdownToRows(text)
    onChange(rows.length > 0 ? rows : undefined)
  }

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError(undefined)
    setNotice(undefined)
    setLoading(true)
    try {
      const { rows, totalRows, totalCols, truncated } =
        await parseSpreadsheet(file)
      if (rows.length === 0) {
        setError('That file had no rows')
        return
      }
      onChange(rows)
      setDraft(rowsToMarkdown(rows))
      if (truncated) {
        setNotice(
          `Large file: kept the first ${Math.min(totalRows, MAX_ROWS)} of ${totalRows} rows` +
            (totalCols > MAX_COLS
              ? ` and ${MAX_COLS} of ${totalCols} columns`
              : '') +
            '.'
        )
      }
    } catch {
      setError('Could not read that file')
    } finally {
      setLoading(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <>
      <Styled.FieldLabel>{label}</Styled.FieldLabel>
      <Styled.SegmentedControl>
        <Styled.SegmentButton
          type='button'
          $active={mode === 'upload'}
          onClick={() => setMode('upload')}
        >
          Import file
        </Styled.SegmentButton>
        <Styled.SegmentButton
          type='button'
          $active={mode === 'write'}
          onClick={enterWrite}
        >
          Write table
        </Styled.SegmentButton>
      </Styled.SegmentedControl>

      {mode === 'upload' ? (
        <>
          <S.HiddenInput
            ref={input}
            type='file'
            accept='.csv,.tsv,.xlsx,.xls'
            onChange={handleFile}
          />
          <Button
            variant='outlined'
            disabled={loading}
            onClick={() => input.current?.click()}
          >
            {loading ? (
              <Progress.Dots />
            ) : hasContent ? (
              'Replace data…'
            ) : (
              'Upload CSV / Excel…'
            )}
          </Button>
        </>
      ) : (
        <>
          <S.MonospaceTextarea
            value={draft}
            spellCheck={false}
            placeholder={
              '| Column A | Column B |\n| --- | --- |\n| Row 1 | Value |'
            }
            onChange={(event) => handleDraft(event.target.value)}
          />
          <Styled.FieldHelp>
            First row is the header. Separate columns with <code>|</code>; the{' '}
            <code>---</code> line is optional.
          </Styled.FieldHelp>
        </>
      )}

      {notice && <Styled.FieldHelp>{notice}</Styled.FieldHelp>}
      {error && <S.ErrorHelp>{error}</S.ErrorHelp>}
    </>
  )
}
