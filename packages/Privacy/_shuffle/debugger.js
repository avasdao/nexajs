/* Import core modules. */
const _ = require('lodash')
const bch = require('bitcore-lib-cash')
const repl = require('repl')

/* Import local modules. */
const messageUtils = require('./serverMessages.js')

/* Set magic bytes. */
const magic = Buffer.from('42bcc32669467873', 'hex')

const currentPath = __filename.substring(0, __filename.lastIndexOf('/'))
process.chdir(currentPath)

/* Initialize shuffle. */
const shuffleIt = repl.start('cashshuffle debug > ')

shuffleIt.context.round

try {
    shuffleIt.context.round = require(currentPath + '/_failedShuffle.js')
} catch (nope) {
    /* eslint-disable-next-line no-console */
    console.log('\n  No failed shuffle file found at', currentPath + '/_failedShuffle.js')
    shuffleIt.context.round = {}

    /* Quit application. */
    process.exit()
}

// shuffleIt.context.players = shuffleIt.context.round.players
shuffleIt.context.inbox = shuffleIt.context.round.inbox
shuffleIt.context.outbox = shuffleIt.context.round.outbox
shuffleIt.context.me = _.find(shuffleIt.context.round.players, { isMe: true })

for (let onePlayer of shuffleIt.context.round.players) {
    if (onePlayer.isMe) {
        continue
    }

    let somePlayer = {}

    somePlayer['player' + onePlayer.playerNumber] = onePlayer

    Object.assign(shuffleIt.context, somePlayer)
}

shuffleIt.context.bch = bch
shuffleIt.context.Address = shuffleIt.context.bch.Address
shuffleIt.context.PrivateKey = shuffleIt.context.bch.PrivateKey
shuffleIt.context.PublicKey = shuffleIt.context.bch.PublicKey
shuffleIt.context.Message = require('./BetterMessage.js')
shuffleIt.context.msg = messageUtils
shuffleIt.context.crypto = require('./cryptoUtils.js')
shuffleIt.context._ = _

shuffleIt.context.tools = {
    crypto: require('./cryptoUtils.js'),
    coin: require('./coinUtils.js'),
    loadProtobuffMessageFromMailbox: function(someMailboxMessageObject) {
        let messageBuffer = Buffer.from(someMailboxMessageObject.protobuffMessage.components.buffer, 'base64')
        let decodedMessage = messageUtils.decodeAndClassify(messageBuffer)

        delete decodedMessage.components

        let sender = _.find(shuffleIt.context.round.players, {
            session: decodedMessage.pruned.message.session
        })

        return Object.assign(decodedMessage, { sender: sender })
    },
    // Find a properly packed `Protocol Message` from
    // somewhere deep inside a base64 encoded string.
    findValidPackets: function(someBase64EncodedString) {
        let messageBuffer = Buffer.from(someBase64EncodedString, 'base64')
        let aintGood = true
        let indexCounter = 0
        let packets
        let numTries = 0

        while (aintGood && numTries < someBase64EncodedString.length) {
            numTries++

            try {
                let messageMagic = messageBuffer.slice(indexCounter, indexCounter + 8)

                if (messageMagic.toString('hex') !== magic.toString('hex')) {
                    indexCounter += 1

                    throw new Error('message_magic:'+(messageMagic.toString('hex')))
                } else {
                    packets = shuffleIt.context.crypto.PB.Packets
                        .decode(messageBuffer.slice(indexCounter+12, )).toJSON()

                    aintGood = false
                }
            } catch (nope) {
                console.error(nope) // eslint-disable-line no-console
            }
        }

        console.log(JSON.stringify(packets, null, 4)) // eslint-disable-line no-console

        return packets
    }
}
