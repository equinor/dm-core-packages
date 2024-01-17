import { Stack } from '@development-framework/dm-core'
import {
  Button,
  Checkbox,
  Dialog,
  Icon,
  Menu,
  Typography,
} from '@equinor/eds-core-react'
import {
  add,
  check,
  chevron_down,
  chevron_up,
  copy,
  download,
  minimize,
  settings,
} from '@equinor/eds-icons'
import { useState } from 'react'
import * as Styled from '../styles'
import { TFunctionalityChecks } from '../types'

type DataGridActionsProps = {
  addRow: () => void
  addColumn: () => void
  columnLabels: string[]
  data: any[]
  deleteRow: () => void
  functionality: TFunctionalityChecks
  moveRow: (direction: 'up' | 'down') => void
  name: string
  printDirection: 'horizontal' | 'vertical'
  rowLabels: string[]
  selectedRow: number | undefined
}

export function DataGridActions(props: DataGridActionsProps) {
  const {
    columnLabels,
    data,
    functionality,
    moveRow,
    printDirection,
    rowLabels,
    selectedRow,
  } = props
  const [includeColumnLabels, setIsIncludeColumnLabels] =
    useState<boolean>(false)
  const [includeRowLabels, setIsIncludeRowLabels] = useState<boolean>(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)
  const [menuButtonAnchor, setMenuButtonAnchor] =
    useState<HTMLButtonElement | null>(null)

  function reverseData(dataArray: string[][]) {
    const reversedData: any[] = []
    for (let index = 0; index < columnLabels.length; index++) {
      const values = dataArray.map((item) => item[index])
      reversedData.push(values)
    }
    return reversedData
  }

  function mapData(separator: string) {
    let dataCopy = window.structuredClone(data)
    if (printDirection === 'vertical') {
      dataCopy = reverseData(dataCopy)
    }
    const currentColumnLabels =
      printDirection === 'vertical' ? [...rowLabels] : [...columnLabels]
    const currentRowLabels =
      printDirection === 'vertical' ? [...columnLabels] : [...rowLabels]
    if (includeRowLabels) {
      dataCopy.map((item, index) => item.unshift(currentRowLabels[index]))
    }
    if (functionality.isMultiDimensional) {
      dataCopy = dataCopy?.map((line: any[]) => line.join(separator))
    }
    if (includeColumnLabels) {
      if (includeRowLabels) {
        currentColumnLabels.unshift('')
      }
      dataCopy.unshift(currentColumnLabels?.join(separator))
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
    // create anchor element and fake click
    const element = document.createElement('a')
    element.href = URL.createObjectURL(file)
    element.download = props.name.replace('.csv', '') + '.csv'
    document.body.appendChild(element)
    element.click()
  }

  return (
    <Stack direction='row'>
      {functionality.addButtonIsEnabled && (
        <Styled.ActionRowButton
          aria-label='Add data row'
          onClick={() =>
            functionality.addButtonFunctionality === 'addRow'
              ? props.addRow()
              : props.addColumn()
          }
        >
          <Icon size={16} data={add} />
        </Styled.ActionRowButton>
      )}
      {selectedRow !== undefined && (
        <>
          {functionality.rowsAreEditable && (
            <Styled.ActionRowButton onClick={props.deleteRow}>
              <Icon size={16} data={minimize} />
            </Styled.ActionRowButton>
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
      <Styled.ActionRowButton
        aria-haspopup
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(true)}
        ref={setMenuButtonAnchor}
      >
        <Icon size={16} data={settings} />
      </Styled.ActionRowButton>
      <Menu
        anchorEl={menuButtonAnchor}
        id='table-setting-menu'
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
      >
        <Menu.Item onClick={() => setIsExportDialogOpen(true)}>
          <Icon data={download} size={16} /> Export
        </Menu.Item>
      </Menu>
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
