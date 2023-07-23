# NexaJS Packages

The following suite of 33 packages compose the entire NexaJS Library and Software Development Kit (SDK).


## Account

_TBD_


## [Address](/packages/Address)

Performs various address functions like:
- Base32 conversions
- Base58 conversions
- Decoding
- Encoding
- Formatting
- Validation


## Analytics

Supports telemetry recording to a back-end database and report generation via web-based, responsive charts.


## Application

_TBD_


## Charts

Create web-based, responsive charts.


## [Crypto](/packages/Crypto)

_TBD_


## Database

Manages front-end and back-end database connections and transactions. Front-end is supported by [PouchDB](https://pouchdb.com/), with back-end supporting by [CouchDB](https://couchdb.apache.org/).


## Decentralized Finance (DeFi)

_TBD_


## Deno

_TBD_


## Express

_TBD_


## [HD Node](/packages/Hdnode)

_TBD_


## [Nexa ID Protocol](/packages/Id)

_TBD_


## Ledger Hardware Wallet

_TBD_


## Lightning Network

_TBD_


## [Markets](/packages/Markets)

_TBD_


## Message

_TBD_


## [Meta](/packages/Meta)

_TBD_


## Nostr

_TBD_


## Nuxt

_TBD_


## [Privacy](/packages/Privacy)

Support for coin joining and masking protocols, including:
1. CashShuffle
2. CashFusion


## [Provider](/packages/Provider)

Performs general on-chain functions like:
- Broadcasting of raw transactions


## [Purse](/packages/Purse)

Manages individual Unspent Transaction Outputs (UTXOs).


## [Rostrum](/packages/Rostrum)

Exposes all of the Rostrum node endpoints. Manages a connection pool (eg. 2 of 3) for data redundancy and application security.


## [Remote Procedure Call (RPC)](/packages/Rpc)

Provides a simple communications gateway to the Core node for Node.js.

> Please Note: This package DOES NOT work on the client (in web browser).


## [Script](/packages/Script)

Build and compile the "wise" contract scripts of Nexa.


## Slim

A minimal (lightweight) version of the full NexaJS library containing ONLY the minimum libraries required for effective operational use in environments that have strict (data/security) constraints.


## [Token](/packages/Token)

Manages tokens functions, including:
- info: Provides token information (eg. genesis details)
- new: Create a new token group
- mint: Create new tokens from an existing group
- melt: Destroy existing tokens
- send: Send tokens to an address


## [Transaction](/packages/Transaction)

Manages a full Nexa transaction, including:
- Unspent output retrieval
- Transaction serialization
- UTXO signing


## Trezor Hardware Wallet

_TBD_


## [Utilities](/packages/Utils)

A suite of "pure" utilities to support the other NexaJS libraries.


## [Wallet](/packages/Wallet)

Manages the basic wallet functions, including:
- HD wallet creation
- Address management
- Balance management


## WebAssembly (WASM)

A polyfill that allows WebAssembly (WASM) to be supported in environments that don't natively support it (eg. React Native).


## Zero Knowledge

Manages functions requiring use of zero knowledge proofs, including:
- ZK-SNARKs
- ZK-STARKs
