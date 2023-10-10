---
title: Studio Wallet
description: A full-service, multi-currency web wallet for your applications.
---

A full-service, multi-currency web wallet for your applications.


## Introduction

Many applications offer a better User Experience (UX) when the wallet is directly embedded into the application.

![NPM Create Nexa](/screenshots/studio-wallet.png)

{% callout title="You should know!" %}
We also make this as simple as a [drop-in Wallet package](https://github.com/avasdao/nexajs/tree/master/packages/Wallet) for your existing applications.
{% /callout %}

### Wallet Package

NexaJS offers a comprehensive Wallet package that you can add to any of your new/existing applications. For you convenience, default data providers are pre-installed.

```js
import { Wallet } from '@nexajs/wallet'

const wallet = await Wallet.init()
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

---

## Customize Your Wallet

Customize your wallet options to best meet your needs:

- Coin selection
- Token selection
- Change address
- Fee rate
- (Smart) contract script
- Lock time
- Sequence number
