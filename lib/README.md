# NEXA.js

### https://nexajs.org

![NEXA.js Banner](/web/public/banner.jpg)

A pure JavaScript Library and Software Development Kit (SDK) for building _decentralized_ applications (dApps) powered by the [__Nexa__](https://nexa.org/) blockchain.

Released under the terms of the [__MIT LICENSE__](LICENSE).

## Documentation

Our docs are updated regularly.

### https://docs.nexajs.org


# Table of contents

- [Quick Start](#quick-start)
  - [Web2 (CDN) Installation](#web2-cdn-installation)
  - [Web3 (IPFS) Installation](#web3-ipfs-installation)
  - [Web4 (CAPD | Nostr) Installation](#web4-capd-nostr-installation)
  - [Package Manager Installation](#package-manager-installation)
- [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
- [Installation](#installation)
  - [Building the Workspace](#building-the-workspace)
- [Should I use this in Production?](#should-i-use-this-in-production)
- [Can I trust this Code?](#can-i-trust-this-code)
- [Usage](#usage)
  - [Browser](#browser)
- [Examples](#examples)
- [Packages List](#packages-list)
- [Contributing](#contributing)
  - [Running the Test Suite](#running-the-test-suite)
- [Complementing Libraries](#complementing-libraries)


## Quick Start

To quickly get started using Nexa in your existing Webapp, simply include this tag in the <head> section of your HTML:

### Web2 (CDN) Installation

```html
<!-- CDN (Web2) integration solution -->
<script src="https://cdn.nexajs.org/nexa.min.js"
  integrity="sha384-qBLa2DVAThYbLO3kajnReZVS5cG3m3swWmBL0tNN7CxvzgRZQw/cfwsmbXOGma7K"
  crossorigin="anonymous"></script>
```

### Web3 (IPFS) Installation

```html
<!-- IPFS Gateway (Web3) integration solution -->
<script src="https://bafybeifohi5njjlohhkwcsola3346cn3ngyaqyl5bwn5k7a4mbvtzy4y3m.ipfs.dweb.link/"
  integrity="sha384-qBLa2DVAThYbLO3kajnReZVS5cG3m3swWmBL0tNN7CxvzgRZQw/cfwsmbXOGma7K"
  crossorigin="anonymous"></script>
```

### Web4 (CAPD | Nostr) Installation

```html
<!-- Counterparty and Protocol Discovery (Web4) integration solution -->
<script src="proto://9addf9bc724b2e14094950598918dde63b091253e6106b7d9716nexaverse888"></script>
```

### Package Manager Installation

```bash
npm install --save nexajs
```
```bash
yarn add nexajs
```
```bash
pnpm install nexajs
```

__WARNING__: We presently don't provide any tooling to verify that the release on `npm` matches GitHub.  As such, you should verify anything downloaded by `npm` against your own verified copy.


## Introduction

The NEXA.js Library + SDK aims to be a modern & comprehensive toolkit for creating decentralized applications (dApps) on the Nexa Blockchain and its expansive Web3 ecosystem.

### Prerequisites

- Node v12+

### Requirements

- Basic JavaScript knowledge


## Installation

```
npm install nexajs
```

### Building the Workspace

Install your preferred Integrated Development Environment (IDE) or text editor, eg:
- Visual Studio Code (VSC)
- Atom
- Sublime

Example file: [__send-tx.js__](examples/send-tx.js)

```
import Nexa from 'nexajs'

const privateKey = new Nexa.PrivateKey('L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy')

const utxo = {
    txId        : '115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986',
    outputIndex : 0,
    address     : '17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV',
    script      : '76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac',
    satoshis    : 50000,
}

const transaction = new Nexa.Transaction()
    .from(utxo)
    .to('1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK', 15000)
    .sign(privateKey)
```

From the terminal / command-line:

```
$ node examples/send-tx.js
```


## Should I use this in Production?

If you are thinking of using the *master* branch of this library in production, __stop__. Master is not stable; it is our development branch, and [only tagged releases may be classified as stable](https://github.com/avasdao/nexajs/tags).


## Can I trust this Code?

> Don't trust. Verify.

We recommend every user of this library and the [nexajs](https://gitlab.com/nexajs) ecosystem audit and verify any underlying code for its validity and suitability,  including reviewing any and all of your project's dependencies.

Mistakes and bugs happen, but with your help in resolving and reporting [issues](https://github.com/avasdao/nexajs/issues), together we can produce open source software that is:

- Easy to audit and verify,
- Tested, with test coverage >95%,
- Advanced and feature rich,
- Standardized, using [prettier](https://github.com/prettier/prettier) and Node `Buffer`'s throughout, and
- Friendly, with a strong and helpful community, ready to answer questions.


## Usage

Crypto is hard.

When working with private keys, the random number generator is fundamentally one of the most important parts of any software you write.
For random number generation, we *default* to the [`randombytes`](https://github.com/crypto-browserify/randombytes) module, which uses [`window.crypto.getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues) in the browser, or Node js' [`crypto.randomBytes`](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback), depending on your build system.
Although this default is ~OK, there is no simple way to detect if the underlying RNG provided is good enough, or if it is __catastrophically bad__.
You should always verify this yourself to your own standards.

Finally, __adhere to best practice__.
We are not an authorative source of best practice, but, at the very least:

* [~~Don't re-use addresses~~](https://en.bitcoin.it/wiki/Address_reuse).
* Don't share BIP32 extended public keys ('xpubs'). [They are a liability](https://bitcoin.stackexchange.com/questions/56916/derivation-of-parent-private-key-from-non-hardened-child), and it only takes 1 misplaced private key (or a buggy implementation!) and you are vulnerable to __catastrophic fund loss__.
* [Don't use `Math.random`](https://security.stackexchange.com/questions/181580/why-is-math-random-not-designed-to-be-cryptographically-secure) - in any way - don't.
* Enforce that users always verify (manually) a freshly-decoded human-readable version of their intended transaction before broadcast.
* [Don't *ask* users to generate mnemonics](https://en.bitcoin.it/wiki/Brainwallet#cite_note-1), or 'brain wallets',  humans are terrible random number generators.


### Browser

The recommended method of using `nexajs-lib` in your browser is through [Browserify](https://github.com/substack/node-browserify).
If you're familiar with how to use browserify, ignore this and carry on, otherwise, it is recommended to read the tutorial at https://browserify.org/.

__NOTE__: We use Node Maintenance LTS features, if you need strict ES5, use [`--transform babelify`](https://github.com/babel/babelify) in conjunction with your `browserify` step (using an [`es2015`](https://babeljs.io/docs/plugins/preset-es2015/) preset).

__WARNING__: iOS devices have [problems](https://github.com/feross/buffer/issues/136), use at least [buffer@5.0.5](https://github.com/feross/buffer/pull/155) or greater,  and enforce the test suites (for `Buffer`, and any other dependency) pass before use.


## Examples

The below examples are implemented as integration tests, they should be very easy to understand.
Otherwise, pull requests are appreciated.
Some examples interact (via HTTPS) with a 3rd Party Blockchain Provider (3PBP).

- [Generate a random address]()
- [Import an address via WIF]()
- [Generate a 2-of-3 P2SH multisig address]()
- [Generate a Testnet address]()
- [Create a 1-to-1 Transaction]()
- [Import a BIP32 testnet xpriv and export to WIF]()
- [Export a BIP32 xpriv, then import it]()
- [Export a BIP32 xpub]()
- [Use BIP39 to generate BIP32 addresses]()

If you have a use case that you feel could be listed here, please [ask for it](https://github.com/avasdao/nexajs/issues/new)!


## Packages List

> The following suite of 26 packages compose the entire NEXA.js Library and Software Development Kit (SDK).

- [ ] [Account](/packages)
- [x] [__Address__](/packages/Address)
- [ ] [App](/packages)
- [ ] [Blockchain](/packages)
- [ ] [Charts](/packages)
- [x] [__Crypto__](/packages/Crypto)
- [ ] [DeFi](/packages)
- [ ] [Express](/packages)
- [ ] [Games](/packages)
- [x] [__HD Node__](/packages/Hdnode)
- [x] [__Nexa ID__](/packages/Id)
- [ ] [Ledger HW Wallet](/packages)
- [x] [__Market__](/packages/Market)
- [ ] [Meta](/packages/meta)
- [ ] [Privacy](/packages)
- [x] [__Purse__](/packages/Purse)
- [x] [__Rostrum__](/packages/Rostrum)
- [x] [__RPC__](/packages/Rpc)
- [x] [__Script__](/packages/Script)
- [ ] [Server](/packages)
- [ ] [Slim](/packages/slim)
- [x] [__Token__](/packages/Token)
- [x] [__Transaction__](/packages/Transaction)
- [ ] [Trezor HW Wallet](/packages)
- [x] [__Utils__](/packages/Utils)
- [x] [__Wallet__](/packages/Wallet)

* _NOTE: Not all packages are published to the NPM registry._


## NPM Repository Deployment

```
cd nexajs/lib/package/<package-name>
rm -rf node_modules/ yarn.lock
yarn

# update package.json version
# !cdn, !daemon, !yarn.lock

npm publish
```


## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).

### Running the Test Suite

``` bash
npm test
npm run-script coverage
```


## Similar Libraries
- [Nexcore Lib](https://gitlab.com/otoplo/nexa-libs/nexcore-lib) — a fork of [Bitcore Lib Cash library](https://github.com/bitpay/bitcore/tree/master/packages/bitcore-lib-cash) with changes to make it work for Nexa project.
