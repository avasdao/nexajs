/* Import modules. */
import { binToHex } from '@nexajs/utils'
import { hexToBin } from '@nexajs/utils'
import { randomBytes } from '@nexajs/crypto'
import { sha256 } from '@nexajs/crypto'

/* Set constants. */
const ENTROPY_BYTES_LENGTH = 32

/**
 * Create Wallet
 *
 * Generates 128-bits of random entropy and saves it to the
 * local browser.
 */
export default function (_entropy) {
    let entropy

    if (_entropy) {
        this.setEntropy(_entropy)

        return _entropy
    }

    /* Return random bytes (as hex string). */
    const localBytes = binToHex(randomBytes(ENTROPY_BYTES_LENGTH))

    /* Hash the entropy. */
    const hashed = sha256(hexToBin(localBytes))

    /* Set (final 128-bit) entropy. */
    // NOTE: Serialize to a 16-byte (128-bit) Hex String.
    // NOTE: We use 16-bytes to remain compatible with popular HD wallets.
    entropy = binToHex(hashed).slice(0, 16) + binToHex(hashed).slice(-16)

    this.setEntropy(entropy)

    console.info('New (128-bit) wallet created!')

    return entropy
}
