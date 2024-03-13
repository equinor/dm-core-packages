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
import { DataGridConfig, TFunctionalityChecks } from '../types'
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
  updateColumnLabels: (length: number) => void
  updateRowLabels: (length: number) => void
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

  function mapData(separator: string) {
    let dataCopy = window.structuredClone(data)
    const columnLabelsCopy = [...columnLabels]
    if (includeRowLabels) {
      dataCopy.map((item, index) => item.unshift(rowLabels[index]))
    }
    if (functionality.isMultiDimensional) {
      dataCopy = dataCopy?.map((line: any[]) => line.join(separator))
    }
    if (includeColumnLabels) {
      if (includeRowLabels) {
        columnLabelsCopy.unshift('')
      }
      dataCopy.unshift(columnLabelsCopy?.join(separator))
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
      {functionality.addButtonIsEnabled && (
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
              <Styled.ActionRowButton onClick={props.deleteRow}>
                <Icon size={16} data={minimize} />
              </Styled.ActionRowButton>
            </Tooltip>
          )}
          {functionality.isSortEnabled && (
            <>
              <Styled.ActionRowButton
                onClick={() => moveRow('up')}
                disabled={selectedRow === 0}
              >
                <Icon size={16} data={chevron_up} />
              </Styled.ActionRowButton>
              <Styled.ActionRowButton
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
          <Styled.ActionRowButton onClick={clearTable}>
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
        updateColumnLabels={props.updateColumnLabels}
        updateRowLabels={props.updateRowLabels}
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
