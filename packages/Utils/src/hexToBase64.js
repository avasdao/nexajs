export default (_hex) => {
    return btoa(_hex.match(/\w{2}/g).map((a) => {
        return String.fromCharCode(parseInt(a, 16))
    }).join(''))
}
