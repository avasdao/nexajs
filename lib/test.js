const { assert } = require('chai')
const ffi = require('ffi-napi')
const ref = require('ref-napi')

let response

// let result = ref.types.void
let result = ref.types.byte
// let result = ref.types.CString
let resultPtr = ref.refType(result)
let stringPtr = ref.refType(ref.types.byte)

/* Initialize buffer. */
const buf = Buffer.alloc(32)
// console.info('\nBuffer location is [ 0x%s ]', buf.hexAddress())

/* Set buffer to UINT_32. */
// NOTE: Set the "type", and gain magic abilities!
// buf.type = ref.types.uint32

// const testLib = ffi.Library('./src/libs/cashlib', {
const testLib = ffi.Library('./src/libs/libnexa', {
    'sha256': [ 'void', [ 'string', 'int', 'pointer' ] ],
    'RandomBytes': [ 'int', [ 'pointer', 'int' ] ],
})
// const nexaPtr = ref.alloc(resultPtr)
// const nexaPtr = ref.alloc(stringPtr)
const sample = Buffer.from('8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', 'hex')
console.log('\nSAMPLE (buf) is [ 0x%s ]', sample.toString('hex'))

response = testLib.sha256(sample, 32, buf)
// console.log('\nSHA256 (response):', response)
// console.log('\nSHA256 (buf)', buf)
console.log('SHA256 (hex) is [ 0x%s ]\n', Buffer.from(buf).toString('hex'))

// https://emn178.github.io/online-tools/sha256.html
assert(buf.toString('hex') === 'bc4f48d7a8651dc97ae415f0b47a52ef1a2702098202392b88bc925f6e89ee17')

response = testLib.RandomBytes(buf, 32)
// console.log('\nRandomBytes (response):', response)
console.log('\nRandomBytes.1 -> %s', buf.toString('hex'))
testLib.RandomBytes(buf, 32)
console.log('RandomBytes.2 -> %s\n', buf.toString('hex'))
