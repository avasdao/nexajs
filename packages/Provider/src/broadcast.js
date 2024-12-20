/* Import modules. */
import { isHex } from '@nexajs/utils'

/* Initialize constants. */
const INSOMNIA_DEFAULT = 'https://insomnia.fountainhead.cash/v1/tx/broadcast'
const NEXASH_DEFAULT_MAINNET = 'https://nexa.sh/graphql'
const NEXASH_DEFAULT_TESTNET = 'https://test-nexa.sh/graphql'
const ROSTRUM_DEFAULT_MAINNET = 'wss://rostrum.nexa.sh:20004'
const ROSTRUM_DEFAULT_TESTNET = 'wss://rostrum.test-nexa.sh:30004'

/* Initialize globals. */
let nexashProvider
let rostrumProvider

/* Handle environment variables. */
if (typeof process !== 'undefined' && process?.env?.NEXASH) {
    /* Set (user-defined) Rostrum provider. */
    nexashProvider = process.env.NEXASH
} else if (typeof process !== 'undefined' && process?.env?.TESTNET) {
    /* Set default (Testnet) provider. */
    nexashProvider = NEXASH_DEFAULT_TESTNET
} else {
    /* Set default (Mainnet) provider. */
    nexashProvider = NEXASH_DEFAULT_MAINNET
}

/* Handle environment variables. */
if (typeof process !== 'undefined' && process?.env?.ROSTRUM) {
    /* Set (user-defined) Rostrum provider. */
    rostrumProvider = process.env.ROSTRUM
} else if (typeof process !== 'undefined' && process?.env?.TESTNET) {
    /* Set default (Testnet) provider. */
    rostrumProvider = ROSTRUM_DEFAULT_TESTNET
} else {
    /* Set default (Mainnet) provider. */
    rostrumProvider = ROSTRUM_DEFAULT_MAINNET
}

/**
 * Broadcast a (signed) transaction to the network.
 *
 * @param {*} transaction
 */
export default (_rawTx) => {
    // FIXME Automatically detect transaction format

    // return broadcastBch(_rawTx)
    return broadcastNexa(_rawTx)
}

/**
 * Broadcast a (signed) transaction to the network.
 *
 * @param {*} transaction
 */
const broadcastBch = async (_rawTx) => {
    /* Call remote API. */
    // NOTE: Native `fetch` requires Node v21+.
    const response = await fetch(INSOMNIA_DEFAULT, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain'
        },
        body: _rawTx,
    })
    .catch(err => {
        console.error(err)
        // TODO Handle error

        /* Set error. */
        // error = err
    })

    /* Request (response) body. */
    const body = await response
        .json()
        .catch(err => console.error(err))
    console.log('Broadcast (response):', body)

    /* Return (response) body. */
    return body
}

/**
 * Broadcast a (signed) transaction to the network.
 *
 * @param {*} transaction
 */
const broadcastNexa = async (_rawTx) => {
    /* Initialize locals. */
    let bytecode
    let query
    let response
    let txidem

    bytecode = _rawTx
    // TODO Validate bytecode.

    /* Validate bytecode. */
    if (!bytecode || bytecode === '') {
        throw new Error('Oops! You MUST provide a valid bytecode.')
    }

    /* Build query. */
    query = `
    mutation Broadcast {
        broadcast(hexstring: "${bytecode}")
    }`
    // console.log('QUERY', query)

    /* Make query request. */
    // NOTE: Native `fetch` requires Node v21+.
    response = await fetch(NEXASH_DEFAULT_MAINNET,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query }),
        }).catch(err => console.error(err))

    /* Validate response. */
    if (response) {
        response = await response.json()
    } else {
        throw new Error('Transaction broadcast FAILED!')
    }
    // console.log('RESPONSE (graphql)', response)

    /* Validate response. */
    if (response?.data?.broadcast) {
        /* Set response. */
        response = response.data.broadcast

        /* Validate (txidem) response. */
        if (isHex(response) && response.length === 64) {
            response = {
                // NOTE: This should be a transaction idem.
                result: response
            }
        } else {
            response = {
                error: typeof response === 'string' ? response : JSON.stringify(response)
            }
        }
    } else if (response?.data) {
        /* Set response. */
        response = response.data

        response = {
            error: typeof response === 'string' ? response : JSON.stringify(response)
        }
    } else {
        response = {
            error: typeof response === 'string' ? response : JSON.stringify(response)
        }
    }

    /* Return response. */
    return response
}
