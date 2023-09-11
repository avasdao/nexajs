/* Import modules. */
import { Wallet } from '@nexajs/wallet'

import create from './src/create.js'
import mint from './src/mint.js'
import signMessage from './src/signMessage.js'

console.log('Starting NexaJS Daemon...')



;(async () => {
    let wallet

    // create()
    // signMessage()

    wallet = new Wallet(process.env.MNEMONIC)

return
    setTimeout(() => {
        mint(
            wallet,
            'nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug',
            100000000
        )
    }, 100)
})()
