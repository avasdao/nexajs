/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:address')

/* Import (local) modules. */
import { decodeAddress as _decodeAddress } from './src/cashaddr.js'
import { encodeAddress as _encodeAddress } from './src/cashaddr.js'
import getSeedType from './src/getSeedType.js'

/* Export (local) modules. */
export const decodeAddress = _decodeAddress
export const encodeAddress = _encodeAddress


/**
 * Address Class
 *
 * Manages address functions.
 */
export class Address extends EventEmitter {
    constructor(_params) {
        /* Initialize Address class. */
        debug('Initializing Address...')
        debug(JSON.stringify(_params, null, 2))
        super()

        /* Set (address) seed. */
        this._seed = _params?.seed

        /* Validate seed. */
        if (!this._seed) {
            /* Set (address) seed. */
            this._seed = _params
        }

        /* Set seed type. */
        this._seedType = getSeedType(_params)

        /* Validate seed type. */
        if (!this._seedType) {
            throw new Error(`Oops! Invalid address seed.`)
        }
    }

    test() {
        testAddr()
    }

    decode(_addr) {
        return decodeAddress(_addr)
    }
    static decode(_addr) {
        return decodeAddress(_addr)
    }

    encode(_prefix, _type, _hash) {
        return encodeAddress(_prefix, _type, _hash)
    }
    static encode(_prefix, _type, _hash) {
        return encodeAddress(_prefix, _type, _hash)
    }

    /**
     * To String
     *
     * Serializes (or marshalls) the Address details into a JSON package.
     *
     * (optional) Set formatting to (true) for "pretty" output styling.
     */
    toString(_formatted = false) {
        /* Build Address (data) package. */
        const pkg = {
            seed: this._seed,
            seedType: this._seedType,
        }

        /* Handle formatting flag. */
        if (_formatted) {
            return JSON.stringify(pkg, null, 2)
        } else {
            return pkg
        }
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Address class. */
Nexa.Address = Address

/* Initialize Address modules. */
Nexa.decodeAddress = decodeAddress
Nexa.encodeAddress = encodeAddress

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
