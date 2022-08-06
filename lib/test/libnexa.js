'use strict'

const { assert, expect } = require('chai')
const ffi = require('ffi-napi')
const ref = require('ref-napi')

describe( 'Nexa Library Test Suite', function () {
    before( function () {
        console.info( `  ↳ targeting all of the "local functionality" of 'libnexa.so'` )
    } )

    /* Initialize buffers. */
    const buf = Buffer.alloc(32)
    const buf2 = Buffer.alloc(32)

    /* Initialize shared library. */
    const libnexa = ffi.Library('./src/libs/libnexa', {
        'sha256': [ 'void', [ 'string', 'int', 'string' ] ],
        'RandomBytes': [ 'int', [ 'pointer', 'int' ] ],
    })

    describe( 'random bytes', function () {
        it( 'should return the buffer length', function () {
            /* Request buffer length. */
            const response = libnexa.RandomBytes(buf, 32)

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
} )
