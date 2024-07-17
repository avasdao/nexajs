/* Import (test) modules. */
import { expect } from 'chai'

import { encodeAddress } from '@nexajs/address'

import {
    derivePublicKeyCompressed,
    ripemd160,
    sha256,
    signMessageHashEcdsa,
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
    hexToBase64,
    hexToBin,
    utf8ToBin,
} from '@nexajs/utils'

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

    NEXA_TEST_ADDRESS,
    NEXA_TEST_PARAM,
    PUBLIC_KEY,
} from '../test_vectors.js'

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
            let publicKeyHash
            let scriptData
            let scriptPubKey
            let signature
            let wif

            /* Set Private Key WIF. */
            wif = 'L1TnU2zbNaAqMoVh65Cyvmcjzbrj41Gs9iTLcWbpJCMynXuap6UN'

            const {
                address,
                privateKey,
                publicKey,
            } = await parseWif(wif, 'nexa', 'TEMPLATE')
            // console.log('ADDRESS', address)
            // console.log('PRIVATE KEY', binToHex(privateKey))

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
            // console.log('SIGNATURE', signature)

            const parsed = await parseWif(wif)
            // console.log('PARSED-1', parsed)

            const msgbuf = utf8ToBin('Hi Nexa!')

            const test = await signMessageHashEcdsa(privateKey, msgbuf)
            console.log('SIGNATURE-1', test)

            expect(signature.bin).to.eql(MSG_SIG_BIN)
            expect(signature.ecdsa).to.equal(MSG_SIG_ECDSA)
            expect(signature.hex).to.equal(MSG_SIG_HEX)
            expect(signature.sig).to.equal(MSG_SIG_ELECTRON)
        } )
    } )

    describe( 'Message -> verifyMessage', () => {
        it( 'should perform SIGNATURE VERIFICATION and return True or False', async () => {
            const addr = NEXA_TEST_ADDRESS
            const msg = utf8ToBin('Hi Nexa!')
            // const sig = 'IF4L/FpqrJwtbDi3/CmsHb6yEs4/i7ebNm5U1oqYi1iKMYzf00vJhe1uUjNQEYE2aFyFQUowhz5Y4sb1NY4U5ts='
            const sig = 'IECtdWeQRP8Wgy9j4piMze3FGtzEY7+sSD8zq/Uw11O0eGDL/DLzm8yYkx5w7Cee7RylsMQW21Q0/tFdJK88P6k='

            const verification = await verifyMessage(addr, sig, msg)
            // console.log('VERIFICATION', verification)
            // console.log('PUBLIC KEY', binToHex(verification.publicKey))

            expect(verification.isValid).to.be.true
            expect(verification.publicKey.length).to.equal(33)
            // expect(binToHex(verification.publicKey)).to.equal('02297e552f5d2f924278443df1656bec03ada990ef91ebfe884d165651ef51863f')
            // expect(binToHex(verification.publicKey)).to.equal('02fa2ce68d33f22823d50eb2ffe055d08ded55f78d8626a5123457e2390a0179bd')
            expect(binToHex(verification.publicKey)).to.equal('03971ef3ad27c75bd2695e9bde2ce6bcb273fe6732596f8789efdda77469a3588f')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return an INVALID signature verification', async () => {
            const addr = NEXA_TEST_ADDRESS
            const msg = utf8ToBin('Hi Nexa!')
            const sig = 'IECtdWeQRP8Wgy9j4piMze3FGtzEY7+sSD8zq/Uw11O0eGDL/DLzm8yYkx5w7Cee7RylsMQW21Q0/tFdJK88P6k='

            const verification = await verifyMessage(addr, sig, msg)
            // console.log('VERIFICATION', verification)

            expect(binToHex(verification.publicKey)).to.equal('03971ef3ad27c75bd2695e9bde2ce6bcb273fe6732596f8789efdda77469a3588f')
            expect(verification.isValid).to.be.false
        } )
    } )

} )
