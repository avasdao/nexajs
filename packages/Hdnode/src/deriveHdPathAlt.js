import {
    HDPrivateKey,
    PrivateKey,
} from '@nexajs/crypto'

import { binToHex } from '@nexajs/utils'

export default (_node, _path) => {
    // console.log('NODE', _node)

    const privateKey = _node.privateKey
    // console.log('PRIVATE KEY', privateKey)

    const altKey = PrivateKey(Buffer.from(privateKey))
    // console.log('ALT KEY-1', altKey)
    // console.log('ALT KEY-2', altKey.toString())

    _node.chainCode = Buffer.from(_node.chainCode)
    _node.network = 'livenet'
    _node.parentFingerPrint = Buffer.from(_node.parentFingerprint)
    _node.privateKey = Buffer.from(_node.privateKey)

    const tstKey = HDPrivateKey(_node)
    // console.log('TST KEY-1', tstKey)
    // console.log('TST KEY-2', tstKey.toString())

    return _node
}

/*
{
  chainCode: Uint8Array(32) [
    165, 104, 250, 113, 203, 214, 228,  73,
    157, 234, 168, 111, 214,  60, 140,  19,
    186,  56, 141,  62,  98, 192,  27, 125,
    209, 114,  76,  68,  51,   1,  52, 174
  ],
  childIndex: 1,
  depth: 5,
  parentFingerprint: Uint8Array(4) [ 99, 196, 243, 234 ],
  parentIdentifier: Uint8Array(20) [
     99, 196, 243, 234, 123,  33,
     31, 200, 107, 105,  47, 108,
    137, 254, 195, 129, 206, 192,
     54,  96
  ],
  privateKey: Uint8Array(32) [
      7,  69, 213, 225, 243, 181, 159,
    105, 141, 124, 255, 113, 218, 180,
    128, 116, 192, 197, 234,  32,  90,
     44, 143,  80, 241, 134, 179,  46,
    238, 170,  79,  94
  ],
  valid: true
}
*/
