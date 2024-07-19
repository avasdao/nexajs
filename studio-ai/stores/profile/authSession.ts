/* Import modules. */
import moment from 'moment'

import { signMessageHashSchnorr } from '@nexajs/crypto'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Initialize stores. */
import { useProfileStore } from '@/stores/profile'
const Profile = useProfileStore()

export default async function () {
    console.log('WALLET', this.wallet)
    console.log('ADDRESS', this.address)
    console.log('PUBLIC KEY', this.wallet.publicKey)
    console.log('PROFILE SESSION', Profile.session)

    /* Initialize locals. */
    let messageHash
    let timestamp
    let response
    let signature
    let unitSeparator

    /* Set unit separator. */
    unitSeparator = '1f'

    /* Set (timestamp) timestamp.*/
    timestamp = moment().unix()
    console.log('TIMESTAMP-1', timestamp)
    timestamp = timestamp.toString(16)
    console.log('TIMESTAMP-2', timestamp)

    console.log('\n\nPRIVATE KEY', this.wallet.privateKey)

    // NOTE: Format is <timestamp> <0x1F> <challenge>
    // NOTE: We use 0x1F as the default "unit separator".
    messageHash = hexToBin(`${timestamp}${unitSeparator}${Profile.challenge}`)
    console.log('\n\nMESSAGE HASH', binToHex(messageHash))

    // Generate a signature over the "sighash" using the passed private key.
    signature = signMessageHashSchnorr(this.wallet.privateKey, messageHash)
    console.log('SIGNATURE BIN', signature)
    console.log('SIGNATURE HEX', binToHex(signature))

    response = await $fetch('/api/auth', {
        method: 'POST',
        body: {
            sessionid: Profile.sessionid,
            publicKey: binToHex(this.wallet.publicKey),
            signature: binToHex(signature),
            timestamp,
        },
    })
    console.log('AUTH SESSIONS (response):', response)
}
