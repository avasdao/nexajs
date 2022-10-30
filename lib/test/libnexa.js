'use strict'

const { assert, expect } = require('chai')
const ffi = require('ffi-napi')
const ref = require('ref-napi')

/* Initialize buffers. */
const buf = Buffer.alloc(32)
const buf2 = Buffer.alloc(32)

const sampleBuf = Buffer.from(
    '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', 'hex')

// let result = ref.types.void
let result = ref.types.byte
// let result = ref.types.CString
let resultPtr = ref.refType(result)
let stringPtr = ref.refType(ref.types.byte)

/* Initialize shared library. */
const libnexa = ffi.Library('./src/libs/libnexa', {
    'sha256': [ 'void', [ 'string', 'int', 'string' ] ],
    'hash256': [ 'void', [ 'string', 'int', 'string' ] ],
    'RandomBytes': [ 'int', [ 'pointer', 'int' ] ],
})
// const nexaPtr = ref.alloc(resultPtr)
// const nexaPtr = ref.alloc(stringPtr)

describe( 'Nexa Library Test Suite', function () {
    before( function () {
        console.info( `  ↳ targeting all of the "local functionality" of 'libnexa.so'` )
    } )

    let response

    describe( 'random bytes', function () {
        it( 'should return the buffer length', function () {
            /* Request buffer length. */
            response = libnexa.RandomBytes(buf, 32)

            /* Validate. */
            expect(response).to.equal(32)
        } )

        it( 'should return a 32-byte random value', function () {
            /* Call random bytes. */
            libnexa.RandomBytes(buf, 32)

            /* Validate. */
            expect(buf).to.have.lengthOf(32)
        } )

        it( 'should not match random bytes', function () {
            /* Call random bytes. */
            libnexa.RandomBytes(buf, 32)

            /* Call random bytes (again). */
            libnexa.RandomBytes(buf2, 32)

            /* Validate. */
            expect(buf).to.not.equal(buf2)
        } )
    } )

    describe( 'SHA-256 Hashing', function () {
        it( 'should match the hash', function () {
            /* Request buffer length. */
            libnexa.sha256(sampleBuf, 32, buf)

            /* Validate. */
            // https://emn178.github.io/online-tools/sha256.html
            expect(buf.toString('hex'))
                .to.equal('bc4f48d7a8651dc97ae415f0b47a52ef1a2702098202392b88bc925f6e89ee17')
        } )

        it( 'should return a 32-byte length', function () {
            /* Call SHA-256 hashing. */
            libnexa.sha256(sampleBuf, 32, buf)

            /* Validate. */
            expect(buf).to.have.lengthOf(32)
        } )
    } )

    describe( '(Double) SHA-256 Hashing', function () {
        it( 'should match the hash', function () {
            /* Request buffer length. */
            libnexa.hash256(sampleBuf, 32, buf)

            /* Validate. */
            // https://emn178.github.io/online-tools/sha256.html
            expect(buf.toString('hex'))
                .to.equal('ac7590167db3d08d7b752230914b1b0dd41cdadf91338e8ffd0321ecf8d63236')
        } )

        it( 'should return a 32-byte length', function () {
            /* Call SHA-256 hashing. */
            libnexa.hash256(sampleBuf, 32, buf)

            /* Validate. */
            expect(buf).to.have.lengthOf(32)
        } )
    } )
} )
