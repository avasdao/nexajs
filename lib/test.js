const ffi = require('ffi-napi')
const ref = require('ref-napi')

// let result = ref.types.void
let result = ref.types.byte
// let result = ref.types.CString
let resultPtr = ref.refType(result)
let stringPtr = ref.refType(ref.types.byte)

/* Initialize buffer. */
const buf = Buffer.alloc(32)
console.info('\nBuffer location:', buf.hexAddress())

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

console.log('\nSHA256 (response):', testLib.sha256('hi', 32, buf));
console.log('\nSHA256 (buf):', buf);
console.log('\nSHA256 (hex):', Buffer.from(buf).toString('hex'));

// console.log('\nRandomBytes (response):', testLib.RandomBytes(buf, 32))
// console.log('\nRandomBytes (buf):', buf)
// console.log('\nRandomBytes (hex.1):', buf.toString('hex'))
// testLib.RandomBytes(buf, 32)
// console.log('\nRandomBytes (hex.2):', buf.toString('hex'))
