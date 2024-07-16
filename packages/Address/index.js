/* Import (local) modules. */
import { decodeAddress as _decodeAddress } from './src/cashaddr.js'
import _decodeBase58AddressFormat from './src/decodeBase58AddressFormat.js'
import { encodeAddress as _encodeAddress } from './src/cashaddr.js'
import _encodeBase58AddressFormat from './src/encodeBase58AddressFormat.js'
import getSeedType from './src/getSeedType.js'
import _getSender from './src/getSender.js'
import _listUnspent from './src/listUnspent.js'
import _watchAddress from './src/watchAddress.js'

/* Export (local) modules. */
export const decodeAddress = _decodeAddress
export const decodeBase58AddressFormat = _decodeBase58AddressFormat
export const encodeAddress = _encodeAddress
export const encodeBase58AddressFormat = _encodeBase58AddressFormat
export const getSender = _getSender
export const listUnspent = _listUnspent
export const watchAddress = _watchAddress


/**
 * Address Class
 *
 * Manages address functions.
 */
export class Address {
    constructor(_params, _notif) {
        /* Initialize Address class. */
        // console.info('Initializing Address...')
        // console.log(JSON.stringify(_params, null, 2))

        /* Handle notifications. */
        if (_params?.notif) {
            notif = _params.notif
        } else if (_notif) {
            notif = _notif
        }

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

    static getSender(_input) {
        return getSender(_input)
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
Nexa.decodeBase58AddressFormat = decodeBase58AddressFormat
Nexa.encodeAddress = encodeAddress
Nexa.encodeBase58AddressFormat = encodeBase58AddressFormat
Nexa.getSender = getSender
Nexa.listUnspent = listUnspent
Nexa.watchAddress = watchAddress

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
