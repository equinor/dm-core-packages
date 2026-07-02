import {
  ErrorBoundary,
  type IUIPlugin,
  splitAddress,
  useDocument,
} from '@development-framework/dm-core'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { GridPlugin } from '../grid/GridPlugin'
import type { TGridArea, TGridItem } from '../grid/types'
import { getBlock } from './blocks'
import { Canvas, DENSITY_STEP } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { Navbar } from './components/Navbar'
import { NavSidebar } from './components/NavSidebar'
import { Outline } from './components/Outline'
import { TemplatesMenu } from './components/TemplatesMenu'
import { Toast } from './components/Toast'
import { WidgetPalette } from './components/WidgetPalette'
import { useHistory } from './history'
import { ICONS } from './icons'
import {
  addWidget,
  clampPath,
  deserialize,
  duplicateWidget,
  getSubModel,
  insertWidgetItem,
  MAX_GRID_CELLS,
  MIN_GRID_CELLS,
  moveWidget,
  removeWidget,
  rescaleGrid,
  resizeWidget,
  serialize,
  setSubModel,
  setWidgetArea,
  setWidgetConfigValue,
  setWidgetLabel,
  setWidgetScope,
  setWidgetStyleValue,
  setWidgetTitle,
  translateArea,
  wouldOverlap,
} from './model'
import {
  addNavItem,
  addPage,
  deserializeSite,
  findPage,
  findPageContext,
  moveNavItem,
  movePage,
  removeNavItem,
  removePage,
  renamePage,
  serializeSite,
  setPageLayout,
  type TNavbar,
  type TNavbarItem,
  updateNavbar,
  updateNavItem,
} from './site'
import * as Styled from './styles'
import { useToast } from './toast'
import type {
  TBlock,
  TBuilderMode,
  TBuilderModel,
  TBuilderPluginConfig,
} from './types'

type TDevice = 'desktop' | 'tablet' | 'mobile'

const DEVICE_WIDTHS: Record<TDevice, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '380px',
}

const DEVICE_ICONS: Record<TDevice, string> = {
  desktop: 'desktop_mac',
  tablet: 'tablet_android',
  mobile: 'phone',
}

