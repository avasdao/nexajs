/* Import modules. */

import {
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,

    // bigIntToCompactUint,
} from '@nexajs/utils'

import {
    // numberToBinUintLE,
} from '@bitauth/libauth'

/**
 * (Build) Group Data Script
 *
 * Concatenates all group group details into an OP_RETURN data script.
 */
export default (_params) => {
    let dataScript

    dataScript = new Uint8Array([
        OP.RETURN,
        ...hexToBin('38564c05'), // integer value is 88888888
        ...hexToBin(encodeNullData(_params.ticker)),
        ...hexToBin(encodeNullData(_params.name)),
    ])

    if (_params.uri && _params.hash) {
        dataScript = new Uint8Array([
            ...dataScript,
            ...hexToBin(encodeNullData(_params.uri)),
            ...hexToBin(_params.hash),
        ])
    }

    if (_params.decimals) {
        dataScript = new Uint8Array([
            ...dataScript,
            OP['_' + _params.decimals], // FIXME Add support for 17+
        ])
    }

    return dataScript
}
