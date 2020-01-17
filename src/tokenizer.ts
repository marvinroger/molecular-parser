import { Atom } from './atoms'
import { Failable } from './common'

export enum TokenType {
  Bracket = 'bracket',
  Atom = 'atom',
  Index = 'index',
}

export enum BracketDirection {
  Open = 'open',
  Close = 'close',
}

export enum BracketType {
  Round = 'round',
  Curly = 'curly',
  Square = 'square',
}

interface BracketToken {
  type: TokenType.Bracket
  bracketDirection: BracketDirection
  bracketType: BracketType
}

interface AtomToken {
  type: TokenType.Atom
  value: Atom
}

interface IndexToken {
  type: TokenType.Index
  value: number
}

export type Token = BracketToken | AtomToken | IndexToken

const getBracketDirection = (char: string) =>
  ['(', '{', '['].includes(char)
    ? BracketDirection.Open
    : BracketDirection.Close
const getBracketType = (char: string) => {
  if (['(', ')'].includes(char)) {
    return BracketType.Round
  }

  if (['{', '}'].includes(char)) {
    return BracketType.Curly
  }

  if (['[', ']'].includes(char)) {
    return BracketType.Square
  }

  throw new Error('Not a bracket')
}

const DIGIT_REGEX = /^[0-9]$/
const isDigit = (candidate: string) => DIGIT_REGEX.test(candidate)

const LETTER_REGEX = /^[a-z]$/i
const isLetter = (candidate: string) => LETTER_REGEX.test(candidate)

const isAtom = (candidate: string): candidate is Atom =>
  Atom[candidate as Atom] !== undefined

/**
 * Take an input string and return the tokens.
 *
 * Note: the "isDigit" and "isLetter" could have been factorized,
 * but given that there are only 2 cases, I prefer readability over
 * abstraction
 *
 * @param input The string to tokenize
 * @returns the tokens or an error
 */
export const tokenize = (input: string): Failable<Token[]> => {
  const tokens: Token[] = []

  let current = 0
  while (current < input.length) {
    let char = input[current]

    if (['(', ')', '{', '}', '[', ']'].includes(char)) {
      tokens.push({
        type: TokenType.Bracket,
        bracketDirection: getBracketDirection(char),
        bracketType: getBracketType(char),
      })
      current++
      continue
    }

    if (isDigit(char)) {
      let value = ''

      while (isDigit(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: TokenType.Index, value: parseInt(value, 10) })
      continue
    }

    if (isLetter(char)) {
      let value = ''

      while (isLetter(char) && !isAtom(value)) {
        value += char
        char = input[++current]
      }

      if (!isAtom(value)) {
        return {
          ok: false,
          error: new Error(`"${value}" is not a valid atom`),
        }
      }

      tokens.push({ type: TokenType.Atom, value })
      continue
    }

    return {
      ok: false,
      error: new Error(`The "${char}" character is invalid`),
    }
  }

  return { ok: true, value: tokens }
}
