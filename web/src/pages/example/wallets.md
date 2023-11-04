---
title: Wallet Examples & Use-cases
description: A full-service, multi-currency web wallet for your applications.
---

Many applications offer a better User Experience (UX) when the wallet is directly embedded into the application.

## For Beginners

Beginner developers can configure the preset parameters to best suite their needs.

```js
import { Wallet } from '@nexajs/wallet'
const wallet = await Wallet.init('correct horse battery staple')
console.log(wallet)

// {
//   _entropy: null,
//   _mnemonic: 'correct horse battery staple',
//   _network: null,
//   _provider: null,
//   _isTestnet: null,
//   _hrp: null,
//   _coinPurpose: "44'",
//   _coinType: "29223'",
//   _accountIdx: "0'",
//   _addressIdx: '0',
//   _path: "m/44'/29223'/0'/0/0",
//   _privateKey: null,
//   _publicKey: null,
//   _publicKeyHash: null,
//   _xpriv: null,
//   _xpub: null,
//   _wif: null,
//   ...
// }
```

### [Personalized for individual and/or project use](/example/wallet/personal)

Easily set your desired wallet parameters to create a personalized experience.


## For Intermediate

Experienced developers will appreciate the flexibility of Wallet's preset parameters.

```js
import { Wallet } from '@nexajs/wallet'
const wallet = await Wallet.init({
    mnemonic: 'correct horse battery staple',
    locktime: 690069,
    sequence: 0x400001,
})
console.log(wallet)

// {
//   _entropy: null,
//   _mnemonic: 'correct horse battery staple',
//   ...
// }
```

## For Advanced

Advanced developers will appreciate the robust qualities of Wallet's Script capabilities.

```js
import { Wallet } from '@nexajs/wallet'
const wallet = await Wallet.init({
    mnemonic: 'correct horse battery staple',
    locking: '6c6c7cb275ad',
    unlocking: '1337beef',
})
console.log(wallet)

// {
//   _entropy: null,
//   _mnemonic: 'correct horse battery staple',
//   ...
// }
```
