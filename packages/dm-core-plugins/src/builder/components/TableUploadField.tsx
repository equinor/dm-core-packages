import { Button, Progress } from '@equinor/eds-core-react'
import { type ChangeEvent, useRef, useState } from 'react'
import { parseSpreadsheet, toMarkdownTable } from '../spreadsheet'
import * as Styled from '../styles'

type TTableUploadFieldProps = {
  label: string
  /** True when the widget already has table content. */
  hasContent: boolean
  onChange: (markdown: string | undefined) => void
}

/**
 * Lets the user pick a CSV/TSV/Excel file from their computer. The file is
 * parsed locally and converted into a markdown table that the widget renders,
 * so no document or scope binding is needed.
 */
export const TableUploadField = ({
  label,
  hasContent,
  onChange,
}: TTableUploadFieldProps): React.ReactElement => {
  const input = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError(undefined)
    setLoading(true)
    try {
      const rows = await parseSpreadsheet(file)
      if (rows.length === 0) {
        setError('That file had no rows')
        return
      }
      onChange(toMarkdownTable(rows))
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
      {error && (
        <Styled.FieldHelp style={{ color: '#c00' }}>{error}</Styled.FieldHelp>
      )}
    </>
  )
}
