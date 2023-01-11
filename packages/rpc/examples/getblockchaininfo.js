/* Import modules. */
import { call } from '../index.js' // use @nexajs/rpc in production

;(async () => {
    /* Set method. */
    const method = 'getblockchaininfo'

    /* Set parameters. */
    const params = []

    /* Set node options. */
    const options = {
        username: 'user', // required
        password: 'password', // required
        host: '127.0.0.1', // (optional) default is localhost (127.0.0.1)
        port: '7227', // (optional) default is 7227
    }

    /* Execute JSON-RPC request. */
    const response = await call(method, params, options)
    console.log('\nJSON-RPC response:\n%s', response)
})()
