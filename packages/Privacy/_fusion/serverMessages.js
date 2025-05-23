/* Import core modules. */
const _ = require('lodash')
// const bch = require('bitcore-lib-cash')
const path = require('path')
const protobuf = require('protobufjs')

/* Import local modules. */
// const BetterMessage = require('./BetterMessage.js')

/* Initialize magic (bytes). */
const magic = Buffer.from('765be8b4e4396dcf', 'hex')

/* Initialize protobuf classes. */
const pbEnums = ['Phase', 'Reason']

/* Initialize protobuf types. */
const pbTypes = [
    'Signed', 'Packet', 'Coins', 'Signatures', 'Message', 'Address',
    'Registration', 'VerificationKey', 'EncryptionKey', 'DecryptionKey',
    'Hash', 'Signature', 'Transaction', 'Blame', 'Invalid', 'Inputs',
    'Packets'
]

/* Initialize protobuf. */
const PB = {
    root: protobuf.loadSync(path.join(__dirname, 'fusion.proto'))
}

/* Loop through ALL protobuf types. */
for (let oneTypeName of pbTypes) {
    PB[oneTypeName] = PB.root.lookupType(oneTypeName)
}

/* Loop through ALL protobuf classes. */
for (let oneClassName of pbEnums) {
    PB[oneClassName] = PB.root.lookupEnum(oneClassName)
}

/**
 * Message to Buffers
 */
// function messageToBuffers (someBase64Message) {
//     /* Initialize message buffer. */
//     const messageBuffer = Buffer.from(someBase64Message, 'base64')
//
//     /* Validate message buffer. */
//     if (messageBuffer.length < 12) {
//         throw new Error('bad_length')
//     } else {
//         /* Set message magic (bytes). */
//         const messageMagic = messageBuffer.slice(0, 8)
//
//         /* Validate message magic (bytes). */
//         if (messageMagic.toString('hex') !== magic.toString('hex')) {
//             throw new Error('message_magic')
//         }
//
//         /* Initialize message length. */
//         let messageLength = messageBuffer.slice(8, 12)
//
//         /* Set message length. */
//         messageLength = messageLength.readUInt32BE()
//
//         /* Set message payload. */
//         // const messagePayload = messageBuffer.slice(12, ) // FIXME: Why do we have a trailing space??
//         const messagePayload = messageBuffer.slice(12) // FIXME: Why do we have a trailing space??
//
//         /* Validate message payload. */
//         if (messagePayload.length !== messageLength) {
//             console.log('Incorrect payload size:', messagePayload.length, '!==', messageLength)
//             throw new Error('message_payload')
//         } else {
//             /* Return message buffers. */
//             return {
//                 magic: messageBuffer.slice(0, 8).toString('base64'),
//                 length: messageBuffer.slice(8, 12).toString('base64'),
//                 // payload: messageBuffer.slice(12, ).toString('base64'), // FIXME
//                 payload: messageBuffer.slice(12).toString('base64'), // FIXME
//                 buffer: messageBuffer.toString('base64')
//             }
//         }
//     }
// }

/**
 * Decode and Classify
 *
 * TODO: Clean this up so it better handles multi-packet messages.
 */
