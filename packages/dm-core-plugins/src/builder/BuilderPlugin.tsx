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
import { useState } from 'react'
import { GridPlugin } from '../grid/GridPlugin'
import type { TGridArea } from '../grid/types'
import { getBlock } from './blocks'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { WidgetPalette } from './components/WidgetPalette'
import { ICONS } from './icons'
import {
  addWidget,
  createEmptyModel,
  deserialize,
  duplicateWidget,
  moveWidget,
  removeWidget,
  resizeWidget,
  serialize,
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleAdd = (block: TBlock) =>
    setModel((current) => addWidget(current, block))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || over.id !== 'canvas') return
    const blockId = active.data.current?.blockId
    if (!blockId) return
    const block = getBlock(blockId)
    if (block) handleAdd(block)
  }

  const handleDelete = (index: number) => {
    setModel((current) => removeWidget(current, index))
    setSelectedIndex(null)
  }

  const handleDuplicate = (index: number) =>
    setModel((current) => duplicateWidget(current, index))

  const handleMove = (index: number, deltaColumns: number, deltaRows: number) =>
    setModel((current) => {
      const item = current.items[index]
      if (!item) return current
      const area = translateArea(item.gridArea, deltaColumns, deltaRows)
      const next = moveWidget(current, index, area)
      // Reject moves that would stack this widget on top of another.
      if (wouldOverlap(next, index, next.items[index].gridArea)) return current
      return next
    })

  const handleResize = (index: number, area: TGridArea) =>
    setModel((current) => {
      if (!current.items[index]) return current
      const next = resizeWidget(current, index, area)
      if (wouldOverlap(next, index, next.items[index].gridArea)) return current
      return next
    })

  const handleSetArea = (index: number, area: TGridArea) =>
    setModel((current) => {
      if (!current.items[index]) return current
      const next = setWidgetArea(current, index, area)
      if (wouldOverlap(next, index, next.items[index].gridArea)) return current
      return next
    })

  const selectedItem =
    selectedIndex !== null ? (model.items[selectedIndex] ?? null) : null
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
      setModel((current) => setWidgetTitle(current, selectedIndex, value)),
    onLabel: (value: string) =>
      selectedIndex !== null &&
      setModel((current) => setWidgetLabel(current, selectedIndex, value)),
    onScope: (value: string) =>
      selectedIndex !== null &&
      setModel((current) => setWidgetScope(current, selectedIndex, value)),
    onArea: (area: TGridArea) =>
      selectedIndex !== null && handleSetArea(selectedIndex, area),
    onConfigValue: (key: string, value: unknown) =>
      selectedIndex !== null &&
      setModel((current) =>
        setWidgetConfigValue(current, selectedIndex, key, value)
      ),
  }

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
          </Styled.ToolbarGroup>
          <Styled.ToolbarGroup>
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
            model={model}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onMove={handleMove}
            onResize={handleResize}
          />
        ) : (
          <Styled.CanvasPanel style={{ gridColumn: '1 / -1' }}>
            <GridPlugin
              type={type}
              idReference={idReference}
              config={previewConfig}
              onSubmit={onSubmit}
              onChange={onChange}
            />
          </Styled.CanvasPanel>
        )}

        {mode === 'edit' && !showJson && (
          <Inspector
            item={selectedItem}
            block={selectedBlock}
            gridSize={model.size}
            {...inspectorHandlers}
          />
        )}
      </Styled.BuilderLayout>
    </DndContext>
  )
}
