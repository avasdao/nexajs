/**
 * Message to Buffers
 */
export default (someBase64Message) => {
    /* Initialize message buffer. */
    const messageBuffer = Buffer.from(someBase64Message, 'base64')

    /* Validate message buffer. */
    if (messageBuffer.length < 12) {
        throw new Error('bad_length')
    } else {
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
        // const messagePayload = messageBuffer.slice(12, ) // FIXME: Why do we have a trailing space??
        const messagePayload = messageBuffer.slice(12) // FIXME: Why do we have a trailing space??

        /* Validate message payload. */
        if (messagePayload.length !== messageLength) {
            console.error( // eslint-disable-line no-console
                'Incorrect payload size', messagePayload.length,
                '!==', messageLength)
            throw new Error('message_payload')
        } else {
            /* Return message buffers. */
            return {
                magic: messageBuffer.slice(0, 8).toString('base64'),
                length: messageBuffer.slice(8, 12).toString('base64'),
                payload: messageBuffer.slice(12).toString('base64'),
                buffer: messageBuffer.toString('base64')
            }
        }
    }
}
