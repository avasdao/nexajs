/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:address:watchAddress')

import { createClient } from 'graphql-ws'
import WebSocket from 'ws'

export default async (_params, _notif) => {
    console.log('PARAMS', _params)
    console.log('NOTIF', _notif)
    /* Initialize locals. */
    // let notif

    /* Handle notifications. */
    // if (_params?.notif) {
    //     notif = _params.notif
    // } else if (_notif) {
    //     notif = _notif
    // }

    const client = createClient({
    	url: 'wss://nexa.sh/graphql',
        webSocketImpl: WebSocket,
    })

    // subscription
    const onNext = (_val) => {
        /* handle incoming values */
        console.log('TX', _val)
    }

    let unsubscribe = () => {
        /* complete the subscription */
        console.log('done!')
    }

    await new Promise((resolve, reject) => {
        unsubscribe = client.subscribe(
            {
                query: 'subscription { transaction { txidem hex } }',
            },
            {
                next: onNext,
                error: reject,
                complete: resolve,
            },
        )
    }).catch(err => console.error(err))
}
