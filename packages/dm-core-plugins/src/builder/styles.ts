import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'
import type { TGridSize } from '../grid'

// Aliases for EDS tokens used throughout this file.
const {
  interactive: {
    primary__resting: { hex: colorPrimary },
    primary__hover_alt: { hex: colorPrimaryHoverAlt },
    danger__hover: { hex: colorDangerHover },
    danger__resting: { hex: colorDangerResting },
  },
  text: {
    static_icons__default: { hex: colorTextDefault },
    static_icons__tertiary: { hex: colorTextTertiary },
  },
  ui: {
    background__default: { hex: colorBgDefault },
    background__light: { hex: colorBgLight },
    background__medium: { hex: colorBgMedium },
    background__warning: { hex: colorBgWarning },
    background__danger: { hex: colorBgDanger },
  },
} = tokens.colors

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
  border-bottom: 1px solid ${colorBgMedium};
  background: ${colorBgLight};
`

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const SaveStatus = styled.span<{ $state: 'saved' | 'saving' | 'dirty' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${(props) =>
    props.$state === 'dirty' ? colorDangerHover : colorTextTertiary};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) =>
      props.$state === 'saved'
        ? '#4caf50'
        : props.$state === 'saving'
          ? colorBgMedium
          : '#ffa000'};
  }
`

export const LeftPanel = styled.div`
  grid-area: palette;
  border-right: 1px solid ${colorBgMedium};
  background: ${colorBgDefault};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const PalettePanel = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  padding: 12px;
  overflow-y: auto;
  background: ${colorBgDefault};
`

export const OutlinePanel = styled.div`
  flex: 0 0 auto;
  max-height: 40%;
  padding: 12px;
  border-top: 1px solid ${colorBgMedium};
  overflow-y: auto;
  background: ${colorBgLight};
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
    ${(props) => (props.$selected ? colorPrimary : 'transparent')};
  border-radius: 4px;
  background: ${(props) =>
    props.$selected ? colorPrimaryHoverAlt : 'transparent'};
  cursor: pointer;
  font-size: 13px;
  text-align: left;

  &:hover {
    background: ${colorPrimaryHoverAlt};
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
  color: ${colorTextTertiary};
  font-size: 11px;
`

export const OutlineEmpty = styled.div`
  color: ${colorTextTertiary};
  font-size: 12px;
  padding: 6px 0;
`

export const PaletteGroupTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${colorTextTertiary};
  margin: 12px 0 6px;
`

export const PaletteCard = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  margin-bottom: 6px;
  border: 1px solid ${colorBgMedium};
  border-radius: 6px;
  background: ${colorBgDefault};
  cursor: grab;
  text-align: left;
  font-size: 13px;

  &:hover {
    border-color: ${colorPrimary};
    background: ${colorPrimaryHoverAlt};
  }

  &:active {
    cursor: grabbing;
  }
`

export const CanvasPanel = styled.div`
  grid-area: canvas;
  padding: 16px;
  overflow: auto;
  background: ${colorBgLight};
`

export const DeviceFrame = styled.div<{ $maxWidth: string }>`
  width: 100%;
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
  color: ${colorTextTertiary};
`

export const BreadcrumbButton = styled.button<{ $current: boolean }>`
  border: none;
  background: none;
  padding: 2px 4px;
  cursor: ${(props) => (props.$current ? 'default' : 'pointer')};
  color: ${(props) => (props.$current ? colorTextDefault : colorPrimary)};
  font-weight: ${(props) => (props.$current ? 600 : 400)};
  font-size: 13px;

  &:hover {
    text-decoration: ${(props) => (props.$current ? 'none' : 'underline')};
  }
`

export const CanvasGrid = styled.div<{ $size: TGridSize; $editing: boolean }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$size.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.$size.rows}, minmax(24px, 1fr));
  row-gap: ${(props) => props.$size.rowGap};
  column-gap: ${(props) => props.$size.columnGap};
  min-height: 100%;
  background-color: ${colorBgDefault};
  background-image: ${(props) =>
    props.$editing
      ? `linear-gradient(${colorBgMedium} 1px, transparent 1px), linear-gradient(90deg, ${colorBgMedium} 1px, transparent 1px)`
      : 'none'};
  background-size: ${(props) =>
    `calc(100% / ${props.$size.columns}) calc(100% / ${props.$size.rows})`};
  border: 1px solid ${colorBgMedium};
  border-radius: 6px;
  padding: 4px;
