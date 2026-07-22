import type { IUIPlugin } from '@development-framework/dm-core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { max as arrayMax, min as arrayMin } from '../utils/mathUtils'
import * as S from './StaticChartPlugin.styles'

/**
 * A self-contained, dependency-free chart rendered as inline SVG. Data is
 * authored in the inspector as a small table (the same `table-source` field the
 * Table widget uses): the first row is the header, the first column holds the
 * x-axis labels and every other column is a numeric series.
 *
 * Mirrors the static-widget philosophy: no DMSS binding and no heavyweight
 * charting dependency, so authored pages render WYSIWYG in preview and when
 * published.
 */

export interface StaticChartPluginConfig {
  chartType?: 'line' | 'bar'
  /** First row = header, first column = x labels, other columns = series. */
  rows?: string[][]
  title?: string
  showLegend?: boolean
  /** Base color; multi-series charts cycle through a palette from here. */
  color?: string
}

const PALETTE = [
  '#0084c4',
  '#eb0000',
  '#4bb748',
  '#ff9200',
  '#7d0023',
  '#52c0ff',
]

interface ChartData {
  xLabels: string[]
  series: { name: string; values: number[] }[]
  yMin: number
  yMax: number
}

const parseChartData = (rows: string[][]): ChartData => {
  const header = rows[0] ?? []
  const body = rows.slice(1)
  const seriesNames = header.slice(1)
  const xLabels = body.map((row) => row[0] ?? '')

  const series = seriesNames.map((name, seriesIndex) => ({
    name: name || `Series ${seriesIndex + 1}`,
    values: body.map((row) => {
      const value = Number(row[seriesIndex + 1])
      return Number.isFinite(value) ? value : 0
    }),
  }))

  const allValues = series.flatMap((entry) => entry.values)
  const rawMin = Math.min(0, arrayMin(allValues))
  const rawMax = arrayMax(allValues)
  const yMax = rawMax === rawMin ? rawMin + 1 : rawMax

  return { xLabels, series, yMin: rawMin, yMax }
}

const useElementWidth = (): [
  React.RefObject<HTMLDivElement | null>,
  { width: number; height: number },
] => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry)
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, size]
}

const niceTicks = (min: number, max: number, count = 4): number[] => {
  const step = (max - min) / count
  return Array.from({ length: count + 1 }, (_, index) => min + step * index)
}

/** Render a line or bar chart from inline tabular config. */
export const StaticChartPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticChartPluginConfig }
): React.ReactElement => {
  const {
    chartType = 'line',
    rows = [],
    title,
    showLegend = true,
    color = PALETTE[0],
  } = props.config

  const [ref, size] = useElementWidth()
  const data = useMemo(() => parseChartData(rows), [rows])

  const colors = useMemo(() => {
    const base = [color, ...PALETTE.filter((entry) => entry !== color)]
    return data.series.map((_, index) => base[index % base.length])
  }, [color, data.series])

  const hasData = data.series.length > 0 && data.xLabels.length > 0

  const legendHeight = showLegend && data.series.length > 0 ? 24 : 0
  const titleHeight = title ? 24 : 0
  const width = Math.max(size.width, 120)
  const height = Math.max(size.height - titleHeight - legendHeight, 200)

  const margin = { top: 8, right: 12, bottom: 28, left: 40 }
  const plotWidth = Math.max(width - margin.left - margin.right, 10)
  const plotHeight = Math.max(height - margin.top - margin.bottom, 10)

  const xCount = data.xLabels.length
  const yToPx = (value: number): number => {
    const ratio = (value - data.yMin) / (data.yMax - data.yMin || 1)
    return margin.top + plotHeight - ratio * plotHeight
  }
  const xToPx = (index: number): number => {
    if (xCount <= 1) return margin.left + plotWidth / 2
    return margin.left + (index / (xCount - 1)) * plotWidth
  }

  const ticks = niceTicks(data.yMin, data.yMax)
  return (
    <S.ChartContainer ref={ref} className='dm-plugin-padding'>
      {title ? <S.ChartTitle>{title}</S.ChartTitle> : null}

      {!size ? null : !hasData ? (
        <S.EmptyMessage>
          Add data in the inspector: a header row, x labels in the first column
          and numbers in the rest.
        </S.EmptyMessage>
      ) : (
        <>
          <S.Svg
            width='100%'
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role='img'
            aria-label={title || 'Chart'}
          >
            <title>{title || 'Chart'}</title>

            {ticks.map((tick) => {
              const y = yToPx(tick)
              return (
                <g key={`tick-${tick}`}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={margin.left + plotWidth}
                    y2={y}
                    stroke='#e6e6e6'
                  />
                  <text
                    x={margin.left - 6}
                    y={y}
                    textAnchor='end'
                    dominantBaseline='middle'
                    fontSize={10}
                    fill='#6f6f6f'
                  >
                    {Number(tick.toFixed(2))}
                  </text>
                </g>
              )
            })}

            {data.xLabels.map((label, index) => (
              <text
                key={`x-${index}`}
                x={xToPx(index)}
                y={margin.top + plotHeight + 16}
                textAnchor='middle'
                fontSize={10}
                fill='#6f6f6f'
              >
                {label}
              </text>
            ))}

            <line
              x1={margin.left}
              y1={yToPx(Math.max(0, data.yMin))}
              x2={margin.left + plotWidth}
              y2={yToPx(Math.max(0, data.yMin))}
              stroke='#bbb'
            />

            {chartType === 'line'
              ? data.series.map((entry, seriesIndex) => (
                  <polyline
                    key={`line-${seriesIndex}`}
                    fill='none'
                    stroke={colors[seriesIndex]}
                    strokeWidth={2}
                    points={entry.values
                      .map((value, index) => `${xToPx(index)},${yToPx(value)}`)
                      .join(' ')}
                  />
                ))
              : data.xLabels.map((_, xIndex) => {
                  const groupWidth = plotWidth / Math.max(xCount, 1)
                  const barAreaWidth = groupWidth * 0.7
                  const barWidth =
                    barAreaWidth / Math.max(data.series.length, 1)
                  const groupStart =
                    margin.left +
                    groupWidth * xIndex +
                    (groupWidth - barAreaWidth) / 2
                  const baseline = yToPx(Math.max(0, data.yMin))
                  return (
                    <g key={`bargroup-${xIndex}`}>
                      {data.series.map((entry, seriesIndex) => {
                        const value = entry.values[xIndex] ?? 0
                        const y = yToPx(value)
                        const barTop = Math.min(y, baseline)
                        const barHeight = Math.abs(baseline - y)
                        return (
                          <rect
                            key={`bar-${xIndex}-${seriesIndex}`}
                            x={groupStart + seriesIndex * barWidth}
                            y={barTop}
                            width={Math.max(barWidth - 1, 1)}
                            height={barHeight}
                            fill={colors[seriesIndex]}
                          />
                        )
                      })}
                    </g>
                  )
                })}
          </S.Svg>

          {showLegend && data.series.length > 0 ? (
            <S.Legend>
              {data.series.map((entry, seriesIndex) => (
                <S.LegendItem key={`legend-${seriesIndex}`}>
                  <S.LegendSwatch $color={colors[seriesIndex]} />
                  {entry.name}
                </S.LegendItem>
              ))}
            </S.Legend>
          ) : null}
        </>
      )}
    </S.ChartContainer>
  )
}
