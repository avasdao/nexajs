# NexaJS Address

A comprehensive suite of Address querying, monitoring and formatting utilities.


## Contents

- [Address Details](#address-details)
  - [Balance](#balance)
  - [Received](#received)
  - [Sent](#sent)
  - [Unconfirmed](#unconfirmed)
  - [Transaction Count](#transaction-count)
  - [Transactions](#transactions)
  - [Created At](#createdat)
  - [Updated At](#updatedat)
- [Address Methods](#address-methods)
  - [encodeAddress(string|array)](#encodeaddressstringarray)
  - [decodeAddress(string|array)](#decodeaddressstringarray)
  - [getAddress(string|array)](#getaddressstringarray)
  - [listUnspent(string|array)](#listunspentstringarray)
  - [watchAddress(string|array)](#watchaddressstringarray)


## Data Schema

Here is the full data schema for a NexaJS Address.

```graphql
{
  type: String
  prefix: String
  hash: String
  balance: BigInt
  received: BigInt
  sent: BigInt
  unconfirmed: BigInt
  transactions: String[txid]
  createdAt: Integer
  updatedAt: Integer
}
```

> __NOTE:__ All `BigInt` amounts are measured in satoshis (ie. 0.01 NEX).

### Prefix

The `prefix` can be either `nexa:` or `nexatest:` for Mainnet and Testnet respectively.

### Type

The Address `type` can be one of:
- P2PKH
- SCRIPT
- TEMPLATE
- GROUP

### (Public Key) Hash

This is the public key hash for the Address.

### Balance

This is the current "confirmed" NEXA balance.

### Received

The total amount of NEXA received by this Address.

### Sent

The total amount of NEXA sent from this Address.

### Unconfirmed

This is the current "unconfirmed" NEXA balance.

### Transactions

A list of all txidem(s) associated with this Address.

### Created At

The timestamp of the first block confirmation for this Address.

### Updated At

The timestamp of the most recent transaction associated with this Address.


## Address Methods

### `encodeAddress(string|array)`

Creates a Base58-encoded Nexa address.

### `decodeAddress(string|array)`

Disassembles a Base58-encoded Nexa address.

### `getAddress(string|array)`

Retrieve the latest on-chain data about an Address.

_see [Data Schema](#data-schema) above_

### `listUnspent(string|array)`

Retrieve a list of ALL unspent transaction outputs.

#### Option #1: Import from (Package) Method

> __NOTE:__ This is the recommended option.

```js
import { listUnspent } from '@nexajs/address'

const myAddress = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'

const unspent = await listUnspent(myAddress)
console.log(unspent)
/*
[
  {
    height: 301991,
    outpoint: '65102a067b574b7bd3cad9ad51f1907d94dadebdc24fd1db3742e76d6f1786b7',
    txid: '0cb7c4825931c696be4bc55185a534aeb08596860eaf97356ed978fcd3f3c06b',
    pos: 0,
    amount: 5.46,
    satoshis: 546,
    tokenid: 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x',
    tokenidHex: '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000',
    tokens: '100000000',
    hasToken: true
  },
  {
    height: 303280,
    outpoint: 'e6cecbc1c67d3b8587986abc768f2be946d3515442e61b3869953807dae69579',
    txid: '6af1d65fdc3a858ff8d1ce2044532f3765d4848eba1e8ae08609519436793e37',
    pos: 2,
    amount: 49910.15,
    satoshis: 4991015,
    hasToken: false
  }
]
*/
```

#### Option #2: Import from (Core Library) Method

```js
import Nexa from 'nexajs'

const myAddresses = [
  'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz',
  'nexa:nqtsq5g5lsgc2yns89kjp2ws4u7wk2d3lvzjznt3v8k2td59',
]

await Nexa.listUnspent(myAddresses)
```

### `watchAddress(string|array)`

Allows you to monitor ALL on-chain activity for an Address.

#### Option #1: Import from (Package) Method

> __NOTE:__ This is the recommended option.

```js
import { watchAddress } from '@nexajs/address'

const myAddress = 'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5'

const myHandler = (updatedInfo) => {
    console.log(updatedInfo)
}

const cleanup = await watchAddress(myAddress, myHandler)
// cleanup() // Execute to cancel (and cleanup) an Address subscription.
```

#### Option #2: Import from (Core Library) Method

```js
import Nexa from 'nexajs'

const myAddresses = [
  'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5',
  'nexa:nqtsq5g5lsgc2yns89kjp2ws4u7wk2d3lvzjznt3v8k2td59',
]

const cleanup = await Nexa.watchAddress(myAddresses, myHandler)
// cleanup() // Execute to cancel (and cleanup) an Address subscription.
```

#### Setting a Custom Configuration

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
      },
    ],
    threshold: 1,
    timeout: 5000,
  },
}

const cleanup = await watchAddress(params)
// cleanup() // Execute to cancel (and cleanup) an Address subscription.
```