// function decodeAndClassify (messageBuffer) {
//     if (messageBuffer.length < 12) {
//         throw new Error('bad_length')
//     } else {
//         /* Set message magic (bytes). */
//         const messageMagic = messageBuffer.slice(0, 8)
//
//         /* Validate message magic (bytes). */
//         if (messageMagic.toString('hex') !== magic.toString('hex')) {
//             throw new Error('message_magic')
//         }
//
//         /* Initialize message length. */
//         let messageLength = messageBuffer.slice(8, 12)
//
//         /* Set message length. */
//         messageLength = messageLength.readUInt32BE()
//
//         /* Set message payload. */
//         // const messagePayload = messageBuffer.slice(12, ) // FIXME
//         const messagePayload = messageBuffer.slice(12) // FIXME
//
//         /* Build server message. */
//         const serverMessage = {
//             packets: [],
//             full: undefined,
//             pruned: undefined,
//             components: messageToBuffers(messageBuffer)
//         }
//
//         /* Validate message payload. */
//         if (messagePayload.length !== messageLength) {
//             console.log('Incorrect payload size:', messagePayload.length, '!==', messageLength)
//             throw new Error('message_payload')
//         } else {
//             /* Set decoded packets. */
//             const decodedPackets = PB.Packets.decode(messagePayload)
//
//             /* Loop through ALL decoded packets. */
//             for (let onePacket of decodedPackets.packet) {
//                 serverMessage.packets.push(onePacket)
//             }
//
//             /* Set (full) server message. */
//             serverMessage.full = decodedPackets.toJSON()
//
//             /* Set (pruned) server message. */
//             serverMessage.pruned = {
//                 message: _.get(serverMessage.full, 'packet[0].packet'),
//                 signature: _.get(serverMessage.full, 'packet[0].signature.signature')
//             }
//         }
//
//         /* Validate (pruned) server message. */
//         if (!serverMessage.pruned.message) {
//             throw new Error('message_parsing')
//         }
//
//         /* Initialize message types. */
//         // TODO: Pick more intuitive and more consistent message names.
//         let messageTypes = [
//             { name: 'playerCount', required: ['number'] },
//             { name: 'serverGreeting', required: ['number', 'session'] },
//             { name: 'announcementPhase', required: ['number', 'phase'] },
//             { name: 'incomingVerificationKeys', required: ['session', 'fromKey.key', 'message.inputs'] },
//             { name: 'incomingChangeAddress', required: ['session', 'number', 'fromKey.key', 'message.address.address', 'message.key.key', 'phase'] },
//
//             /**
//              * This message name will be changed before the `serverMessage`
//              * event is emitted by the `CommChannel` class.
//              *
//              * We set the final message name there because that's where we
//              * have access to round state data and the purpose of the message
//              * (which should inform the name) changes based on the state of the
//              * round.
//              *
//              * Yep, this is yet another hack to deal with the fact that there
//              * is no support for a unique `messageName` field on the protocol
//              * messages.
//              */
//             { name: '_unicast', required: ['number', 'session', 'fromKey.key', 'toKey.key', 'message.str'] },
//             { name: 'incomingEquivCheck', required: ['number', 'session', 'phase', 'fromKey.key', 'message.hash.hash'] },
//             { name: 'incomingInputAndSig', required: ['number', 'session', 'phase', 'fromKey.key', 'message.signatures'] },
//             { name: 'finalTransactionOutputs', required: ['session', 'number', 'phase', 'fromKey.key', 'message.str'] },
//             { name: 'blame', required: ['number', 'session', 'fromKey.key', 'message.blame', 'phase'] }
//         ]
//
//         // Order the message types so that the most
//         // specific descriptions are seen first by
//         // the function that attempts to find a match.
//         messageTypes = _.orderBy(
//             messageTypes,
//             function (ot) {
//                 return ot.required.length
//             },
//             ['desc']
//         )
//
//         /* Set matching message type. */
//         const matchingMessageType = _.reduce(messageTypes, function (winner, oneObject) {
//             /* Set required parameter values. */
//             const requiredParamValues = _.at(serverMessage.pruned.message, oneObject.required)
//
//             /* Validate required parameter values. */
//             // NOTE: If none of the required parameters are missing,
//             //       consider this object a match.
//             const isMatch = oneObject.required.length === _.compact(requiredParamValues).length
//
//             /* Validate match. */
//             // NOTE: If our match has more matching params than
//             //       our previous match, use this one instead
//             if (isMatch && winner.required.length < requiredParamValues.length) {
//                 return oneObject
//             } else {
//                 return winner
//             }
//         }, { required: [] })
//
//         /* Update server message. */
//         _.extend(serverMessage.pruned, {
//             messageType: matchingMessageType.name || 'UNKNOWN'
//         })
//
//         /* Return server message. */
//         return serverMessage
//     }
// }

/**
 * Registration
 */
