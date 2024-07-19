import {
    HDPrivateKey,
    PrivateKey,
} from '@nexajs/crypto'

import { binToHex } from '@nexajs/utils'

export default (_seed, _path) => {
    /* Initialize locals. */
    let hdnode
    let seed

    seed = binToHex(_seed)

    /* Initialize HD node. */
    hdnode = HDPrivateKey.fromSeed(seed)
    // console.log('HD NODE-1', hdnode)

    hdnode = hdnode.derive(_path)
    // console.log('HD NODE-2', hdnode)

    /* Return HD node. */
    return hdnode
}

/*
{
    network: Network.get(network) || Network.defaultNetwork,
    depth: 0,
    parentFingerPrint: 0,
    childIndex: 0,
    privateKey: hash.slice(0, 32),
    chainCode: hash.slice(32, 64),
}
*/

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
