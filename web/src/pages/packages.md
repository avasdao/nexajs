---
title: Packages
description: A comprehensive collection of (33) specialized packages make up the NEXA.js Library + SDK.
---

The full NEXA.js Library + SDK is comprised of a collection of __(33)__ specialized packages. Each package is tasked with performing a set of tasks extremely well.

There are currently over __100+__ unit tests, integration tests and end-to-end tests to ensure a stable and consistent execution of library methods.

[View it on GitHub](https://github.com/avasdao/nexajs/tree/master/packages)

---

## Using Packages

You have 2 options when including packages to your code.


```js
import Nexa from 'nexajs'

const details = Nexa.getTransaction('...')
```

```js
import { getTransaction } from '@nexajs/transaction'

const details = getTransaction('...')
```

---

There are currently 33 packages that make up the full NEXA.js suite.

### Address

A suite of Address query, monitoring and formatting utilities.

[go to Address](/pkg/address)

### Rostrum

A complete solution for connecting your application to remote Rostrum services.

[go to Rostrum](/pkg/rostrum)

### Wallet

A complete solution for managing Nexa coin and token assets.

[go to Wallet](/pkg/wallet)
