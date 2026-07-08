import styled from 'styled-components'

export const ChartContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 0;
`

export const ChartTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
`

export const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6f6f6f;
  text-align: center;
`

export const Svg = styled.svg`
  display: block;
  flex: 1;
  min-height: 0;
`

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 4px;
`

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #3d3d3d;
`

export const LegendSwatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${(props) => props.$color};
`
