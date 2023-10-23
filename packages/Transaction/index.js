/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:transaction')

/* Import modules. */
import { OP } from '@nexajs/script'

/* Libauth helpers. */
import {
    binToHex,
} from '@bitauth/libauth'

/* Import (local) modules. */
import _createTransaction from './src/createTransaction.js'

/* Export (local) modules. */
export const createTransaction = _createTransaction

/* Initialize default script bytecode. */
const SCRIPT_TEMPLATE_1 = new Uint8Array([
    OP.FROMALTSTACK,
        OP.CHECKSIGVERIFY,
])

const MAXINT = 0xffffffff
const DEFAULT_SEQNUMBER = MAXINT - 1 // NOTE: Enables nLocktime

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

        /* Validate sequence (number). */
        if (_params?.sequence) {
            this._sequence = _params.sequence
        } else {
            this._sequence = DEFAULT_SEQNUMBER
        }

        /* Validate locking (script). */
        if (_params?.locking) {
            this._locking = _params.locking
        } else {
            this._locking = SCRIPT_TEMPLATE_1
        }

        /* Validate unlocking (script). */
        if (_params?.unlocking === null) {
            // NOTE: disables "automatic" transaction signing.
            this._unlocking = null
        } else {
            // NOTE: expect `undefined` for "standard" pubkey+sig procedure.
            this._unlocking = _params.unlocking
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

    get locking() {
        return this._locking
    }

    get sequence() {
        return this._sequence
    }

    get unlocking() {
        return this._unlocking
    }

    addInput(_outpoint, _satoshis, _unlocking = null) {
        // TODO Validate input.

        /* Validate unlocking script. */
        if (_unlocking !== null && typeof _unlocking !== 'undefined') {
            this._inputs.push({
                outpoint: _outpoint,
                satoshis: _satoshis,
                unlocking: _unlocking,
            })
        } else {
            this._inputs.push({
                outpoint: _outpoint,
                satoshis: _satoshis,
                // NOTE: unlocking is "undefined"
            })
        }
    }

    addOutput(
        _receiver,
        _satoshis = null,
        _tokenid = null,
        _tokens = null
    ) {
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

    async sign(_wifs) {
        /* Initialize unspent holder. */
        const unspents = []

        /* Handle inputs. */
        this._inputs.forEach(_input => {
            unspents.push({
                outpoint: _input.outpoint,
                satoshis: _input.satoshis,
                sequence: this.sequence, // TODO Allow unique sequence per input.
            })
        })

        /* Generate raw transaction. */
        this._raw = await createTransaction(
            _wifs,
            unspents,
            this.outputs,
            this.lockTime,
            this.locking,
            this.unlocking,
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
