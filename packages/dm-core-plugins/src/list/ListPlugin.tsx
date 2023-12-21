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
  TViewConfig,
  useList,
  ViewCreator,
  DeleteSoftButton,
  TEntityPickerReturn,
  TemplateMenu,
  TTemplate,
} from '@development-framework/dm-core'
import { toast } from 'react-toastify'
import {
  Button,
  EdsProvider,
  Icon,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import { external_link, undo, chevron_right, link } from '@equinor/eds-icons'
import { AppendButton, ListChevronButton, FormButton } from './Components'

type TListConfig = {
  expanded?: boolean
  headers: string[]
  expandViewConfig: TViewConfig
  openViewConfig: TViewConfig
  saveExpanded: boolean
  selectFromScope?: string
  hideInvalidTypes?: boolean
  compact?: boolean
  functionality: {
    add: boolean
    sort: boolean
    delete: boolean
    expand: boolean
    open: boolean
  }
  resolveReferences: boolean
  templates?: TTemplate[]
  labelByIndex?: boolean
  defaultPaginationRowsPerPage?: number
  label?: string
}
const defaultConfig: TListConfig = {
  expanded: false,
  headers: ['name', 'type'],
  expandViewConfig: { type: 'ViewConfig', scope: 'self' },
  openViewConfig: { type: 'ViewConfig' },
  saveExpanded: false,
  selectFromScope: undefined,
  hideInvalidTypes: false,
  compact: false,
  defaultPaginationRowsPerPage: 10,
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

  const defaultPaginationRowsPerPage = useMemo(() => {
    let numRows = internalConfig.defaultPaginationRowsPerPage ?? 10
    numRows = Math.round(numRows)
    numRows = Math.abs(numRows)
    return numRows
  }, [internalConfig.defaultPaginationRowsPerPage])

  const [paginationPage, setPaginationPage] = useState(0)
  const [paginationRowsPerPage, setPaginationRowsPerPage] = useState(
    defaultPaginationRowsPerPage
  )

  const showPagination = useMemo(
    () =>
      items.length >
      Math.min(defaultPaginationRowsPerPage, paginationRowsPerPage),
    [items, paginationRowsPerPage]
  )
  const [showModal, setShowModal] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)
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

  const ensureNotObject = (attribute: any) => {
    if (typeof attribute === 'object') {
      throw new Error(
        `Objects can not be displayed in table header. Attribute '${attribute}' is not a primitive type.`
      )
    }
    return attribute
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
    const label = config.label
      ? config.label
      : item?.data?.name
        ? item?.data?.name
        : `${attribute?.name}`
    const view = {
      ...internalConfig.openViewConfig,
      label: config.labelByIndex ? `${label} #${item.index + 1}` : label,
    }
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
    <Stack style={{ width: '100%' }}>
      {attribute && !attribute.contained && (
        <EntityPickerDialog
          showModal={showModal}
          setShowModal={setShowModal}
          typeFilter={type}
          scope={config.selectFromScope}
          onChange={async (entities: TEntityPickerReturn[]) => {
            const newKeys: Record<string, boolean> = {}
            for (const { address, entity } of entities) {
              const newKey = await addReference(address, entity, false)
              newKeys[newKey] = true
            }
            if (internalConfig.expanded) {
              setExpanded({ ...expanded, ...newKeys })
            }
          }}
          multiple
          hideInvalidTypes={internalConfig.hideInvalidTypes}
        />
      )}
      {paginatedRows &&
        paginatedRows.map((item: TItem<TGenericObject>, index: number) => (
          <Stack key={item?.key} style={{ width: '100%' }}>
            <Stack
              direction='row'
              role='row'
              justifyContent='space-between'
              alignItems='center'
              className={`border-b border-[#ccc]`}
              style={{
                paddingBlock: internalConfig.compact ? '' : '2px',
                paddingInline: '4px',
                width: '100%',
              }}
            >
              <Stack
                direction='row'
                alignItems='center'
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                {internalConfig.functionality.expand && (
                  <EdsProvider
                    density={internalConfig.compact ? 'compact' : 'comfortable'}
                  >
                    <Tooltip title={expanded[item.key] ? 'Minimize' : 'Expand'}>
                      <div className='w-fit'>
                        <Button
                          variant='ghost_icon'
                          color='secondary'
                          disabled={!item.isSaved}
                          data-testid={`expandListItem-${index}`}
                          onClick={() => handleExpand(item)}
                        >
                          <Icon
                            data={chevron_right}
                            size={internalConfig.compact ? 18 : 24}
                            title={
                              expanded[item.key]
                                ? 'Minimize item'
                                : 'Expand item'
                            }
                            className='transition-all'
                            style={{
                              padding: '0px',
                              transform: expanded[item.key]
                                ? 'rotate(90deg)'
                                : 'rotate(0deg)',
                            }}
                          />
                        </Button>
                      </div>
                    </Tooltip>
                  </EdsProvider>
                )}
                {attribute && !attribute.contained && <Icon data={link} />}
                <div
                  onClick={() =>
                    internalConfig.functionality.expand &&
                    item.isSaved &&
                    handleExpand(item)
                  }
                  className={`px-2 overflow-hidden text-ellipsis whitespace-nowrap
                    ${
                      internalConfig.functionality.expand
                        ? 'cursor-pointer'
                        : ''
                    }`}
                >
                  {internalConfig.headers.map(
                    (attribute: string, index: number) => {
                      if (item.data && item.data?.[attribute]) {
                        return (
                          <Typography
                            key={attribute}
                            variant='body_short'
                            bold={index === 0}
                            style={{
                              marginLeft: index !== 0 ? '10px' : '0',
                              display: 'inline',
                            }}
                          >
                            {ensureNotObject(item?.data[attribute])}
                          </Typography>
                        )
                      }
                    }
                  )}
                </div>
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
                        title={'Open in tab'}
                        aria-label={'Open in tab'}
                      />
                    </Button>
                  </Tooltip>
                )}
                {internalConfig.functionality.sort && (
                  <>
                    <ListChevronButton
                      disabled={index === 0}
                      onClick={() => {
                        moveItem(item, 'up')
                      }}
                      type='up'
                    />
                    <ListChevronButton
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
                <div className='m-2 border-b border-[#ccc] pb-4'>
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
                </div>
              )}
            </Stack>
          </Stack>
        ))}
      <EdsProvider density={internalConfig.compact ? 'compact' : 'comfortable'}>
        <Stack
          direction='row'
          justifyContent={showPagination ? 'space-between' : 'flex-end'}
          spacing={1}
          style={
            showPagination
              ? { padding: '0.2rem 0 0.2rem 0.5rem' }
              : { padding: '0.5rem 0 0.5rem 0' }
          }
        >
          {showPagination && (
            <Pagination
              count={Object.keys(items).length}
              page={paginationPage}
              setPage={setPaginationPage}
              rowsPerPage={paginationRowsPerPage}
              setRowsPerPage={setPaginationRowsPerPage}
              defaultRowsPerPage={defaultPaginationRowsPerPage}
            />
          )}
          <Stack
            direction='row'
            alignItems='center'
            spacing={1}
            justifyContent='space-between'
          >
            {internalConfig.functionality.add && (
              <>
                <AppendButton
                  onClick={() => {
                    if (attribute && !attribute.contained) {
                      setShowModal(true)
                      return
                    }
                    if (!(config.templates && config.templates.length))
                      addItem(false)
                    else if (config.templates.length === 1)
                      addItem(false, undefined, config.templates[0].path)
                    else setTemplateMenuIsOpen(true)
                  }}
                  compact={internalConfig.compact}
                />
                {config.templates?.length && (
                  <TemplateMenu
                    templates={config.templates}
                    onSelect={(template: TTemplate) =>
                      addItem(false, undefined, template?.path)
                    }
                    onClose={() => setTemplateMenuIsOpen(false)}
                    isOpen={isTemplateMenuOpen}
                  />
                )}
              </>
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
              onClick={() => save(items)}
              disabled={!dirtyState}
              isLoading={isLoading}
              tooltip={'Save'}
              dataTestid='SaveList'
            >
              Save
            </FormButton>
          </Stack>
        </Stack>
      </EdsProvider>
    </Stack>
  )
}
