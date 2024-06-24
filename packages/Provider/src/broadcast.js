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
    let request
    let resolve
    let reject

    // TODO Add (a secondary) broadcast request directly to NexaShell's GraphQL
    // USE `fetch()` -> NEXASH_DEFAULT_MAINNET

    /* Import WebSocket. */
    // NOTE: MUST BE EXCLUDED WHEN BUILDING FOR BROWSER VIA USING ROLLUP.
    const WebSocket = (await import('isomorphic-ws')).default

    /* Initialize socket connection. */
    // TODO Enable connection pooling.
    const socket = new WebSocket(rostrumProvider)

    /* Handle open connection. */
    socket.onopen = () => {
        // console.log('SOCKET OPENDED!')

        /* Build request. */
        request = {
            id: 'nexajs',
            method: 'blockchain.transaction.broadcast',
            params: [_rawTx],
        }

        /* Send request. */
        socket.send(JSON.stringify(request) + '\n')
    }

    /* Handle socket messages. */
    socket.onmessage = (msg) => {
        // console.log('MESSAGE (data):', msg.data)

        /* Resolve message data. */
        resolve(msg.data)

        /* Close connection. */
        // TODO Add support for connection pooling.
        socket.close()
    }

    /* Handle socket errors. */
    socket.onerror = (err) => {
        reject(err)
    }

    /* Return (response) promise. */
    return new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject // FIXME Handle socket errors.
    })
}
