# NEXA.js Transaction

Manage the construction of a new or existing Transaction; as well as handle
the unlocking (by use of redeem scripts) and authorize the transaction
for on-chain broadcast.

The Transaction Builder represents a transaction internally and is used to build a transaction step-by-step. It can then be expressed as a hexadecimal string ready to be sent to a Nexa node and broadcast to the entire network.

The necessary steps to create a Transaction are:
1. Add input(s)
2. Add output(s)
3. Set lock time _(optional)_
4. Sign input(s)


## Simple Transaction

```js
import { Transaction } from '@nexajs/transaction'

// Provide one or more Locksmiths (e.g. Wallet Import Format WIF).
const locksmith = [
    // TODO
]

// Initialize the transaction.
const tx = new Transaction()

// Add inputs.
tx.addInputs([{
    // TODO
}])

// Add outputs.
tx.addOutputs([{
    // TODO
}])

console.log(tx) // without signatures
// {
//   inputs: [...],
//   outputs: [...],
// }

// Sign the transaction (using an array of one or more Locksmiths).
tx.sign(locksmith)

console.log(tx) // with signatures
// {
//   inputs: [...],
//   outputs: [...],
// }

console.log(tx.raw) // in hexadecimal format (for broadcast via node)
// abc123...
```


TODO: Add more examples...
