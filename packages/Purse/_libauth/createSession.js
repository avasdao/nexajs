/* Import libraries. */
import CashID from 'cashid'
import moment from 'moment'

/* Import modules. */
import installBadger from './installBadger.js'

/**
 * Get Session Id
 *
 * 1. Generate a deterministic authorization key (authKey).
 * 2. Call the API session manager (create a new session).
 * 3. Return the `authKey`.
 */
const getSessionId = () => {
    return new Promise(function (resolve, reject) {
        // console.log('SIGN IN')

        if (typeof window.web4bch !== 'undefined') {
            /* Initialize Web4BCH. */
            const web4bch = new window.Web4Bch(window.web4bch.currentProvider)
            // console.log('web4bch', web4bch)

            /* Validate web4BCH. */
            if (!web4bch) {
                installBadger()

                reject('No web4BCH found.')
            }

            // console.log('DEFAULT ACCOUNT', web4bch.bch.defaultAccount)

            /* Validate account. */
            if (web4bch.bch && web4bch.bch.defaultAccount === undefined) {
                alert('please unlock your badgerwallet');
            }

            /* Initialize CashId. */
            // const cashid = new CashID()
            const cashid = new CashID('api.apecs.dev', '/v1/cashid')

            /* Set action. */
            const action = 'Sign in'

            /* Set timestamp. */
            // NOTE: This is NOT currently used for any purpose during
            //       user authentication.
            const data = moment().format('LLLL (x)')

            /* Set metadata. */
            // NOTE: This is NOT currently used for any purpose during
            //       user authentication.
            const metadata = {
                optional: {
                    identity: ['name', 'nickname'],
                    contact: ['email']
                }
            }

            /* Set URI. */
            const cashIDRequest = cashid.createRequest(action, data, metadata)
            // console.log('CASHID REQUEST', cashIDRequest)

            /* Set CashID buffer. */
            const cidBuf = Buffer.from(cashIDRequest)
            // console.log('CASHID REQUEST BUFFER', cidBuf)

            /* Set CashID (authorization) hash. */
            // const authHash = bitbox.Crypto.sha256(cidBuf).toString('hex')
            // console.log('CASHID AUTH HASH', authHash)

            /* Initialize signature function. */
            const sigFunc = (err, res) => {
                if (err) {
                    // console.error('SIGFUNC ERROR:', err)

                    // console.error('ERROR MSG', err.message)

                    if (err.message.includes('User denied message signature')) {
                        reject('DENIED')
                    } else {
                        reject(err)
                    }

                    return
                }

                // console.log('SIGFUNC RESPONSE', res, authHash)

                /* Resolve the authorization hash. */
                resolve({ res, authHash })
            }

            web4bch.bch.sign(
                web4bch.bch.defaultAccount,
                cashIDRequest,
                sigFunc
            )
         } else {
             /* Install Badger. */
             installBadger()

             reject('No web4BCH found.')
         }
    })
}

export default getSessionId
