import { markdownToRows, rowsToMarkdown } from './markdownTable'

describe('markdown table', () => {
  it('renders a cell grid as a GitHub-style markdown table', () => {
    const md = rowsToMarkdown([
      ['Name', 'Score'],
      ['Ada', '99'],
      ['Linus', '42'],
    ])
    expect(md).toBe(
      [
        '| Name | Score |',
        '| --- | --- |',
        '| Ada | 99 |',
        '| Linus | 42 |',
      ].join('\n')
    )
  })

  it('parses a markdown table into a cell grid, ignoring the separator', () => {
    const rows = markdownToRows(
      '| Name | Score |\n| --- | --- |\n| Ada | 99 |\n| Linus | 42 |'
    )
    expect(rows).toEqual([
      ['Name', 'Score'],
      ['Ada', '99'],
      ['Linus', '42'],
    ])
  })

  it('round-trips a grid through markdown and back', () => {
    const original = [
      ['A', 'B', 'C'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]
    expect(markdownToRows(rowsToMarkdown(original))).toEqual(original)
  })

  it('escapes and restores pipes inside cells', () => {
    const original = [
      ['Expression', 'Result'],
      ['a | b', 'true'],
    ]
    const md = rowsToMarkdown(original)
    expect(md).toContain('a \\| b')
    expect(markdownToRows(md)).toEqual(original)
  })

  it('pads ragged rows to the widest row when rendering', () => {
    const md = rowsToMarkdown([['A', 'B'], ['only-one']])
    expect(md).toBe(
      ['| A | B |', '| --- | --- |', '| only-one |  |'].join('\n')
    )
  })

  it('tolerates missing separators and surrounding pipes', () => {
    const rows = markdownToRows('Name | Score\nAda | 99')
    expect(rows).toEqual([
      ['Name', 'Score'],
      ['Ada', '99'],
    ])
  })

  it('skips blank lines and trims surrounding whitespace', () => {
    const rows = markdownToRows('\n  | A | B |  \n\n| 1 | 2 |\n')
    expect(rows).toEqual([
      ['A', 'B'],
      ['1', '2'],
    ])
  })

  it('returns an empty grid for empty input and an empty string for no rows', () => {
    expect(markdownToRows('')).toEqual([])
    expect(markdownToRows('   \n  ')).toEqual([])
    expect(rowsToMarkdown([])).toBe('')
  })
})
