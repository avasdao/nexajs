# NexaJS Wallet

Create a Nexa Wallet to manage your assets.


## Auto-generated Wallet

```js
import { Wallet } from '@nexajs/wallet'

const wallet = new Wallet()

const address = wallet.address
console.log(address)
// nexa:example-address-here

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

const wallet = new Wallet('correct horse battery staple')

const address = wallet.address
console.log(address)
// nexa:example-address-here

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

const wallet = new Wallet('deadbeef')

const address = wallet.address
console.log(address)
// nexa:example-address-here

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

const wallet = new Wallet('satoshi@bitcoin.org', 'setecastronomy')

const address = wallet.address
console.log(address)
// nexa:example-address-here

const balance = wallet.balance
console.log(balance)
// {
//   confirmed: 1337,
//   unconfirmed: 0,
// }
```
