/**
 * Broadcast a (signed) transaction to the network.
 *
 * @param {*} transaction
 */
const broadcast = async (_rawTx) => {
    const target = 'https://insomnia.fountainhead.cash/v1/tx/broadcast'
    /* Call remote API. */
    const response = await fetch(target, {
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

    const body = await response.json()
    console.log('broadcast (body):', body)
}

const broadcastRostrum = (_rawTx) => {
    const socket = new WebSocket('wss://electrum.nexa.org:20004')
    // const socket = new WebSocket('wss://rostrum.apecs.dev:20004')

    /* Handle open connection. */
    socket.onopen = () => {
        // console.log('SOCKET OPENDED!')
        let request

        request = `{"method":"blockchain.transaction.broadcast","params":["${_rawTx}"],"id":"testing"}`
        socket.send(request + '\n')
    }

    socket.onmessage = async (msg) => {
        console.log('MESSAGE (data):', msg.data)
        socket.close()
    }
}

/* Export module. */
export default broadcastRostrum
