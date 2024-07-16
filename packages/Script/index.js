/* Import (local) modules. */
import _decodeNullData from './src/decodeNullData.js'
import _encodeDataPush from './src/encodeDataPush.js'
import _encodeNullData from './src/encodeNullData.js'
import _getOpcode from './src/getOpcode.js'
import _OP from './src/Opcodes.js'

/* Export (local) modules. */
export const decodeNullData = _decodeNullData
export const encodeDataPush = _encodeDataPush
export const encodeNullData = _encodeNullData
export const getOpcode = _getOpcode
export const OP = _OP


/**
 * Script Class
 *
 * Manages script functions.
 */
export class Script {
    constructor(_params) {
        /* Initialize Script class. */
        // console.info('Initializing Script...')
        // console.log(JSON.stringify(_params, null, 2))

        this._data = null

        if (_params) {
            this._data = _params
        }

        return this
    }

    test() {
        return 'Script (Instance) is working!'
    }

    static test() {
        return 'Script (Static) is working!'
    }

    static empty() {
        const initialData = []

        return new Script(initialData) // For method chaining.
    }

    get chunks() {
        return this.data // alias for `data`
    }

    get data() {
        return this._data
    }

    get length() {
        return this._data.length
    }

    get raw() {
        return this.data // alias for `data`
    }

    add(_data) {
        /* Initailize data holder. */
        let data

        if (_data instanceof Uint8Array) {
            data = _data
        } else if (Array.isArray(_data)) {
            data = new Uint8Array(_data)
        } else {
            data = new Uint8Array([_data])
        }

        /* Add data to existing array. */
        this._data = new Uint8Array([
            ...this._data,
            ...data,
        ])

        return this // For method chaining.
    }

    toString() {
        /* Initialize OPs. */
        const ops = []

        this.data.forEach(_code => {
            ops.push(getOpcode(_code))
        })

        return ops.join(' ')
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Script class. */
Nexa.Script = Script

/* Initialize Script modules. */
Nexa.decodeNullData = decodeNullData
Nexa.encodeDataPush = encodeDataPush
Nexa.encodeNullData = encodeNullData
Nexa.getOpcode = getOpcode
Nexa.OP = OP

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
