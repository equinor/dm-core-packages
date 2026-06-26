import styled from 'styled-components'
import type { TGridSize } from '../grid/types'

export const BuilderLayout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr 300px;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'toolbar toolbar toolbar'
    'palette canvas inspector';
  height: 100%;
  min-height: 480px;
  gap: 0;
`

export const Toolbar = styled.div`
  grid-area: toolbar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #d3d3d3;
  background: #fafafa;
`

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PalettePanel = styled.div`
  grid-area: palette;
  border-right: 1px solid #d3d3d3;
  padding: 12px;
  overflow-y: auto;
  background: #fff;
`

export const PaletteGroupTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6f6f6f;
  margin: 12px 0 6px;
`

export const PaletteCard = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  margin-bottom: 6px;
  border: 1px solid #d3d3d3;
  border-radius: 6px;
  background: #fff;
  cursor: grab;
  text-align: left;
  font-size: 13px;

  &:hover {
    border-color: #007079;
    background: #f0f7f7;
  }

  &:active {
    cursor: grabbing;
  }
`

export const CanvasPanel = styled.div`
  grid-area: canvas;
  padding: 16px;
  overflow: auto;
  background: #f3f3f3;
`

export const CanvasGrid = styled.div<{ $size: TGridSize; $editing: boolean }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$size.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.$size.rows}, minmax(48px, 1fr));
  row-gap: ${(props) => props.$size.rowGap};
  column-gap: ${(props) => props.$size.columnGap};
  min-height: 100%;
  background-color: #fff;
  background-image: ${(props) =>
    props.$editing
      ? 'linear-gradient(#e6e6e6 1px, transparent 1px), linear-gradient(90deg, #e6e6e6 1px, transparent 1px)'
      : 'none'};
  background-size: ${(props) =>
    `calc(100% / ${props.$size.columns}) calc(100% / ${props.$size.rows})`};
  border: 1px solid #d3d3d3;
  border-radius: 6px;
  padding: 4px;
`

export const CanvasItem = styled.div<{
  $selected: boolean
  $dragging?: boolean
}>`
  position: relative;
  overflow: hidden;
  border: 2px solid ${(props) => (props.$selected ? '#007079' : '#bcbcbc')};
  border-radius: 6px;
  background: #fff;
  box-shadow: ${(props) =>
    props.$selected ? '0 0 0 2px rgba(0,112,121,0.2)' : 'none'};
  opacity: ${(props) => (props.$dragging ? 0.7 : 1)};
  z-index: ${(props) => (props.$dragging || props.$selected ? 2 : 1)};
`

export const CanvasItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 4px 6px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-size: 12px;
  font-weight: 600;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

export const CanvasItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`

export const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
  background: linear-gradient(
    135deg,
    transparent 0 50%,
    #007079 50% 60%,
    transparent 60% 70%,
    #007079 70% 80%,
    transparent 80%
  );
  touch-action: none;
`

export const CanvasItemBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #6f6f6f;
  font-size: 12px;
  height: 100%;
`

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  font-size: 14px;
  text-align: center;
`

export const InspectorPanel = styled.div`
  grid-area: inspector;
  border-left: 1px solid #d3d3d3;
  padding: 12px;
  overflow-y: auto;
  background: #fff;
`

export const InspectorEmpty = styled.div`
  color: #9e9e9e;
  font-size: 13px;
  padding: 8px 0;
`

export const InspectorSection = styled.div`
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`

export const InspectorSectionTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6f6f6f;
  margin-bottom: 8px;
`

export const InspectorField = styled.div`
  margin-bottom: 10px;
`

export const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

export const FieldHelp = styled.div`
  font-size: 11px;
  color: #6f6f6f;
  margin-top: 2px;
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  resize: vertical;
  padding: 8px;
  font-family: inherit;
  font-size: 13px;
  border: 1px solid #897e7e;
  border-radius: 0;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid #007079;
    outline-offset: -2px;
  }
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #3d3d3d;
  margin-bottom: 4px;
`
