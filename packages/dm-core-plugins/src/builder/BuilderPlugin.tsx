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
import { Button, Icon, Typography } from '@equinor/eds-core-react'
import { Fragment, useState } from 'react'
import { GridPlugin } from '../grid/GridPlugin'
import type { TGridArea } from '../grid/types'
import { getBlock } from './blocks'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { TemplatesMenu } from './components/TemplatesMenu'
import { WidgetPalette } from './components/WidgetPalette'
import { ICONS } from './icons'
import {
  addWidget,
  createEmptyModel,
  deserialize,
  duplicateWidget,
  getSubModel,
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

  const [model, setModel] = useState<TBuilderModel>(() =>
    config?.initialConfig
      ? deserialize(config.initialConfig)
      : createEmptyModel()
  )
  const [mode, setMode] = useState<TBuilderMode>(config?.mode ?? 'edit')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [path, setPath] = useState<number[]>([])
  const [device, setDevice] = useState<TDevice>('desktop')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  // The grid currently being edited (root, or a section drilled into via path).
  const activeModel = getSubModel(model, path)
  const frameWidth = DEVICE_WIDTHS[device]

  /** Apply a transform to the active (possibly nested) grid and write it back. */
  const updateActive = (updater: (model: TBuilderModel) => TBuilderModel) =>
    setModel((current) =>
      setSubModel(current, path, updater(getSubModel(current, path)))
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
  }

  const handleDuplicate = (index: number) =>
    updateActive((m) => duplicateWidget(m, index))

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
  }

  const handleMove = (index: number, deltaColumns: number, deltaRows: number) =>
    updateActive((m) => {
      const item = m.items[index]
      if (!item) return m
      const area = translateArea(item.gridArea, deltaColumns, deltaRows)
      const next = moveWidget(m, index, area)
      // Reject moves that would stack this widget on top of another.
      if (wouldOverlap(next, index, next.items[index].gridArea)) return m
      return next
    })

  const handleResize = (index: number, area: TGridArea) =>
    updateActive((m) => {
      if (!m.items[index]) return m
      const next = resizeWidget(m, index, area)
      if (wouldOverlap(next, index, next.items[index].gridArea)) return m
      return next
    })

  const handleSetArea = (index: number, area: TGridArea) =>
    updateActive((m) => {
      if (!m.items[index]) return m
      const next = setWidgetArea(m, index, area)
      if (wouldOverlap(next, index, next.items[index].gridArea)) return m
      return next
    })

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
      updateActive((m) => setWidgetTitle(m, selectedIndex, value)),
    onLabel: (value: string) =>
      selectedIndex !== null &&
      updateActive((m) => setWidgetLabel(m, selectedIndex, value)),
    onScope: (value: string) =>
      selectedIndex !== null &&
      updateActive((m) => setWidgetScope(m, selectedIndex, value)),
    onArea: (area: TGridArea) =>
      selectedIndex !== null && handleSetArea(selectedIndex, area),
    onConfigValue: (key: string, value: unknown) =>
      selectedIndex !== null &&
      updateActive((m) => setWidgetConfigValue(m, selectedIndex, key, value)),
  }

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
          </Styled.ToolbarGroup>
          <Styled.ToolbarGroup>
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

        {mode === 'edit' && !showJson && <WidgetPalette onAdd={handleAdd} />}

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
    </DndContext>
  )
}
