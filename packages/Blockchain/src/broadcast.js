/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:blockchain:broadcast')

const INSOMNIA_ENDPOINT = 'https://insomnia.fountainhead.cash/v1/tx/broadcast'
const ROSTRUM_ENDPOINT = 'wss://electrum.nexa.org:20004'
// const ROSTRUM_ENDPOINT = 'wss://rostrum.nexa.sh:20004'

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
    const response = await fetch(INSOMNIA_ENDPOINT, {
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
    const body = await response.json()
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

    /* Import WebSocket. */
    // NOTE: Ignored by esmify.
    const WebSocket = await import('isomorphic-ws')

    /* Initialize socket connection. */
    // TODO Enable connection pooling.
    const socket = new WebSocket(ROSTRUM_ENDPOINT)

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
