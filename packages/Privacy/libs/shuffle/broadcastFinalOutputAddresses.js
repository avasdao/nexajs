/**
 * Broadcast Final Output Addresses
 */
export default (
    session,
    fromPlayerNumber,
    arrayOfOutputs,
    phase,
    myVerificationPubKey,
    myVerificationPrivKey
) => {
    /* Validate verification public key. */
    if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
        myVerificationPubKey = myVerificationPubKey.toString()
    }

    /* Initialize signed messages. */
    const signedMessages = []

    /* Loop through ALL outputs. */
    for (let onePlaintextAddress of arrayOfOutputs) {
        /* Set message. */
        const message = PB.Signed.create({
            packet: PB.Packet.create({
                session: session,
                number: fromPlayerNumber,
                fromKey: PB.VerificationKey.create({
                    key: myVerificationPubKey
                }),
                phase: PB.Phase.values[phase.toUpperCase()],
                message: PB.Message.create({
                    str: onePlaintextAddress
                })
            })
        })

        /* Set message. */
        const msg = Buffer.from(PB.Packet.encode(message.packet).finish())
            .toString('base64')

        /* Set signature. */
        const signature = new BetterMessage(msg, 'base64')
            .sign(bch.PrivateKey(myVerificationPrivKey))

        /* Set message signature. */
        message.signature = PB.Signature.create({ signature })

        /* Add message to signed messages. */
        signedMessages.push(message)
    }

    /* Return packed signed messages. */
    return packMessage(signedMessages)
}
