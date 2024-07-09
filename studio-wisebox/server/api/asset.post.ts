/* Import modules. */
import formidable from 'formidable'
import fs from 'fs'
// import { createHelia } from 'helia'
// import { unixfs } from '@helia/unixfs'
// import { FsBlockstore } from 'blockstore-fs'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { sha256 } from '@nexajs/crypto'

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
// const rainmakerProfilesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/rainmaker_profiles`)
// const rainmakerTxsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/rainmaker_txs`)

/* Initialize (global) Helia. */
// let helia

// console.log('process.env.HELIA_DIR', process.env.HELIA_DIR)
// const blockstore = new FsBlockstore(process.env.HELIA_DIR)
// console.log('blockstore', blockstore)

// const heliaOptions = {
//     libp2p: createLibp2p({
//         // ..other settings
//         peerDiscovery: [
//             bootstrap({
//                 list: [
//                     '/dnsaddr/bootstrap.io/p2p/QmBootstrap1',
//                     '/dnsaddr/bootstrap.io/p2p/QmBootstrap2'
//                     // etc
//                 ]
//             })
//         ]
//     })
// }

const init = async () => {
    // helia = await createHelia({
    //     // blockstore,
    // })
    // console.log('helia', helia)

    // await helia.stop()
}

const cleanup = async () => {
    // await helia.stop()
}

const getPin = async (_cid) => {
    // const fs = unixfs(helia)
    // // console.log('FS', fs);

    // const decoder = new TextDecoder()
    // let text = ''

    // for await (const chunk of fs.cat(_cid)) {
    //     text += decoder.decode(chunk, {
    //         stream: true
    //     })
    // }

    // console.log('Added file contents:', text)

    // return text
}

const doPin = async (_data) => {
    // console.log('DATA', _data)

    /* Initialize locals. */
    let cid
    let commandToRun
    let data
    let filename
    let outputPath
    // let outputResponse
    let pipePath
    let timeout
    let timeoutStart
    let wstream

    /* Validate (filename) data. */
    if (_data?.newFilename) {
        filename = _data?.newFilename
    }

    /* Validate filename. */
    if (!filename) {
        throw new Error('Oops! No filename provided.')
    }

    pipePath = '/gateway/pipe'
    outputPath = '/gateway/output'
    commandToRun = `docker exec ipfs_host ipfs add -Q --cid-version 1 /export/${filename}`

    console.log('delete previous output')
    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath)
    }

    console.log('commandToRun', commandToRun)
    wstream = fs.createWriteStream(pipePath)
    wstream.write(commandToRun)
    wstream.close()

    return new Promise((resolve, reject) => {
        console.log('waiting for output...') //there are better ways to do that than setInterval

        timeout = 10000 //stop waiting after 10 seconds (something might be wrong)

        timeoutStart = Date.now()

        const myLoop = setInterval(() => {
console.log('looping...')
            if (Date.now() - timeoutStart > timeout) {
                clearInterval(myLoop)

                console.error('timed out')

                reject('timed out')
            } else {
                //if output.txt exists, read it
                if (fs.existsSync(outputPath)) {

                    cid = fs.readFileSync(outputPath).toString().trim()
                    console.log('CID', cid.length, cid)

                    /* Validate CID. */
                    // TODO Perform a "proper" validation.
                    if (cid.length > 50) {
                        clearInterval(myLoop)

                        if (fs.existsSync(outputPath)) {
                            fs.unlinkSync(outputPath) //delete the output file
                        }

                        /* Resolve CID. */
                        resolve(cid)
                    }
                }
            }
        }, 100)
    })

    // const fs = unixfs(helia)
    // // console.log('FS', fs);

    // const directoryCid = await fs.addDirectory()
    // console.log('DIR', directoryCid)

    // // we will use this TextEncoder to turn strings into Uint8Arrays
    // const encoder = new TextEncoder()
    // const bytes = encoder.encode('Hello World 201')

    // // add the bytes to your node and receive a unique content identifier
    // const cid = await fs.addBytes(bytes)
    // console.log('Added file:', cid.toString())

    // const updatedCid = await fs.cp(cid, directoryCid, 'foo.txt')
    // console.info(updatedCid)

    // return cid
}

init()


export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let address
    let body
    let campaign
    let campaignid
    let data
    let fields
    let files
    let form
    let options
    let profiles
    let receivers
    let response
    let txidem
    let assetPkg

    options = {
        uploadDir: process.env.IPFS_STAGING,
        maxFieldsSize: 1 * 1024 * 1024,         //   1 MiB
        maxFileSize: 100 * 1024 * 1024,         // 100 MiB
        maxTotalFileSize: 1024 * 1024 * 1024,   //   1 GiB
        multiples: true,
    }
    console.log('FORMIDABLE OPTIONS', options)

    /* Initialize Formidable library. */
    form = formidable(options)

    response = await form.parse(event.node.req)
        .catch(err => {
            console.error(err)

            if (err?.code === 1016) {
                return `Oops! You've exceeded the maximum file size (100 MiB).`
            }
        })
    console.log('RESPONSE', response)

    if (!response?.length) {
        return null
    }

    data = response[1]?.data[0]

    let result = await doPin(data)
        .catch(err => console.error(err))
    console.log('PIN RESULT', result)

    response.push(result)

    // result = await getPin(result)
    //     .catch(err => console.error(err))
    // console.log('GET PIN RESULT', result)

    return response

    campaign = body.campaign
    campaignid = campaign.id

    receivers = body.receivers

    txidem = body.txidem

    profiles = receivers.map(_receiver => {
        let profileid

        profileid = sha256(`${campaignid}:${_receiver.address}`)

        return profileid
    })

    for (let i = 0; i < profiles.length; i++) {
        const profileid = profiles[i]

        const profile = await rainmakerProfilesDb
            .get(profileid)
            .catch(err => console.error(err))
        // console.log('PROFILE-1', profile)

        /* Validate profile. */
        if (profile) {
            profile.txs.push(txidem)
            profile.updatedAt = moment().unix()
            // console.log('PROFILE-2', profile)

            response = await rainmakerProfilesDb
                .put(profile)
                .catch(err => console.error(err))
            // console.log('UPDATE PROFILE', response)
        }
    }

    txPkg = {
        _id: txidem,
        campaignid,
        profiles,
        createdAt: moment().unix(),
    }
    // console.log('TX PKG', txPkg)

    response = await rainmakerTxsDb
        .put(txPkg)
        .catch(err => console.error(err))
    // console.log('RESPONSE', response)

    return txidem
})
