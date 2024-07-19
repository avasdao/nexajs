/* Import (local) modules. */
import _decrypt from './src/decrypt.js'
import _derivePublicKeyCompressed from './src/derivePublicKeyCompressed.js'
import _encrypt from './src/encrypt.js'
// import _passwordToSafu from './src/passwordToSafu.js'
import _getHmac from './src/getHmac.js'
import _ripemd160 from './src/ripemd160.js'
import _sha256 from './src/sha256.js'
import _sha512 from './src/sha512.js'
import _signMessageHashEcdsa from './src/signMessageHashEcdsa.js'
import _signMessageHashSchnorr from './src/signMessageHashSchnorr.js'
import _validateSecp256k1PrivateKey from './src/validateSecp256k1PrivateKey.js'
import _verifyMessageHashEcdsa from './src/verifyMessageHashEcdsa.js'

/* Import (local) libraries. */
import _Base58Check from './libs/Base58Check.js'
import _ECDSA from './libs/ECDSA.js'
import _Hash from './libs/Hash.js'
import _HDPrivateKey from './libs/HDPrivateKey.js'
import _HDPublicKey from './libs/HDPublicKey.js'
import _Point from './libs/Point.js'
import _PrivateKey from './libs/PrivateKey.js'
import _PublicKey from './libs/PublicKey.js'

/* Import (Network) settings. */
import { defaultNetwork as _defaultNetwork } from './libs/Network.js'

/* Export (local) modules. */
export const decrypt = _decrypt
export const derivePublicKeyCompressed = _derivePublicKeyCompressed
export const encrypt = _encrypt
// export const passwordToSafu = _passwordToSafu
export const getHmac = _getHmac
export const ripemd160 = _ripemd160
export const sha256 = _sha256
export const sha512 = _sha512
export const signMessageHashEcdsa = _signMessageHashEcdsa
export const signMessageHashSchnorr = _signMessageHashSchnorr
export const validateSecp256k1PrivateKey = _validateSecp256k1PrivateKey
export const verifyMessageHashEcdsa = _verifyMessageHashEcdsa

/* Export (local) libraries. */
export const Base58Check = _Base58Check
export const ECDSA = _ECDSA
export const Hash = _Hash
export const HDPrivateKey = _HDPrivateKey
export const HDPublicKey = _HDPublicKey
export const Point = _Point
export const PrivateKey = _PrivateKey
export const PublicKey = _PublicKey

/* Export (Network) settings. */
export const defaultNetwork = _defaultNetwork

/* Provide Ether.js helpers. */
import { randomBytes as _randomBytes } from '@ethersproject/random'
export const randomBytes = _randomBytes

/* Import Buffer class. */
// FIXME REMOVE THIS GLOBAL INJECTION, AFTER REFACTORING FOR SCHNORR.
// NOTE: THIS ONLY INJECTS IF `window.Buffer` IS MISSING.
import './libs/Buffer.js'

/**
 * Crypto Class
 *
 * Manages crypto functions.
 */
export class Crypto {
    // NOTE: We won't use a constructor, as this is a "pure" class.

    test() {
        return 'Crypto (Instance) is working!'
    }
    static test() {
        return 'Crypto (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Crypto class. */
Nexa.Crypto = Crypto

/* Initialize Crypto modules. */
Nexa.decrypt = decrypt
Nexa.derivePublicKeyCompressed = derivePublicKeyCompressed
Nexa.encrypt = encrypt
// Nexa.passwordToSafu = passwordToSafu
Nexa.getHmac = getHmac
Nexa.randomBytes = randomBytes
Nexa.ripemd160 = ripemd160
Nexa.sha256 = sha256
Nexa.sha512 = sha512
Nexa.signMessageHashEcdsa = signMessageHashEcdsa
Nexa.signMessageHashSchnorr = signMessageHashSchnorr
Nexa.validateSecp256k1PrivateKey = validateSecp256k1PrivateKey
Nexa.verifyMessageHashEcdsa = verifyMessageHashEcdsa

/* Initialize Crypto libraries. */
Nexa.Base58Check = Base58Check
Nexa.ECDSA = ECDSA
Nexa.Hash = Hash
Nexa.HDPrivateKey = HDPrivateKey
Nexa.HDPublicKey = HDPublicKey
Nexa.Point = Point
Nexa.PrivateKey = PrivateKey
Nexa.PublicKey = PublicKey

/* Initialize Crypto settings. */
Nexa.defaultNetwork = defaultNetwork

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
