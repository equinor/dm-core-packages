import { EdsProvider, Icon, Table } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import {
  LazyLoad,
  TGenericObject,
  TItem,
  TTemplate,
  TemplateMenu,
  ViewCreator,
} from '../../../'
import { TTableColumnConfig, TableRowProps } from '../types'
import * as utils from '../utils'
import { TableCell } from './TableCell/TableCell'
import { TableRowActions } from './TableRowActions/TableRowActions'
import * as Styled from './styles'

const NotHoverColorTableRow = styled(Table.Row)`
  &:hover {
    background-color: white; // same as the non-hover state
  }
`

export function TableRow(props: TableRowProps) {
  const {
    addItem,
    config,
    dragHandle,
    editMode,
    functionalityConfig,
    idReference,
    index,
    item,
    items,
    setItems,
    updateItem,
    setDirtyState,
    tableVariant,
    ...dragProps
  } = props

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)
  const menuAnchorEl = useRef<HTMLButtonElement | null>(null)
  const columnsLength: number = utils.getColumnsLength(
    config,
    functionalityConfig,
    tableVariant
  )
  const handleItemUpdate = (itemToChange: TItem<any>, data: any) => {
    updateItem(itemToChange, data, false)
  }

  function openItemAsTab() {
    if (!props.onOpen) {
      toast.error(
        'Invalid UiRecipes. The table plugin was not passed an "onOpen()"-function.'
      )
      return
    }
    const label =
      config.label ||
      item.data?.label ||
      item.data?.name ||
      `${idReference.split('.').slice(-1)}`
    props.onOpen(
      item.key,
      {
        label: config.labelByIndex ? `${label} #${index + 1}` : label,
        type: 'ViewConfig',
      },
      `${idReference}[${index}]`,
      false,
      (data: any) => handleItemUpdate(item, data)
    )
  }

  function updateCell(
    attribute: string,
    newValue: string | number | boolean,
    attributeType: string
  ) {
    if (attributeType === 'number') newValue = Number(newValue)
    setItems(utils.updateItemAttribute(items, item.key, attribute, newValue))
    setDirtyState(true)
  }

  return (
    <>
      {editMode && (
        <Table.Row style={{ height: 0, position: 'relative' }}>
          <Table.Cell
            style={{ padding: 0, margin: 0, height: 0, borderBottom: 'none' }}
            colSpan={columnsLength}
          >
            {functionalityConfig.add &&
              (!config.templates || config.templates.length < 2) && (
                <Styled.InsertRowButton
                  title='Add new row'
                  onClick={() => {
                    const defaultTemplate = config?.templates
                      ? config.templates[0]
                      : undefined
                    addItem(!editMode, index, defaultTemplate?.path)
                  }}
                >
                  <span className='resting_state_indicator' />
                  <Icon data={add} color='white' />
                </Styled.InsertRowButton>
              )}
            {functionalityConfig.add &&
              config.templates &&
              config.templates.length > 1 && (
                <>
                  <Styled.InsertRowButton
                    ref={menuAnchorEl}
                    title={'Add new row'}
                    onClick={() => setTemplateMenuIsOpen(true)}
                  />
                  <TemplateMenu
                    anchorRef={menuAnchorEl}
                    templates={config.templates}
                    onSelect={(template: TTemplate) =>
                      addItem(!editMode, index, template?.path)
                    }
                    onClose={() => setTemplateMenuIsOpen(false)}
                    isOpen={isTemplateMenuOpen}
                  />
                </>
              )}
          </Table.Cell>
        </Table.Row>
      )}
      <EdsProvider density='compact'>
        <Table.Row
          key={item.key}
          style={{
            ...dragProps.style,
            backgroundColor: index % 2 === 0 ? '#f7f7f7' : '',
          }}
          ref={dragProps.setNodeRef}
        >
          {editMode && (
            <Styled.TableCell style={{ position: 'relative' }}>
              {dragHandle ? dragHandle() : null}
            </Styled.TableCell>
          )}
          {config.columns.map((column: TTableColumnConfig) => (
            <TableCell
              key={column.data}
              column={column}
              editMode={editMode}
              isExpanded={isExpanded}
              item={item}
              openItemAsTab={openItemAsTab}
              setIsExpanded={setIsExpanded}
              updateItem={updateCell}
            ></TableCell>
          ))}
          {props.showAdditionalCell && (
            <TableRowActions
              editMode={editMode}
              item={item}
              removeItem={props.removeItem}
              functionalityConfig={functionalityConfig}
            />
          )}
        </Table.Row>
      </EdsProvider>
      <LazyLoad visible={isExpanded} element={NotHoverColorTableRow}>
        <Table.Cell colSpan={columnsLength}>
          <ViewCreator
            idReference={`${idReference}[${item.index}]`}
            onSubmit={(data: TGenericObject) => handleItemUpdate(item, data)}
            viewConfig={
              config.expandableRecipeViewConfig
                ? config.expandableRecipeViewConfig
                : { type: 'ViewConfig', scope: 'self' }
            }
          />
        </Table.Cell>
      </LazyLoad>
    </>
  )
}
