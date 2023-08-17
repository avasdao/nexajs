const downloadURL = (data, fileName) => {
    var a
    a = document.createElement('a')
    a.href = data
    a.download = fileName
    document.body.appendChild(a)
    a.style = 'display: none'
    a.click()
    a.remove()
}

export default (data, fileName, mimeType) => {
    // NOTE: We ONLY run this on the (web) client.
    if (process.client) {
        let blob, url
        blob = new Blob([data], {
            type: mimeType
        })
        url = window.URL.createObjectURL(blob);
        this.downloadURL(url, fileName);
        setTimeout(() => {
            return window.URL.revokeObjectURL(url)
        }, 1000)
    } else {
        throw new Error(`Oops! Server download is not currently supported.`)
    }
}
