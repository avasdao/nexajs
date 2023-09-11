/* Import modules. */
import { Wallet } from '@nexajs/wallet'

import create from './src/create.js'
import mint from './src/mint.js'
import signMessage from './src/signMessage.js'

console.log('Starting NexaJS Daemon...')



;(async () => {
    let wallet

    // return create()
    // return signMessage()

    wallet = new Wallet(process.env.MNEMONIC)

    setTimeout(() => {
        return console.log('WALLET ADDRESS', wallet.address)

        mint(
            wallet,
            // 'nexa:nqtsq5g5ezqpr27c78uyf08260xq4xh35faa4yk64aycgega', // Daemon
            'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug', // Shomari
            100000000
        )
    }, 100)
})()