function registration (protocolVersion, amount, key) {
    /* Validate key. */
    if (_.isObject(key) && typeof key.toString) {
        key = key.toString()
    }

    /* Set message. */
    const message = PB.Signed.create({
        packet: PB.Packet.create({
            fromKey: PB.VerificationKey.create({ key }),
            registration: PB.Registration.create({
                amount: amount,
                version: protocolVersion,
                // type: 'DEFAULT' // WHY AREN'T WE USING THIS??
                type: 'DEFAULT'
            })
        })
    })

    /* Return packed message. */
    return packMessage(message)
}

/**
 * Broadcast Transaction Input
 *
 * This function reveals the coin our client wishes to shuffle as well as our
 * verificationKey. Although we revealed our verificationKey in our server
 * registration message, that message isn't relayed to our peers. This is the
 * first message where our peers see the vk.
 */
// function broadcastTransactionInput (
//     inputsObject,
//     session,
//     playerNumber,
//     verificationPublicKey
// ) {
//     /* Validate verification key. */
//     if (_.isObject(verificationPublicKey) && typeof verificationPublicKey.toString) {
//         verificationPublicKey = verificationPublicKey.toString()
//     }
//
//     /* Initialize message. */
//     let message
//
//     /* Set message. */
//     message = PB.Signed.create({
//         packet: PB.Packet.create({
//             fromKey: PB.VerificationKey.create({
//                 key: verificationPublicKey
//             }),
//             message: PB.Message.create({
//                 inputs: {}
//             }),
//             session: session,
//             number: playerNumber
//         })
//     })
//
//     /* Loop through ALL input objects. */
//     for (let key in inputsObject) {
//         message.packet.message.inputs[key] = PB.Coins.create({
//             coins: inputsObject[key]
//         })
//     }
//
//     /* Return packed message. */
//     return packMessage(message)
// }

/*
{
    "packet": [
        {
            "packet": {
                "session": "aGFIYURRd0JBWFN5MkJJNnBhdzZ6OQ==",
                "number": 2,
                "from_key": {
                    "key": "03b9bf1605aa851945bd72e575d42f7ca874d9d7099f686c70893f927512010853"
                },
                "to_key": {
                    "key": "03aa863d01fd4c44043b73fccd820101f8bdc3bdf59a2472f1f1ecf6822ce4ad7b"
                },
                "phase": 2,
                "message": {
                    "str": "QklFMQNiC79dSfQjlIRKY/nHYE9KblxLkT6na8kelVoL8OIHW9/QqooDxTgtNm5Xhfh3R6kMWslw+uF6sYdhYZ53ce2sJBaaRWMLO8twqjfJGBPt/97XAAIVA57KNfzJOzdx6a8e/oUZ99xKPp6MRDBPGmME"
                }
            },
            "signature": {
                "signature": "H/zYhGuMsptl9hL76Wn9ylNUmHKAzO+ZQbEHAkTPIp1aP0DiAjtvsyFmS1ZK03nTS5d5/4Vb5GoKnty7UijANds="
            }
        },
        {
            "packet": {
                "session": "aGFIYURRd0JBWFN5MkJJNnBhdzZ6OQ==",
                "number": 2,
                "from_key": {
                    "key": "03b9bf1605aa851945bd72e575d42f7ca874d9d7099f686c70893f927512010853"
                },
                "to_key": {
                    "key": "03aa863d01fd4c44043b73fccd820101f8bdc3bdf59a2472f1f1ecf6822ce4ad7b"
                },
                "phase": 2,
                "message": {
                    "str": "QklFMQJtTrG5IQiUX1C0ZR67t5cQbN4v72uSzrCOuy1QEtOI41wQ2CGGK7lgtxyS9g8tzd9YHe+4DyMaSyrCIx/Ft/U27P6dU5xR6lVhf3ekV3mIW8/vH2lpb2AWY3Djl0egotBFrIylX+2W0nC9MVaU98xZ"
                }
            },
            "signature": {
                "signature": "H8zKYj3OsPF/EUstjST/pzI8AqwcsK8OySDIxm9WABUYHWODcoBAzKsnEh1I7gLfABpAqnYkM0WK0SiyBeVUuq8="
            }
        }
    ]
}
*/

