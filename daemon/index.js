/* Import modules. */
import { Wallet } from '@nexajs/wallet'

import createGroup from './src/createGroup.js'
import meltGroup from './src/meltGroup.js'
import mintGroup from './src/mintGroup.js'
import mintSubgroup from './src/mintSubgroup.js'
import signMessage from './src/signMessage.js'

console.log('Starting NexaJS Daemon...')

const IS_LIVE_BROADCAST = false
const ACTIVE_ACCOUNT_IDX = 2
// 0 - nexa:nqtsq5g5ezqpr27c78uyf08260xq4xh35faa4yk64aycgega (master)
// 1 - nexa:nqtsq5g55ykpcwwvr0x54358lx7skesefgj9anf07drdv52v (minting)
// 2 - nexa:nqtsq5g56gvyyaf57seml8zdxu8ur7x5wsevh49mj5f7q6s0 (melting)

;(async () => {
    let wallet

    // return createGroup()
    // return signMessage()

    wallet = await Wallet.init({
        path: `m/44'/29223'/${ACTIVE_ACCOUNT_IDX}'/0/0`,
        mnemonic: process.env.MNEMONIC,
    }, false)

    console.log('\nWALLET ADDRESS', wallet.address, '\n')

    meltGroup(
    // mintGroup(
    // mintSubgroup(
        wallet,
        // 'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug', // Shomari (Robin Hood)
        // 'nexa:nqtsq5g52285kqgw8c9gukavzj6n6cxav5cq48y86x3gwt0c', // Causes Cash
        // 'nexa:nprqq9x0e0dzeshwa3mkhu62578d6k7qch0mr0qqzjefztzvcc03hr97t3m7h40wagnyzezlzqqjs9phktx2f4lypqtemkak3jlpgcxww409nlqz9sqs0xpkt57y',
        // 100000000,
        IS_LIVE_BROADCAST,
    )
})()
