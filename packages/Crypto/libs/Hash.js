/* Import (local) modules. */
import $ from '../utils/preconditions.js'
import {
    ripemd160,
    sha256,
    sha512,
} from '../index.js'

/* Initialize hash. */
class Hash {
    constructor() {}
}

Hash.sha1 = function(buf) {
    $.checkArgument(Buffer.isBuffer(buf))
    return crypto.createHash('sha1').update(buf).digest()
}

Hash.sha1.blocksize = 512

Hash.sha256 = function (_buf) {
    return Buffer.from(sha256(_buf))
}

Hash.sha256.blocksize = 512

Hash.sha256sha256 = function (buf) {
    $.checkArgument(Buffer.isBuffer(buf))
    return Hash.sha256(Hash.sha256(buf))
}

Hash.ripemd160 = function(buf) {
    $.checkArgument(Buffer.isBuffer(buf))
    return ripemd160(buf)
}

Hash.sha256ripemd160 = function(buf) {
    $.checkArgument(Buffer.isBuffer(buf))
    return Hash.ripemd160(Hash.sha256(buf))
}

Hash.sha512 = function(buf) {
    $.checkArgument(Buffer.isBuffer(buf))
    return sha512(buf)
};

Hash.sha512.blocksize = 1024

Hash.hmac = function(hashf, data, key) {
    //http://en.wikipedia.org/wiki/Hash-based_message_authentication_code
    //http://tools.ietf.org/html/rfc4868#section-2
    $.checkArgument(hashf.blocksize)

    const blocksize = hashf.blocksize / 8

    if (key.length > blocksize) {
        key = hashf(key)
    } else if (key < blocksize) {
        const fill = Buffer.alloc(blocksize)
        fill.fill(0)
        key.copy(fill)
        key = fill
    }

    const o_key = Buffer.alloc(blocksize)
    o_key.fill(0x5c)

    const i_key = Buffer.alloc(blocksize)
    i_key.fill(0x36)

    const o_key_pad = Buffer.alloc(blocksize)
    const i_key_pad = Buffer.alloc(blocksize)

    for (let i = 0; i < blocksize; i++) {
        o_key_pad[i] = o_key[i] ^ key[i]
        i_key_pad[i] = i_key[i] ^ key[i]
    }

    return hashf(
        Buffer.concat([
            o_key_pad, hashf(Buffer.concat([
                i_key_pad,
                data,
            ]))
        ])
    )
}

Hash.sha256hmac = function (_msgbuf, _privkey) {
    return Hash.hmac(Hash.sha256, _msgbuf, _privkey)
}

Hash.sha512hmac = function (_msgbuf, _privkey) {
    return Hash.hmac(Hash.sha512, _msgbuf, _privkey)
}

export default Hash
