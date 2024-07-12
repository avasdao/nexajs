/* Import modules. */
import { encodeAddress } from '@nexajs/address'

import {
    randomBytes,
    sha256,
    sha512,
} from '@nexajs/crypto'

import {
    deriveHdPrivateNodeFromSeed,
    encodePrivateKeyWif,
    entropyToMnemonic,
    mnemonicToSeed,
} from '@nexajs/hdnode'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    deriveHdPath,
    instantiateSecp256k1,
} from '@bitauth/libauth'

/* Initialize Libauth crypto interfaces. */
let secp256k1
let crypto

/* Instantiate Libauth crypto interfaces. */
// NOTE: This requires a few cycles to load
//       and MUST be handled accordingly.
;(async () => {
    secp256k1 = await instantiateSecp256k1()

    /* Initialize crypto. */
    crypto = {
        ripemd160: { hash: ripemd160 },
        sha256: { hash: sha256 },
        sha512: { hash: sha512 },
        secp256k1,
    }
})()

/**
 * Get Address
 *
 * Retrieve any address contained in the BIP-32 wallet.
 */
export default function (_addressIdx = '0', _isChange) {
    /* Validate mnemonic. */
    if (!this.mnemonic) {
        return null
    }

    /* Initialize locals. */
    let address
    let changeIdx
    let child
    let node
    let privateKey
    let publicKey
    let publicKeyHash
    let scriptPubKey
    let scriptPushPubKey
    let seed

    /* Set change index. */
    changeIdx = _isChange ? '1' : '0'

    /* Set seed. */
    seed = hexToBin(mnemonicToSeed(this.mnemonic))

    /* Initialize HD node. */
    node = deriveHdPrivateNodeFromSeed({ sha512: { hash: sha512 } }, seed)

    /* Derive a child from the Master node */
    child = deriveHdPath(
        crypto,
        node,
        `m/${this._coinPurpose}/${this._coinType}/${this._accountIdx}/${changeIdx}/${_addressIdx}`
    )

    /* Set private key. */
    privateKey = child.privateKey

    /* Derive the corresponding public key. */
    publicKey = secp256k1.derivePublicKeyCompressed(privateKey)

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    scriptPushPubKey = encodeDataPush(publicKey)

    /* Generate public key hash. */
    publicKeyHash = ripemd160(sha256(scriptPushPubKey))

    /* Generate public key hash script. */
    scriptPubKey = new Uint8Array([
        OP.ZERO,
        OP.ONE,
        ...encodeDataPush(publicKeyHash),
    ])

    /* Encode the public key hash into a P2PKH nexa address. */
    address = encodeAddress(
        'nexa',
        'TEMPLATE',
        scriptPubKey,
    )

    /* Return address. */
    return address
}
