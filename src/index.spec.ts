import { AtomsCount, countAtoms } from '.'

describe('API', () => {
  it('works with H2O', () => {
    const result = countAtoms('H2O')

    expect(result.ok).toBe(true)
    expect((result as any).value as AtomsCount).toEqual({ H: 2, O: 1 })
  })

  it('works with Mg(OH)2', () => {
    const result = countAtoms('Mg(OH)2')

    expect(result.ok).toBe(true)
    expect((result as any).value as AtomsCount).toEqual({ Mg: 1, O: 2, H: 2 })
  })

  it('works with K4[ON(SO3)2]2', () => {
    const result = countAtoms('K4[ON(SO3)2]2')

    expect(result.ok).toBe(true)
    expect((result as any).value as AtomsCount).toEqual({
      K: 4,
      O: 14,
      N: 2,
      S: 4,
    })
  })

  it('fails with unbalanced K4{ON[SO3}2]2', () => {
    const result = countAtoms('K4{ON[SO3}2]2')

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The brackets are not balanced'
    )
  })

  it('fails with bad input', () => {
    const result = countAtoms('°')

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The "°" character is invalid'
    )
  })

  it('fails with unclosed group', () => {
    const result = countAtoms('[H')

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The brackets are not balanced'
    )
  })

  it('fails with unopened group', () => {
    const result = countAtoms('H]')

    expect(result.ok).toBe(false)
    expect(((result as any).error as Error).message).toBe(
      'The brackets are not balanced'
    )
  })
})
