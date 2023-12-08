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
const TYPEID_TOKEN = 88888888

/**
 * (Build) Group Data Script
 *
 * Concatenates all group group details into an OP_RETURN data script.
 */
export default (_params) => {
    let dataScript

    dataScript = new Uint8Array([
        ...encodeDataPush(numberToBinUint32LE(TYPEID_TOKEN)),
        ...encodeNullData(_params.ticker).slice(1),
        ...encodeNullData(_params.name).slice(1),
    ])

    if (_params.uri && _params.hash) {
        dataScript = new Uint8Array([
            ...dataScript,
            ...encodeNullData(_params.uri).slice(1),
            ...encodeDataPush(hexToBin(_params.hash).reverse()),
        ])
    }

    if (_params.decimals) {
        dataScript = new Uint8Array([
            ...dataScript,
            OP['_' + _params.decimals],
            // FIXME Add support for 17+
        ])
    }

    dataScript = new Uint8Array([
        OP.RETURN,
        ...dataScript,
    ])

    return dataScript
}
