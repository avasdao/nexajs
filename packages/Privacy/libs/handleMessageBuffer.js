/* Initialize magic (bytes). */
const magic = Buffer.from('42bcc32669467873', 'hex')

export default (messageBuffer) => {
    /* Validate message buffer. */
    if (messageBuffer.length < 12) {
        throw new Error('bad_length')
    }

    /* Set message magic (bytes). */
    const messageMagic = messageBuffer.slice(0, 8)

    /* Validate message magic (bytes). */
    if (messageMagic.toString('hex') !== magic.toString('hex')) {
        throw new Error('message_magic')
    }

    /* Initialize message length. */
    let messageLength = messageBuffer.slice(8, 12)

    /* Set message length. */
    messageLength = messageLength.readUInt32BE(0)

    /* Set message payload. */
    const messagePayload = messageBuffer.slice(12)

    /* Build server message. */
    const serverMessage = {
        packets: [],
        full: undefined,
        pruned: undefined,
        components: messageToBuffers(messageBuffer)
    }

    /* Validate message payload. */
    if (messagePayload.length !== messageLength) {
        console.log(
            'Incorrect payload size:', messagePayload.length,
            '!==', messageLength
        )
        throw new Error('message_payload')
    } else {
        /* Set decoded packets. */
        const decodedPackets = PB.Packets.decode(messagePayload)

        /* Loop through ALL decoded packets. */
        for (let onePacket of decodedPackets.packet) {
            serverMessage.packets.push(onePacket)
        }

        /* Set (full) server message. */
        serverMessage.full = decodedPackets.toJSON()

        /* Set (pruned) server message. */
        serverMessage.pruned = {
            message: _.get(serverMessage.full, 'packet[0].packet'),
            signature: _.get(serverMessage.full, 'packet[0].signature.signature')
        }
    }

    /* Validate (pruned) server message. */
    if (!serverMessage.pruned.message) {
        throw new Error('message_parsing')
    }

    /* Initialize message types. */
    // TODO: Pick more intuitive and more consistent message names.
    let messageTypes = [
        { name: 'playerCount', required: ['number'] },
        { name: 'serverGreeting', required: ['number', 'session'] },
        { name: 'announcementPhase', required: ['number', 'phase'] },
        { name: 'incomingVerificationKeys', required: ['session', 'fromKey.key', 'message.inputs'] },
        { name: 'incomingChangeAddress', required: ['session', 'number', 'fromKey.key', 'message.address.address', 'message.key.key', 'phase'] },

        /**
         * This message name will be changed before the `serverMessage`
         * event is emitted by the `CommChannel` class.
         *
         * We set the final message name there because that's where we
         * have access to round state data and the purpose of the message
         * (which should inform the name) changes based on the state of the
         * round.
         *
         * Yep, this is yet another hack to deal with the fact that there
         * is no support for a unique `messageName` field on the protocol
         * messages.
         */
        { name: '_unicast', required: ['number', 'session', 'fromKey.key', 'toKey.key', 'message.str'] },
        { name: 'incomingEquivCheck', required: ['number', 'session', 'phase', 'fromKey.key', 'message.hash.hash'] },
        { name: 'incomingInputAndSig', required: ['number', 'session', 'phase', 'fromKey.key', 'message.signatures'] },
        { name: 'finalTransactionOutputs', required: ['session', 'number', 'phase', 'fromKey.key', 'message.str'] },
        { name: 'blame', required: ['number', 'session', 'fromKey.key', 'message.blame', 'phase'] }
    ]

    // Order the message types so that the most
    // specific descriptions are seen first by
    // the function that attempts to find a match.
    messageTypes = _.orderBy(
        messageTypes,
        function (ot) {
            return ot.required.length
        },
        ['desc']
    )

    /* Set matching message type. */
    const matchingMessageType = _.reduce(messageTypes, function (winner, oneObject) {
        /* Set required parameter values. */
        const requiredParamValues = _.at(serverMessage.pruned.message, oneObject.required)

        /* Validate required parameter values. */
        // NOTE: If none of the required parameters are missing,
        //       consider this object a match.
        const isMatch = oneObject.required.length === _.compact(requiredParamValues).length

        /* Validate match. */
        // NOTE: If our match has more matching params than
        //       our previous match, use this one instead
        if (isMatch && winner.required.length < requiredParamValues.length) {
            return oneObject
        } else {
            return winner
        }
    }, { required: [] })

    /* Update server message. */
    Object.assign(serverMessage.pruned, {
        messageType: matchingMessageType.name || 'UNKNOWN'
    })

    /* Return server message. */
    return serverMessage
}
