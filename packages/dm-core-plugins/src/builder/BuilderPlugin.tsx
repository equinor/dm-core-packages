import type { IUIPlugin } from '@development-framework/dm-core'
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
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { GridPlugin } from '../grid/GridPlugin'
import type { TGridArea, TGridItem } from '../grid/types'
import { getBlock } from './blocks'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { Outline } from './components/Outline'
import { TemplatesMenu } from './components/TemplatesMenu'
import { Toast } from './components/Toast'
import { WidgetPalette } from './components/WidgetPalette'
import { useHistory } from './history'
import { ICONS } from './icons'
import {
  addWidget,
  createEmptyModel,
  deserialize,
  duplicateWidget,
  getSubModel,
  insertWidgetItem,
  moveWidget,
  removeWidget,
  resizeWidget,
  serialize,
  setSubModel,
  setWidgetArea,
  setWidgetConfigValue,
  setWidgetLabel,
  setWidgetScope,
  setWidgetTitle,
  translateArea,
  wouldOverlap,
} from './model'
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

  const history = useHistory<TBuilderModel>(() =>
    config?.initialConfig
      ? deserialize(config.initialConfig)
      : createEmptyModel()
  )
  const model = history.present
  const setModel = history.set
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

  const handleMove = (
    index: number,
    deltaColumns: number,
    deltaRows: number
  ) => {
    const item = activeModel.items[index]
    if (!item) return
    const area = translateArea(item.gridArea, deltaColumns, deltaRows)
    const next = moveWidget(activeModel, index, area)
    // Reject moves that would stack this widget on top of another.
    if (wouldOverlap(next, index, next.items[index].gridArea)) {
      notify('That position overlaps another widget')
      return
    }
    updateActive(() => next)
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

  const handleSetArea = (index: number, area: TGridArea) => {
    const item = activeModel.items[index]
    if (!item) return
    const next = setWidgetArea(activeModel, index, area)
    if (wouldOverlap(next, index, next.items[index].gridArea)) {
      notify('That size overlaps another widget')
      return
    }
    updateActive(() => next, `area:${index}`)
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

  // Persisted JSON of the page. The baseline ref tracks what was last saved so
  // we can tell whether there are unsaved changes.
  const currentJson = useMemo(() => JSON.stringify(serialize(model)), [model])
  const savedJsonRef = useRef(currentJson)
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'dirty'>(
    'saved'
  )

  // Autosave: debounce changes and push them to the host via onChange. Without
  // an onChange handler there is nowhere to save to, so the page just stays
  // marked as having unsaved changes.
  useEffect(() => {
    if (currentJson === savedJsonRef.current) {
      setSaveState('saved')
      return
    }
    if (!onChange) {
      setSaveState('dirty')
      return
    }
    setSaveState('saving')
    const timer = setTimeout(() => {
      onChange(JSON.parse(currentJson))
      savedJsonRef.current = currentJson
      setSaveState('saved')
    }, 800)
    return () => clearTimeout(timer)
  }, [currentJson, onChange])

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
              {JSON.stringify(serialize(model), null, 2)}
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
          />
        ) : (
          <Styled.CanvasPanel style={{ gridColumn: '1 / -1' }}>
            <Styled.DeviceFrame $maxWidth={frameWidth}>
              <GridPlugin
                type={type}
                idReference={idReference}
                config={previewConfig}
                onSubmit={onSubmit}
                onChange={onChange}
              />
            </Styled.DeviceFrame>
          </Styled.CanvasPanel>
        )}

        {mode === 'edit' && !showJson && (
          <Inspector
            item={selectedItem}
            block={selectedBlock}
            gridSize={activeModel.size}
            {...inspectorHandlers}
          />
        )}
      </Styled.BuilderLayout>
      <Toast toast={toast} onClose={dismiss} />
    </DndContext>
  )
}
