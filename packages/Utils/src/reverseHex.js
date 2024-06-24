/**
 * Reverse (Hex) Bytes
 *
 * Reverse the bytes of a HEX string.
 */
export default (_bytes) => {
    return _bytes.match(/[a-fA-F0-9]{2}/g).reverse().join('')
}
