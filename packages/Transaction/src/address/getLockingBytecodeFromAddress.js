/* Import modules. */
import {
    // base58AddressToLockingBytecode,
    // cashAddressToLockingBytecode,
    instantiateSha256,
} from '@bitauth/libauth'

import base58AddressToLockingBytecode from './base58AddressToLockingBytecode.js'
import cashAddressToLockingBytecode from './cashAddressToLockingBytecode.js'

/**
 * Converts an address to its locking byte-code equivalent.
 *
 * @function
 *
 * @param _address {String} Bitcoin Cash address.
 *
 * @returns {Uint8Array} The locking code for the given address.
 */
export default async (_address) => {
    // Initialize an empty error message, that we can use to display after we exhausted our options.
    let errorMessages = ''

    try {
        // Add a prefix if necessary.
        let prefix = ''

        // Normalize address prefix
        if (!_address.startsWith('nexa:') && !_address.startsWith('bitcoincash:')) {
            if (_address.startsWith('qq') || _address.startsWith('qr')) {
                prefix = 'bitcoincash:'
            }

            if (_address.startsWith('nq')) {
                prefix = 'nexa:'
            }
        }

        const lockScriptResult = cashAddressToLockingBytecode(prefix + _address)
        console.log('lockScriptResult', lockScriptResult)

        // Throw an error in case of failure (which we'll catch and ignore).
        if(typeof lockScriptResult === 'string') {
            throw(new Error(`Cannot decode '${_address}' as a cash address: ${lockScriptResult}`))
        }

        return lockScriptResult.bytecode
    } catch (error) {
        // Store the error message, but otherwise do nothing.
        errorMessages += error
    }

    try {
        // Attempt to decode the address as a base58 legacy address.
        const sha256 = await instantiateSha256()
        const lockScriptResult = base58AddressToLockingBytecode(sha256, _address)

        // Throw an error in case of failure (which we'll catch and ignore).
        if (typeof lockScriptResult === 'string') {
            throw(new Error(`Cannot decode '${_address}' as a base58 address: ${lockScriptResult}`))
        }

        return lockScriptResult.bytecode
    } catch (error) {
        // Store the error message, but otherwise do nothing.
        errorMessages += error
    }

    // Throw an error, including the the most recent error message in case the address could not be decoded with either address type.
    throw(new Error(`Failed to decode '${_address}': ${errorMessages}`))
}
