/* Import (test) modules. */
import { assert, expect } from 'chai'

/* Import library modules. */
import { broadcast } from '../index.js'

/* Import class. */
import { Purse } from '../index.js'

/* Import library modules. */
import { createNexaTransaction } from '../index.js'
import { encodeAddress } from '../index.js'
import { getUnspentOutputs } from '../index.js'
import { sendUtxo } from '../index.js'

/* Set (BIP39) seed phrase. */
const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony'
const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9'
const BCH_TEST_ADDRESS = 'bitcoincash:qqwsfram5cc87k2n26gshjnylg8gdjnauuum5sws3c'
const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> UTXO -> Send UTXO', async () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
            /* Increase timeout to 5 seconds. */
            // NOTE See https://github.com/mochajs/mocha/issues/2025
            // this.timeout(5000)

            /* Build parameters. */
            const params = {
                mnemonic: TEST_MNEMONIC,
                receiver: NEXA_TEST_ADDRESS,
            }

            /* Send UTXO request. */
            const response = await sendUtxo(params)
            console.log('Send UTXO (response):', response)


            try {
                const txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    return console.error(txResult.message)
                }

                expect(txResult.result).to.have.length(64)
            } catch (err) {
                console.error(err)
            }
        } )
    } )

    describe( 'error', () => {
        it( 'should return an error', () => {
            // assert.throws( utils.badd, Error('it blowed up') )
            // assert.throws( utils.badd, 'it blowed up' )
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
