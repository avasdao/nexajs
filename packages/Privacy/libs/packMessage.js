/**
 * Pack Message
 *
 * Encode (pack) a message into a prototype buffer (protobuf) object.
 */
export default (oneOrMorePackets) => {
    oneOrMorePackets = _.isArray(oneOrMorePackets) ? oneOrMorePackets : [oneOrMorePackets]

    /* Set packets. */
    const packets = PB.Packets.create({ packet: oneOrMorePackets })

    /* Set message buffer. */
    const messageBuffer = Buffer.from(PB.Packets.encode(packets).finish())

    /* Initialize length suffix. */
    const lengthSuffix = Buffer.alloc(4)

    /* Set length suffix. */
    lengthSuffix.writeUIntBE(messageBuffer.length, 0, 4)

    /* Set message components. */
    const messageComponents = [magic, lengthSuffix, messageBuffer]

    /* Set full message. */
    const fullMessage = Buffer.concat(messageComponents)

    /* Return message object. */
    return {
        unpacked: packets,
        packed: fullMessage,
        components: messageToBuffers(fullMessage)
    }
}
