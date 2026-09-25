import { Button } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import styled, { css } from 'styled-components'
import { Stack } from '../../common'
import type { FillVariant } from '../MediaViewerPlugin.types'

export const NoPreviewMessage = styled(Stack)`
  border: 1px solid ${tokens.colors.interactive.primary__resting.rgba};
  background: ${tokens.colors.interactive.primary__hover_alt.rgba};
`

type MediaWrapperStyleProps = {
  $height?: number
  $width?: number
  $fill?: FillVariant
}

export const MediaPluginWrapper = styled.div<
  MediaWrapperStyleProps & { $isDocument?: boolean }
>`
  ${({ $fill }) =>
    $fill === 'height' || $fill === 'both'
      ? css`
          min-height: 0;
          flex-grow: 1;
        `
      : css`
          height: fit-content;
        `};
  width: ${({ $fill, $width, $isDocument }) =>
    $fill === 'width' || $fill === 'both' || (!$width && $isDocument)
      ? '100%'
      : 'fit-content'};
`

export const MediaWrapper = styled.div<{
  $height?: number
  $width?: number
  $fill?: FillVariant
  $isDocument?: boolean
}>`
  position: relative;
  ${({ $fill, $height, $isDocument }) =>
    $fill === 'height' || $fill === 'both'
      ? css`
          height: 100%;
        `
      : css`
          height: ${$height ? `${$height}px` : $isDocument ? '75vh' : 'fit-content'};
        `};
  ${({ $fill, $width, $isDocument }) =>
    $fill === 'width' || $fill === 'both'
      ? css`
          width: 100%;
        `
      : css`
          width: ${$width ? `${$width}px` : $isDocument ? '100%' : 'fit-content'};
        `};
`

export const MetaPopoverButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 50;
  color: #595959;
`
