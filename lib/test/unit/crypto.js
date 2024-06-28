/* Import (test) modules. */
import { expect } from 'chai'

import CryptoJS from 'crypto-js'

import {
    binToHex,
    hexToBin
} from '@nexajs/utils'

// FOR DEV PURPOSES ONLY
import {
    instantiateSecp256k1,
} from '@bitauth/libauth'

/* Import class. */
import { Crypto } from '../../index.js'

/* Import (individual) modules. */
import {
    decrypt,
    encrypt,
    getHmac,
    randomBytes,
    ripemd160,
    sha256,
    sha512,
    signMessageHashSchnorr,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_BODY,
    NEXA_TEST_SECRET,
} from '../test_vectors.js'

describe( 'Crypto (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Crypto' class.` )
    } )

    describe( 'RandomBytes', () => {
        it( 'should generate 32-bytes of random data', () => {
            const bytes = randomBytes(32)

            expect(bytes).to.have.length(32)
        } )
    } )

    describe( 'Create hash using SHA-256', () => {
        it( 'should generate a 256-bit (HEX) hash of the provided (UTF-8) data', () => {
            const hash = sha256(NEXA_TEST_SECRET)

            expect(hash).to.equal('c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
        } )

        it( 'should generate a 256-bit (BINARY) hash of the provided (BINARY) data', () => {
            const hash = sha256(hexToBin('abcd'))

            const bin = hexToBin('123d4c7ef2d1600a1b3a0f6addc60a10f05a3495c9409f2ecbf4cc095d000a6b')

            expect(hash).to.eql(bin)
        } )

        it( 'should generate a 256-bit (HEX) hash of the provided (BINARY) data', () => {
            const hash = sha256(hexToBin('abcd'), 'hex')

            expect(hash).to.equal('123d4c7ef2d1600a1b3a0f6addc60a10f05a3495c9409f2ecbf4cc095d000a6b')
        } )

    } )

    describe( 'Create hash using SHA-512', () => {
        it( 'should generate a 512-bit (HEX) hash of the provided (UTF-8) data', () => {
            const hash = sha512(NEXA_TEST_SECRET)

            expect(hash).to.equal('be5ef7679d88ab9a9045f6267e55f5e5784b4b8cd764b5cd855a5244f91c626953cd46c43d7668873fd6efbd3b221249315580031963472a078781fe046e62ae')
        } )

        it( 'should generate a 512-bit (BINARY) hash of the provided (BINARY) data', () => {
            const hash = sha512(hexToBin('abcd'))

            const bin = hexToBin('9b3a86c5dddf6c13acb969db8f54ebb9fa50dc4f902eff843380cebfc9cc53ffc2cc4a5f4dda0fac9e3315578faebc999ee61609434e10a6c75e3d984ee2a426')

            expect(hash).to.eql(bin)
        } )

        it( 'should generate a 512-bit (HEX) hash of the provided (BINARY) data', () => {
            const hash = sha512(hexToBin('abcd'), 'hex')

            expect(hash).to.equal('9b3a86c5dddf6c13acb969db8f54ebb9fa50dc4f902eff843380cebfc9cc53ffc2cc4a5f4dda0fac9e3315578faebc999ee61609434e10a6c75e3d984ee2a426')
        } )

    } )

    describe( 'Create hash using RIPEMD-160', () => {
        it( 'should generate a RIPEMD-160 (HEX) hash of the provided (UTF-8) data', () => {
            const hash = ripemd160(NEXA_TEST_SECRET)

            expect(hash).to.equal('5e708aa85ae8b0d080837c50bd63634d584edc00')
        } )

        it( 'should generate a RIPEMD-160 (BINARY) hash of the provided (BINARY) data', () => {
            const hash = ripemd160(hexToBin('abcd'))

            const bin = hexToBin('a21c2817130deaa1105afb3b858dbd219ee2da44')

            expect(hash).to.eql(bin)
        } )

        it( 'should generate a RIPEMD-160 (HEX) hash of the provided (BINARY) data', () => {
            const hash = ripemd160(hexToBin('abcd'), 'hex')

            expect(hash).to.equal('a21c2817130deaa1105afb3b858dbd219ee2da44')
        } )

    } )

    describe( 'Create a 512-bit hashed message authentication code', () => {
        it( 'should generate a 512-bit HMAC', () => {
            const hmac = getHmac(NEXA_TEST_BODY, NEXA_TEST_SECRET)

            expect(hmac).to.equal('171d2f81d571ac58f0a05c561216845a7708472c833fcf695721854083c7296ec4fae86acc1b9c177db1fa95a1ea47fbd52a63e6cc46a1455047000698dc9e56')
        } )
    } )

    describe( 'Create a 64-byte Schnorr signature', () => {
        it( 'should generate a 64-byte signature', async () => {
            // Instantiate the Secp256k1 interface.
            const secp256k1 = await instantiateSecp256k1()

            const privateKeyBin = sha256(NEXA_TEST_SECRET, 'binary')

            const signingSerialization = sha256(NEXA_TEST_BODY, 'binary')
            const sighash = sha256(sha256(signingSerialization))

            // Generate a signature over the "sighash" using the passed private key.
            const signatureBin = secp256k1.signMessageHashSchnorr(privateKeyBin, sighash)

            expect(binToHex(signatureBin)).to.equal('b8743a1bcfc800d33cea8e89d1d687c646dfcc7a98172baab19c8f45921ae64aeaf130c173f06c6bb3dfc76cc9e64051136a4280d6791ab85d20938c1a63137f')
        } )
    } )

    describe( 'Encrypt a data payload using a private key', () => {
        it( 'should encrypt the data', () => {
            const params = {
                body: `hi there!`,
            }

            // const privKey = new Uint8Array(32)
            const privKey = 'testing'

            const ciphertext = encrypt(params, privKey)
            // console.log('CIPHERTEXT', ciphertext)
            console.log('CIPHERTEXT (str)', ciphertext.toString())

            const plaintext = decrypt({
                body: ciphertext.toString(),
            }, privKey)
            console.log('PLAINTEXT', plaintext)

            // expect(ciphertext.toString()).to.equal('U2FsdGVkX18cLqpZCjcp1+haTZ5u61ieUGecJBR0ptg=')
            expect(ciphertext.toString().length).to.equal(44)
        } )
    } )

    describe( 'Decrypt a data payload using a private key', () => {
        it( 'should decrypt the data', () => {
            const params = {
                body: `U2FsdGVkX1+AWuiF5QaQkeyUgMccBeniWKGpDNbBV6k=`,
            }

            // const privKey = new Uint8Array(32)
            const privKey = 'testing'

            const plaintext = decrypt(params, privKey)
            console.log('PLAINTEXT', plaintext)

            expect(plaintext.toString()).to.equal(`hi there!`)
        } )
    } )

    describe( 'Sign a (Schnorr) data payload using a private key', () => {
        it( 'should (Schnorr) sign the data', () => {
            const hashbuf = hexToBin('b8743a1bcfc800d33cea8e89d1d687c646dfcc7a98172baab19c8f45921ae64a')

            const privkey = hexToBin('eaf130c173f06c6bb3dfc76cc9e64051136a4280d6791ab85d20938c1a63137f')

            const signature = signMessageHashSchnorr(privkey, hashbuf)
            console.log('SIGNATURE:', signature)
            console.log('SIGNATURE (hex):', binToHex(signature))

            // const plaintext = decrypt(params, privKey)
            // console.log('PLAINTEXT', plaintext)

            // expect(binToHex(signature)).to.equal('0123456')
        } )
    } )

    // describe( 'Verify a (Schnorr) data payload using a sig, msg + pubkey', () => {
    //     it( 'should veryify the signed (Schnorr) data', () => {
    //         const hashbuf = hexToBin('b8743a1bcfc800d33cea8e89d1d687c646dfcc7a98172baab19c8f45921ae64a')
    //
    //         const privkey = hexToBin('eaf130c173f06c6bb3dfc76cc9e64051136a4280d6791ab85d20938c1a63137f')
    //
    //         const signature = signMessageHashSchnorr(privkey, hashbuf)
    //         console.log('SIGNATURE', signature)
    //
    //         const plaintext = decrypt(params, privKey)
    //         console.log('PLAINTEXT', plaintext)
    //
    //         expect(signature.verified).to.equal(true)
    //     } )
    // } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
