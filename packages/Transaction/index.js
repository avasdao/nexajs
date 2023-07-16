/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:transaction')

/* Libauth helpers. */
import {
    binToHex,
} from '@bitauth/libauth'

/* Import (local) modules. */
import _createTransaction from './src/createTransaction.js'

/* Export (local) modules. */
export const createTransaction = _createTransaction


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

        /* Initialize raw (hex) output. */
        this._raw = null

        /* Validate fee rate. */
        if (_params?.feeRate) {
            this._feeRate = _params.feeRate
        } else {
            // NOTE: This is the new Qt default (1.0/byte is for consolidation).
            this._feeRate = 2.0 // 2.0 satoshis per byte
        }

        /* Validate lock time. */
        // NOTE: A Unix timestamp or block number. (4 bytes)
        if (_params?.lockTime) {
            this._lockTime = _params.lockTime
        } else {
            this._lockTime = 0
        }

    }

    test() {
        return 'Transaction (Instance) is working!'
    }

    static test() {
        return 'Transaction (Static) is working!'
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

    addInput(_outpoint, _satoshis) {
        // TODO Validate input.
        this._inputs.push({
            outpoint: _outpoint,
            satoshis: _satoshis,
        })
    }

    addOutput(_receiver, _satoshis = null, _tokenid = null, _tokens = null) {
        if (_satoshis !== null) {
            // TODO Validate output.
            this._outputs.push({
                address: _receiver,
                satoshis: _satoshis,
                tokenid: _tokenid,
                tokens: _tokens,
            })
        } else {
            // TODO Validate output.
            this._outputs.push({
                data: _receiver
            })
        }
    }

    setLockTime(_timestamp) {
        // TODO Validate timestamp or block height.
        this._lockTime = _timestamp
    }

    async sign(_wifs) {
        /* Initialize unspent holder. */
        const unspents = []

        /* Handle inputs. */
        this._inputs.forEach(_input => {
            unspents.push({
                outpoint: _input.outpoint,
                satoshis: _input.satoshis,
            })
        })

        /* Generate raw transaction. */
        this._raw = await createTransaction(
            _wifs,
            unspents,
            this._outputs,
        ).catch(err => console.error(err))
        // console.log('RAW TX', this._raw)

        /* Set flag. */
        this._isSigned = true
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Transaction class. */
Nexa.Transaction = Transaction

/* Initialize Transaction modules. */
Nexa.createTransaction = createTransaction

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
