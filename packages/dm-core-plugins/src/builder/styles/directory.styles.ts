import { Button, Dialog, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

// EDS token aliases used by the Site directory and its cards.
const {
  interactive: {
    danger__resting: { hex: colorDangerResting },
  },
  text: {
    static_icons__tertiary: { hex: colorTextTertiary },
    static_icons__primary_white: { hex: colorTextWhite },
  },
  ui: {
    background__default: { hex: colorBgDefault },
    background__medium: { hex: colorBgMedium },
  },
} = tokens.colors

// ---- Directory layout ---------------------------------------------------

export const Root = styled.div`
  width: 100%;
`

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const DialogActions = styled(Dialog.Actions)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const AlertRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
`

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`

/** Muted helper/caption text (loading, empty and info messages). */
export const MutedText = styled(Typography)`
  color: ${colorTextTertiary};
`

/** Danger message shown inside the delete dialog. */
export const DialogErrorText = styled(Typography)`
  color: ${colorDangerResting};
  margin-top: 8px;
`

/** Create-error banner above the gallery. */
export const CreateErrorText = styled(Typography)`
  margin-bottom: 12px;
`

export const EmptyTitle = styled(Typography)`
  margin-bottom: 8px;
  color: ${colorTextTertiary};
`

// ---- Site card ----------------------------------------------------------

export const Card = styled.div<{ $deleting: boolean }>`
  border-radius: 12px;
  background: ${colorBgDefault};
  border: 1px solid ${colorBgMedium};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    box-shadow 0.15s ease,
    transform 0.15s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
  opacity: ${(props) => (props.$deleting ? 0.5 : 1)};

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
    transform: translateY(-2px);
  }
  
`

/** Coloured banner; hue is derived per-site so each card looks distinct. */
export const Banner = styled.div<{ $hue: number }>`
  background: linear-gradient(
    135deg,
    hsl(${(props) => props.$hue}, 55%, 38%) 0%,
    hsl(${(props) => (props.$hue + 40) % 360}, 60%, 52%) 100%
  );
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
`

export const BannerInitial = styled.span`
  font-size: 52px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1;
  user-select: none;
  letter-spacing: -2px;
`

export const DraftBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  color: ${colorTextWhite};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`

export const CardBody = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
`

export const CardTitle = styled(Typography)`
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
`

export const CardCaption = styled(Typography)`
  color: ${colorTextTertiary};
  margin-bottom: 14px;
`

export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`

/** Link wrapping the primary "Open" button; grows to fill the row. */
export const OpenLink = styled.a`
  text-decoration: none;
  flex-grow: 1;
`

export const EditLink = styled.a`
  text-decoration: none;
`

export const FullWidthButton = styled(Button)`
  width: 100%;
`

export const DangerIconButton = styled(Button)`
  color: ${colorDangerResting};
`