export const BuilderPlugin = (
  props: IUIPlugin & { config?: TBuilderPluginConfig }
): React.ReactElement => {
  const { config, idReference, type, onSubmit, onChange } = props

  const { document, updateDocument } = useDocument<Record<string, unknown>>(
    idReference,
    1
  )

  const history = useHistory(() =>
    deserializeSite(config?.initialConfig ?? null)
  )
  const site = history.present
  const setSite = history.set
  const [activePageId, setActivePageId] = useState<string>(
    () => site.pages[0]?.id ?? ''
  )
  const [mode, setMode] = useState<TBuilderMode>(config?.mode ?? 'edit')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [path, setPath] = useState<number[]>([])
  const [device, setDevice] = useState<TDevice>('desktop')
  const [clipboard, setClipboard] = useState<TGridItem | null>(null)
  const { toast, notify, dismiss } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  // The page currently open in the editor; falls back to the first page when
  // the active id no longer resolves (e.g. after a delete or undo).
  const activePage = findPage(site, activePageId) ?? site.pages[0]
  const model = activePage.layout

  // Edit the active page's grid through the site history, so widget edits and
  // page operations share a single undo stack. Behaves like a plain model
  // setter scoped to the open page.
  const setModel = useCallback(
    (
      updater: TBuilderModel | ((current: TBuilderModel) => TBuilderModel),
      label: string | null = null
    ) =>
      setSite((current) => {
        const previous = findPage(current, activePage.id)?.layout
        if (previous === undefined) return current
        const next =
          typeof updater === 'function'
            ? (updater as (value: TBuilderModel) => TBuilderModel)(previous)
            : updater
        return setPageLayout(current, activePage.id, next)
      }, label),
    [setSite, activePage.id]
  )

  // The grid currently being edited (root, or a section drilled into via path).
  const activeModel = getSubModel(model, path)
  const frameWidth = DEVICE_WIDTHS[device]

  /**
   * Apply a transform to the active (possibly nested) grid and write it back.
   * An optional `label` lets consecutive related changes (e.g. a drag-resize or
   * typing in one field) collapse into a single undo step.
   */
  const updateActive = (
    updater: (model: TBuilderModel) => TBuilderModel,
    label: string | null = null
  ) =>
    setModel(
      (current) =>
        setSubModel(current, path, updater(getSubModel(current, path))),
      label
    )

  const handleAdd = (block: TBlock) => updateActive((m) => addWidget(m, block))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || over.id !== 'canvas') return
    const blockId = active.data.current?.blockId
    if (!blockId) return
    const block = getBlock(blockId)
    if (block) handleAdd(block)
  }

  const handleDelete = (index: number) => {
    updateActive((m) => removeWidget(m, index))
    setSelectedIndex(null)
    notify('Widget deleted')
  }

  const handleDuplicate = (index: number) => {
    updateActive((m) => duplicateWidget(m, index))
    notify('Widget duplicated')
  }

  const handleEnter = (index: number) => {
    setPath((current) => [...current, index])
    setSelectedIndex(null)
  }

  const handleNavigate = (depth: number) => {
    setPath((current) => current.slice(0, depth))
    setSelectedIndex(null)
  }

  const handleApplyTemplate = (build: () => TBuilderModel) => {
    setModel(build())
    setPath([])
    setSelectedIndex(null)
    notify('Template applied')
  }

  // ---- Page (nav sidebar) management -------------------------------------

  // Switch the editor (or, in preview, the viewer) to another page, resetting
  // the section path and selection so we open at that page's root grid.
  const handleSelectPage = (id: string) => {
    if (id === activePageId) return
    setActivePageId(id)
    setPath([])
    setSelectedIndex(null)
  }

  const handleAddPage = (parentId: string | null = null) => {
    const { site: next, id } = addPage(site, parentId)
    if (!id) return
    setSite(next)
    setActivePageId(id)
    setPath([])
    setSelectedIndex(null)
    notify(parentId ? 'Sub-page added' : 'Page added')
  }

  const handleRenamePage = (id: string, title: string) =>
    setSite((current) => renamePage(current, id, title))

  const handleDeletePage = (id: string) => {
    const context = findPageContext(site, id)
    if (!context) return
    if (context.parentId === null && site.pages.length <= 1) return
    const next = removePage(site, id)
    if (next === site) return
    setSite(next)
    if (id === activePageId || findPage(next, activePageId) === null) {
      const sibling =
        context.siblings[context.index - 1] ?? context.siblings[context.index]
      const fallback =
        (sibling && sibling.id !== id ? findPage(next, sibling.id) : null) ??
        (context.parentId ? findPage(next, context.parentId) : null) ??
        next.pages[0]
      setActivePageId(fallback.id)
      setPath([])
      setSelectedIndex(null)
    }
    notify('Page deleted')
  }

  const handleReorderPages = (
    parentId: string | null,
    from: number,
    to: number
  ) => setSite((current) => movePage(current, parentId, from, to))

  // ---- Top navbar management ---------------------------------------------

  const handleUpdateNavbar = (patch: Partial<TNavbar>) =>
    setSite((current) => updateNavbar(current, patch))

  const handleAddNavItem = () => setSite((current) => addNavItem(current).site)

  const handleUpdateNavItem = (id: string, patch: Partial<TNavbarItem>) =>
    setSite((current) => updateNavItem(current, id, patch))

  const handleRemoveNavItem = (id: string) =>
    setSite((current) => removeNavItem(current, id))

  const handleReorderNavItem = (from: number, to: number) =>
    setSite((current) => moveNavItem(current, from, to))

  const handleMove = (
    index: number,
    deltaColumns: number,
    deltaRows: number
  ) => {
    const item = activeModel.items[index]
    if (!item) return
    const area = translateArea(item.gridArea, deltaColumns, deltaRows)
    // Pre-check against the rendered grid for immediate feedback.
    const preview = moveWidget(activeModel, index, area)
    if (wouldOverlap(preview, index, preview.items[index].gridArea)) {
      notify('That position overlaps another widget')
      return
    }
    // Authoritative write re-derives from the latest model so a concurrent edit
    // is never dropped, and re-checks overlap against that model.
    updateActive((m) => {
      const current = m.items[index]
      if (!current) return m
      const next = moveWidget(
        m,
        index,
        translateArea(current.gridArea, deltaColumns, deltaRows)
      )
      if (wouldOverlap(next, index, next.items[index].gridArea)) return m
      return next
    })
  }

  const handleResize = (index: number, area: TGridArea) =>
    updateActive((m) => {
      if (!m.items[index]) return m
      const next = resizeWidget(m, index, area)
      if (wouldOverlap(next, index, next.items[index].gridArea)) return m
      return next
    }, `resize:${index}`)

  // Drag-resize emits many updates; end the coalescing run on pointer-up so the
  // whole gesture collapses into a single undo step.
  const handleResizeEnd = () => history.commit()

  // Rescale the active grid's density (cell count) without changing its size,
  // so a higher density yields a finer snap stride for micro adjustments.
  // Consecutive density steps coalesce into one undo step via a shared label.
  const handleDensity = (factor: number) =>
    updateActive((m) => rescaleGrid(m, factor), 'density')

  const handleSetArea = (index: number, area: TGridArea) => {
    const item = activeModel.items[index]
    if (!item) return
    const preview = setWidgetArea(activeModel, index, area)
    if (wouldOverlap(preview, index, preview.items[index].gridArea)) {
      notify('That size overlaps another widget')
      return
    }
    updateActive((m) => {
      if (!m.items[index]) return m
      const next = setWidgetArea(m, index, area)
      if (wouldOverlap(next, index, next.items[index].gridArea)) return m
      return next
    }, `area:${index}`)
  }

  const handleCopy = (index: number) => {
    const item = activeModel.items[index]
    if (!item) return
    setClipboard(JSON.parse(JSON.stringify(item)) as TGridItem)
    notify('Widget copied')
  }

  const handlePaste = () => {
    if (!clipboard) return
    // The pasted widget is appended, so it lands at the current item count.
    const newIndex = activeModel.items.length
    updateActive((m) => insertWidgetItem(m, clipboard))
    setSelectedIndex(newIndex)
    notify('Widget pasted')
  }

  const selectedItem =
    selectedIndex !== null ? (activeModel.items[selectedIndex] ?? null) : null
  const selectedBlock = selectedItem
    ? getBlock(
        typeof selectedItem.viewConfig.recipe === 'string'
          ? selectedItem.viewConfig.recipe
          : (selectedItem.viewConfig.recipe?.name ?? '')
      )
    : undefined

  const inspectorHandlers = {
    onTitle: (value: string) =>
      selectedIndex !== null &&
      updateActive(
        (m) => setWidgetTitle(m, selectedIndex, value),
        `title:${selectedIndex}`
      ),
    onLabel: (value: string) =>
      selectedIndex !== null &&
      updateActive(
        (m) => setWidgetLabel(m, selectedIndex, value),
        `label:${selectedIndex}`
      ),
    onScope: (value: string) =>
      selectedIndex !== null &&
      updateActive(
        (m) => setWidgetScope(m, selectedIndex, value),
        `scope:${selectedIndex}`
      ),
    onArea: (area: TGridArea) =>
      selectedIndex !== null && handleSetArea(selectedIndex, area),
    onConfigValue: (key: string, value: unknown) =>
      selectedIndex !== null &&
      updateActive(
        (m) => setWidgetConfigValue(m, selectedIndex, key, value),
        `config:${key}:${selectedIndex}`
      ),
    onStyleValue: (
      key: keyof NonNullable<TGridItem['style']>,
      value: unknown,
      target: 'body' | 'title' = 'body'
    ) =>
      selectedIndex !== null &&
      updateActive(
        (m) => setWidgetStyleValue(m, selectedIndex, key, value, target),
        `style:${target}:${key}:${selectedIndex}`
      ),
    onCommit: () => history.commit(),
  }

  // Keyboard shortcuts for editing. Undo/redo are available whenever the editor
  // is active; the editing shortcuts are ignored while typing in a form field so
  // the field's own behaviour (text undo, copy, etc.) keeps working.
  useEffect(() => {
    if (mode !== 'edit' || showJson) return

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      const mod = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()

      if (mod && key === 'z') {
        if (typing) return
        event.preventDefault()
        if (event.shiftKey) history.redo()
        else history.undo()
        return
      }
      if (mod && key === 'y') {
        if (typing) return
        event.preventDefault()
        history.redo()
        return
      }

      if (typing) return

      if (mod && key === 'c') {
        if (selectedIndex !== null) handleCopy(selectedIndex)
        return
      }
      if (mod && key === 'v') {
        if (clipboard) {
          event.preventDefault()
          handlePaste()
        }
        return
      }
      if (mod && key === 'd') {
        if (selectedIndex !== null) {
          event.preventDefault()
          handleDuplicate(selectedIndex)
        }
        return
      }
      if (key === 'delete' || key === 'backspace') {
        if (selectedIndex !== null) {
          event.preventDefault()
          handleDelete(selectedIndex)
        }
        return
      }
      if (key === 'escape') setSelectedIndex(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    mode,
    showJson,
    history,
    selectedIndex,
    clipboard,
    handleCopy,
    handlePaste,
    handleDuplicate,
    handleDelete,
  ])

  // Keep navigation valid: if the model changes underneath the current path
  // (e.g. an undo removes the section being edited), truncate the path to the
  // deepest still-valid container and drop any now-stale selection.
  useEffect(() => {
    const clamped = clampPath(model, path)
    if (clamped.length !== path.length) {
      setPath(clamped)
      setSelectedIndex(null)
    }
  }, [model, path])

  // Keep the active page id in sync with the site: if it no longer resolves
  // (e.g. an undo/redo removed the open page), snap to the resolved page.
  useEffect(() => {
    if (activePage.id !== activePageId) setActivePageId(activePage.id)
  }, [activePage.id, activePageId])

  // Persisted JSON of the whole site (all pages). The baseline ref tracks what
  // was last saved so we can tell whether there are unsaved changes.
  const currentJson = useMemo(() => JSON.stringify(serializeSite(site)), [site])
  const savedJsonRef = useRef(currentJson)
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'dirty'>(
    'saved'
  )

  // Hydrate the builder from the page entity's saved `layout` once it loads, so
  // reopening shows previously saved work rather than the recipe seed. Accepts
  // both the multi-page site format and a legacy single-grid layout. A corrupt
  // or unreadable layout must never crash the editor: on failure we keep the
  // seeded/empty site and tell the user, so their next save can recover it.
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (hydratedRef.current) return
    const layout = document?.layout
    if (!layout) return
    hydratedRef.current = true
    try {
      const loaded = deserializeSite(layout)
      if (loaded.pages.length === 0) {
        throw new Error('Saved layout has no pages')
      }
      savedJsonRef.current = JSON.stringify(serializeSite(loaded))
      setSite(() => loaded, 'load')
      setActivePageId(loaded.pages[0]?.id ?? '')
      setPath([])
      setSelectedIndex(null)
      setSaveState('saved')
    } catch {
      // Leave the current (seeded) site in place and flag it as unsaved so the
      // author can review before overwriting whatever unreadable data existed.
      setSaveState('dirty')
      notify('Could not read the saved page — starting from a blank layout')
    }
  }, [document, setSite, notify])

  /**
   * Persist the current page layout. When bound to an entity we write the
   * serialized grid config to its `layout` attribute; otherwise we fall back to
   * the host `onChange` handler. Returns true on success.
   */
  const save = async (): Promise<boolean> => {
    const layout = JSON.parse(currentJson)
    setSaveState('saving')
    try {
      if (idReference && document) {
        await updateDocument({ ...document, layout }, false, true)
      } else if (onChange) {
        onChange(layout)
      } else {
        setSaveState('dirty')
        return false
      }
      savedJsonRef.current = currentJson
      setSaveState('saved')
      return true
    } catch {
      setSaveState('dirty')
      notify('Could not save page')
      return false
    }
  }

  // Autosave: debounce changes and persist them. Without a save target the page
  // just stays marked as having unsaved changes.
  useEffect(() => {
    if (currentJson === savedJsonRef.current) {
      setSaveState('saved')
      return
    }
    if (!idReference && !onChange) {
      setSaveState('dirty')
      return
    }
    setSaveState('saving')
    const timer = setTimeout(() => {
      void save()
    }, 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJson, onChange, idReference, document])

  // Warn before leaving the page while there are unsaved changes.
  useEffect(() => {
    if (saveState === 'saved') return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveState])

  const saveStatusLabel =
    saveState === 'saved'
      ? 'All changes saved'
      : saveState === 'saving'
        ? 'Saving…'
        : 'Unsaved changes'

  // Breadcrumb labels for the path from the root page down to the active grid.
  const crumbLabels = ['Page']
  for (let depth = 0; depth < path.length; depth++) {
    const parent = getSubModel(model, path.slice(0, depth))
    crumbLabels.push(parent.items[path[depth]]?.title ?? 'Section')
  }

  const breadcrumb =
    path.length > 0 ? (
      <Styled.Breadcrumbs>
        {crumbLabels.map((label, depth) => (
          <Fragment key={`${depth}-${label}`}>
            {depth > 0 && <Icon data={ICONS.chevron_right} size={16} />}
            <Styled.BreadcrumbButton
              type='button'
              $current={depth === crumbLabels.length - 1}
              disabled={depth === crumbLabels.length - 1}
              onClick={() => handleNavigate(depth)}
            >
              {label}
            </Styled.BreadcrumbButton>
          </Fragment>
        ))}
      </Styled.Breadcrumbs>
    ) : undefined

  // Round-trip through serialize/deserialize so preview proves the stored JSON
  // renders identically with the runtime grid plugin.
  const previewConfig = deserialize(serialize(model))

  const navSidebar = (
    <NavSidebar
      pages={site.pages}
      activePageId={activePage.id}
      editing={mode === 'edit'}
      onNavigate={handleSelectPage}
      onAddPage={handleAddPage}
      onRenamePage={handleRenamePage}
      onDeletePage={handleDeletePage}
      onReorder={handleReorderPages}
    />
  )

  const navbar = (
    <Navbar
      navbar={site.navbar}
      pages={site.pages}
      editing={mode === 'edit'}
      onNavigate={handleSelectPage}
      onUpdateNavbar={handleUpdateNavbar}
      onAddItem={handleAddNavItem}
      onUpdateItem={handleUpdateNavItem}
      onRemoveItem={handleRemoveNavItem}
      onReorderItem={handleReorderNavItem}
    />
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd}
    >
      <Styled.BuilderLayout>
        <Styled.Toolbar>
          <Styled.ToolbarGroup>
            <Typography variant='h5'>Website builder</Typography>
            {mode === 'edit' && (
              <TemplatesMenu
                onApply={(template) => handleApplyTemplate(template.build)}
              />
            )}
            {mode === 'edit' && (
              <>
                <Tooltip title='Undo (Ctrl/Cmd+Z)'>
                  <Button
                    variant='ghost_icon'
                    aria-label='Undo'
                    disabled={!history.canUndo}
                    onClick={() => history.undo()}
                  >
                    <Icon data={ICONS.undo} size={18} />
                  </Button>
                </Tooltip>
                <Tooltip title='Redo (Ctrl/Cmd+Shift+Z)'>
                  <Button
                    variant='ghost_icon'
                    aria-label='Redo'
                    disabled={!history.canRedo}
                    onClick={() => history.redo()}
                  >
                    <Icon data={ICONS.redo} size={18} />
                  </Button>
                </Tooltip>
              </>
            )}
          </Styled.ToolbarGroup>
          <Styled.ToolbarGroup>
            {mode === 'edit' && (
              <Styled.SaveStatus $state={saveState}>
                {saveStatusLabel}
              </Styled.SaveStatus>
            )}
            {mode === 'edit' && (
              <Button
                variant='outlined'
                disabled={saveState === 'saved'}
                onClick={() => {
                  void save()
                }}
              >
                <Icon data={ICONS.save} size={18} />
                Save
              </Button>
            )}
            {(['desktop', 'tablet', 'mobile'] as TDevice[]).map((value) => (
              <Button
                key={value}
                variant={device === value ? 'contained_icon' : 'ghost_icon'}
                aria-label={`${value} width`}
                aria-pressed={device === value}
                onClick={() => setDevice(value)}
              >
                <Icon data={ICONS[DEVICE_ICONS[value]]} size={18} />
              </Button>
            ))}
            {mode === 'edit' && (
              <>
                <Tooltip title='Coarser grid (fewer cells)'>
                  <Button
                    variant='ghost_icon'
                    aria-label='decrease grid density'
                    disabled={
                      activeModel.size.columns <= MIN_GRID_CELLS &&
                      activeModel.size.rows <= MIN_GRID_CELLS
                    }
                    onClick={() => handleDensity(1 / DENSITY_STEP)}
                  >
                    <Icon data={ICONS.zoom_out} size={18} />
                  </Button>
                </Tooltip>
                <Tooltip title='Grid density (Ctrl/Cmd + scroll to zoom)'>
                  <span
                    style={{ fontSize: 13, minWidth: 56, textAlign: 'center' }}
                  >
                    {activeModel.size.columns}×{activeModel.size.rows}
                  </span>
                </Tooltip>
                <Tooltip title='Finer grid (more cells, micro adjustments)'>
                  <Button
                    variant='ghost_icon'
                    aria-label='increase grid density'
                    disabled={
                      activeModel.size.columns >= MAX_GRID_CELLS &&
                      activeModel.size.rows >= MAX_GRID_CELLS
                    }
                    onClick={() => handleDensity(DENSITY_STEP)}
                  >
                    <Icon data={ICONS.zoom_in} size={18} />
                  </Button>
                </Tooltip>
              </>
            )}
            <Button
              variant={showJson ? 'contained' : 'outlined'}
              onClick={() => setShowJson((value) => !value)}
            >
              Advanced: JSON
            </Button>
            <Button
              variant={mode === 'edit' ? 'contained' : 'outlined'}
              onClick={() => setMode('edit')}
            >
              <Icon data={ICONS.edit} size={18} />
              Edit
            </Button>
            <Button
              variant={mode === 'preview' ? 'contained' : 'outlined'}
              onClick={() => setMode('preview')}
            >
              <Icon data={ICONS.visibility} size={18} />
              Preview
            </Button>
          </Styled.ToolbarGroup>
        </Styled.Toolbar>

        {mode === 'edit' && !showJson && (
          <Styled.LeftPanel>
            <WidgetPalette onAdd={handleAdd} />
            <Outline
              items={activeModel.items}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onEnter={handleEnter}
            />
          </Styled.LeftPanel>
        )}

        {showJson ? (
          <Styled.CanvasPanel
            style={{ gridColumn: '1 / -1', background: '#1e1e1e' }}
          >
            <pre style={{ color: '#d4d4d4', fontSize: 12, margin: 0 }}>
              {JSON.stringify(serializeSite(site), null, 2)}
            </pre>
          </Styled.CanvasPanel>
        ) : mode === 'edit' ? (
          <Canvas
            model={activeModel}
            selectedIndex={selectedIndex}
            frameWidth={frameWidth}
            breadcrumb={breadcrumb}
            onSelect={setSelectedIndex}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onMove={handleMove}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
            onEnter={handleEnter}
            onDensity={handleDensity}
            nav={navSidebar}
            navbar={navbar}
          />
        ) : (
          <Styled.CanvasPanel style={{ gridColumn: '1 / -1' }}>
            <Styled.SiteShell>
              {navbar}
              <Styled.SiteFrame>
                {navSidebar}
                <Styled.SitePageArea>
                  <Styled.DeviceFrame $maxWidth={frameWidth}>
                    <ErrorBoundary message='A widget could not render. Bind its data (scope) in the inspector or remove it, then preview again.'>
                      <GridPlugin
                        type={type}
                        idReference={idReference}
                        config={previewConfig}
                        onSubmit={onSubmit}
                        onChange={onChange}
                      />
                    </ErrorBoundary>
                  </Styled.DeviceFrame>
                </Styled.SitePageArea>
              </Styled.SiteFrame>
            </Styled.SiteShell>
          </Styled.CanvasPanel>
        )}

        {mode === 'edit' && !showJson && (
          <Inspector
            item={selectedItem}
            block={selectedBlock}
            gridSize={activeModel.size}
            dataSource={idReference ? splitAddress(idReference).dataSource : ''}
            {...inspectorHandlers}
          />
        )}
      </Styled.BuilderLayout>
      <Toast toast={toast} onClose={dismiss} />
    </DndContext>
  )
}
