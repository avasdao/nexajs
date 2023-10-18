/* Import modules. */
import { Wallet } from '@nexajs/wallet'

import createGroup from './src/createGroup.js'
import mintGroup from './src/mintGroup.js'
import mintSubgroup from './src/mintSubgroup.js'
import signMessage from './src/signMessage.js'

console.log('Starting NexaJS Daemon...')

const IS_LIVE_BROADCAST = false
const ACTIVE_ACCOUNT_IDX = 1
// 0 - nexa:nqtsq5g5ezqpr27c78uyf08260xq4xh35faa4yk64aycgega
// 1 - nexa:nqtsq5g55ykpcwwvr0x54358lx7skesefgj9anf07drdv52v
// 2 - nexa:nqtsq5g56gvyyaf57seml8zdxu8ur7x5wsevh49mj5f7q6s0

;(async () => {
    let wallet

    // return createGroup()
    // return signMessage()

    wallet = await Wallet.init({
        path: `m/44'/29223'/${ACTIVE_ACCOUNT_IDX}'/0/0`,
        mnemonic: process.env.MNEMONIC,
    }, false)

    setTimeout(() => {
        console.log('\nWALLET ADDRESS', wallet.address, '\n')

        mintGroup(
        // mintSubgroup(
            wallet,
            // 'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug', // Shomari (Robin Hood)
            // 'nexa:nqtsq5g52285kqgw8c9gukavzj6n6cxav5cq48y86x3gwt0c', // Causes Cash
            'nexa:nqtsq5g5zmfck8fxlhkpxe28yu4a747l2e65kuptph2ajp8x',
            100000,
            IS_LIVE_BROADCAST,
        )
    }, 100)
})()
