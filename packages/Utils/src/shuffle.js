/**
 * Shuffle
 *
 * The de-facto unbiased shuffle algorithm is the
 * Fisher-Yates (aka Knuth) Shuffle.
 * (see: https://github.com/coolaj86/knuth-shuffle)
 */
export default (_array) => {
    /* Initialize locals. */
    let currentIndex = _array.length
    let temporaryValue
    let randomIndex

    /* While there remain elements to shuffle... */
    while (0 !== currentIndex) {
        /* Pick a remaining element... */
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        /* And swap it with the current element. */
        temporaryValue = _array[currentIndex]
        _array[currentIndex] = _array[randomIndex]
        _array[randomIndex] = temporaryValue
    }

    /* Return (shuffled) array. */
    return _array
}
