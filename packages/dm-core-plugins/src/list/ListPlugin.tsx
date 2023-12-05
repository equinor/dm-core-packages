import React, { useMemo, useState } from 'react'
import {
  EntityPickerDialog,
  IUIPlugin,
  Loading,
  Pagination,
  resolveRelativeAddress,
  splitAddress,
  Stack,
  TGenericObject,
  TItem,
  TValidEntity,
  TViewConfig,
  useList,
  ViewCreator,
} from '@development-framework/dm-core'
import { toast } from 'react-toastify'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { external_link, undo, chevron_right, link } from '@equinor/eds-icons'
import { AppendButton, ListItemButton, FormButton } from './Components'
import { DeleteSoftButton } from '../common/DeleteSoftButton'

type TListConfig = {
  expanded?: boolean
  headers: string[]
  expandViewConfig: TViewConfig
  openViewConfig: TViewConfig
  saveExpanded: boolean
  selectFromScope?: string
  functionality: {
    add: boolean
    sort: boolean
    delete: boolean
    expand: boolean
    open: boolean
  }
  resolveReferences: boolean
}
const defaultConfig: TListConfig = {
  expanded: false,
  headers: ['name', 'type'],
  expandViewConfig: { type: 'ViewConfig', scope: 'self' },
  openViewConfig: { type: 'ViewConfig' },
  saveExpanded: false,
  selectFromScope: undefined,
  functionality: {
    add: true,
    sort: true,
    delete: true,
    expand: true,
    open: false,
  },
  resolveReferences: true,
}

