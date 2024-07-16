/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD
import { ethers } from 'ethers'

/**
 * Meta Class
 *
 * Manages meta functions.
 */
export class Meta extends EventEmitter {
    constructor(_params) {
        /* Initialize Meta class. */
        // console.info('Initializing Meta...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Meta (Instance) is working!'
    }

    static test() {
        return 'Meta (Static) is working!'
    }

    async getBlockHeight() {
        // return 'Meta (Instance) is working!'
        const url = 'https://nexa.sh/metatest'
        const provider = new ethers.JsonRpcProvider(url)

        const blockCount = await provider
            .getBlockNumber()
            .catch(err => console.error(err))
        return blockCount
    }

    async getBalance(_address) {
        // return 'Meta (Instance) is working!'
        const url = 'https://nexa.sh/metatest'
        const provider = new ethers.JsonRpcProvider(url)

        const blockCount = await provider
            .getBalance(_address)
            .catch(err => console.error(err))
        return blockCount
    }

}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Meta class. */
Nexa.Meta = Meta

/* Initialize Meta modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
