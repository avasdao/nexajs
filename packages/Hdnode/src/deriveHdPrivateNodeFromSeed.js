/* Import modules. */
import {
    hmacSha512,
    utf8ToBin,
    validateSecp256k1PrivateKey,
} from '@bitauth/libauth'

const bip32HmacSha512Key = utf8ToBin('Bitcoin seed')
const halfHmacSha512Length = 32

/**
 * Derive an `HdPrivateNode` from the provided seed following the BIP32
 * specification. A seed should include between 16 bytes and 64 bytes of
 * entropy (recommended: 32 bytes).
 *
 * @param crypto - an implementation of sha512
 * @param seed - the entropy from which to derive the `HdPrivateNode`
 * @param assumeValidity - if set, the derived private key will not be checked
 * for validity, and will be assumed valid if `true` or invalid if `false` (this
 * is useful for testing)
 */
export default (
    crypto,
    seed
) => {
    const mac = hmacSha512(crypto.sha512, bip32HmacSha512Key, seed)
    const privateKey = mac.slice(0, halfHmacSha512Length)
    const chainCode = mac.slice(halfHmacSha512Length)
    const depth = 0
    const childIndex = 0
    const parentFingerprint = Uint8Array.from([0, 0, 0, 0])
    const valid = validateSecp256k1PrivateKey(privateKey)

    /* Return HD Node. */
    return {
        chainCode,
        childIndex,
        depth,
        parentFingerprint,
        privateKey,
        valid
    }
}
