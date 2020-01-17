import { Failable } from './common'
import { Node, NodeType, parse } from './parser'
import { tokenize } from './tokenizer'

export interface AtomsCount {
  [atom: string]: number
}

/**
 * Count the number of atoms of each element contained in the given chemical formula.
 *
 * @param input The chemical formula to count the number of atoms from
 */
export const countAtoms = (input: string): Failable<AtomsCount> => {
  const tokensResult = tokenize(input)

  if (tokensResult.ok === false) {
    return tokensResult
  }

  const astResult = parse(tokensResult.value)

  if (astResult.ok === false) {
    return astResult
  }

  const atomsCount: AtomsCount = {}
  const addAtomCount = (atom: string, count: number) => {
    const currentAtomCount = atomsCount[atom] ?? 0
    atomsCount[atom] = currentAtomCount + count
  }

  const traverse = (nodes: Node[], multiplier = 1) => {
    for (const node of nodes) {
      if (node.type === NodeType.Atom) {
        addAtomCount(node.atom, multiplier)
        continue
      }

      if (node.type === NodeType.Group) {
        traverse(node.children, multiplier)
        continue
      }

      if (node.type === NodeType.Index) {
        traverse([node.child], multiplier * node.index)
        continue
      }
    }
  }

  traverse(astResult.value)

  return { ok: true, value: atomsCount }
}
