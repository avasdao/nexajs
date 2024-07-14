/* Import (test) modules. */
import { expect } from 'chai'

import { encodeAddress } from '@nexajs/address'

import {
    ripemd160,
    sha256,
} from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import {
    encodeDataPush,
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    instantiateSecp256k1,
} from '@bitauth/libauth'

/* Import class. */
import { Message } from '../../index.js'

/* Import (individual) modules. */
import {
    signMessage,
    verifyMessage,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    MSG_SIG_BIN,
    MSG_SIG_ECDSA,
    MSG_SIG_ELECTRON,
    MSG_SIG_HEX,

    NEXA_TEST_PARAM,
} from '../test_vectors.js'

/* Instantiate Libauth crypto interfaces. */
const secp256k1 = await instantiateSecp256k1()

/* Initialize globals. */
let prefix

describe( 'Message (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Message' class.` )

        prefix = 'nexa'
    } )

    describe( 'Message -> signMessage', () => {
        it( 'should use a WIF to SIGN a message and return the signature details', async () => {
            let nexaAddress
            let publicKey
            let publicKeyHash
            let scriptData
            let scriptPubKey
            let signature
            let wif

            /* Set Private Key WIF. */
            wif = 'L1TnU2zbNaAqMoVh65Cyvmcjzbrj41Gs9iTLcWbpJCMynXuap6UN'

            /* Derive the corresponding public key. */
            // FIXME Derive from WIF!!
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin('7e96f68c3c15d6884d254c2b68356faf15b4d0f00001fc2f1e9e4f9e434ba9cd'))
            // console.log('publicKey-1', publicKey);

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptData = encodeDataPush(publicKey)

            publicKeyHash = ripemd160(sha256(scriptData))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])
            // console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            nexaAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            // console.info('\n  Nexa address:', nexaAddress)

            /* TBD. */
            signature = await signMessage(wif, 'Hi Nexa!')
            // console.log('signature', signature);

            expect(signature.bin).to.eql(MSG_SIG_BIN)
            expect(signature.ecdsa).to.equal(MSG_SIG_ECDSA)
            expect(signature.hex).to.equal(MSG_SIG_HEX)
            expect(signature.sig).to.equal(MSG_SIG_ELECTRON)
        } )
    } )

    describe( 'Message -> verifyMessage', () => {
        it( 'should perform SIGNATURE VERIFICATION and return True or False', async () => {
            const msg = '1336'
            const sig = 'IF4L/FpqrJwtbDi3/CmsHb6yEs4/i7ebNm5U1oqYi1iKMYzf00vJhe1uUjNQEYE2aFyFQUowhz5Y4sb1NY4U5ts='

            const verification = await verifyMessage(msg, sig)
            // console.log('VERIFICATION', verification)

            expect(verification.isValid).to.be.true
            expect(verification.publicKey.length).to.equal(33)
            expect(binToHex(verification.publicKey)).to.equal('02297e552f5d2f924278443df1656bec03ada990ef91ebfe884d165651ef51863f')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
