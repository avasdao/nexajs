/* Import modules. */
import { encodeAddress } from '@nexajs/address'

import {
    derivePublicKeyCompressed,
    randomBytes,
    ripemd160,
    sha256,
    sha512,
} from '@nexajs/crypto'

import {
    deriveHdPath,
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
    node = deriveHdPrivateNodeFromSeed(seed)

    /* Derive a child from the Master node */
    child = deriveHdPath(
        seed, // FIXME Derive from parent `node`.
        `m/${this._coinPurpose}/${this._coinType}/${this._accountIdx}/${changeIdx}/${_addressIdx}`
    )

    const childKey = child.privateKey.toString()

    /* Set private key. */
    privateKey = hexToBin(childKey)

    /* Derive the corresponding public key. */
    publicKey = derivePublicKeyCompressed(privateKey)

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
