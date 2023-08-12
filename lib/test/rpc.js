/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Rpc } from '../index.js'

/* Import (individual) modules. */
import {
    callNode,
    connectToNode,
} from '../index.js'

describe( 'RPC Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'RPC' class.` )
    } )

    describe( 'bytes', () => {
        let result
        let params

        params = []

        // params = [
        //     'nexa:qra4l7xn7t9kpppnxy5u7xe40jltsghggvmtr4jz0z',
        //     'HzNg+qPxQN8YvS/6k//7ycfClOesz40uydZ+VOoUz6hIdsR3x7BV61DqbudKMNf66ofGGVrlgD9NDssANO7+o08=',
        //     'awesomenexa.org_nexid_login_f4ce73a0-acbd-41c9-9d2e-49a807708db1',
        // ]
        // result = await callNode('verifymessage', params, {
        //     username: 'user',
        //     password: 'password',
        // })
        // .catch(err => console.error(err))
        // console.log('RPC RESULT', result)


        /* Reverse the bytes of the Hex string. */
        // const reversedByClass = Rpc.reverseBytes(TEST_BYTES)

        it( 'should retrieve the Wallet details (by Class)', async () => {
            result = await Rpc.call('getwalletinfo', params, {
                username: 'user',
                password: 'password',
            })
            .catch(err => console.error(err))
            // console.log('RPC RESULT', result)

            expect(result.walletversion).to.equal(130000)
        } )

        it( 'should retrieve the Wallet details (by Method)', async () => {
            result = await callNode('getwalletinfo', params, {
                username: 'user',
                password: 'password',
            })
            .catch(err => console.error(err))

            expect(result.walletversion).to.equal(130000)
        } )

        it( 'should have a Sync Block length of 32 bytes', async () => {
            result = await callNode('getwalletinfo', params, {
                username: 'user',
                password: 'password',
            })
            .catch(err => console.error(err))

            expect(result.syncblock).to.have.lengthOf(64)
        } )

        it( 'should have an HD Master Key ID length of 20 bytes', async () => {
            result = await callNode('getwalletinfo', params, {
                username: 'user',
                password: 'password',
            })
            .catch(err => console.error(err))

            expect(result.hdmasterkeyid).to.have.lengthOf(40)
        } )

        it( 'should have an Key Pool Size greater than 100', async () => {
            result = await callNode('getwalletinfo', params, {
                username: 'user',
                password: 'password',
            })
            .catch(err => console.error(err))

            expect(result.keypoolsize).to.at.least(100, `Oops! This number is too low.`)
        } )
    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
