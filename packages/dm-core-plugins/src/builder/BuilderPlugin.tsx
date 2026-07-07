import {
  type IUIPlugin,
  splitAddress,
  useApplication,
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
import { Icon } from '@equinor/eds-core-react'
import { Fragment, useCallback, useEffect, useState } from 'react'
import type { TGridArea, TGridItem } from '../grid'
import {
  BuilderToolbar,
  DEVICE_WIDTHS,
  type TDevice,
} from './components/BuilderToolbar'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { Navbar } from './components/Navbar'
import { NavSidebar } from './components/NavSidebar'
import { Outline } from './components/Outline'
import { SiteGrid } from './components/SiteGrid'
import { SiteShellView } from './components/SiteShellView'
import { Toast } from './components/Toast'
import { WidgetPalette } from './components/WidgetPalette'
import { useEditorShortcuts } from './hooks/useEditorShortcuts'
import { usePersistence } from './hooks/usePersistence'
import { getBlock } from './model/blocks'
import { useHistory } from './model/history'
import {
  addWidget,
  clampPath,
  deserialize,
  duplicateWidget,
  getSubModel,
  insertWidgetItem,
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
} from './model/model'
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
  type TBuilderSite,
  type TNavbar,
  type TNavbarItem,
  updateNavbar,
  updateNavItem,
  updateSiteMeta,
} from './model/site'
import * as Styled from './styles'
import type {
  TBlock,
  TBuilderMode,
  TBuilderModel,
  TBuilderPluginConfig,
} from './types'
import { ICONS } from './utils/icons'
import { useToast } from './utils/toast'

export const BuilderPlugin = (
  props: IUIPlugin & { config?: TBuilderPluginConfig }
): React.ReactElement => {
  const { config, idReference, type, onSubmit, onChange } = props

  const { document } = useDocument<Record<string, unknown>>(idReference, 1)

  const history = useHistory(() =>
    deserializeSite(config?.initialConfig ?? null)
  )
  const site = history.present
  const setSite = history.set
  const [activePageId, setActivePageId] = useState<string>(
    () => site.pages[0]?.id ?? ''
  )
  const readOnly = config?.readOnly ?? false
  const { role, dmssAPI } = useApplication()
  // When `editorRoles` is configured, only those roles may edit; everyone else
  // is shown the read-only viewer. An empty/absent list means editing is open.
  const editorRoles = config?.editorRoles
  const roleAllowsEditing =
    !editorRoles?.length || editorRoles.includes(role?.name)
  const locked = readOnly || !roleAllowsEditing
  const [mode, setMode] = useState<TBuilderMode>(
    locked ? 'preview' : (config?.mode ?? 'edit')
  )
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

  // ---- Site metadata (display name + publish state) ----------------------

  const handleRenameSite = (title: string) =>
    setSite((current) => updateSiteMeta(current, { title }), 'rename-site')

  const handleTogglePublished = () =>
    setSite(
      (current) => updateSiteMeta(current, { published: !current.published }),
      'publish'
    )

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

  // Keyboard shortcuts for editing (undo/redo, copy/paste/duplicate/delete).
  useEditorShortcuts({
    enabled: mode === 'edit' && !showJson,
    selectedIndex,
    hasClipboard: clipboard !== null,
    onUndo: () => history.undo(),
    onRedo: () => history.redo(),
    onCopy: handleCopy,
    onPaste: handlePaste,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onDeselect: () => setSelectedIndex(null),
  })

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

  // Loading and saving the site (hydration, autosave, manual save, unload guard).
  const handleSiteLoaded = useCallback((loaded: TBuilderSite) => {
    setActivePageId(loaded.pages[0]?.id ?? '')
    setPath([])
    setSelectedIndex(null)
  }, [])

  const { saveState, saveStatusLabel, save } = usePersistence({
    site,
    document,
    idReference,
    dmssAPI,
    locked,
    onChange,
    notify,
    setSite,
    onSiteLoaded: handleSiteLoaded,
  })

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

  const siteGrid = (
    <SiteGrid
      type={type}
      idReference={idReference}
      config={previewConfig}
      onSubmit={onSubmit}
      onChange={onChange}
    />
  )

  // Read-only viewer: render the published site (navbar, page navigation and
  // content) with no editing chrome. Reached when the recipe sets `readOnly` or
  // the current role isn't allowed to edit. Multi-page navigation still works so
  // end users can browse the built site, but nothing here can mutate or persist it.
  if (locked) {
    return (
      <Styled.BuilderLayout>
        <SiteShellView
          navbar={navbar}
          navSidebar={navSidebar}
          errorMessage='This page could not be displayed.'
        >
          {siteGrid}
        </SiteShellView>
      </Styled.BuilderLayout>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd}
    >
      <Styled.BuilderLayout>
        <BuilderToolbar
          config={config}
          mode={mode}
          locked={locked}
          siteTitle={site.title}
          published={site.published}
          saveState={saveState}
          saveStatusLabel={saveStatusLabel}
          device={device}
          gridColumns={activeModel.size.columns}
          gridRows={activeModel.size.rows}
          showJson={showJson}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onSetMode={setMode}
          onRenameSite={handleRenameSite}
          onCommit={() => history.commit()}
          onUndo={() => history.undo()}
          onRedo={() => history.redo()}
          onTogglePublished={handleTogglePublished}
          onApplyTemplate={handleApplyTemplate}
          onSave={() => {
            void save()
          }}
          onSetDevice={setDevice}
          onDensity={handleDensity}
          onToggleJson={() => setShowJson((value) => !value)}
        />

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
          <Styled.JsonPanel>
            <Styled.JsonPre>
              {JSON.stringify(serializeSite(site), null, 2)}
            </Styled.JsonPre>
          </Styled.JsonPanel>
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
          <SiteShellView
            navbar={navbar}
            navSidebar={navSidebar}
            maxWidth={frameWidth}
            errorMessage='A widget could not render. Bind its data (scope) in the inspector or remove it, then preview again.'
          >
            {siteGrid}
          </SiteShellView>
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
