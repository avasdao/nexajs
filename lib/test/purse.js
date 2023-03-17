/* Import (test) modules. */
import { assert, expect } from 'chai'

/* Ethers.js helpers. */
import { randomBytes } from '@ethersproject/random'

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
const PRIVATE_KEY = 'a42801c4-40cd-4e8f-aeba-a74f5145ad9b'
const BCH_TEST_ADDRESS = 'bitcoincash:qqwsfram5cc87k2n26gshjnylg8gdjnauuum5sws3c'
const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> Ethers -> RandomBytes', () => {
        it( 'should generate 32-bytes of random data', () => {
            const bytes = randomBytes(32)

            expect(bytes).to.have.length(32)
        } )
    } )

    describe( 'Purse -> UTXO -> Send UTXO', async () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
            const params = {
                mnemonic: TEST_MNEMONIC,
                receiver: NEXA_TEST_ADDRESS,
            }

            const success = await sendUtxo(params)
            console.log('SEND UTXO (success):', success)
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
