import { parse } from './parser'
import { Token } from './tokenizer'

describe('parse()', () => {
  it('works with a sample formula', () => {
    const result = parse([
      { type: 'atom', value: 'Mg' },
      { type: 'bracket', bracketType: 'round', bracketDirection: 'open' },
      { type: 'atom', value: 'O' },
      { type: 'atom', value: 'H' },
      { type: 'bracket', bracketType: 'round', bracketDirection: 'close' },
      { type: 'index', value: 2 },
    ] as Token[])

    expect(result.ok).toBe(true)
    expect((result as any).value as Node[]).toEqual([
      {
        type: 'index',
        index: 2,
        child: {
          type: 'group',
          children: [
            { type: 'atom', atom: 'H' },
            { type: 'atom', atom: 'O' },
          ],
        },
      },
      { type: 'atom', atom: 'Mg' },
    ])
  })

  it('fails with bad grouping', () => {
    const result = parse([
      { type: 'bracket', bracketType: 'round', bracketDirection: 'open' },
      { type: 'atom', value: 'O' },
      { type: 'atom', value: 'H' },
      { type: 'bracket', bracketType: 'square', bracketDirection: 'close' },
    ] as Token[])

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The brackets are not balanced'
    )
  })

  it('fails with bad grouping closing', () => {
    const result = parse([
      { type: 'bracket', bracketType: 'round', bracketDirection: 'open' },
      { type: 'atom', value: 'O' },
      { type: 'atom', value: 'H' },
    ] as Token[])

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The brackets are not balanced'
    )
  })

  it('fails with bad grouping opening', () => {
    const result = parse([
      { type: 'bracket', bracketType: 'round', bracketDirection: 'close' },
    ] as Token[])

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The brackets are not balanced'
    )
  })

  it('fails with orphan index', () => {
    const result = parse([
      { type: 'index', value: 2 },
      { type: 'atom', value: 'O' },
    ] as Token[])

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'An index must be preceded by an entity'
    )
  })
})
