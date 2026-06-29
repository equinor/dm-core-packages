import { Button, Progress } from '@equinor/eds-core-react'
import { type ChangeEvent, useRef, useState } from 'react'
import { MAX_COLS, MAX_ROWS, parseSpreadsheet } from '../spreadsheet'
import * as Styled from '../styles'

type TTableUploadFieldProps = {
  label: string
  /** True when the widget already has table content. */
  hasContent: boolean
  onChange: (rows: string[][] | undefined) => void
}

/**
 * Lets the user pick a CSV/TSV/Excel file from their computer. The file is
 * parsed locally into a grid of cells the table widget renders, so no document
 * or scope binding is needed. Large files are capped and paginated on display.
 */
export const TableUploadField = ({
  label,
  hasContent,
  onChange,
}: TTableUploadFieldProps): React.ReactElement => {
  const input = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [notice, setNotice] = useState<string | undefined>()

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
      <input
        ref={input}
        type='file'
        accept='.csv,.tsv,.xlsx,.xls'
        style={{ display: 'none' }}
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
      {notice && <Styled.FieldHelp>{notice}</Styled.FieldHelp>}
      {error && (
        <Styled.FieldHelp style={{ color: '#c00' }}>{error}</Styled.FieldHelp>
      )}
    </>
  )
}