// this.comms.sendMessage('forwardEncryptedOutputs', [
//     this.session, me.playerNumber, encryptedOutputAddresses.success,
//     this.phase.toUpperCase(), nextPlayer.verificationKey, this.ephemeralKeypair.publicKey,
//     this.ephemeralKeypair.privateKey
// ])

/**
 * Forward Encrypted Outputs
 */
// function forwardEncryptedOutputs (
//     session,
//     fromPlayerNumber,
//     arrayOfOutputs,
//     phase,
//     toVerificationKey,
//     myVerificationPubKey,
//     myVerificationPrivKey
// ) {
//     /* Validate verification public key. */
//     if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
//         myVerificationPubKey = myVerificationPubKey.toString()
//     }
//
//     /* Validate (to) verification key. */
//     if (_.isObject(toVerificationKey) && typeof toVerificationKey.toString) {
//         toVerificationKey = toVerificationKey.toString()
//     }
//
//     // TODO: Make these server messages consistent with
//     //       respect to param validation and type checking.
//
//     /* Initialize signed messages. */
//     const signedMessages = []
//
//     /* Loop through ALL outputs. */
//     for (let oneEncryptedAddress of arrayOfOutputs) {
//         /* Set message. */
//         const message = PB.Signed.create({
//             packet: PB.Packet.create({
//                 session: session,
//                 number: fromPlayerNumber,
//                 fromKey: PB.VerificationKey.create({
//                     key: myVerificationPubKey
//                 }),
//                 toKey: PB.VerificationKey.create({
//                     key: toVerificationKey
//                 }),
//                 phase: PB.Phase.values[phase.toUpperCase()],
//                 message: PB.Message.create({
//                     str: oneEncryptedAddress
//                 })
//             })
//         })
//
//         /* Set message. */
//         const msg = PB.Packet
//             .encode(message.packet)
//             .finish()
//             .toString('base64')
//
//         /* Set signature. */
//         const signature = new BetterMessage(msg, 'base64')
//             .sign(bch.PrivateKey(myVerificationPrivKey))
//
//         /* Set message signature. */
//         message.signature = PB.Signature.create({
//             signature: signature
//         })
//
//         /* Add message to signed messages. */
//         signedMessages.push(message)
//     }
//
//     /* Return packed signed messages. */
//     return packMessage(signedMessages)
// }

/*
{
    "packet": [
        {
            "packet": {
                "session": "OGlTZkdsSTZUQVgwNkU4Yk4wMkowTw==",
                "number": 1,
                "from_key": {
                    "key": "0202135e4f7217957db961f26e3856a239e89023f6cd6088d6303775c3a61572bf"
                },
                "phase": 6,
                "message": {
                    "signatures": [
                        {
                            "utxo": "3a019c3a44d5269edf8a6ca2588ead452b03f8fcdda2b622906c98e4d1d5778f:0",
                            "signature": {
                                "signature": "MzA0NDAyMjAwYjZiYzIyMDMzZTQwYzA5ZjJhNTdiZjZhOTc1YTEwMTk0OGU5ODAzMGY2OWRjMWZhYzlmZWY5ZTk0YTcxZTMzMDIyMDY4MDFlYzMzYWZiOTU5ZDZlZGZiMDQyMDM2NzcwYjA4MjI1NzczM2ExMjBhMDdmMTgzM2RlZTdhZTUzNDhlNzM0MQ=="
                            }
                        }
                    ]
                }
            },
            "signature": {
                "signature": "H0fwrr75/6GcPzPB6etyWyZD4mLlDGacVIs/j+VTldLCdE8yAfactL8jdXrJRwE7RqYhCFJ6vIHFpTu6Xa+SW2Y="
            }
        }
    ]
}
*/

/**
 * Broadcast Signature and UTXO
 */
