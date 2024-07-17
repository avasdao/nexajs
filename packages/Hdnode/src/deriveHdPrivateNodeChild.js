/**
 * Derive a child HD private node from an HD private node.
 *
 * To derive a child HD public node, use `deriveHdPublicNode` on the result of
 * this method. If the child uses a non-hardened index, it's also possible to
 * use `deriveHdPublicNodeChild`.
 *
 * @privateRemarks
 * The `Secp256k1.addTweakPrivateKey` method throws if the tweak is out of range
 * or if the resulting private key would be invalid. The procedure to handle
 * this error is standardized by BIP32: return the HD node at the next child
 * index. (Regardless, this scenario is incredibly unlikely without a weakness
 * in HMAC-SHA512.)
 *
 * @param crypto - implementations of sha256, ripemd160, secp256k1 compressed
 * public key derivation, and secp256k1 private key "tweak addition"
 * (application of the EC group operation) – these are available via
 * `instantiateBIP32Crypto`
 * @param node - the valid HD private node from which to derive the child node
 * @param index - the index at which to derive the child node - indexes greater
 * than or equal to the hardened index offset (`0x80000000`/`2147483648`) are
 * derived using the "hardened" derivation algorithm
 */
// eslint-disable-next-line complexity
const deriveHdPrivateNodeChild = (
    node,
    index,
) => {
    const maximumIndex = 0xffffffff

    if (index > maximumIndex) {
        return HdNodeDerivationError.childIndexExceedsMaximum
    }

    const hardenedIndexOffset = 0x80000000
    const useHardenedAlgorithm = index >= hardenedIndexOffset

    const keyMaterial = useHardenedAlgorithm
        ? node.privateKey
        : crypto.secp256k1.derivePublicKeyCompressed(node.privateKey)

    const serialization = Uint8Array.from([
        ...(useHardenedAlgorithm ? [0x00] : []),
        ...keyMaterial,
        ...numberToBinUint32BE(index),
    ])

    const derivation = hmacSha512(crypto.sha512, node.chainCode, serialization)
    const tweakValueLength = 32
    const tweakValue = derivation.slice(0, tweakValueLength)
    const nextChainCode = derivation.slice(tweakValueLength)

    // eslint-disable-next-line functional/no-try-statement
    try {
        const nextPrivateKey = crypto.secp256k1.addTweakPrivateKey(
            node.privateKey,
            tweakValue
        )
        const parentIdentifier = deriveHdPrivateNodeIdentifier(crypto, node)
        const parentFingerprintLength = 4

        return {
            chainCode: nextChainCode,
            childIndex: index,
            depth: node.depth + 1,
            parentFingerprint: parentIdentifier.slice(0, parentFingerprintLength),
            parentIdentifier,
            privateKey: nextPrivateKey,
            valid: true,
        }
    } catch (error) /* istanbul ignore next - testing requires >2^127 brute force */ {
        if (index === hardenedIndexOffset - 1) {
            return HdNodeDerivationError.nextChildIndexRequiresHardenedAlgorithm
        }

        return deriveHdPrivateNodeChild(node, index + 1)
    }
}

export default deriveHdPrivateNodeChild
