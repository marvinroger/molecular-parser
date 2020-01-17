import { Atom } from './atoms'
import { Failable } from './common'
import { BracketDirection, BracketType, Token, TokenType } from './tokenizer'

export enum NodeType {
  Index = 'index',
  Atom = 'atom',
  Group = 'group',
}

interface AtomNode {
  type: NodeType.Atom
  atom: Atom
}

interface IndexNode {
  type: NodeType.Index
  index: number
  child: Node
}

interface GroupNode {
  type: NodeType.Group
  children: Node[]
}

export type Node = AtomNode | IndexNode | GroupNode

export type AST = Node[]

const makeUnbalancedError = () => new Error('The brackets are not balanced')

export const parse = (tokens: Token[]): Failable<AST> => {
  // we start from the end, indexes being on the right side
  let current = tokens.length - 1

  const walk = (): Failable<Node> => {
    let token = tokens[current]

    if (token.type === TokenType.Atom) {
      current--

      return { ok: true, value: { type: NodeType.Atom, atom: token.value } }
    }

    if (token.type === TokenType.Index) {
      if (--current === -1) {
        return {
          ok: false,
          error: new Error('An index must be preceded by an entity'),
        }
      }

      const childResult = walk()

      if (childResult.ok === false) {
        return childResult
      }

      return {
        ok: true,
        value: {
          type: NodeType.Index,
          index: token.value,
          child: childResult.value,
        },
      }
    }

    const bracketStack: BracketType[] = []

    if (
      token.type === TokenType.Bracket &&
      token.bracketDirection === BracketDirection.Close
    ) {
      const bracketType = token.bracketType
      bracketStack.push(bracketType)

      token = tokens[--current]

      const node: GroupNode = {
        type: NodeType.Group,
        children: [],
      }

      // iterate until there's no more token
      // or until we reach a open bracket
      while (
        token &&
        (token.type !== TokenType.Bracket ||
          (token.type === TokenType.Bracket &&
            token.bracketDirection !== BracketDirection.Open))
      ) {
        const childResult = walk()

        if (childResult.ok === false) {
          return childResult
        }

        node.children.push(childResult.value)
        token = tokens[current]
      }

      // check that there's indeed a token,
      // and that it's the expected bracket (for balance)
      const expectedBracketType = bracketStack.pop()
      if (!token || token.bracketType !== expectedBracketType) {
        return {
          ok: false,
          error: makeUnbalancedError(),
        }
      }

      current--

      return { ok: true, value: node }
    }

    // not mandatory, but that way we provider a more clear
    // error, instead of the "Cannot parse the input" generic message
    if (
      token.type === TokenType.Bracket &&
      token.bracketDirection === BracketDirection.Open
    ) {
      return { ok: false, error: makeUnbalancedError() }
    }

    return { ok: false, error: new Error('Cannot parse the input') }
  }

  const ast: AST = []

  while (current > -1) {
    const nodeResult = walk()
    if (nodeResult.ok === false) {
      return nodeResult
    }

    ast.push(nodeResult.value)
  }

  return { ok: true, value: ast }
}
