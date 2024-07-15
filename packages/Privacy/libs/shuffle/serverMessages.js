/* Import modules. */
import _ from 'lodash'
import path from 'path'

/* Import core modules. */
// const _ = require('lodash')
// const bch = require('bitcore-lib-cash')
// const path = require('path')
// const protobuf = require('protobufjs')

/* Import local modules. */
import handleMessageBuffer from './handleMessageBuffer.js'
import messageToBuffers from './messageToBuffers.js'

const BetterMessage = require('./BetterMessage.js')

/* Initialize magic (bytes). */
const magic = Buffer.from('42bcc32669467873', 'hex')

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
// NOTE: Problem loading from local file, so copied to web root. See issue:
//       https://github.com/protobufjs/protobuf.js/issues/1023#issuecomment-629165262
// TODO: Translate `.proto` to `.json` and use JSON load.
let PB = {}
let protoFile = null
if (typeof window !== 'undefined') {
    protoFile = 'shuffle.proto'
} else {
    protoFile = path.join(__dirname, 'shuffle.proto')
}
protobuf.load(protoFile, (err, root) => {
    if (err) return console.error(err) // eslint-disable-line no-console

    /* Set root. */
    PB.root = root

    /* Loop through ALL protobuf types. */
    for (let oneTypeName of pbTypes) {
        PB[oneTypeName] = PB.root.lookupType(oneTypeName)
    }

    /* Loop through ALL protobuf classes. */
    for (let oneClassName of pbEnums) {
        PB[oneClassName] = PB.root.lookupEnum(oneClassName)
    }

})





/**
 * Decode and Classify
 *
 * TODO: Clean this up so it better handles multi-packet messages.
 */
function decodeAndClassify (messageBuffer) {
    return new Promise(function (resolve, reject) {
        /* Validate and parse message data. */
        /* eslint-disable-next-line no-undef */
        if (messageBuffer && messageBuffer.data && messageBuffer.data instanceof Blob) {
            /* Initialize file reader. */
            const reader = new FileReader() // eslint-disable-line no-undef

            /* Handle onload. */
            reader.onload = () => {
                /* Handle message buffer. */
                resolve(handleMessageBuffer(Buffer.from(reader.result)))
            }

            /* Handle onerror. */
            reader.onerror = reject

            /* Read data as buffer. */
            reader.readAsArrayBuffer(messageBuffer.data)
        } else {
            /* Handle message buffer. */
            resolve(handleMessageBuffer(messageBuffer))
        }
    })
}

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
function broadcastTransactionInput (
    inputsObject,
    session,
    playerNumber,
    verificationPublicKey
) {
    /* Validate verification key. */
    if (_.isObject(verificationPublicKey) && typeof verificationPublicKey.toString) {
        verificationPublicKey = verificationPublicKey.toString()
    }

    /* Initialize message. */
    let message

    /* Set message. */
    message = PB.Signed.create({
        packet: PB.Packet.create({
            fromKey: PB.VerificationKey.create({
                key: verificationPublicKey
            }),
            message: PB.Message.create({
                inputs: {}
            }),
            session: session,
            number: playerNumber
        })
    })

    /* Loop through ALL input objects. */
    for (let key in inputsObject) {
        message.packet.message.inputs[key] = PB.Coins.create({
            coins: inputsObject[key]
        })
    }

    /* Return packed message. */
    return packMessage(message)
}

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
function forwardEncryptedOutputs (
    session,
    fromPlayerNumber,
    arrayOfOutputs,
    phase,
    toVerificationKey,
    myVerificationPubKey,
    myVerificationPrivKey
) {
    /* Validate verification public key. */
    if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
        myVerificationPubKey = myVerificationPubKey.toString()
    }

    /* Validate (to) verification key. */
    if (_.isObject(toVerificationKey) && typeof toVerificationKey.toString) {
        toVerificationKey = toVerificationKey.toString()
    }

    // TODO: Make these server messages consistent with
    //       respect to param validation and type checking.

    /* Initialize signed messages. */
    const signedMessages = []

    /* Loop through ALL outputs. */
    for (let oneEncryptedAddress of arrayOfOutputs) {
        /* Set message. */
        const message = PB.Signed.create({
            packet: PB.Packet.create({
                session: session,
                number: fromPlayerNumber,
                fromKey: PB.VerificationKey.create({
                    key: myVerificationPubKey
                }),
                toKey: PB.VerificationKey.create({
                    key: toVerificationKey
                }),
                phase: PB.Phase.values[phase.toUpperCase()],
                message: PB.Message.create({
                    str: oneEncryptedAddress
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
function broadcastSignatureAndUtxo (
    session,
    fromPlayerNumber,
    coinUtxoData,
    signatureString,
    phase,
    myVerificationPubKey,
    myVerificationPrivKey
) {
    /* Validate verification public key. */
    if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
        myVerificationPubKey = myVerificationPubKey.toString()
    }

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
                signatures: []
            })
        })
    })

    /* Add packet message signatures. */
    message.packet.message.signatures.push(PB.Signature.create({
        utxo: coinUtxoData,
        signature: PB.Signature.create({
            signature: signatureString
        })
    }))

    /* Set message. */
    const msg = Buffer.from(PB.Packet.encode(message.packet).finish())
        .toString('base64')

    /* Set signature. */
    const signature = new BetterMessage(msg, 'base64')
        .sign(bch.PrivateKey(myVerificationPrivKey))

    /* Set message signature. */
    message.signature = PB.Signature.create({ signature })

    /* Return packed message. */
    return packMessage(message)
}

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
function broadcastEquivCheck (
    session,
    fromPlayerNumber,
    equivCheckHash,
    phase,
    myVerificationPubKey,
    myVerificationPrivKey
) {
    /* Validate verification public key. */
    if (_.isObject(myVerificationPubKey) && typeof myVerificationPubKey.toString) {
        myVerificationPubKey = myVerificationPubKey.toString()
    }

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
                hash: PB.Hash.create({
                    hash: equivCheckHash
                })
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

    /* Return packed message. */
    return packMessage(message)
}




/* Export module. */
module.exports = {
    PB,
    broadcastSignatureAndUtxo,
    broadcastEquivCheck,
    broadcastFinalOutputAddresses,
    forwardEncryptedOutputs,
    // messageToBuffers,
    decodeAndClassify,
    registration,
    broadcastTransactionInput,
    changeAddressAnnounce,
    packMessage,
    // blameMessage,
    checkPacketSignature
}
