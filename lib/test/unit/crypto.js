/* Import (test) modules. */
import { expect } from 'chai'

import { binToHex } from '../index.js'
import { hexToBin } from '../index.js'

// FOR DEV PURPOSES ONLY
import {
    instantiateSecp256k1,
} from '@bitauth/libauth'

/* Import class. */
import { Crypto } from '../index.js'

/* Import (individual) modules. */
import {
    getHmac,
    randomBytes,
    ripemd160,
    sha256,
    sha512,
} from '../index.js'

const NEXA_TEST_BODY = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const NEXA_TEST_SECRET = 'correct horse battery staple'

describe( 'Crypto Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Crypto' class.` )
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
            // console.log('HASH', hash)

            expect(hash).to.equal('c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
        } )

        it( 'should generate a 256-bit (BINARY) hash of the provided (BINARY) data', () => {
            const hash = sha256(hexToBin('abcd'))
            // console.log('HASH', hash)

            const bin = hexToBin('123d4c7ef2d1600a1b3a0f6addc60a10f05a3495c9409f2ecbf4cc095d000a6b')

            expect(hash).to.eql(bin)
        } )

        it( 'should generate a 256-bit (HEX) hash of the provided (BINARY) data', () => {
            const hash = sha256(hexToBin('abcd'), 'hex')
            // console.log('HASH', hash)

            expect(hash).to.equal('123d4c7ef2d1600a1b3a0f6addc60a10f05a3495c9409f2ecbf4cc095d000a6b')
        } )

    } )

    describe( 'Create hash using SHA-512', () => {
        it( 'should generate a 512-bit (HEX) hash of the provided (UTF-8) data', () => {
            const hash = sha512(NEXA_TEST_SECRET)
            // console.log('HASH', hash)

            expect(hash).to.equal('be5ef7679d88ab9a9045f6267e55f5e5784b4b8cd764b5cd855a5244f91c626953cd46c43d7668873fd6efbd3b221249315580031963472a078781fe046e62ae')
        } )

        it( 'should generate a 512-bit (BINARY) hash of the provided (BINARY) data', () => {
            const hash = sha512(hexToBin('abcd'))
            // console.log('HASH', hash)

            const bin = hexToBin('9b3a86c5dddf6c13acb969db8f54ebb9fa50dc4f902eff843380cebfc9cc53ffc2cc4a5f4dda0fac9e3315578faebc999ee61609434e10a6c75e3d984ee2a426')

            expect(hash).to.eql(bin)
        } )

        it( 'should generate a 512-bit (HEX) hash of the provided (BINARY) data', () => {
            const hash = sha512(hexToBin('abcd'), 'hex')
            // console.log('HASH', hash)

            expect(hash).to.equal('9b3a86c5dddf6c13acb969db8f54ebb9fa50dc4f902eff843380cebfc9cc53ffc2cc4a5f4dda0fac9e3315578faebc999ee61609434e10a6c75e3d984ee2a426')
        } )

    } )

    describe( 'Create hash using RIPEMD-160', () => {
        it( 'should generate a RIPEMD-160 (HEX) hash of the provided (UTF-8) data', () => {
            const hash = ripemd160(NEXA_TEST_SECRET)
            // console.log('HASH', hash)

            expect(hash).to.equal('5e708aa85ae8b0d080837c50bd63634d584edc00')
        } )

        it( 'should generate a RIPEMD-160 (BINARY) hash of the provided (BINARY) data', () => {
            const hash = ripemd160(hexToBin('abcd'))
            // console.log('HASH', hash)

            const bin = hexToBin('a21c2817130deaa1105afb3b858dbd219ee2da44')

            expect(hash).to.eql(bin)
        } )

        it( 'should generate a RIPEMD-160 (HEX) hash of the provided (BINARY) data', () => {
            const hash = ripemd160(hexToBin('abcd'), 'hex')
            // console.log('HASH', hash)

            expect(hash).to.equal('a21c2817130deaa1105afb3b858dbd219ee2da44')
        } )

    } )

    describe( 'Create a 512-bit hashed message authentication code', () => {
        it( 'should generate a 512-bit HMAC', () => {
            const hmac = getHmac(NEXA_TEST_BODY, NEXA_TEST_SECRET)
            // console.log('HMAC', hmac)

            expect(hmac).to.equal('171d2f81d571ac58f0a05c561216845a7708472c833fcf695721854083c7296ec4fae86acc1b9c177db1fa95a1ea47fbd52a63e6cc46a1455047000698dc9e56')
        } )
    } )

    describe( 'Create a 64-byte Schnorr signature', () => {
        it( 'should generate a 64-byte signature', async () => {
            // Instantiate the Secp256k1 interface.
            const secp256k1 = await instantiateSecp256k1()

            const privateKeyBin = sha256(NEXA_TEST_SECRET, 'binary')
            // console.log('privateKeyBin', privateKeyBin)

            const signingSerialization = sha256(NEXA_TEST_BODY, 'binary')
            const sighash = sha256(sha256(signingSerialization))

            // Generate a signature over the "sighash" using the passed private key.
            const signatureBin = secp256k1.signMessageHashSchnorr(privateKeyBin, sighash)
            // console.log('SIGNATURE (binary):', signatureBin)
            // console.log('SIGNATURE (hex):', binToHex(signatureBin))

            expect(binToHex(signatureBin)).to.equal('b8743a1bcfc800d33cea8e89d1d687c646dfcc7a98172baab19c8f45921ae64aeaf130c173f06c6bb3dfc76cc9e64051136a4280d6791ab85d20938c1a63137f')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