`

export const CanvasItem = styled.div<{
  $selected: boolean
  $dragging?: boolean
}>`
  position: relative;
  overflow: hidden;
  border: 2px solid
    ${(props) => (props.$selected ? colorPrimary : colorBgMedium)};
  border-radius: 6px;
  background: ${colorBgDefault};
  box-shadow: ${(props) =>
    props.$selected ? `0 0 0 2px ${colorPrimaryHoverAlt}` : 'none'};
  opacity: ${(props) => (props.$dragging ? 0.7 : 1)};
  z-index: ${(props) => (props.$dragging || props.$selected ? 2 : 1)};
`

export const CanvasItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 4px 6px;
  background: ${colorBgLight};
  border-bottom: 1px solid ${colorBgMedium};
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
    ${colorPrimary} 50% 60%,
    transparent 60% 70%,
    ${colorPrimary} 70% 80%,
    transparent 80%
  );
  touch-action: none;
`

export const CanvasItemBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: ${colorTextTertiary};
  font-size: 12px;
  height: 100%;
`

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colorTextTertiary};
  font-size: 14px;
  text-align: center;
`

export const InspectorPanel = styled.div`
  grid-area: inspector;
  border-left: 1px solid ${colorBgMedium};
  padding: 12px;
  overflow-y: auto;
  background: ${colorBgDefault};
`

export const InspectorEmpty = styled.div`
  color: ${colorTextTertiary};
  font-size: 13px;
  padding: 8px 0;
`

export const InspectorSection = styled.div`
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colorBgMedium};

  &:last-child {
    border-bottom: none;
  }
`

export const InspectorSectionTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${colorTextTertiary};
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
  color: ${colorTextTertiary};
  margin-top: 2px;
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  resize: vertical;
  padding: 8px;
  font-family: inherit;
  font-size: 13px;
  border: 1px solid ${colorBgMedium};
  border-radius: 0;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid ${colorPrimary};
    outline-offset: -2px;
  }
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${colorTextDefault};
  margin-bottom: 4px;
`

/* A small two-option segmented toggle used in inspector fields. */
export const SegmentedControl = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 8px;
`

export const SegmentButton = styled.button<{ $active: boolean }>`
  flex: 1 1 0;
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${(props) => (props.$active ? colorPrimary : colorBgMedium)};
  background: ${(props) => (props.$active ? colorPrimary : colorBgDefault)};
  color: ${(props) =>
    props.$active
      ? tokens.colors.text.static_icons__primary_white.hex
      : colorTextDefault};

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
    border-left: ${(props) => (props.$active ? undefined : 'none')};
  }

  &:hover {
    background: ${(props) =>
      props.$active ? colorPrimary : colorPrimaryHoverAlt};
  }
`

/* ------------------------------------------------------------------ *
 * Website nav sidebar (the site's own left navigation, shown in both *
 * edit and preview so the canvas is WYSIWYG).                        *
 * ------------------------------------------------------------------ */

export const SiteFrame = styled.div`
  display: flex;
  align-items: stretch;
  height: 100%;
  min-height: 0;
  gap: 0;
`

export const NavSidebar = styled.nav<{ $editing: boolean }>`
  flex: 0 0 200px;
  width: 200px;
  display: flex;
  flex-direction: column;
  background: ${colorBgLight};
  border-right: 1px solid ${colorBgMedium};
  border-radius: 6px 0 0 6px;
  overflow-y: auto;
  padding: 12px 8px;
  box-sizing: border-box;
`

export const NavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 0 4px 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${colorTextTertiary};
`

export const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const NavItem = styled.div<{ $active: boolean; $dragging?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) =>
    props.$active
      ? tokens.colors.text.static_icons__primary_white.hex
      : colorTextDefault};
  background: ${(props) => (props.$active ? colorPrimary : 'transparent')};
  opacity: ${(props) => (props.$dragging ? 0.5 : 1)};

  &:hover {
    background: ${(props) => (props.$active ? colorPrimary : colorBgMedium)};
  }
`

