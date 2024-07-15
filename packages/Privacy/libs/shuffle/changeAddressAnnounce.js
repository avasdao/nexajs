/**
 * Change Address Announcement
 */
export default (
    session,
    playerNumber,
    changeAddress,
    encryptionPublicKey,
    phase,
    verificationPublicKey,
    verificationPrivateKey
) => {
    /* Validate encryption public key. */
    if (_.isObject(encryptionPublicKey) && typeof encryptionPublicKey.toString) {
        encryptionPublicKey = encryptionPublicKey.toString()
    }

    /* Validate verification public key. */
    if (_.isObject(verificationPublicKey) && typeof verificationPublicKey.toString) {
        verificationPublicKey = verificationPublicKey.toString()
    }

    /* Initialize message. */
    let message

    /* Set message. */
    message = PB.Signed.create({
        packet: PB.Packet.create({
            session: session,
            number: playerNumber,
            fromKey: PB.VerificationKey.create({
                key: verificationPublicKey
            }),
            phase: PB.Phase.values[phase.toUpperCase()],
            message: PB.Message.create({
                address: PB.Address.create({
                    address: changeAddress
                }),
                key: PB.VerificationKey.create({
                    key: encryptionPublicKey
                })
            })
        })
    })

    /* Set message. */
    const msg = Buffer.from(PB.Packet.encode(message.packet).finish())
        .toString('base64')

    /* Set signature. */
    const signature = new BetterMessage(msg, 'base64')
        .sign(bch.PrivateKey(verificationPrivateKey))

    /* Set message signature. */
    message.signature = PB.Signature.create({ signature })

    /* Return packed message. */
    return packMessage(message)
}
