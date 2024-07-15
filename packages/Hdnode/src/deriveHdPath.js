// import deriveHdPrivateNodeChild from './deriveHdPrivateNodeChild.js'

/**
 * Derive a child HD node from a parent node given a derivation path. The
 * resulting node is the same type as the parent node (private nodes return
 * private nodes, public nodes return public nodes).
 *
 * @remarks
 * The derivation path uses the notation specified in BIP32:
 *
 * The first character must be either `m` for private derivation or `M` for
 * public derivation, followed by sets of `/` and a number representing the
 * child index used in the derivation at that depth. Hardened derivation is
 * represented by a trailing `'`, and may only appear in private derivation
 * paths (hardened derivation requires knowledge of the private key). Hardened
 * child indexes are represented with the hardened index offset (`2147483648`)
 * subtracted.
 *
 * For example, `m/0/1'/2` uses private derivation (`m`), with child indexes in
 * the following order:
 *
 * `derivePrivate(derivePrivate(derivePrivate(node, 0), 2147483648 + 1), 2)`
 *
 * Likewise, `M/3/4/5` uses public derivation (`M`), with child indexes in the
 * following order:
 *
 * `derivePublic(derivePublic(derivePublic(node, 3), 4), 5)`
 *
 * Because hardened derivation requires a private node, paths which specify
 * public derivation (`M`) using hardened derivation (`'`) will return an error.
 * To derive the public node associated with a child private node which requires
 * hardened derivation, begin with private derivation, then provide the result
 * to `deriveHdPublicNode`.
 *
 * @param crypto - implementations of sha256, sha512, ripemd160, and secp256k1
 * derivation functions – these are available via `instantiateBIP32Crypto`
 * @param node - the HD node from which to begin the derivation (for paths
 * beginning with `m`, an `HdPrivateNodeValid`; for paths beginning with `M`, an
 * `HdPublicNode`)
 * @param path - the BIP32 derivation path, e.g. `m/0/1'/2` or `M/3/4/5`
 */
// eslint-disable-next-line complexity
export default (
    node,
    path
) => {
    const validDerivationPath = /^[mM](?:\/[0-9]+'?)*$/u

    if (!validDerivationPath.test(path)) {
        return HdNodeDerivationError.invalidDerivationPath
    }

    const parsed = path.split('/')

    const isPrivateDerivation = 'privateKey' in node

    if (isPrivateDerivation && parsed[0] !== 'm') {
        return HdNodeDerivationError.invalidPrivateDerivationPrefix
    }

    if (!isPrivateDerivation && parsed[0] !== 'M') {
        return HdNodeDerivationError.invalidPublicDerivationPrefix
    }

    const base = 10
    const hardenedIndexOffset = 0x80000000

    const indexes = parsed
        .slice(1)
        .map((index) =>
            index.endsWith("'")
                ? parseInt(index.slice(0, -1), base) + hardenedIndexOffset
                : parseInt(index, base)
        )

    return (isPrivateDerivation
        ? indexes.reduce(
            (result, nextIndex) =>
                typeof result === 'string'
                    ? result
                    : deriveHdPrivateNodeChild(crypto, result, nextIndex),
                node
        )
        : indexes.reduce(
            (result, nextIndex) =>
                typeof result === 'string'
                    ? result
                    : deriveHdPublicNodeChild(crypto, result, nextIndex),
                node
        )
    )
}
