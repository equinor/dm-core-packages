import {
  Button,
  Checkbox,
  Dialog,
  Icon,
  Menu,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import {
  add,
  check,
  chevron_down,
  chevron_up,
  copy,
  delete_to_trash,
  download,
  minimize,
  settings,
  upload,
} from '@equinor/eds-icons'
import { useState } from 'react'
import { Stack } from '../../common'
import { createSyntheticFileDownload } from '../../utils'
import * as Styled from '../styles'
import {
  type DataGridConfig,
  PredefinedLabel,
  type TFunctionalityChecks,
} from '../types'
import { DataGridImportDialog } from './DataGridImportDialog/DataGridImportDialog'

type DataGridActionsProps = {
  addRow: () => void
  attributeType: string
  columnLabels: string[]
  config: DataGridConfig
  data: any[]
  deleteRow: () => void
  dimensions: string | undefined
  functionality: TFunctionalityChecks
  moveRow: (direction: 'up' | 'down') => void
  name: string
  rowLabels: string[]
  selectedRow: number | undefined
  setData: (data: any[]) => void
  clearTable: () => void
}

export function DataGridActions(props: DataGridActionsProps) {
  const {
    columnLabels,
    config,
    data,
    functionality,
    moveRow,
    rowLabels,
    selectedRow,
    clearTable,
  } = props
  const [includeColumnLabels, setIsIncludeColumnLabels] =
    useState<boolean>(false)
  const [includeRowLabels, setIsIncludeRowLabels] = useState<boolean>(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState<boolean>(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  function createLabels(type: 'columns' | 'rows') {
    let dataLength = type === 'rows' ? data?.length : 1
    if (type === 'columns' && functionality.isMultiDimensional) {
      dataLength = data[0]?.length
    }
    const labelConfig =
      type === 'columns' ? config.columnLabels : config.rowLabels
    const labels = type === 'columns' ? columnLabels : rowLabels
    const labelsToCopy = labelConfig.includes(PredefinedLabel.NUMERIC)
      ? Array.from({ length: dataLength }, (_, i) => `${i + 1}`)
      : labels.slice(0, dataLength)
    return labelsToCopy
  }

  function mapData(separator: string) {
    let dataCopy = window.structuredClone(data)

    if (includeColumnLabels || includeRowLabels) {
      const columnLabels = createLabels('columns')
      const rowLabels = createLabels('rows')
      if (functionality.isMultiDimensional) {
        if (includeColumnLabels) {
          dataCopy.unshift(columnLabels) // add column labels
        }
        if (includeRowLabels) {
          if (includeColumnLabels) rowLabels.unshift('') // add an empty labels if column labels are also included
          dataCopy.map((data, index) => data.unshift(rowLabels[index])) // add row labels
        }
      } else {
        if (includeColumnLabels) dataCopy.unshift(columnLabels)
        if (includeRowLabels) {
          if (includeColumnLabels) rowLabels.unshift('') // add an empty labels if column labels are also included
          // add row labels before data primitive
          dataCopy = dataCopy.map(
            (data, index) => `${rowLabels[index]}${separator} ${data}`
          )
        }
      }
    }

    if (functionality.isMultiDimensional) {
      dataCopy = dataCopy?.map((line: any[]) => line.join(separator))
    }
    return dataCopy.join('\n')
  }

  function copyDataToClipboard() {
    const mappedData = mapData('\t')
    navigator.clipboard.writeText(mappedData)
    setCopiedToClipboard(true)
    setTimeout(() => {
      setCopiedToClipboard(false)
    }, 2500)
  }

  function exportTableAsCSV() {
    const mappedData = mapData(';')
    const file = new Blob([mappedData], {
      type: 'text/plain',
      endings: 'native',
    })
    createSyntheticFileDownload(
      URL.createObjectURL(file),
      props.name.replace('.csv', '') + '.csv'
    )
  }

  return (
    <Stack direction='row'>
      {functionality.addButtonIsEnabled && functionality.rowsAreEditable && (
        <Tooltip title='Add row'>
          <Styled.ActionRowButton
            aria-label='Add data row'
            onClick={() => props.addRow()}
          >
            <Icon size={16} data={add} />
          </Styled.ActionRowButton>
        </Tooltip>
      )}
      {selectedRow !== undefined && (
        <>
          {functionality.rowsAreEditable && (
            <Tooltip title='Delete selected row'>
              <Styled.ActionRowButton
                aria-label='Delete selected row'
                onClick={props.deleteRow}
              >
                <Icon size={16} data={minimize} />
              </Styled.ActionRowButton>
            </Tooltip>
          )}
          {functionality.isSortRowsEnabled && (
            <>
              <Styled.ActionRowButton
                aria-label='Move selected row up'
                onClick={() => moveRow('up')}
                disabled={selectedRow === 0}
              >
                <Icon size={16} data={chevron_up} />
              </Styled.ActionRowButton>
              <Styled.ActionRowButton
                aria-label='Move selected row down'
                onClick={() => moveRow('down')}
                disabled={selectedRow === props.data?.length - 1}
              >
                <Icon size={16} data={chevron_down} />
              </Styled.ActionRowButton>
            </>
          )}
        </>
      )}
      <Tooltip title='Import and Export'>
        <Styled.ActionRowButton
          aria-label='Open table actions menu'
          aria-haspopup
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
          ref={setMenuButtonAnchor}
        >
          <Icon size={16} data={settings} />
        </Styled.ActionRowButton>
      </Tooltip>
      {functionality.rowsAreEditable && functionality.addButtonIsEnabled && (
        <Tooltip title='Clear table content'>
          <Styled.ActionRowButton
            aria-label='Clear table content'
            onClick={clearTable}
          >
            <Icon size={16} data={delete_to_trash} />
          </Styled.ActionRowButton>
        </Tooltip>
      )}
      <Menu
        anchorEl={menuButtonAnchor}
        id='table-setting-menu'
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
      >
        {config.editable && (
          <Menu.Item onClick={() => setIsImportDialogOpen(true)}>
            <Icon data={upload} size={16} /> Import
          </Menu.Item>
        )}
        <Menu.Item onClick={() => setIsExportDialogOpen(true)}>
          <Icon data={download} size={16} /> Export
        </Menu.Item>
      </Menu>
      <DataGridImportDialog
        attributeType={props.attributeType}
        closeModal={() => setIsImportDialogOpen(false)}
        data={data}
        dimensions={props.dimensions}
        open={isImportDialogOpen}
        setData={props.setData}
      />
      <Dialog
        isDismissable
        onClose={() => setIsExportDialogOpen(false)}
        open={isExportDialogOpen}
        style={{ minWidth: '30vw' }}
      >
        <Stack padding={1.5} spacing={1}>
          <Typography variant='h4'>Export data</Typography>
          <Stack>
            <Checkbox
              checked={includeColumnLabels}
              label='Include column labels'
              onChange={() => setIsIncludeColumnLabels(!includeColumnLabels)}
            />
            <Checkbox
              checked={includeRowLabels}
              label='Include row labels'
              onChange={() => setIsIncludeRowLabels(!includeRowLabels)}
            />
          </Stack>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Button onClick={exportTableAsCSV} variant='outlined'>
              <Icon data={download} size={16} /> Download (.csv)
            </Button>
            <Button onClick={copyDataToClipboard} variant='outlined'>
              <Icon data={copy} size={16} /> Copy to clipboard
            </Button>
            {copiedToClipboard && (
              <Stack direction='row' spacing={0.5}>
                <Icon data={check} size={16} />
                <Typography>Data copied to clipboard!</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Dialog>
    </Stack>
  )
}
