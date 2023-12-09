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
// 3 - nexa:nqtsq5g5knff2pzlmfge7c2443j050sfx6kw87tn4l5vgukw (persona)

;(async () => {
    /* Initialize locals. */
    let wallet

    /* Initialize wallet. */
    wallet = await Wallet.init({
        path: `m/44'/29223'/${ACTIVE_ACCOUNT_IDX}'/0/0`,
        mnemonic: process.env.MNEMONIC,
    }, false)

    console.log('\nWALLET ADDRESS', wallet.address, '\n')

    if (ACTIVE_ACCOUNT_IDX === 0) {
        // createGroup()
    }

    if (ACTIVE_ACCOUNT_IDX === 1) {
        mintGroup(
            wallet,
            'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug', // Shomari (Robin Hood)
            1000000,
            IS_LIVE_BROADCAST,
        )

        // mintSubgroup(
        //     wallet,
        //     'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug', // Shomari (Robin Hood)
        //     100000000,
        //     IS_LIVE_BROADCAST,
        // )
    }

    if (ACTIVE_ACCOUNT_IDX === 2) {
        setTimeout(() => {
            meltGroup(wallet, IS_LIVE_BROADCAST)
        }, 3000)
    }

    if (ACTIVE_ACCOUNT_IDX === 3) {
        // signMessage()
    }
})()