export const NavItemLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NavItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  flex: 0 0 auto;
`

export const NavDragHandle = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: grab;
  color: inherit;
  opacity: 0.6;

  &:active {
    cursor: grabbing;
  }
`

export const NavDisclosure = styled.button<{ $expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  transform: rotate(${(props) => (props.$expanded ? 90 : 0)}deg);
  transition: transform 0.15s ease;
`

export const NavDisclosureSpacer = styled.span`
  flex: 0 0 auto;
  width: 18px;
`

export const NavRenameInput = styled.input`
  flex: 1;
  min-width: 0;
  font: inherit;
  font-size: 14px;
  padding: 2px 4px;
  border: 1px solid ${colorPrimary};
  border-radius: 4px;
  box-sizing: border-box;
`

export const NavAddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  padding: 6px 8px;
  border: 1px dashed ${colorBgMedium};
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: ${colorPrimary};

  &:hover {
    background: ${colorPrimaryHoverAlt};
    border-color: ${colorPrimary};
  }
`

export const SitePageArea = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

/* ------------------------------------------------------------------ *
 * Customizable top navbar (a full-width header above the sidebar and *
 * content, shared by every page and rendered in edit + preview).     *
 * ------------------------------------------------------------------ */

/** Column wrapper: navbar on top, then the sidebar + content row below. */
export const SiteShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`

export const Navbar = styled.header<{ $background: string; $color: string }>`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 0 0 auto;
  padding: 10px 16px;
  background: ${(props) => props.$background};
  color: ${(props) => props.$color};
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px 6px 0 0;
  box-sizing: border-box;
`

export const NavbarBrand = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.$color};
`

export const NavbarBrandInput = styled.input`
  font: inherit;
  font-size: 18px;
  font-weight: 700;
  color: inherit;
  background: rgba(255, 255, 255, 0.85);
  padding: 2px 6px;
  border: 1px solid ${colorPrimary};
  border-radius: 4px;
  box-sizing: border-box;
`

export const NavbarItems = styled.nav<{ $align: 'left' | 'center' | 'right' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1 1 auto;
  min-width: 0;
  justify-content: ${(props) =>
    props.$align === 'left'
      ? 'flex-start'
      : props.$align === 'center'
        ? 'center'
        : 'flex-end'};
`

export const NavbarLink = styled.button<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 15px;
  color: ${(props) => props.$color};

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`

export const NavbarItemEditor = styled.div<{ $dragging?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.6);
  opacity: ${(props) => (props.$dragging ? 0.5 : 1)};
`

export const NavbarItemInput = styled.input`
  font: inherit;
  font-size: 14px;
  color: ${colorTextDefault};
  background: ${colorBgDefault};
  padding: 2px 4px;
  border: 1px solid ${colorPrimary};
  border-radius: 4px;
  box-sizing: border-box;
  width: 100px;
`

export const NavbarTargetSelect = styled.select`
  font: inherit;
  font-size: 13px;
  color: ${colorTextDefault};
  background: ${colorBgDefault};
  padding: 2px 4px;
  border: 1px solid ${colorBgMedium};
  border-radius: 4px;
  box-sizing: border-box;
  max-width: 140px;
`

export const NavbarUrlInput = styled.input`
  font: inherit;
  font-size: 13px;
  color: ${colorTextDefault};
  background: ${colorBgDefault};
  padding: 2px 4px;
  border: 1px solid ${colorBgMedium};
  border-radius: 4px;
  box-sizing: border-box;
  width: 140px;
`

export const NavbarAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px dashed rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`

export const NavbarEmptyAffordance = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex: 0 0 auto;
  padding: 10px 16px;
  border: 1px dashed ${colorBgMedium};
  border-radius: 6px 6px 0 0;
  background: ${colorBgLight};
  cursor: pointer;
  font-size: 14px;
  color: ${colorPrimary};
  box-sizing: border-box;

  &:hover {
    background: ${colorPrimaryHoverAlt};
    border-color: ${colorPrimary};
  }
`

export const NavbarSettings = styled.div`
  position: relative;
  flex: 0 0 auto;
`

export const NavbarSettingsPanel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 220px;
  padding: 12px;
  background: ${colorBgDefault};
  color: ${colorTextDefault};
  border: 1px solid ${colorBgMedium};
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
`

export const NavbarSettingsRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
`
