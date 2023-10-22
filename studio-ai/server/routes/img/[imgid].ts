/* Import modules. */
import {
    readFileSync,
    writeFile,
} from 'node:fs'

export default defineEventHandler(async (event) => {
    // console.log('EVENT (req):', event.node.req)

    /* Initialize locals. */
    let binData
    let img
    let imgid
    let proxyUrl
    let url

    /* Set (path) URL. */
    url = event.node.req?.url
    // console.log('URL', url)

    /* Validate URL. */
    if (url.length === 41 || url.length === 45) {
        /* Parse image id. */
        imgid = url?.slice(5)
    } else {
        return 'error'
    }

    img = await readFileSync(process.env.BIN_DIR + imgid)
        .catch(err => console.error(err))

    if (img) {
        /* Return image. */
        return event.node.res.end(img)
    } else {
        console.error('WE NEED TO CACHE THIS IMAGE')
    }

    /* Set proxy URL. */
    proxyUrl = process.env.AI_HOST + imgid
    // console.log('PROXY URL', proxyUrl)

    /* Request binary data. */
    binData = await $fetch(proxyUrl)
        .catch(err => console.error(err))
    // console.log('BIN DATA LEN', binData, typeof binData)

    /* Validate binary data. */
    if (binData?.id) {
        return binData
    }

    /* Convert to typed array. */
    img = new Uint8Array(await binData.arrayBuffer())

    if (!img) {
        return 'error'
    }

    /* Return image. */
    event.node.res.end(img)

    /* Write image to (local) cache. */
    writeFile(process.env.BIN_DIR + imgid, img, (err) => {
        if (err) throw err

        console.log(imgid, 'has been written to cache.')
    })
})
