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

export const LeftPanel = styled.div`
  grid-area: palette;
  border-right: 1px solid #d3d3d3;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const PalettePanel = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  padding: 12px;
  overflow-y: auto;
  background: #fff;
`

export const OutlinePanel = styled.div`
  flex: 0 0 auto;
  max-height: 40%;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  overflow-y: auto;
  background: #fafafa;
`

export const OutlineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
`

export const OutlineRow = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 4px 6px;
  border: 1px solid
    ${(props) => (props.$selected ? '#007079' : 'transparent')};
  border-radius: 4px;
  background: ${(props) => (props.$selected ? '#f0f7f7' : 'transparent')};
  cursor: pointer;
  font-size: 13px;
  text-align: left;

  &:hover {
    background: #f0f7f7;
  }
`

export const OutlineLabel = styled.span`
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const OutlineCount = styled.span`
  flex: 0 0 auto;
  color: #6f6f6f;
  font-size: 11px;
`

export const OutlineEmpty = styled.div`
  color: #9e9e9e;
  font-size: 12px;
  padding: 6px 0;
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

export const DeviceFrame = styled.div<{ $maxWidth: string }>`
  max-width: ${(props) => props.$maxWidth};
  margin: 0 auto;
  height: 100%;
  transition: max-width 0.2s ease;
`

export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #6f6f6f;
`

export const BreadcrumbButton = styled.button<{ $current: boolean }>`
  border: none;
  background: none;
  padding: 2px 4px;
  cursor: ${(props) => (props.$current ? 'default' : 'pointer')};
  color: ${(props) => (props.$current ? '#3d3d3d' : '#007079')};
  font-weight: ${(props) => (props.$current ? 600 : 400)};
  font-size: 13px;

  &:hover {
    text-decoration: ${(props) => (props.$current ? 'none' : 'underline')};
  }
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
