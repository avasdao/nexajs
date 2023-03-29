# NexaJS Address

A suite of Address query, monitoring and formatting utilities.


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

> NOTE: All values are in satoshis.

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

Allows you to monitor for changes to an Address.

```js
import { watchAddress } from '@nexajs/address'

const myAddress = 'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5'

const notifier = (updatedInfo) => {
    console.log(updatedInfo)
}

watchAddress(myAddress, notifier)

```