// function broadcastSignatureAndUtxo (
//     session,
//     fromPlayerNumber,
//     coinUtxoData,
//     signatureString,
//     phase,
//     myVerificationPubKey,
//     myVerificationPrivKey
// ) {
//     /* Validate verification public key. */
//     if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
//         myVerificationPubKey = myVerificationPubKey.toString()
//     }
//
//     /* Set message. */
//     const message = PB.Signed.create({
//         packet: PB.Packet.create({
//             session: session,
//             number: fromPlayerNumber,
//             fromKey: PB.VerificationKey.create({
//                 key: myVerificationPubKey
//             }),
//             phase: PB.Phase.values[phase.toUpperCase()],
//             message: PB.Message.create({
//                 signatures: []
//             })
//         })
//     })
//
//     /* Add packet message signatures. */
//     message.packet.message.signatures.push(PB.Signature.create({
//         utxo: coinUtxoData,
//         signature: PB.Signature.create({
//             signature: signatureString
//         })
//     }))
//
//     /* Set message. */
//     const msg = PB.Packet.encode(message.packet).finish().toString('base64')
//
//     /* Set signature. */
//     const signature = new BetterMessage(msg, 'base64')
//         .sign(bch.PrivateKey(myVerificationPrivKey))
//
//     /* Set message signature. */
//     message.signature = PB.Signature.create({
//         signature: signature
//     })
//
//     /* Return packed message. */
//     return packMessage(message)
// }

/*
{
    "packet": [
        {
            "packet": {
                "session": "c25hMmNwNm8xcXJIejlNMDhJdGFNZA==",
                "number": 2,
                "from_key": {
                    "key": "03343954c832a7b870eb8758c1c280b954bfed8b8fb65a33d52f848aabdbf31dce"
                },
                "phase": 4,
                "message": {
                    "hash": {
                        "hash": "1WDdy4zstoNgSnuSjagCxL5P8aqDbBerN92WSs1c2hY="
                    }
                }
            },
            "signature": {
                "signature": "ICz+h2V5JBhHTronVb2FB4rCLHrIDi3gmsCn/+VphuojdofZBx5LCjefnnoGhwyYVQ40pSPi1u+JPXduPurrOBo="
            }
        }
    ]
}
*/

/**
 * Broadcast Equivocation Check
 */
// function broadcastEquivCheck (
//     session,
//     fromPlayerNumber,
//     equivCheckHash,
//     phase,
//     myVerificationPubKey,
//     myVerificationPrivKey
// ) {
//     /* Validate verification public key. */
//     if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
//         myVerificationPubKey = myVerificationPubKey.toString()
//     }
//
//     /* Set message. */
//     const message = PB.Signed.create({
//         packet: PB.Packet.create({
//             session: session,
//             number: fromPlayerNumber,
//             fromKey: PB.VerificationKey.create({
//                 key: myVerificationPubKey
//             }),
//             phase: PB.Phase.values[phase.toUpperCase()],
//             message: PB.Message.create({
//                 hash: PB.Hash.create({
//                     hash: equivCheckHash
//                 })
//             })
//         })
//     })
//
//     /* Set message. */
//     const msg = PB.Packet.encode(message.packet).finish().toString('base64')
//
//     /* Set signature. */
//     const signature = new BetterMessage(msg, 'base64')
//         .sign(bch.PrivateKey(myVerificationPrivKey))
//
//     /* Set message signature. */
//     message.signature = PB.Signature.create({
//         signature: signature
//     })
//
//     /* Return packed message. */
//     return packMessage(message)
// }

/**
 * Broadcast Final Output Addresses
 */
