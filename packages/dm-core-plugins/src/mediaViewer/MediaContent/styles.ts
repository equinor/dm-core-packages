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

export const MediaPluginWrapper = styled.div<MediaWrapperStyleProps>`
  ${({ $fill }) =>
    $fill === 'height' || $fill === 'both'
      ? css`
          min-height: 0;
          flex-grow: 1;
        `
      : css`
          height: fit-content;
        `};
  width: ${({ $fill }) => ($fill === 'width' || $fill === 'both' ? '100%' : 'fit-content')};
`

export const MediaWrapper = styled.div<{
  $height?: number
  $width?: number
  $fill?: FillVariant
}>`
  position: relative;
  ${({ $fill, $height }) =>
    $fill === 'height' || $fill === 'both'
      ? css`
          height: 100%;
        `
      : css`
          height: ${$height ? `${$height}px` : 'fit-content'};
        `};
  ${({ $fill, $width }) =>
    $fill === 'width' || $fill === 'both'
      ? css`
          width: 100%;
        `
      : css`
          width: ${$width ? `${$width}px` : 'fit-content'};
        `};
`

export const MetaPopoverButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 50;
  color: #595959;
`
