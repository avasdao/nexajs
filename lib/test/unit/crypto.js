/* Import (test) modules. */
import { expect } from 'chai'

import CryptoJS from 'crypto-js'

import { encodeAddress } from '@nexajs/address'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Import (individual) classes. */
import {
    Crypto,
    ECDSA,
    Point,
    PrivateKey,
    PublicKey,
} from '../../index.js'

/* Import (individual) modules. */
import {
    decrypt,
    decryptForPubkey,
    derivePublicKeyCompressed,
    encrypt,
    encryptForPubkey,
    getHmac,
    hash160,
    hash256,
    randomBytes,
    ripemd160,
    sha256,
    sha512,
    signMessageHashEcdsa,
    signMessageHashSchnorr,
    validateSecp256k1PrivateKey,
    verifyMessageHashEcdsa,
    verifyMessageHashSchnorr,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_BODY,
    NEXA_TEST_SECRET,
    PRIVATE_KEY,
    PUBLIC_KEY,
} from '../test_vectors.js'

/* Initialize globals. */
let address
let hashbuf
let isValid
let msgbuf
let prefix
let privateKey
let privateKeyBin
let publicKey
let response
let signature

describe( 'Crypto (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Crypto' class.` )

        prefix = 'nexa'
    } )

    describe( 'Crypto -> Point (Class)', () => {
        it( 'should create a point on the Secp256k1 curve', () => {
            const ecdsa = new ECDSA()
            // console.log('ECDSA', ecdsa)

            const privateKey = PrivateKey('7e96f68c3c15d6884d254c2b68356faf15b4d0f00001fc2f1e9e4f9e434ba9cd')
            // console.log('PRIVATE KEY', privateKey.toString())
            // console.log('PRIVATE KEY', privateKey.toBuffer())
            // console.log('PUBLIC KEY', privateKey.toPublicKey().toString())

            ecdsa.hashbuf = Buffer.from(sha256(new Uint8Array([ 0x13, 0x37 ])))
            ecdsa.privkey = privateKey
            ecdsa.pubkey = privateKey.toPublicKey()
            ecdsa.signRandomK()
            ecdsa.calci()
            // console.log('ECDSA', ecdsa)
            // console.log('SIG-1', ecdsa.sig)
            // console.log('SIG-2', )

            expect(ecdsa).to.be.an('object')
            expect(ecdsa.sig.toCompact().toString('base64')).to.be.a('string')
        } )
    } )

    describe( 'Crypto -> decrypt', () => {
        it( 'should decrypt the DATA payload using a private key', () => {
            /* Set initialization vector. */
            const iv = '8b2f0f69d285bf96eb6b1d3a901443d4'

            /* Set ciphertext. */
            const ciphertext = '0b0138e62acbd7d50e'

            /* Decrypt ciphertext. */
            const decrypted = decrypt(PRIVATE_KEY, iv, ciphertext)
            // console.log('DECRYPTED', decrypted)

            /* Conver to ascii/text. */
            const plaintext = decrypted.toString()
            // console.log('PLAINTEXT', plaintext)

            expect(plaintext).to.equal(`hi there!`)
        } )
    } )

    describe( 'Crypto -> decryptForPubkey', () => {
        it( 'should decrypt the PUBLIC KEY payload using a private key', () => {
            const encrypted = 'SFVTSAPKZwkZ+8NHyktVdJL+Df7aAg/ejAmZOFRzi1tBHhuyQ5ZE7img4IGGKnLGV6LGQL8FvOFM8Nyv/yHLs/++m+Mno4Krs/EYPY3VNLQ6c02JMQ=='

            const decrypted = decryptForPubkey(PRIVATE_KEY, encrypted)
            // console.log('DECRYPTED', decrypted)

            /* Conver to ascii/text. */
            const plaintext = decrypted.toString()
            // console.log('PLAINTEXT', plaintext)

            expect(plaintext).to.equal('Setec Astronomy')
        } )
    } )

    describe( 'Crypto -> derivePublicKeyCompressed', () => {
        it( 'should generate 32-bytes of random data', () => {
            publicKey = derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))
            // console.log('PUBLIC KEY', publicKey)

            expect(publicKey).to.eql(hexToBin('03fc6dbeb83e8d9514eb2512fa1c5f00ab7f96bce07195cb6a5f6ae4f3c41592b2'))
        } )
    } )

    describe( 'Crypto -> encrypt', () => {
        it( 'should encrypt the DATA payload using 256-bits [ w/ out an IV ]', () => {
            const msg = 'hi there!'

            const pkg = encrypt(PRIVATE_KEY, msg)
            // console.log('ENCRYPTED PKG', pkg)

            expect(pkg.ciphertext.length).to.equal(18)
        } )

        it( 'should encrypt the DATA payload using 128-bit CBC', () => {
            // const privKey = new Uint8Array(16)
            const privKey = PRIVATE_KEY.slice(32) // NOTE: Use a 128-bit key for aes-128-cbc.

            const iv = '14a1961bcd7b3f5b1d63fecaa5ddfb76' // NOTE: Use a 128-bit IV for CBC.

            const msg = 'hi there!'

            const algo = 'aes-128-cbc'

            const pkg = encrypt(privKey, iv, msg, algo)
            // console.log('ENCRYPTED PKG', pkg)

            expect(pkg.ciphertext.length).to.equal(32)
            expect(pkg.ciphertext).to.equal('2d2dec05b3401055533a4715b43b3810')
            expect(pkg.base64).to.equal('LS3sBbNAEFVTOkcVtDs4EA==')
        } )

        it( 'should encrypt the DATA payload using 256-bit CTR (default)', () => {
            const msg = 'hi there!'

            const pkg = encrypt(PRIVATE_KEY, msg)
            // console.log('ENCRYPTED PKG', pkg)

            expect(pkg.ciphertext.length).to.equal(18)
        } )
    } )

    describe( 'Crypto -> encryptForPubkey', () => {
        it( 'should encrypt the DATA payload for the SPECIFIED public key', () => {
            const msg = 'Setec Astronomy'

            const encrypted = encryptForPubkey(PUBLIC_KEY, msg)
            // console.log('ENCRYPTED', encrypted)

            expect(encrypted.length).to.equal(116)
        } )
    } )

    describe( 'Crypto -> getHmac', () => {
        it( 'should generate a 512-bit HMAC', () => {
            const hmac = getHmac(NEXA_TEST_SECRET, NEXA_TEST_BODY)

            expect(binToHex(hmac)).to.equal('2777a60aa04acb154d4b408eaaf796b08cb3942ae3959e78169ddd4e98ff4e973aa18a88e2a97d007b461814e6f426048ed21e04a89b9018d6328580f9840fee')
        } )
    } )

    describe( 'Crypto -> randomBytes', () => {
        it( 'should generate 32-bytes of random data', () => {
            const bytes = randomBytes(32)

            expect(bytes).to.have.length(32)
        } )
    } )

    describe( 'Crypto -> ripemd160', () => {
        it( 'should generate a RIPEMD-160 (HEX) hash of the provided (UTF-8) data', () => {
            const hash = ripemd160(NEXA_TEST_SECRET)

            expect(hash).to.equal('5e708aa85ae8b0d080837c50bd63634d584edc00')
        } )

        it( 'should generate a RIPEMD-160 (HEX) hash of the provided (BINARY) data', () => {
            const hash = ripemd160(hexToBin('abcd'), 'hex')

            expect(hash).to.equal('a21c2817130deaa1105afb3b858dbd219ee2da44')
        } )

        it( 'should generate a RIPEMD-160 (BINARY) hash of the provided (BINARY) data', () => {
            const hash = ripemd160(hexToBin('abcd'))

            const bin = hexToBin('a21c2817130deaa1105afb3b858dbd219ee2da44')

            expect(hash).to.eql(bin)
        } )

    } )

    describe( 'Crypto -> sha256', () => {
        it( 'should generate a 256-bit (HEX) hash of the provided (UTF-8) data', () => {
            const hash = sha256(NEXA_TEST_SECRET)

            expect(hash).to.equal('c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
        } )

        it( 'should generate a 256-bit (HEX) hash of the provided (BINARY) data', () => {
            const hash = sha256(hexToBin('abcd'), 'hex')

            expect(hash).to.equal('123d4c7ef2d1600a1b3a0f6addc60a10f05a3495c9409f2ecbf4cc095d000a6b')
        } )

        it( 'should generate a 256-bit (BINARY) hash of the provided (BINARY) data', () => {
            const hash = sha256(hexToBin('abcd'))

            const bin = hexToBin('123d4c7ef2d1600a1b3a0f6addc60a10f05a3495c9409f2ecbf4cc095d000a6b')

            expect(hash).to.eql(bin)
        } )

    } )

    describe( 'Crypto -> sha512', () => {
        it( 'should generate a 512-bit (HEX) hash of the provided (UTF-8) data', () => {
            const hash = sha512(NEXA_TEST_SECRET)

            expect(hash).to.equal('be5ef7679d88ab9a9045f6267e55f5e5784b4b8cd764b5cd855a5244f91c626953cd46c43d7668873fd6efbd3b221249315580031963472a078781fe046e62ae')
        } )

        it( 'should generate a 512-bit (HEX) hash of the provided (BINARY) data', () => {
            const hash = sha512(hexToBin('abcd'), 'hex')

            expect(hash).to.equal('9b3a86c5dddf6c13acb969db8f54ebb9fa50dc4f902eff843380cebfc9cc53ffc2cc4a5f4dda0fac9e3315578faebc999ee61609434e10a6c75e3d984ee2a426')
        } )

        it( 'should generate a 512-bit (BINARY) hash of the provided (BINARY) data', () => {
            const hash = sha512(hexToBin('abcd'))

            const bin = hexToBin('9b3a86c5dddf6c13acb969db8f54ebb9fa50dc4f902eff843380cebfc9cc53ffc2cc4a5f4dda0fac9e3315578faebc999ee61609434e10a6c75e3d984ee2a426')

            expect(hash).to.eql(bin)
        } )

    } )

    describe( 'Crypto -> signMessageHashEcdsa', () => {
        it( 'should generate a Base64 ECDSA signature', async () => {
            privateKeyBin = sha256(NEXA_TEST_SECRET, 'binary')

            const signingSerialization = sha256(NEXA_TEST_BODY, 'binary')

            const msgbuf = sha256(sha256(signingSerialization))

            const signatureB64 = signMessageHashEcdsa(privateKeyBin, msgbuf)
            // console.log('SIGNATURE (base64)', signatureB64)

            // expect(signatureB64).to.equal('ILaaLaj8SY0aihKkCjgvo8E88n30CZ8DkuDggecwZfMFcVzBQHxK+kmBf5az+OfyFlz/qd1quLB+J4rfeLPt48s=')
            expect(signatureB64.length).to.equal(88)
        } )
    } )

    describe( 'Crypto -> signMessageHashSchnorr', () => {
        it( 'should generate a 64-byte SCHNORR signature', async () => {
            privateKeyBin = sha256(NEXA_TEST_SECRET, 'binary')

            const signingSerialization = sha256(NEXA_TEST_BODY, 'binary')

            const sighash = sha256(sha256(signingSerialization))

            // Generate a signature over the "sighash" using the passed private key.
            const signatureBin = signMessageHashSchnorr(privateKeyBin, sighash)

            expect(binToHex(signatureBin)).to.equal('b8743a1bcfc800d33cea8e89d1d687c646dfcc7a98172baab19c8f45921ae64aeaf130c173f06c6bb3dfc76cc9e64051136a4280d6791ab85d20938c1a63137f')
        } )
    } )

    describe( 'Crypto -> validateSecp256k1PrivateKey', () => {
        it( 'should validate the private on the Secp256k1 curve', async () => {
            // Encode Private Key WIF.
            response = validateSecp256k1PrivateKey(hexToBin(PRIVATE_KEY))
            expect(response).to.be.true
        } )
    } )

    describe( 'Crypto -> verifyMessageHashEcdsa', () => {
        it( 'should veryify an ECDSA data payload using a address, sig + msg', () => {
            privateKeyBin = sha256(NEXA_TEST_SECRET, 'binary')
            publicKey = derivePublicKeyCompressed(privateKeyBin)

            const scriptData = encodeDataPush(publicKey)
            const publicKeyHash = ripemd160(sha256(scriptData))
            const scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])
            address = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            // console.info('SIG ADDRESS', address)

            signature = 'H9lselbAsiwzifmu0Es541xkbkn/TP6Y2EQeACf46WUzDZJLlikzMv5MC3VcjeffluK7htz8/POqo+nVCB4O3BA='

            const signingSerialization = sha256(NEXA_TEST_BODY, 'binary')
            msgbuf = sha256(sha256(signingSerialization))

            // FIXME: Remove the dependency for an "Address Encoder" ASAP!!
            response = verifyMessageHashEcdsa(address, signature, msgbuf, encodeAddress)
            // console.log('SIG RESPONSE', response)

            isValid = response.isValid
            // console.log('IS VALID', isValid)

            expect(isValid).to.equal(true)
        } )
    } )

    describe( 'Crypto -> verifyMessageHashSchnorr', () => {
        it( 'should veryify a SCHNORR data payload using a sig, msg + pubkey', () => {
            signature = hexToBin('b8743a1bcfc800d33cea8e89d1d687c646dfcc7a98172baab19c8f45921ae64aeaf130c173f06c6bb3dfc76cc9e64051136a4280d6791ab85d20938c1a63137f')

            privateKeyBin = sha256(NEXA_TEST_SECRET, 'binary')
            publicKey = derivePublicKeyCompressed(privateKeyBin)

            privateKeyBin = sha256(NEXA_TEST_SECRET, 'binary')
            const signingSerialization = sha256(NEXA_TEST_BODY, 'binary')
            const sighash = sha256(sha256(signingSerialization))

            const isValid = verifyMessageHashSchnorr(signature, publicKey, sighash)
            // console.log('IS VALID', isValid)

            expect(isValid).to.equal(true)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
