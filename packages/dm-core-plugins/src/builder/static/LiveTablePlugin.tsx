import {
  type IUIPlugin,
  Loading,
  useDocument,
} from '@development-framework/dm-core'
import { useCallback, useEffect, useState } from 'react'
import * as S from './LiveTablePlugin.styles'

export interface LiveTablePluginConfig {
  caption?: string
  /** Whether viewers are allowed to add rows. Defaults to true. */
  allowAddRows?: boolean
  /** Whether viewers are allowed to delete rows. Defaults to true. */
  allowDeleteRows?: boolean
}

type TDocument = Record<string, unknown> & { rows?: string[][] }

const EMPTY_ROW = (colCount: number): string[] => Array(colCount).fill('')

/**
 * A live, editable table bound to a DMSS entity.
 *
 * The entity must have a `rows` attribute (`string[][]`): the first row is the
 * header and the rest are data rows. Viewers can add/delete rows and edit cells
 * in-place; clicking **Save** writes the updated rows back to the entity via
 * `updateDocument`.
 *
 * Wire it up by binding the widget's **Data scope** in the inspector to an
 * entity that contains a `rows` field.
 */
export const LiveTablePlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: LiveTablePluginConfig }
): React.ReactElement => {
  const { allowAddRows = true, allowDeleteRows = true, caption } = props.config

  const { document, isLoading, updateDocument, error } = useDocument<TDocument>(
    props.idReference,
    1
  )

  const [localRows, setLocalRows] = useState<string[][]>([])
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)

  // Sync from DMSS whenever the document loads or changes externally.
  useEffect(() => {
    if (document) {
      setLocalRows(document.rows ?? [])
      setDirty(false)
    }
  }, [document])

  const colCount = Math.max((localRows[0] ?? []).length, 1)
  const header = localRows[0] ?? []
  const bodyRows = localRows.slice(1)

  const updateRows = useCallback((next: string[][]) => {
    setLocalRows(next)
    setDirty(true)
  }, [])

  const setCellValue = (rowIndex: number, colIndex: number, value: string) => {
    const next = localRows.map((row) => [...row])
    if (!next[rowIndex]) next[rowIndex] = EMPTY_ROW(colCount)
    next[rowIndex][colIndex] = value
    updateRows(next)
  }

  const setHeaderValue = (colIndex: number, value: string) => {
    const next = localRows.map((row) => [...row])
    if (!next[0]) next[0] = EMPTY_ROW(colCount)
    next[0][colIndex] = value
    updateRows(next)
  }

  const addRow = () => {
    const next =
      localRows.length === 0
        ? [EMPTY_ROW(1), EMPTY_ROW(1)]
        : [...localRows, EMPTY_ROW(colCount)]
    updateRows(next)
  }

  const deleteRow = (bodyIndex: number) => {
    const next = [header, ...bodyRows.filter((_, i) => i !== bodyIndex)]
    updateRows(next)
    setSelectedRow(null)
  }

  const addColumn = () => {
    const next = localRows.map((row) => [...row, ''])
    updateRows(next)
  }

  const deleteColumn = (colIndex: number) => {
    const next = localRows.map((row) => row.filter((_, i) => i !== colIndex))
    updateRows(next[0]?.length === 0 ? [] : next)
    setSelectedColumn(null)
  }

  const handleSave = async () => {
    if (!document || saving) return
    setSaving(true)
    try {
      await updateDocument({ ...document, rows: localRows }, false, false)
      setDirty(false)
      if (props.onSubmit) props.onSubmit({ rows: localRows })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <Loading />
  if (error)
    return (
      <S.EmptyMessage>
        Could not load table data: {String(error)}
      </S.EmptyMessage>
    )

  if (!props.idReference)
    return (
      <S.EmptyMessage>
        Bind this widget to a DMSS entity via the Data scope in the inspector.
      </S.EmptyMessage>
    )

  return (
    <S.Container className='dm-plugin-padding'>
      <S.Toolbar>
        {allowAddRows && (
          <>
            <S.AddRowButton type='button' onClick={addRow} disabled={saving}>
              + Add row
            </S.AddRowButton>
            <S.DeleteRowButton
              type='button'
              onClick={() => deleteRow(selectedRow!)}
              disabled={saving || selectedRow === null}
            >
              - Delete row
            </S.DeleteRowButton>
            <S.AddRowButton type='button' onClick={addColumn} disabled={saving}>
              + Add column
            </S.AddRowButton>
            <S.DeleteRowButton
              type='button'
              onClick={() => deleteColumn(selectedColumn!)}
              disabled={saving || selectedColumn === null}
            >
              - Delete column
            </S.DeleteRowButton>
          </>
        )}
        <S.SaveButton
          type='button'
          $saving={saving || !dirty}
          disabled={saving || !dirty}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save'}
        </S.SaveButton>
        {dirty && !saving && <S.StatusText>Unsaved changes</S.StatusText>}
        {!dirty && !saving && <S.StatusText>All changes saved</S.StatusText>}
      </S.Toolbar>

      {localRows.length === 0 ? (
        <S.EmptyMessage>
          No data yet.{allowAddRows ? ' Click "+ Add row" to start.' : ''}
        </S.EmptyMessage>
      ) : (
        <S.GridEditor>
          <S.GridTable>
            {caption && (
              <caption style={{ textAlign: 'left', paddingBottom: 4 }}>
                {caption}
              </caption>
            )}
            <thead>
              {allowDeleteRows && (
                <tr>
                  {header.map((_, colIndex) => (
                    <S.ActionTd as='th' key={`del-col-${colIndex}`}>
                      <S.SelectRowButton
                        type='button'
                        title={`Delete column ${colIndex + 1}`}
                        onClick={() =>
                          colIndex === selectedColumn
                            ? setSelectedColumn(null)
                            : setSelectedColumn(colIndex)
                        }
                        disabled={saving}
                        style={{
                          color: selectedColumn === colIndex ? 'red' : 'grey',
                        }}
                      >
                        ✕
                      </S.SelectRowButton>
                    </S.ActionTd>
                  ))}
                  <S.ActionTd as='th' />
                </tr>
              )}
              <tr>
                {header.map((col, colIndex) => (
                  <S.GridTh key={`h-${colIndex}`}>
                    <S.CellInput
                      value={col}
                      onChange={(e) => setHeaderValue(colIndex, e.target.value)}
                    />
                  </S.GridTh>
                ))}
                {allowDeleteRows && <S.ActionTd as='th' />}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr key={`r-${rowIndex}`}>
                  {Array.from({ length: colCount }).map((_, colIndex) => (
                    <S.GridTd key={`c-${rowIndex}-${colIndex}`}>
                      <S.CellInput
                        value={row[colIndex] ?? ''}
                        onChange={(e) =>
                          setCellValue(rowIndex + 1, colIndex, e.target.value)
                        }
                      />
                    </S.GridTd>
                  ))}
                  {allowDeleteRows && (
                    <S.ActionTd>
                      <S.SelectRowButton
                        type='button'
                        title='Delete row'
                        onClick={() =>
                          rowIndex === selectedRow
                            ? setSelectedRow(null)
                            : setSelectedRow(rowIndex)
                        }
                        disabled={saving}
                        style={{
                          color: selectedRow === rowIndex ? 'red' : 'grey',
                        }}
                      >
                        ✕
                      </S.SelectRowButton>
                    </S.ActionTd>
                  )}
                </tr>
              ))}
            </tbody>
          </S.GridTable>
        </S.GridEditor>
      )}
    </S.Container>
  )
}
