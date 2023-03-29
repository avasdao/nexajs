# NexaJS Address

A suite of Address query, monitoring and formatting utilities.


## Address Details

Below is the standard block of information for a Nexa Address.

```
{
  balance: BigInt
  received: BigInt
  sent: BigInt
  unconfirmed: BigInt
  txcount: Integer
  transactions: string[]
}
```

### Balance

This is the current "confirmed" NEXA balance (amounts are in Satoshis).


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
