/**
 * JSON Stringify
 *
 * Supports BigInt values.
 */
export default (_data) => {
    let data

    data = JSON.stringify(_data, (key, value) =>
        typeof value === 'bigint' ? value.toString() + 'n' : value
    )

    if (!_transform) {
        data = JSON.parse(data)
    }

    return data
}