export const ListPlugin = (props: IUIPlugin & { config?: TListConfig }) => {
  const { idReference, config, type, onOpen } = props
  const internalConfig: TListConfig = {
    ...defaultConfig,
    ...config,
    functionality: { ...defaultConfig.functionality, ...config.functionality },
  }

  const {
    items,
    attribute,
    isLoading,
    error,
    dirtyState,
    addItem,
    addReference,
    removeItem,
    save,
    moveItem,
    reloadData,
    updateItem,
  } = useList<TGenericObject>(idReference, internalConfig.resolveReferences)

  const [paginationPage, setPaginationPage] = useState(0)
  const [paginationRowsPerPage, setPaginationRowsPerPage] = useState(10)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const paginatedRows = useMemo(
    () =>
      items &&
      items.slice(
        paginationPage * paginationRowsPerPage,
        paginationPage * paginationRowsPerPage + paginationRowsPerPage
      ),
    [paginationPage, paginationRowsPerPage, items]
  )

  const handleItemUpdate = (item: TItem<any>, data: any) => {
    updateItem(item, data, false)
  }

  const handleExpand = (item: TItem<any>) => {
    const isExpanded = expanded[item.key] || false
    setExpanded({ ...expanded, [item.key]: !isExpanded })
  }

  const handleOpen = (item: TItem<any>) => {
    if (!onOpen) {
      toast.error(
        'Invalid UiRecipes. The list plugin was not passed an "onOpen()"-function.'
      )
      return
    }

    const view = { ...internalConfig.openViewConfig, label: item?.data?.name }
    onOpen(
      item.key,
      view,
      `${idReference}[${item.index}]`,
      false,
      config.saveExpanded
        ? undefined
        : (data: any) => handleItemUpdate(item, data),
      config.saveExpanded
        ? (data: any) => handleItemUpdate(item, data)
        : undefined
    )
  }
  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading) return <Loading />

  const { documentPath, dataSource } = splitAddress(idReference)

  return (
    <Stack>
      {attribute && !attribute.contained && (
        <EntityPickerDialog
          showModal={showModal}
          setShowModal={setShowModal}
          typeFilter={type}
          scope={config.selectFromScope}
          onChange={async (address: string, entity: TValidEntity) => {
            const key = await addReference(address, entity, false)
            if (internalConfig.expanded) {
              // @ts-ignore
              setExpanded({ ...expanded, [key]: true })
            }
          }}
        />
      )}
      {paginatedRows &&
        paginatedRows.map((item: TItem<TGenericObject>, index: number) => (
          <React.Fragment key={item?.key}>
            <Stack
              direction='row'
              role='row'
              spacing={1}
              justifyContent='space-between'
              alignItems='center'
              style={{
                padding: '0.25rem 0.5rem',
                borderBottom: '1px solid #ccc',
              }}
            >
              <Stack direction='row' spacing={0.5} alignItems='center'>
                {internalConfig.functionality.expand && (
                  <Tooltip title={expanded[item.key] ? 'Minimize' : 'Expand'}>
                    <Button
                      variant='ghost_icon'
                      color='secondary'
                      disabled={!item.isSaved}
                      data-testid={`expandListItem-${index}`}
                      onClick={() => handleExpand(item)}
                    >
                      <Icon
                        data={chevron_right}
                        size={24}
                        title={expanded[item.key] ? 'Close item' : 'Open item'}
                        className='transition-all'
                        style={{
                          transform: expanded[item.key]
                            ? 'rotate(90deg)'
                            : 'rotate(0deg)',
                        }}
                      />
                    </Button>
                  </Tooltip>
                )}
                {attribute && !attribute.contained && <Icon data={link} />}
                {internalConfig.headers.map(
                  (attribute: string, index: number) => {
                    if (item.data && item.data?.[attribute]) {
                      if (typeof item.data[attribute] === 'object')
                        throw new Error(
                          `Objects can not be displayed in table header. Attribute '${attribute}' is not a primitive type.`
                        )
                      return (
                        <Typography
                          key={attribute}
                          variant='body_short'
                          bold={index === 0}
                          style={{ cursor: 'pointer' }}
                        >
                          {item?.data[attribute]}
                        </Typography>
                      )
                    }
                  }
                )}
              </Stack>
              <Stack direction='row' alignItems='center'>
                {internalConfig.functionality.open && (
                  <Tooltip title='Open in new tab'>
                    <Button
                      variant='ghost_icon'
                      color='secondary'
                      disabled={!item.isSaved}
                      data-testid={`open-list-item-${index}`}
                      onClick={() => handleOpen(item)}
                    >
                      <Icon
                        data={external_link}
                        size={18}
                        title={'Open item'}
                      />
                    </Button>
                  </Tooltip>
                )}
                {internalConfig.functionality.sort && (
                  <>
                    <ListItemButton
                      disabled={index === 0}
                      onClick={() => {
                        moveItem(item, 'up')
                      }}
                      type='up'
                    />
                    <ListItemButton
                      type='down'
                      disabled={
                        index === paginationRowsPerPage - 1 ||
                        index === items?.length - 1
                      }
                      onClick={() => {
                        moveItem(item, 'down')
                      }}
                    />
                  </>
                )}
                {internalConfig.functionality.delete && (
                  <DeleteSoftButton
                    onClick={() => removeItem(item, false)}
                    title={'Delete'}
                  />
                )}
              </Stack>
            </Stack>
            <Stack>
              {expanded[item.key] && (
                <ViewCreator
                  onSubmit={
                    config.saveExpanded
                      ? undefined
                      : (data: TGenericObject) => handleItemUpdate(item, data)
                  }
                  onChange={
                    config.saveExpanded
                      ? (data: TGenericObject) => handleItemUpdate(item, data)
                      : undefined
                  }
                  idReference={
                    attribute && !attribute.contained
                      ? resolveRelativeAddress(
                          item?.reference?.address || '',
                          documentPath,
                          dataSource
                        )
                      : `${idReference}[${item.index}]`
                  }
                  viewConfig={internalConfig.expandViewConfig}
                />
              )}
            </Stack>
          </React.Fragment>
        ))}
      <Stack
        direction='row'
        justifyContent='space-between'
        spacing={1}
        style={{ padding: '1rem 0' }}
      >
        <Pagination
          count={Object.keys(items).length}
          page={paginationPage}
          setPage={setPaginationPage}
          rowsPerPage={paginationRowsPerPage}
          setRowsPerPage={setPaginationRowsPerPage}
        />
        <Stack direction='row' spacing={1}>
          {internalConfig.functionality.add && (
            <AppendButton
              onClick={() => {
                if (attribute && attribute.contained) {
                  addItem(false)
                } else {
                  setShowModal(true)
                }
              }}
            />
          )}
          <FormButton
            onClick={reloadData}
            disabled={!dirtyState}
            tooltip={'Revert changes'}
            variant={'outlined'}
            isLoading={isLoading}
            dataTestid='RevertList'
          >
            <Icon data={undo} size={16} />
          </FormButton>
          <FormButton
            onClick={save}
            disabled={!dirtyState}
            isLoading={isLoading}
            tooltip={'Save'}
            dataTestid='SaveList'
          >
            Save
          </FormButton>
        </Stack>
      </Stack>
    </Stack>
  )
}
