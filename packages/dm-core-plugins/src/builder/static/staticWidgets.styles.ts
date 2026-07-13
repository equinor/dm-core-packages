import { Button } from '@equinor/eds-core-react'
import type { CSSProperties } from 'react'
import styled from 'styled-components'

export const FullWidth = styled.div`
  width: 100%;
`

export const Heading = styled.h2<{
  $align: 'left' | 'center' | 'right'
  $color?: string
  $fontSize: string
}>`
  margin: 0;
  text-align: ${(props) => props.$align};
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize};
  font-weight: 600;
  line-height: 1.2;
`

export const ButtonContainer = styled.div<{
  $justifyContent: CSSProperties['justifyContent']
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.$justifyContent};
  width: 100%;
  height: 100%;
`

export const OverflowHiddenButton = styled(Button)`
  overflow: hidden;
`

export const DividerContainer = styled.div<{ $spacing: number }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.$spacing}px 0;
  box-sizing: border-box;
`

export const DividerLine = styled.hr<{ $color: string; $thickness: number }>`
  width: 100%;
  border: none;
  border-top: ${(props) => props.$thickness}px solid ${(props) => props.$color};
  margin: 0;
`

export const Spacer = styled.div<{ $height: number }>`
  width: 100%;
  height: ${(props) => props.$height}px;
`

export const EmptyMessage = styled.div`
  padding: 16px;
  color: #6f6f6f;
  text-align: center;
`

export const EmbedFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  aspect-ratio: 16 / 9;
`

export const EmbedIframe = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
`

export const MetricContainer = styled.div<{
  $alignItems: CSSProperties['alignItems']
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(props) => props.$alignItems};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
`

export const MetricLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #6f6f6f;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

export const MetricValue = styled.div<{ $color: string }>`
  font-size: 40px;
  font-weight: 700;
  line-height: 1.1;
  color: ${(props) => props.$color};
`

export const MetricUnit = styled.span`
  font-size: 20px;
  font-weight: 500;
  margin-left: 4px;
`
