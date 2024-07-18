/* Import modules. */
import {
    derivePublicKeyCompressed,
    ripemd160,
    sha256,
} from '@nexajs/crypto'

/**
 * Derive the public identifier for a given HD private node. This is used to
 * uniquely identify HD nodes in software. The first 4 bytes of this identifier
 * are considered its "fingerprint".
 *
 * @param crypto - implementations of sha256, ripemd160, and secp256k1
 * compressed public key derivation
 * @param hdPrivateNode - the HD private node from which to derive the public
 * identifier (not require to be valid)
 */
export default (hdPrivateNode) =>
    ripemd160(
        sha256(
            derivePublicKeyCompressed(hdPrivateNode.privateKey)
        )
    )
