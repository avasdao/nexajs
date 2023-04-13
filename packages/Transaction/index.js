/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:transaction')

/* Libauth helpers. */
import {
    binToHex,
} from '@bitauth/libauth'

/* Import (local) modules. */
// import _createBchTransaction from './src/createBchTransaction.js'
import createTransaction from './src/createTransaction.js'

/* Export (local) modules. */
// export const createBchTransaction = _createBchTransaction
// export const createNexaTransaction = _createNexaTransaction


/**
 * Transaction Class
 *
 * Manages transaction functions.
 */
export class Transaction {
    constructor(_params) {
        /* Initialize Transaction class. */
        debug('Initializing Transaction...')
        debug(JSON.stringify(_params, null, 2))

        /* Initialize flags. */
        this._isSigned = false

        /* Initialize inputs. */
        this._inputs = []

        /* Initialize outputs. */
        this._outputs = []

        /* Initialize lock time. */
        // NOTE: A Unix timestamp or block number. (4 bytes)
        this._lockTime = 0

        this._raw = null
    }

    test() {
        return 'Transaction (Instance) is working!'
    }

    static test() {
        return 'Transaction (Static) is working!'
    }

    async build(_wif, _unspents, _receivers, _fee = 250) {
        // const fee = Math.floor(1.1 * transactionTemplate.length)

        this._raw = await createTransaction(_wif, _unspents, _receivers, _fee)
        console.log('RAW TX', this._raw)
    }

    get inputs() {
        return this._inputs
    }

    get isSigned() {
        return this._isSigned
    }

    get lockTime() {
        return this._lockTime
    }

    get outputs() {
        return this._outputs
    }

    get json() {
        /* Validate raw transaction data. */
        if (!this._raw) {
            return {}
        }

        return {
            hash: 'TODO',
        }
    }

    get raw() {
        /* Validate raw transaction data. */
        if (!this._raw) {
            return ''
        }

        /* Return (hex-formatted) raw transaction data. */
        return binToHex(this._raw)
    }

    addInput(_input) {
        // TODO Validate input.
        this._inputs.push(_input)
    }

    addOutput(_output) {
        // TODO Validate output.
        this._outputs.push(_output)
    }

    setLockTime(_timestamp) {
        // TODO Validate timestamp or block height.
        this._lockTime = _timestamp
    }

    sign(_params) {
        /* Set flag. */
        this._isSigned = true
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Transaction class. */
Nexa.Transaction = Transaction

/* Initialize Transaction modules. */
// Nexa.createBchTransaction = createBchTransaction
// Nexa.createNexaTransaction = createNexaTransaction

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
