const _downloadURL = (data, fileName) => {
    let a

    a = document.createElement('a')
    a.href = data
    a.download = fileName

    document.body.appendChild(a)

    a.style = 'display: none'
    a.click()
    a.remove()
}

export default (data, fileName, mimeType) => {
    let blob
    let url

    blob = new Blob([data], {
        type: mimeType
    })

    url = window.URL.createObjectURL(blob)

    _downloadURL(url, fileName)

    setTimeout(() => {
        return window.URL.revokeObjectURL(url)
    }, 1000)
}
