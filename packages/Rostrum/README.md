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
| blockchain.address.subscribe | ... | ... |
| blockchain.address.unsubscribe | ... | ... |
| blockchain.block.get | ... | ... |
| blockchain.block.header | ... | ... |
| blockchain.block.headers | ... | ... |
| blockchain.estimatefee | ... | ... |
| blockchain.headers.subscribe | ... | ... |
| blockchain.headers.tip | ... | ... |
| blockchain.relayfee | ... | ... |
| blockchain.scripthash.get_balance | ... | ... |
| blockchain.scripthash.get_first_use | ... | ... |
| blockchain.scripthash.get_history | ... | ... |
| blockchain.scripthash.get_mempool | ... | ... |
| blockchain.scripthash.listunspent | ... | ... |
| blockchain.scripthash.subscribe | ... | ... |
| blockchain.scripthash.unsubscribe | ... | ... |
| [blockchain.transaction.broadcast](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchaintransactionbroadcast) | ... | ... |
| blockchain.transaction.get | ... | ... |
| blockchain.transaction.get_confirmed_blockhash | ... | ... |
| blockchain.transaction.get_merkle | ... | ... |
| blockchain.transaction.id_from_pos | ... | ... |
| [blockchain.utxo.get](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#blockchainutxoget) | ... | ... |
| cashaccount.query.name | ... | ... |
| mempool.get_fee_histogram | ... | ... |
| [token.address.get_balance](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokenaddressget_balance) | ... | ... |
| [token.address.get_history](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokenaddressget_history) | ... | ... |
| [token.address.get_mempool](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokenaddressget_mempool) | ... | ... |
| [token.address.listunspent](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokenaddresslistunspent) | ... | ... |
| [token.genesis.info](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokengenesisinfo) | [getGenesisInfo](/packages/Rostrum/index.js) | ( string ) |
| [token.genesis.info](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokengenesisinfo) | [getTokenInfo](/packages/Rostrum/index.js) _(alias)_ | ( string ) |
| [token.nft.list](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokennftlist) | [getNftList](/packages/Rostrum/index.js) | ( string ) |
| token.scripthash.get_balance | ... | ... |
| token.scripthash.get_history | ... | ... |
| token.scripthash.get_mempool | ... | ... |
| token.scripthash.listunspent | ... | ... |
| [token.transaction.get_history](https://bitcoinunlimited.gitlab.io/rostrum/protocol/methods/#tokentransactionget_history) | [getTokenHistory](/packages/Rostrum/index.js) | ( string ) |