// function broadcastFinalOutputAddresses (
//     session,
//     fromPlayerNumber,
//     arrayOfOutputs,
//     phase,
//     myVerificationPubKey,
//     myVerificationPrivKey
// ) {
//     /* Validate verification public key. */
//     if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
//         myVerificationPubKey = myVerificationPubKey.toString()
//     }
//
//     /* Initialize signed messages. */
//     const signedMessages = []
//
//     /* Loop through ALL outputs. */
//     for (let onePlaintextAddress of arrayOfOutputs) {
//         /* Set message. */
//         const message = PB.Signed.create({
//             packet: PB.Packet.create({
//                 session: session,
//                 number: fromPlayerNumber,
//                 fromKey: PB.VerificationKey.create({
//                     key: myVerificationPubKey
//                 }),
//                 phase: PB.Phase.values[phase.toUpperCase()],
//                 message: PB.Message.create({
//                     str: onePlaintextAddress
//                 })
//             })
//         })
//
//         /* Set message. */
//         const msg = PB.Packet.encode(message.packet).finish().toString('base64')
//
//         /* Set signature. */
//         const signature = new BetterMessage(msg, 'base64')
//             .sign(bch.PrivateKey(myVerificationPrivKey))
//
//         /* Set message signature. */
//         message.signature = PB.Signature.create({
//             signature: signature
//         })
//
//         /* Add message to signed messages. */
//         signedMessages.push(message)
//     }
//
//     /* Return packed signed messages. */
//     return packMessage(signedMessages)
// }

/**
 * Change Address Announcement
 */
// function changeAddressAnnounce (
//     session,
//     playerNumber,
//     changeAddress,
//     encryptionPublicKey,
//     phase,
//     verificationPublicKey,
//     verificationPrivateKey
// ) {
//     /* Validate encryption public key. */
//     if (_.isObject(encryptionPublicKey) && typeof encryptionPublicKey.toString) {
//         encryptionPublicKey = encryptionPublicKey.toString()
//     }
//
//     /* Validate verification public key. */
//     if (_.isObject(verificationPublicKey) && typeof verificationPublicKey.toString) {
//         verificationPublicKey = verificationPublicKey.toString()
//     }
//
//     /* Initialize message. */
//     let message
//
//     /* Set message. */
//     message = PB.Signed.create({
//         packet: PB.Packet.create({
//             session: session,
//             number: playerNumber,
//             fromKey: PB.VerificationKey.create({
//                 key: verificationPublicKey
//             }),
//             phase: PB.Phase.values[phase.toUpperCase()],
//             message: PB.Message.create({
//                 address: PB.Address.create({
//                     address: changeAddress
//                 }),
//                 key: PB.VerificationKey.create({
//                     key: encryptionPublicKey
//                 })
//             })
//         })
//     })
//
//     /* Set message. */
//     const msg = PB.Packet.encode(message.packet).finish().toString('base64')
//
//     /* Set signature. */
//     const signature = new BetterMessage(msg, 'base64')
//         .sign(bch.PrivateKey(verificationPrivateKey))
//
//     /* Set message signature. */
//     message.signature = PB.Signature.create({ signature })
//
//     /* Return packed message. */
//     return packMessage(message)
// }

/**
 * Pack Message
 *
 * Encode (pack) a message into a prototype buffer (protobuf) object.
 */
