/* Import (test) modules. */
import { expect } from 'chai'

import { encodeAddress } from '@nexajs/address'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import {
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    encodeDataPush,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

/* Import class. */
import { Message } from '../index.js'

/* Import (individual) modules. */
import {
    signMessage,
    verifyMessage,
} from '../index.js'

const NEXA_TEST_PARAM = 'someval'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()

describe( 'Message Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Message' class.` )
    } )

    describe( 'Message -> Method', () => {
        it( 'should do something useful', async () => {
            let nexaAddress
            let publicKey
            let publicKeyHash
            let scriptData
            let scriptPubKey
            let signature
            let wif

            /* Encode Private Key WIF. */
            wif = 'L1TnU2zbNaAqMoVh65Cyvmcjzbrj41Gs9iTLcWbpJCMynXuap6UN'

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin('7e96f68c3c15d6884d254c2b68356faf15b4d0f00001fc2f1e9e4f9e434ba9cd'))
            // console.log('publicKey-1', publicKey);

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptData = encodeDataPush(publicKey)

            publicKeyHash = ripemd160.hash(sha256.hash(scriptData))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])
            // console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

            /* TBD. */
            signature = await signMessage(wif, 'Hi Nexa!')
            console.log('signature', signature);

            const ecdsaMatch = 'z2GrpCb75+hhSBClNRjYtiWmy5xY+4w3+RSinTfxz/Z4zIzJ0L6H6RuNx0ng0k+AWwBYjE3OV1bsJfyE6ZPwYw=='
            const binMatch = new Uint8Array([
                207,  97, 171, 164,  38, 251, 231, 232,  97,  72,  16,
                165,  53,  24, 216, 182,  37, 166, 203, 156,  88, 251,
                140,  55, 249,  20, 162, 157,  55, 241, 207, 246, 120,
                204, 140, 201, 208, 190, 135, 233,  27, 141, 199,  73,
                224, 210,  79, 128,  91,   0,  88, 140,  77, 206,  87,
                 86, 236,  37, 252, 132, 233, 147, 240,  99
            ])
            const hexMatch = 'cf61aba426fbe7e8614810a53518d8b625a6cb9c58fb8c37f914a29d37f1cff678cc8cc9d0be87e91b8dc749e0d24f805b00588c4dce5756ec25fc84e993f063'
            const electronMatch = 'IM9hq6Qm++foYUgQpTUY2LYlpsucWPuMN/kUop038c/2eMyMydC+h+kbjcdJ4NJPgFsAWIxNzldW7CX8hOmT8GM='

            expect(signature.bin).to.eql(binMatch)
            expect(signature.ecdsa).to.equal(ecdsaMatch)
            expect(signature.hex).to.equal(hexMatch)
            expect(signature.sig).to.equal(electronMatch)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
