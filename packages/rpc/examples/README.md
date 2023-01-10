# NexaJS RPC Examples

A complete guide to ALL the JSON-RPC commands available via the node.

# Table of contents

- [GetBlockchainInfo](#getblockchaininfo) [ [view the source](getblockchaininfo.js) ]

## GetBlockchainInfo

Details on the current state of the blockchain.

### Sample response:
```
{
  chain: 'nexa',
  blocks: 179259,
  headers: 179259,
  bestblockhash: '969077b0d0bee8998fad7ffe24d36de8259a33507b7ad8947b0d867bdf09ccbb',
  difficulty: 33097.53600739799,
  mediantime: 1673346455,
  verificationprogress: 0.9999992981684301,
  initialblockdownload: false,
  chainwork: '0000000000000000000000000000000000000000000000001ede2a07dbc35c33',
  size_on_disk: 262773457,
  pruned: false,
  softforks: [],
  bip9_softforks: {},
  bip135_forks: {}
}
```