function packMessage (oneOrMorePackets) {
    oneOrMorePackets = _.isArray(oneOrMorePackets) ? oneOrMorePackets : [oneOrMorePackets]

    /* Set packets. */
    const packets = PB.Packets.create({ packet: oneOrMorePackets })

    /* Set message buffer. */
    const messageBuffer = PB.Packets.encode(packets).finish()

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

/**
 * Check Packet Signature
 */
// function checkPacketSignature (oneSignedPacket) {
//     /* Initialize verification key. */
//     const verificationKey = oneSignedPacket.packet.fromKey.key
//
//     /* Set signature. */
//     const signature = oneSignedPacket.signature.signature.toString('base64')
//
//     /* Set packet. */
//     const packet = PB.Packet.encode(oneSignedPacket.packet)
//
//     /* Set public key. */
//     const pubkey = new bch.PublicKey(verificationKey)
//
//     /* Set address. */
//     const address = pubkey.toAddress().toString()
//
//     /* Set message. */
//     const message = packet.finish().toString('base64')
//
//     console.log('checkPacketSignature',
//         verificationKey,
//         signature,
//         packet,
//         pubkey,
//         address,
//         message
//     )
//
//     /* Initialize result. */
//     let result = false
//
//     try {
//         /* Set result. */
//         result = new BetterMessage(message, 'base64').verify(address, signature)
//     } catch (someError) {
//         console.log('Error checking signature:', someError)
//     }
//
//     /* Return result. */
//     return result
// }

/*
{
    reason: < enum string citing reason for blame accusation >,
    accused: < verification key in hex format of player who 's being accused >,
    invalid: < an array of protobuf packets that provide evidence of fault >,
    hash: < hash provided by accused which differs from our own >,
    keypair: {
        key: < private key >,
        public: < public key >
    }
}

Possible Ban Reasons:
    INSUFFICIENTFUNDS = 0
    DOUBLESPEND = 1
    EQUIVOCATIONFAILURE = 2
    SHUFFLEFAILURE = 3
    SHUFFLEANDEQUIVOCATIONFAILURE = 4
    INVALIDSIGNATURE = 5
    MISSINGOUTPUT = 6
    LIAR = 7
    INVALIDFORMAT = 8
*/

/**
 * Blame Message
 */
// function blameMessage (
//     options,
//     mySessionid,
//     myPlayerNumber,
//     myVerificationPublicKey,
//     myVerificationPrivateKey
// ) {
//     /* Validate verification public key. */
//     if (_.isObject(myVerificationPublicKey) && typeof myVerificationPublicKey.toString) {
//         myVerificationPublicKey = myVerificationPublicKey.toString()
//     }
//
//     /* Validate verification private key. */
//     if (_.isObject(myVerificationPrivateKey) && typeof myVerificationPrivateKey.toString) {
//         myVerificationPrivateKey = myVerificationPrivateKey.toString()
//     }
//
//     /* Set blame message. */
//     const blameMessage = _.reduce(_.keys(options), function (msg, oneOptionName) {
//         switch (oneOptionName) {
//         case 'reason':
//             msg.packet.message.blame.reason = PB.Reason.values[options.reason ? options.reason.toUpperCase() : 'NONE']
//             break
//         case 'accused':
//             msg.packet.message.blame.accused = PB.VerificationKey.create({
//                 key: options.accused
//             })
//             break
//         case 'invalid':
//             msg.packet.message.blame.invalue = PB.Invalid.create({ invalid: invalidPackets })
//             break
//         case 'hash':
//             msg.packet.message.hash = PB.Hash.create({ hash: options.hash })
//             break
//         case 'keypair':
//             msg.packet.message.blame.key = PB.DecryptionKey.create({
//                 key: options.keypair.key,
//                 public: options.keypair.public
//             })
//             break
//         // case '':
//         //   msg.packet.message.
//         // break
//         default:
//             break
//         }
//
//         /* Return message. */
//         return msg
//     }, PB.Signed.create({
//         packet: PB.Packet.create({
//             session: mySessionid,
//             number: myPlayerNumber,
//             fromKey: PB.VerificationKey.create({
//                 key: myVerificationPublicKey
//             }),
//             message: PB.Message.create({
//                 blame: PB.Blame.create({
//                 })
//             }),
//             phase: PB.Phase.values['BLAME']
//         })
//     }))
//
//     /* Set message. */
//     const msg = PB.Packet.encode(blameMessage.packet).finish().toString('base64')
//
//     /* Set blame message signature. */
//     blameMessage.signature = PB.Signature.create({
//         signature: new BetterMessage(msg, 'base64')
//             .sign(bch.PrivateKey(myVerificationPrivateKey))
//     })
//
//     console.log('Compiled blame message:', blameMessage)
//
//     /* Return packed message. */
//     return packMessage(blameMessage)
// }

/* Export module. */
module.exports = {
    PB,
    // broadcastSignatureAndUtxo,
    // broadcastEquivCheck,
    // broadcastFinalOutputAddresses,
    // forwardEncryptedOutputs,
    // messageToBuffers,
    // decodeAndClassify,
    // registration,
    // broadcastTransactionInput,
    // changeAddressAnnounce,
    packMessage,
    // blameMessage,
    // checkPacketSignature
}
