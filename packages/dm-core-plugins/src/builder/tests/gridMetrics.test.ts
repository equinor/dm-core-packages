import type { TGridSize } from '../../grid/types'
import { pixelDeltaToCells } from '../utils/gridMetrics'

describe('builder grid metrics', () => {
  const size: TGridSize = {
    columns: 12,
    rows: 8,
    rowGap: '16px',
    columnGap: '16px',
  }

  it('converts pixel deltas to rounded cell deltas', () => {
    const rect = { width: 232, height: 152 }
    // width stride: ((232 - 2 * 4) + 16) / 12 = 20
    // height stride: ((152 - 2 * 4) + 16) / 8 = 20
    expect(pixelDeltaToCells({ x: 40, y: 60 }, rect, size)).toEqual({
      columns: 2,
      rows: 3,
    })
    expect(pixelDeltaToCells({ x: -40, y: -20 }, rect, size)).toEqual({
      columns: -2,
      rows: -1,
    })
    expect(pixelDeltaToCells({ x: 9, y: -9 }, rect, size)).toEqual({
      columns: 0,
      rows: 0,
    })
  })

  it('returns zero for tracks with degenerate stride', () => {
    const noGapSize: TGridSize = { ...size, rowGap: '0px', columnGap: '0px' }

    expect(
      pixelDeltaToCells({ x: 40, y: 23 }, { width: 0, height: 100 }, noGapSize)
    ).toEqual({ columns: 0, rows: 2 })
    expect(
      pixelDeltaToCells({ x: 15, y: 40 }, { width: 100, height: 0 }, noGapSize)
    ).toEqual({ columns: 2, rows: 0 })
  })
})
