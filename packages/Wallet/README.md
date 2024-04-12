# NEXA.js Wallet

Create a Nexa Wallet to manage your assets.


## Auto-generated Wallet

```js
import { Wallet } from '@nexajs/wallet'

const wallet = await Wallet.init()
// {
//   mnemonic: '<randomly generated 12-word seed phrase>',
//   path: `m/44'/29223'/0'`,
//   index: 0,
//   ...
//   updatedAt: 1234567890,
// }

const address = wallet.address
console.log(address)
// nexa:nqtsq5g59vw9p29wupxtnrff0u8ny2tn3j8n63j5akmsk58z

const balance = wallet.balance
console.log(balance)
// {
//   confirmed: 1337,
//   unconfirmed: 0,
// }
```


## Mnemonic Wallet

```js
import { Wallet } from '@nexajs/wallet'

const wallet = await Wallet.init('correct horse battery staple')
// {
//   mnemonic: 'correct horse battery staple',
//   path: `m/44'/29223'/0'`,
//   index: 0,
//   ...
//   updatedAt: 1234567890,
// }

const address = wallet.address
console.log(address)
// nexa:nqtsq5g59vw9p29wupxtnrff0u8ny2tn3j8n63j5akmsk58z

const balance = wallet.balance
console.log(balance)
// {
//   confirmed: 1337,
//   unconfirmed: 0,
// }
```


## Entropy Wallet

```js
import { Wallet } from '@nexajs/wallet'

const wallet = await Wallet.init(0xdeadbeef)
// {
//   mnemonic: null,
//   path: `m/44'/29223'/0'`,
//   index: 0,
//   ...
//   updatedAt: 1234567890,
// }

const address = wallet.address
console.log(address)
// nexa:nqtsq5g59vw9p29wupxtnrff0u8ny2tn3j8n63j5akmsk58z

const balance = wallet.balance
console.log(balance)
// {
//   confirmed: 1337,
//   unconfirmed: 0,
// }
```


## Email + Password Wallet

```js
import { Wallet } from '@nexajs/wallet'

const wallet = await Wallet.init('satoshi@bitcoin.org', 'Setec Astronomy')
// {
//   mnemonic: null,
//   path: `m/44'/29223'/0'`,
//   index: 0,
//   ...
//   updatedAt: 1234567890,
// }

const address = wallet.address
console.log(address)
// nexa:nqtsq5g59vw9p29wupxtnrff0u8ny2tn3j8n63j5akmsk58z

const balance = wallet.balance
console.log(balance)
// {
//   confirmed: 1337,
//   unconfirmed: 0,
// }
```
