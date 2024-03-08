import {
  DeleteSoftButton,
  EntityPickerDialog,
  IUIPlugin,
  LazyLoad,
  Loading,
  NewListItemButton,
  Pagination,
  Stack,
  TEntityPickerReturn,
  TGenericObject,
  TItem,
  TTemplate,
  TViewConfig,
  TemplateMenu,
  ViewCreator,
  resolveRelativeAddressSimplified,
  useList,
  usePagination,
} from '@development-framework/dm-core'
import {
  Button,
  EdsProvider,
  Icon,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import { chevron_right, external_link, link, undo } from '@equinor/eds-icons'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { FormButton, ListChevronButton } from './Components'

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
  width?: string
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
  width: '100%',
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

  const {
    currentItems,
    itemsPerPage,
    currentPage,
    showPagination,
    setPage,
    setItemsPerPage,
    goToLastPage,
  } = usePagination(items, internalConfig.defaultPaginationRowsPerPage ?? 10)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)

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
    const label =
      config.label ||
      item.data?.label ||
      item.data?.name ||
      `${attribute?.name}`
    const view = {
      ...internalConfig.openViewConfig,
      label: config.labelByIndex ? `${label} #${item.index + 1}` : label,
    }
    onOpen(
      item.key,
      view,
      item.idReference,
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

  return (
    <div className='dm-plugin-padding'>
      <Stack
        style={{
          width: config?.width || '100%',
          overflowX: 'auto',
        }}
      >
        {attribute && !attribute.contained && (
          <EntityPickerDialog
            showModal={showModal}
            setShowModal={setShowModal}
            typeFilter={type}
            scope={
              config.selectFromScope
                ? resolveRelativeAddressSimplified(
                    config.selectFromScope,
                    idReference
                  )
                : undefined
            }
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
        <Stack role='rowgroup' style={{ minWidth: 'max-content' }}>
          {currentItems &&
            currentItems.map((item: TItem<TGenericObject>, index: number) => (
              <Stack key={item?.key}>
                <Stack
                  direction='row'
                  role='row'
                  justifyContent='space-between'
                  alignItems='center'
                  className={`border-b border-[#ccc]`}
                  padding={0.25}
                >
                  <Stack direction='row' alignItems='center'>
                    {internalConfig.functionality.expand && (
                      <EdsProvider
                        density={
                          internalConfig.compact ? 'compact' : 'comfortable'
                        }
                      >
                        <Tooltip
                          title={expanded[item.key] ? 'Minimize' : 'Expand'}
                        >
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
                                transform: expanded[item.key]
                                  ? 'rotate(90deg)'
                                  : 'rotate(0deg)',
                              }}
                            />
                          </Button>
                        </Tooltip>
                      </EdsProvider>
                    )}
                    {attribute && !attribute.contained && <Icon data={link} />}
                    <Stack direction='row' wrap='wrap'>
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
                    </Stack>
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
                            index === itemsPerPage - 1 ||
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
                <LazyLoad visible={expanded[item.key]}>
                  <div className='m-2 border-b border-[#ccc] pb-4'>
                    <ViewCreator
                      onSubmit={
                        config.saveExpanded
                          ? undefined
                          : (data: TGenericObject) =>
                              handleItemUpdate(item, data)
                      }
                      onChange={
                        config.saveExpanded
                          ? (data: TGenericObject) =>
                              handleItemUpdate(item, data)
                          : undefined
                      }
                      idReference={item.idReference}
                      viewConfig={internalConfig.expandViewConfig}
                    />
                  </div>
                </LazyLoad>
              </Stack>
            ))}
        </Stack>
        <EdsProvider
          density={internalConfig.compact ? 'compact' : 'comfortable'}
        >
          <div
            className={`w-full space-x-1 flex flex-wrap my-2 justify-between`}
          >
            {showPagination && (
              <Pagination
                count={Object.keys(items).length}
                page={currentPage}
                setPage={setPage}
                rowsPerPage={itemsPerPage}
                setRowsPerPage={setItemsPerPage}
                defaultRowsPerPage={
                  internalConfig?.defaultPaginationRowsPerPage
                }
              />
            )}
            <div className='flex justify-end grow space-x-2 items-center'>
              {internalConfig.functionality.add && (
                <>
                  <NewListItemButton
                    onClick={() => {
                      if (attribute && !attribute.contained) {
                        setShowModal(true)
                        return
                      }
                      if (!(config.templates && config.templates.length)) {
                        addItem(false)
                        goToLastPage(1)
                      } else if (config.templates.length === 1) {
                        addItem(false, undefined, config.templates[0].path)
                        goToLastPage(1)
                      } else setTemplateMenuIsOpen(true)
                    }}
                    compact={internalConfig.compact}
                  />
                  {config.templates?.length && (
                    <TemplateMenu
                      templates={config.templates}
                      onSelect={(template: TTemplate) => {
                        addItem(false, undefined, template?.path)
                        goToLastPage(1)
                      }}
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
            </div>
          </div>
        </EdsProvider>
      </Stack>
    </div>
  )
}
