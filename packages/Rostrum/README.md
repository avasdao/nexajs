# Rostrum

Provides convenient browser access to ALL methods supported by remote Rostrum servers.

| Rostrum Protocol Methods | NexaJS Library Methods | Parameters |
|---|---|---|
| [blockchain.address.decode](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainaddressdecode) | [decodeRemoteAddress](/packages/Rostrum/index.js) | ( string ) |
| [blockchain.address.get_balance](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainaddressget_balance) | [getAddressBalance](/packages/Rostrum/index.js) | ( string ) |
| [blockchain.address.get_first_use](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainaddressget_first_use) | [getAddressFirstUse](/packages/Rostrum/index.js) | ( string ) |
| [blockchain.address.get_history](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainaddressget_history) | [getAddressHistory](/packages/Rostrum/index.js) | ( string ) |
| [blockchain.address.get_mempool](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainaddressget_mempool) | [getAddressMempool](/packages/Rostrum/index.js) | ( string ) |
| [blockchain.address.get_scripthash](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainaddressget_scripthash) | [getAddressScriptHash](/packages/Rostrum/index.js) | ( string ) |
| [blockchain.address.listunspent](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainaddresslistunspent) | [getAddressUnspent](/packages/Rostrum/index.js) | ( string ) |
| ... | ... | ... |
| [token.genesis.info](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokengenesisinfo) | [getGenesisInfo](/packages/Rostrum/index.js) | ( string ) |
| [token.genesis.info](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokengenesisinfo) | [getTokenInfo](/packages/Rostrum/index.js) _(alias)_ | ( string ) |
| [token.nft.list](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokennftlist) | [getNftList](/packages/Rostrum/index.js) | ( string ) |
| ... | ... | ... |
| [token.transaction.get_history](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokentransactionget_history) | [getTokenHistory](/packages/Rostrum/index.js) | ( string ) |
