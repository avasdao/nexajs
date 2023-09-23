/* Import modules. */
import { Wallet } from '@nexajs/wallet'

import createGroup from './src/createGroup.js'
import mintGroup from './src/mintGroup.js'
import mintSubgroup from './src/mintSubgroup.js'
import signMessage from './src/signMessage.js'

console.log('Starting NexaJS Daemon...')



;(async () => {
    let wallet

    // return createGroup()
    // return signMessage()

    wallet = new Wallet(process.env.MNEMONIC)

    setTimeout(() => {
        return console.log('WALLET ADDRESS', wallet.address)

        // mintGroup(
        mintSubgroup(
            wallet,
            // 'nexa:nqtsq5g5ezqpr27c78uyf08260xq4xh35faa4yk64aycgega', // Daemon
            'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug', // Shomari
            1
        )
    }, 100)
})()
