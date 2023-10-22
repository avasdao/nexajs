/* Import modules. */
import {
    readFileSync,
    writeFile,
} from 'node:fs'

export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let binData
    let img
    let imgid
    let proxyUrl
    let url

    /* Set (path) URL. */
    url = event.node.req?.url

    /* Validate URL. */
    if (url.length === 41 || url.length === 45) {
        /* Parse image id. */
        imgid = url?.slice(5)
    } else {
        return 'error'
    }

    /* Validate (binary) image URL. */
    if (imgid.length === 40) {
        try {
            img = await readFileSync(process.env.BIN_DIR + imgid)
                .catch(err => console.error(err))

            console.log('IMG', img)
        } catch (err) {
            console.error(err)
        }
    }

    if (img) {
        /* Return image. */
        return event.node.res.end(img)
    }

    /* Set proxy URL. */
    proxyUrl = process.env.AI_HOST + imgid

    /* Request binary data. */
    binData = await $fetch(proxyUrl)
        .catch(err => console.error(err))

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

    try {
        /* Write image to (local) cache. */
        writeFile(process.env.BIN_DIR + imgid, img, (err) => {
            if (err) throw err

            console.log(imgid, 'has been written to cache.')
        })
    } catch (err) {
        console.error(err)
    }
})
