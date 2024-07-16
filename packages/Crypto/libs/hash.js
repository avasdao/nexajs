/* Import (local) modules. */
import $ from './preconditions.js'
import { sha256 } from '../index.js'

/* Initialize hash. */
let Hash = {}

Hash.sha256 = function(_buf) {
    return Buffer.from(sha256(_buf))
}

Hash.sha256.blocksize = 512

Hash.hmac = function(hashf, data, key) {
    //http://en.wikipedia.org/wiki/Hash-based_message_authentication_code
    //http://tools.ietf.org/html/rfc4868#section-2
    $.checkArgument(hashf.blocksize)

    var blocksize = hashf.blocksize / 8

    if (key.length > blocksize) {
        key = hashf(key)
    } else if (key < blocksize) {
        var fill = Buffer.alloc(blocksize)
        fill.fill(0)
        key.copy(fill)
        key = fill
    }

    var o_key = Buffer.alloc(blocksize)
    o_key.fill(0x5c)

    var i_key = Buffer.alloc(blocksize)
    i_key.fill(0x36)

    var o_key_pad = Buffer.alloc(blocksize)
    var i_key_pad = Buffer.alloc(blocksize)
    for (var i = 0; i < blocksize; i++) {
        o_key_pad[i] = o_key[i] ^ key[i]
        i_key_pad[i] = i_key[i] ^ key[i]
    }

    return hashf(Buffer.concat([o_key_pad, hashf(Buffer.concat([i_key_pad, data]))]))
}

Hash.sha256hmac = function(data, key) {
    return Hash.hmac(Hash.sha256, data, key)
}

export default Hash
