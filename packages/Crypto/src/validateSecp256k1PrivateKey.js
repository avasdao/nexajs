/**
 * Verify that a private key is valid for the Secp256k1 curve. Returns `true`
 * for success, or `false` on failure.
 *
 * Private keys are 256-bit numbers encoded as a 32-byte, big-endian Uint8Array.
 * Nearly every 256-bit number is a valid secp256k1 private key. Specifically,
 * any 256-bit number greater than `0x01` and less than
 * `0xFFFF FFFF FFFF FFFF FFFF FFFF FFFF FFFE BAAE DCE6 AF48 A03B BFD2 5E8C D036 4140`
 * is a valid private key. This range is part of the definition of the
 * secp256k1 elliptic curve parameters.
 *
 * This method does not require the `Secp256k1` WASM implementation (available
 * via `instantiateSecp256k1`).
 */
export default (_privateKey) => {
    const privateKeyLength = 32

    if (
        _privateKey.length !== privateKeyLength ||
        _privateKey.every((value) => value === 0)
    ) {
        return false
    }

    /**
     * The largest possible Secp256k1 private key – equal to the order of the
     * Secp256k1 curve minus one.
     */
    // prettier-ignore
    const maximumSecp256k1PrivateKey = [ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 254, 186, 174, 220, 230, 175, 72, 160, 59, 191, 210, 94, 140, 208, 54, 65, 63 ] // eslint-disable-line @typescript-eslint/no-magic-numbers

    const firstDifference = _privateKey.findIndex(
        (value, i) => value !== maximumSecp256k1PrivateKey[i]
    )

    if (
        firstDifference === -1 ||
        _privateKey[firstDifference] < maximumSecp256k1PrivateKey[firstDifference]
    ) {
        return true
    }

    return false
}
