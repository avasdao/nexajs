/* Import modules. */
import { OP } from '@nexajs/script'

import { binToHex } from '@nexajs/utils'

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

// TODO Add support for ALL signature types.
//      (source: https://spec.nexa.org/nexa/sighashtype.md)
const SIGHASH_ALL = 0x0


/**
 * Transaction Class
 *
 * Manages transaction functions.
 */
export class Transaction {
    constructor(_params) {
        /* Initialize Transaction class. */
        // console.info('Initializing Transaction...')
        // console.log(JSON.stringify(_params, null, 2))

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
        if (_params?.unlocking === null || _params?.unlocking === false) {
            // NOTE: `null` disables "automatic" transaction signing.
            this._unlocking = null
        } else {
            // NOTE: Expect `undefined` for "standard" pubkey+sig procedure.
            this._unlocking = _params?.unlocking
        }

        /* Validate hash type. */
        if (_params?.hashType) {
            this._hashType = _params.hashType
        } else {
            this._hashType = SIGHASH_ALL
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

    addInput({
        outpoint,
        satoshis,
        locking,
        unlocking,
        hashType,
    }) {
        /* Validate hash type. */
        if (!hashType) {
            hashType = SIGHASH_ALL
        }

        // TODO Validate EACH param.

        this._inputs.push({
            outpoint,
            satoshis,
            locking,
            unlocking,
            hashType,
        })
    }

    addOutput({
        address,
        satoshis,
        tokenid,
        tokens,
    }) {
        if (satoshis === null || typeof satoshis === 'undefined') {
            // TODO Validate output.
            this._outputs.push({
                data: address
            })
        } else {
            // TODO Validate output.
            this._outputs.push({
                address,
                satoshis,
                tokenid,
                tokens,
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
                locking: _input.locking,
                unlocking: _input.unlocking,
                sequence: _input.sequence || this.sequence,
                hashType: _input.hashType,
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
