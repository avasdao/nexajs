/**
 * Check Packet Signature
 */
export default (oneSignedPacket) => {
    /* Initialize verification key. */
    const verificationKey = oneSignedPacket.packet.fromKey.key

    /* Set signature. */
    const signature = Buffer.from(oneSignedPacket.signature.signature).toString('base64')

    /* Set packet. */
    const packet = PB.Packet.encode(oneSignedPacket.packet)

    /* Set public key. */
    const pubkey = new bch.PublicKey(verificationKey)

    /* Set address. */
    const address = pubkey.toAddress().toString()

    /* Set message. */
    const message = Buffer.from(packet.finish()).toString('base64')

    // console.log('checkPacketSignature',
    //     oneSignedPacket,
    //     verificationKey,
    //     signature,
    //     packet,
    //     pubkey,
    //     address,
    //     message
    // )

    /* Initialize result. */
    let result = false

    try {
        /* Set result. */
        result = new BetterMessage(message, 'base64').verify(address, signature)
    } catch (someError) {
        console.error('Error checking signature:', someError) // eslint-disable-line no-console
    }

    /* Return result. */
    return result
}
