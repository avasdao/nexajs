# NexaJS Address

A suite of Address query, monitoring and formatting utilities.


## Contents

- [Address Details](#address-details)
  - [Balance](#balance)
  - [Received](#received)
  - [Sent](#sent)
  - [Unconfirmed](#unconfirmed)
  - [Transaction Count](#transaction-count)
  - [Transactions](#transactions)
- [Address Methods](#address-methods)
  - [encodeAddress(string|array)](#encodeaddressstringarray)
  - [decodeAddress(string|array)](#decodeaddressstringarray)
  - [getAddress(string|array)](#getaddressstringarray)
  - [watchAddress(string|array)](#watchaddressstringarray)


## Address Details

Below is the standard block of information for a Nexa Address.

```graphql
{
  balance: BigInt
  received: BigInt
  sent: BigInt
  unconfirmed: BigInt
  txcount: Integer
  transactions: String[]
}
```

> ___NOTE:__ All values are in satoshis (0.01 NEX)._

### Balance

This is the current "confirmed" NEXA balance.

### Received

The total amount of NEXA received by this Address.

### Sent

The total amount of NEXA sent from this Address.

### Unconfirmed

This is the current "unconfirmed" NEXA balance.

### Transaction Count

The total number of transactions associated with this Address.

### Transactions

A list of all txidem(s) associated with this Address.


## Address Methods

### `encodeAddress(string|array)`

Creates a Base58-encoded Nexa address.

### `decodeAddress(string|array)`

Disassembles a Base58-encoded Nexa address.

### `getAddress(string|array)`

Retrieve the latest on-chain data about an Address.

_see [Address Details](#address-details) above_

### `watchAddress(string|array)`

Allows you to monitor ALL on-chain activity for an Address.

#### Option #1: Import from a (Package) Method

> ___NOTE:__ This is the recommended option._

```js
import { watchAddress } from '@nexajs/address'

const myAddress = 'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5'

const handler = (updatedInfo) => {
    console.log(updatedInfo)
}

const cleanup = watchAddress(myAddress, handler)
// cleanup() // Execute to cancel (and cleanup) an Address subscription.
```

#### Option #2: Import from the Core Library

```js
import Nexa from 'nexajs'

const myAddresses = [
  'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5',
  'nexa:nqtsq5g5lsgc2yns89kjp2ws4u7wk2d3lvzjznt3v8k2td59',
]

const cleanup = Nexa.watchAddress(myAddresses, myHandler)
// cleanup() // Execute to cancel (and cleanup) an Address subscription.
```

#### Setting a Custom configuration

```js
/* Set advanced parameters. */
const params = {
  address: [
    'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5',
    'nexa:nqtsq5g5lsgc2yns89kjp2ws4u7wk2d3lvzjznt3v8k2td59',
    'nexa:nqtsq5g54v4772je5xq2z2t2aqgmaayavn44ttz5qd8cmfy2',
  ],
  handler: myHandler, // (optional) Set your notifications handler in your parameters.
  conn: {
    provider: [
      {
        type: 'rostrum',
        src: 'rostrum.myawesomeproject.com:20004',
      },
      {
        type: 'graphql',
        src: 'https://myawesomeproject.com/graphql',
      }
    ],
    threshold: 1,
    timeout: 5000,
  },
}

const cleanup = watchAddress(params)
// cleanup() // Execute to cancel (and cleanup) an Address subscription.
```
