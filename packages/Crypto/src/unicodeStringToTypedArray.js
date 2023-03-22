/**
 * Unicode String to Typed Array
 *
 * Converts a Unicode string to a typed array.
 *
 * NOTE: This serves as a replacement for `<string>.normalize('NFKC')`.
 */
export default (s) => {
    const escstr = encodeURIComponent(s)

    const binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1)
    })

    const ua = new Uint8Array(binstr.length)

    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0)
    })

    /* Return Unicode array. */
    return ua
}
