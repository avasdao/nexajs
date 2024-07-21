/* Import modules. */
import {
    PrivateKey,
    PublicKey,
} from '@nexajs/crypto'


/**
 * Generate Keypair
 *
 * FIXME: DRY this up, using `rebuildKeypair`.
 */
export default () => {
    /* Initialize keypair. */
    const keypair = {
        privateKey: new PrivateKey()
    }

    /* Set public key. */
    keypair.publicKey = keypair.privateKey.toPublicKey()

    /* Set public key (hex). */
    keypair.publicKeyHex = keypair.publicKey.toString('hex')

    /* Set private key (hex). */
    keypair.privateKeyHex = keypair.privateKey.toString('hex')

    /* Return keypair. */
    return keypair
}
