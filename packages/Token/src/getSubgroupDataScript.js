/* Import modules. */

import {
    encodeDataPush,
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    hexToBin,
    numberToBinUint32LE,
} from '@nexajs/utils'

// NOTE: Type identifier for token descriptions.
const TYPEID_NFT = 88888889

/**
 * (Build) Group Data Script
 *
 * Concatenates all group group details into an OP_RETURN data script.
 */
export default (_params) => {
    let dataScript

    dataScript = new Uint8Array([
        ...encodeDataPush(numberToBinUint32LE(TYPEID_NFT)),
        ...encodeNullData(_params.name).slice(1),
    ])

    if (_params.uri && _params.infoHash && _params.fileHash) {
        dataScript = new Uint8Array([
            ...dataScript,
            ...encodeDataPush(hexToBin(_params.infoHash).reverse()),
            ...encodeNullData(_params.uri).slice(1),
            ...encodeDataPush(hexToBin(_params.fileHash).reverse()),
        ])
    }

    dataScript = new Uint8Array([
        OP.RETURN,
        ...dataScript,
    ])

    return dataScript
}
