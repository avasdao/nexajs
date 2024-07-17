/**
 * Derive a non-hardened child HD public node from an HD public node.
 *
 * Because hardened derivation also requires knowledge of the parent private
 * node, it's not possible to use an HD public node to derive a hardened child
 * HD public node.
 *
 * Though private keys cannot be derived from HD public keys, sharing HD public
 * keys still carries risk. Along with allowing an attacker to associate wallet
 * addresses together (breaking privacy), should an attacker gain knowledge of a
 * single child private key, **it's possible to derive all parent HD private
 * keys**. See `crackHdPrivateNodeFromHdPublicNodeAndChildPrivateNode` for
 * details.
 *
 * @privateRemarks
 * The `Secp256k1.addTweakPublicKeyCompressed` method throws if the tweak is out
 * of range or if the resulting public key would be invalid. The procedure to
 * handle this error is standardized by BIP32: return the HD node at the next
 * child index. (Regardless, this scenario is incredibly unlikely without a
 * weakness in HMAC-SHA512.)
 *
 * @param crypto - implementations of sha256, sha512, ripemd160, and secp256k1
 * compressed public key "tweak addition" (application of the EC group
 * operation) – these are available via `instantiateBIP32Crypto`
 * @param node - the HD public node from which to derive the child public node
 * @param index - the index at which to derive the child node
 */
const deriveHdPublicNodeChild = (
  node,
  index
) => {
    const hardenedIndexOffset = 0x80000000

    if (index >= hardenedIndexOffset) {
        return HdNodeDerivationError.hardenedDerivationRequiresPrivateNode
    }

    const serialization = Uint8Array.from([
        ...node.publicKey,
        ...numberToBinUint32BE(index),
    ])

    const derivation = hmacSha512(crypto.sha512, node.chainCode, serialization)
    const tweakValueLength = 32
    const tweakValue = derivation.slice(0, tweakValueLength)
    const nextChainCode = derivation.slice(tweakValueLength)

    // eslint-disable-next-line functional/no-try-statement
    try {
        const nextPublicKey = crypto.secp256k1.addTweakPublicKeyCompressed(
            node.publicKey,
            tweakValue
        )
        const parentIdentifier = deriveHdPublicNodeIdentifier(node)
        const parentFingerprintLength = 4

        return {
            chainCode: nextChainCode,
            childIndex: index,
            depth: node.depth + 1,
            parentFingerprint: parentIdentifier.slice(0, parentFingerprintLength),
            parentIdentifier,
            publicKey: nextPublicKey,
        }
    } catch (error) {
        if (index === hardenedIndexOffset - 1) {
            return HdNodeDerivationError.nextChildIndexRequiresHardenedAlgorithm
        }

        return deriveHdPublicNodeChild(node, index + 1)
    }
}

export default deriveHdPublicNodeChild
