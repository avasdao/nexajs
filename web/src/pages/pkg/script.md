---
title: Script
description: Quidem magni aut exercitationem maxime rerum eos.
---

An efficient implementation of Electrum Server for Bitcoin Cash and Nexa with token support.


---

## What is NexScript?

Rostrum is an efficient implementation of Electrum Server and can be used as a drop-in replacement for ElectrumX. In addition to the TCP RPC interface, it also provides WebSocket support.

Rostrum fully implements the [Electrum v1.4.3 protocol](https://electrumx-spesmilo.readthedocs.io/en/latest/protocol.html) plus many more queries, including full token support. See this projects documentation for full RPC reference.

The server indexes the entire blockchain, and the resulting index enables fast queries for blockchain applications and any given user wallet, allowing the user to keep real-time track of his balances and his transaction history.

When run on the user's own machine, there is no need for the wallet to communicate with external Electrum servers, thus preserving the privacy of the user's addresses and balances.
{% callout title="Did you know?" %}
Rostrum supports BCHUnlimited, Nexa and BCHN and has a large test set to ensure these full nodes always work with the software.
{% /callout %}

## Get Address Balance

```js
import { getAddressBalance } from '@nexajs/rostrum'

;(async () => {
  const myAddress = 'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5'

  const result = await getAddressBalance(myAddress)
  console.log(result)
})()

// {
//   confirmed: 133700,
//   unconfirmed: 0
// }
```
