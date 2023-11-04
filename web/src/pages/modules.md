---
title: Modular Framework
description: Learn about best-practices when using modules in NEXA.js.
---

Learn about best-practices when using modules in NEXA.js

> Importing and using modules are the lifeblood of this library.

```js
/* Import (NEXA.js library) modules. */
import { getAddressBalance } from '@nexajs/rostrum'

/* Request address balance. */
const balance = await getAddressBalance('nexa:...')
console.log('My balance:', balance)
```

---

## Why use a modular framework?

A modular framework offers a number of advantages that are GUARANTEED to improve your Builder Experience (BX), especially when used together with a package bundler:

1. Better code organization
2. Improved testing suite
3. Tree-shaking optimizations

### Better Code Organization

Individuals and teams consistently work faster for longer when making "smart" code management decisions EARLY in the product development cycle.

### Improved Testing Suite

Write easier tests.

### Tree-shaking Optimizations

Reduce the size of your final package by excluding unused code libraries during the build process.
