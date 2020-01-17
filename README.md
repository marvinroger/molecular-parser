# Molecular Parser

This module exposes a single function, `countAtoms`, which, given a string representing a chemical formula, counts the number of atoms of each element contained in the molecule and returns an object where keys correspond to atoms and values to the number of each atom in the molecule.

## Installation

```bash
npm install @marvinroger/molecular-parser --registry https://npm.pkg.github.com
# yarn unfortunately does not support alternative registry without modifying .yarnrc
```

## Usage

```js
const molecularParser = require('@marvinroger/molecular-parser')

console.log(molecularParser.countAtoms('K4[ON(SO3)2]2'))
```

## Limitations

* `countAtoms` expects a valid chemical formula, the point of the module being to count the number of atoms - not validate the formula
