/* Import modules. */
import {
    binToBase58,
    flattenBinArray,
    numberToBinUint32BE,
} from '@bitauth/libauth'

/**
 * Encode an HD private key (as defined by BIP32) given an HD private node.
 *
 * @param crypto - an implementation of sha256
 * @param keyParameters - a valid HD private node and the network for which to
 * encode the key
 */
export default (
    crypto,
    keyParameters
) => {
    const version = numberToBinUint32BE(
        keyParameters.network === 'mainnet'
            ? HdKeyVersion.mainnetPrivateKey
            : HdKeyVersion.testnetPrivateKey
    )

    const depth = Uint8Array.of(keyParameters.node.depth)

    const childIndex = numberToBinUint32BE(keyParameters.node.childIndex)

    const isPrivateKey = Uint8Array.of(0x00)

    const payload = flattenBinArray([
        version,
        depth,
        keyParameters.node.parentFingerprint,
        childIndex,
        keyParameters.node.chainCode,
        isPrivateKey,
        keyParameters.node.privateKey,
    ])

    const checksumLength = 4

    const checksum = crypto.sha256
        .hash(crypto.sha256.hash(payload))
        .slice(0, checksumLength)

    return binToBase58(flattenBinArray([payload, checksum]))
}
