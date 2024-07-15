/**
 * Blame Message
 */
export default (
    options,
    mySessionid,
    myPlayerNumber,
    myVerificationPublicKey,
    myVerificationPrivateKey
) {
    /* Validate verification public key. */
    if (_.isObject(myVerificationPublicKey) && typeof myVerificationPublicKey.toString) {
        myVerificationPublicKey = myVerificationPublicKey.toString()
    }

    /* Validate verification private key. */
    if (_.isObject(myVerificationPrivateKey) && typeof myVerificationPrivateKey.toString) {
        myVerificationPrivateKey = myVerificationPrivateKey.toString()
    }

    /* Set blame message. */
    const blameMessage = _.reduce(_.keys(options), function (msg, oneOptionName) {
        switch (oneOptionName) {
        case 'reason':
            msg.packet.message.blame.reason = PB.Reason.values[
                options.reason ? options.reason.toUpperCase() : 'NONE'
            ]
            break
        case 'accused':
            msg.packet.message.blame.accused = PB.VerificationKey.create({
                key: options.accused
            })
            break
        case 'invalid':
            // msg.packet.message.blame.invalue = PB.Invalid.create({ invalid: invalidPackets })
            msg.packet.message.blame.invalue = PB.Invalid.create({
                invalid: options.invalidPackets
            })
            break
        case 'hash':
            msg.packet.message.hash = PB.Hash.create({
                hash: options.hash
            })
            break
        case 'keypair':
            msg.packet.message.blame.key = PB.DecryptionKey.create({
                key: options.keypair.key,
                public: options.keypair.public
            })
            break
        // case '':
        //   msg.packet.message.
        // break
        default:
            break
        }

        /* Return message. */
        return msg
    }, PB.Signed.create({
        packet: PB.Packet.create({
            session: mySessionid,
            number: myPlayerNumber,
            fromKey: PB.VerificationKey.create({
                key: myVerificationPublicKey
            }),
            message: PB.Message.create({
                blame: PB.Blame.create({
                })
            }),
            phase: PB.Phase.values['BLAME']
        })
    }))

    /* Set message. */
    const msg = Buffer.from(PB.Packet.encode(blameMessage.packet).finish())
        .toString('base64')

    /* Set blame message signature. */
    blameMessage.signature = PB.Signature.create({
        signature: new BetterMessage(msg, 'base64')
            .sign(bch.PrivateKey(myVerificationPrivateKey))
    })

    console.log('Compiled blame message:', blameMessage)

    /* Return packed message. */
    return packMessage(blameMessage)
}
