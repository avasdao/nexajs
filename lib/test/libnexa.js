'use strict'

const { assert, expect } = require('chai')
const ffi = require('ffi-napi')
const ref = require('ref-napi')

/* Initialize buffers. */
const buf = Buffer.alloc(32)
const buf2 = Buffer.alloc(32)
const buf_20 = Buffer.alloc(20)

const sampleBuf = Buffer.from(
    '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', 'hex')

// let result = ref.types.void
let result = ref.types.byte
// let result = ref.types.CString
let resultPtr = ref.refType(result)
let stringPtr = ref.refType(ref.types.byte)

/* Initialize shared library. */
const libnexa = ffi.Library('./src/libs/libnexa', {
    'Bin2Hex'       : [ 'int',  [ 'pointer', 'int', 'pointer', 'int' ] ],
    'GetPubKey'     : [ 'int',  [ 'pointer', 'pointer', 'int' ] ],
    'RandomBytes'   : [ 'int',  [ 'pointer', 'int' ] ],
    'SignTxSchnorr' : [ 'int',  [ 'pointer', 'int', 'int', 'int', 'pointer', 'int', 'pointer', 'int', 'pointer', 'pointer', 'int' ] ],
    'hash160'       : [ 'void', [ 'pointer', 'int', 'pointer' ] ],
    'hash256'       : [ 'void', [ 'pointer', 'int', 'pointer' ] ],
    'sha256'        : [ 'void', [ 'pointer', 'int', 'pointer' ] ],
    'txid'          : [ 'int',  [ 'pointer', 'int', 'pointer' ] ],
    'txidem'        : [ 'int',  [ 'pointer', 'int', 'pointer' ] ],
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

    describe( 'Binary to Hex', function () {
        it( 'should match the hash', function () {
            const buf3 = Buffer.alloc(32)
            /* Request buffer length. */
            const bin = Buffer.from([0, 1, 2])
            console.log('BIN', bin)
            libnexa.Bin2Hex(bin, 32, buf3, 32)

            console.log('BINARY TO HEX', buf3)
        } )

        // it( 'should return a 32-byte length', function () {
        //     /* Call SHA-256 hashing. */
        //     libnexa.hash256(sampleBuf, 32, buf)

        //     /* Validate. */
        //     expect(buf).to.have.lengthOf(32)
        // } )
    } )

    describe( 'Get Public Key', function () {
        it( 'should match the hash', function () {
            libnexa.GetPubKey(sampleBuf, buf, 32)

            console.log('Get Public Key', buf.toString('hex'))
            // 75c1300ee47bb0b5a48619f2365d1bf7f468b69110f6b9a270ce50bbc91d7f0c
        } )

        // it( 'should return a 32-byte length', function () {
        //     /* Call SHA-256 hashing. */
        //     libnexa.GetPubKey(sampleBuf, 32, buf)

        //     /* Validate. */
        //     expect(buf).to.have.lengthOf(32)
        // } )
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

    describe( 'RIPEMD-160 Hashing', function () {
        it( 'should match the hash', function () {
            /* Request buffer length. */
            libnexa.hash160(sampleBuf, 32, buf_20)

            /* Validate. */
            // FIXME: Verify that this is the correct hash???
            expect(buf_20.toString('hex'))
                .to.equal('3aa20c0aec62eadebcf7841a0ea68b1f189b617a')
        } )

        it( 'should return a 32-byte length', function () {
            /* Call RIPEMD-160 hashing. */
            libnexa.hash160(sampleBuf, 32, buf_20)

            /* Validate. */
            expect(buf_20).to.have.lengthOf(20)
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

    describe( 'txid', function () {
        it( 'should match the hash', function () {
            const rawtx = Buffer.from('0000020100ca9a3b0000000017005114d3582a76a8668a5772e6c670b7e2d5215297d95a0000000000000000000f6a037095010008000000000000000000000000', 'hex')

            /* Request buffer length. */
            libnexa.txid(rawtx, rawtx.length, buf)

            /* Validate. */
            // NOTE: Reverse the bytes from LE to BE.
            expect(buf.reverse().toString('hex'))
                .to.equal('af1c84196fb87f8584e72e324140f153cca124d5f71f724932f90a5d4b0fdcef')
        } )
    } )

    describe( 'txidem', function () {
        it( 'should match the hash', function () {
            const rawtx = Buffer.from('0000020100ca9a3b0000000017005114d3582a76a8668a5772e6c670b7e2d5215297d95a0000000000000000000f6a037095010008000000000000000000000000', 'hex')

            /* Request buffer length. */
            libnexa.txidem(rawtx, rawtx.length, buf)

            /* Validate. */
            // NOTE: Reverse the bytes from LE to BE.
            expect(buf.reverse().toString('hex'))
                .to.equal('154bdb0998d7bdd948faa0385570ca55bced1c83ac7041d819429bc100fbad07')
        } )
    } )

    describe( 'Sign Schnorr', function () {
        it( 'should match the hash', function () {
            const rawtx = Buffer.from('0000020100ca9a3b0000000017005114d3582a76a8668a5772e6c670b7e2d5215297d95a0000000000000000000f6a037095010008000000000000000000000000', 'hex')
            const buf3 = Buffer.alloc(32)
            const buf4 = Buffer.alloc(32)
            const buf5 = Buffer.from([0, 1, 2])

            /* Request buffer length. */
            const sigLen = libnexa.SignTxSchnorr(rawtx,
                rawtx.length,
                0,
                0,
                buf3,
                0,
                buf4,
                1,
                buf5,
                buf,
                32
            )
            console.log('SIG LEGNTH:', sigLen)
            console.log('SIG (bug):', buf)

            /* Validate. */
            // NOTE: Reverse the bytes from LE to BE.
            // expect(buf.reverse().toString('hex'))
            //     .to.equal('154bdb0998d7bdd948faa0385570ca55bced1c83ac7041d819429bc100fbad07')
        } )
    } )

} )
