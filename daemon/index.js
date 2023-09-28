/* Import modules. */
import { Wallet } from '@nexajs/wallet'

import createGroup from './src/createGroup.js'
import mintGroup from './src/mintGroup.js'
import mintSubgroup from './src/mintSubgroup.js'
import signMessage from './src/signMessage.js'

console.log('Starting NexaJS Daemon...')

const IS_LIVE_BROADCAST = true

;(async () => {
    let wallet

    // return createGroup()
    // return signMessage()

    wallet = new Wallet(process.env.MNEMONIC)

    setTimeout(() => {
        console.log('\nWALLET ADDRESS', wallet.address, '\n')

        mintGroup(
        // mintSubgroup(
            wallet,
            // 'nexa:nqtsq5g5ezqpr27c78uyf08260xq4xh35faa4yk64aycgega', // Studio Daemon
            // 'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug', // Shomari (Robin Hood)
            'nexa:nqtsq5g52285kqgw8c9gukavzj6n6cxav5cq48y86x3gwt0c', // Causes Cash
            65000000,
            IS_LIVE_BROADCAST,
        )
    }, 100)
})()
