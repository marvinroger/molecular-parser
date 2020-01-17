import { Token, tokenize } from './tokenizer'

describe('tokenize()', () => {
  it('works with indexes', () => {
    const result = tokenize('23')

    expect(result.ok).toBe(true)
    expect((result as any).value as Token[]).toEqual([
      { type: 'index', value: 23 },
    ])
  })

  it('works with atoms', () => {
    const result = tokenize('HO')

    expect(result.ok).toBe(true)
    expect((result as any).value as Token[]).toEqual([
      { type: 'atom', value: 'H' },
      { type: 'atom', value: 'O' },
    ])
  })

  it('works with brackets', () => {
    const result = tokenize('[{()}]')

    expect(result.ok).toBe(true)
    expect((result as any).value as Token[]).toEqual([
      { type: 'bracket', bracketType: 'square', bracketDirection: 'open' },
      { type: 'bracket', bracketType: 'curly', bracketDirection: 'open' },
      { type: 'bracket', bracketType: 'round', bracketDirection: 'open' },
      { type: 'bracket', bracketType: 'round', bracketDirection: 'close' },
      { type: 'bracket', bracketType: 'curly', bracketDirection: 'close' },
      { type: 'bracket', bracketType: 'square', bracketDirection: 'close' },
    ])
  })

  it('works with everything combined', () => {
    const result = tokenize('Mg(OH)2')

    expect(result.ok).toBe(true)
    expect((result as any).value as Token[]).toEqual([
      { type: 'atom', value: 'Mg' },
      { type: 'bracket', bracketType: 'round', bracketDirection: 'open' },
      { type: 'atom', value: 'O' },
      { type: 'atom', value: 'H' },
      { type: 'bracket', bracketType: 'round', bracketDirection: 'close' },
      { type: 'index', value: 2 },
    ])
  })

  it('fails with bad atom', () => {
    const result = tokenize('Mrc')

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      '"Mrc" is not a valid atom'
    )
  })

  it('fails with bad character', () => {
    const result = tokenize('ç')

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The "ç" character is invalid'
    )
  })
})
