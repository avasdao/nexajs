/* Import core modules. */
const _ = require('lodash')
const bch = require('bitcore-lib-cash')

const $ = bch.util.preconditions
const Address = bch.Address
// const PublicKey = bch.PublicKey
const PrivateKey = bch.PrivateKey
const BufferWriter = bch.encoding.BufferWriter
const ECDSA = bch.crypto.ECDSA
const Signature = bch.crypto.Signature
const sha256sha256 = bch.crypto.Hash.sha256sha256
const JSUtil = bch.util.js

/* Set magic bytes. */
const MAGIC_BYTES = Buffer.from('Bitcoin Signed Message:\n')

/**
 * (Better) Message (Class)
 *
 * Constructs a new message to sign and verify.
 * Now featuring typed buffers!
 */
class Message {
    constructor (message, messageEncoding) {
        messageEncoding = messageEncoding || 'utf8'

        if (!(this instanceof Message)) {
            return new Message(message, messageEncoding)
        }

        $.checkArgument(
            _.isString(message), 'First argument should be a string')

        this.message = message
        this.messageEncoding = messageEncoding

        return this
    }

    /**
     * Magic Hash
     */
    get magicHash () {
        /* Initialize first prefix. */
        const prefix1 = BufferWriter.varintBufNum(MAGIC_BYTES.length)

        /* Set buffer message. */
        const messageBuffer = Buffer.from(this.message, this.messageEncoding)

        /* Initialize second prefix. */
        const prefix2 = BufferWriter.varintBufNum(messageBuffer.length)

        /* Set (complete) buffer. */
        const buf = Buffer
            .concat([prefix1, MAGIC_BYTES, prefix2, messageBuffer])

        /* Set buffer hash. */
        const hash = sha256sha256(buf)

        /* Return hash. */
        return hash
    }

    /**
     * Sign
     *
     * Will sign a message with a given bitcoin private key.
     */
    sign (privateKey) {
        $.checkArgument(privateKey instanceof PrivateKey,
            'First argument should be an instance of PrivateKey')

        /* Initialize hash. */
        const hash = this.magicHash

        /* Initialize ECDSA. */
        const ecdsa = new ECDSA()

        /* Set hash buffer. */
        ecdsa.hashbuf = hash

        /* Set private key. */
        ecdsa.privkey = privateKey

        /* Set public key. */
        ecdsa.pubkey = privateKey.toPublicKey()

        /* Sign. */
        ecdsa.signRandomK()

        /* Calculate. */
        ecdsa.calci()

        /* Return signature. */
        return ecdsa.sig.toCompact().toString('base64')
    }

    /**
     * Verify
     *
     * Will return a boolean of the signature is valid for a given
     * bitcoin address. If it isn't the specific reason is accessible via
     * the "error" member.
     */
    verify (bitcoinAddress, signatureString) {
        $.checkArgument(bitcoinAddress)

        $.checkArgument(signatureString && _.isString(signatureString))

        if (_.isString(bitcoinAddress)) {
            bitcoinAddress = Address.fromString(bitcoinAddress)
        }

        /* Set signature. */
        const signature = Signature
            .fromCompact(Buffer.from(signatureString, 'base64'))

        /* Initialize ECDSA. */
        const ecdsa = new ECDSA()

        /* Set hash buffer. */
        ecdsa.hashbuf = this.magicHash

        /* Set signature. */
        ecdsa.sig = signature

        /* Set public key. */
        const publicKey = ecdsa.toPublicKey()

        /* Set signature address. */
        const signatureAddress = Address
            .fromPublicKey(publicKey, bitcoinAddress.network)

        /* Validate addresses. */
        if (bitcoinAddress.toString() !== signatureAddress.toString()) {
            this.error = 'The signature did not match the message digest'

            return false
        }

        /* Set verification. */
        const verified = ECDSA.verify(this.magicHash, signature, publicKey)

        /* Validate verification. */
        if (!verified) {
            this.error = 'The signature was invalid'
        }

        /* Return verification. */
        return verified
    }

    /**
     * To Object
     *
     * Returns a plain object with the message information.
     */
    toObject () {
        return {
            message: this.message
        }
    }

    /**
     * To JSON
     *
     * Returns a JSON representation of the message information.
     */
    toJSON () {
        return JSON.stringify(this.toObject())
    }

    /**
     * To String
     *
     * Returns a string representation of the message.
     */
    toString () {
        return this.message
    }

    /**
     * Inspect
     *
     * Returns a string formatted for the console.
     */
    inspect () {
        return '<Message: ' + this.toString() + '>'
    }
}

/**
 * From String
 *
 * Instantiate a message from a message string.
 */
Message.prototype.fromString = function (str) {
    return new Message(str)
}

/**
 * From JSON
 *
 * Instantiate a message from JSON.
 */
Message.prototype.fromJSON = function fromJSON (json) {
    if (JSUtil.isValidJSON(json)) {
        json = JSON.parse(json)
    }

    return new Message(json.message)
}

/**
 * Magic Bytes
 */
Message.prototype.MAGIC_BYTES = MAGIC_BYTES

/* Export module. */
module.exports = Message
