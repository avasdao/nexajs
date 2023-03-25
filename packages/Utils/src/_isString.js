/**
 * Is String
 */
const isString = (_str) => {
    /* Validate string. */
    if (_str && typeof _str.valueOf() === 'string') {
        /* Return true. */
        return true
    }

    /* Return false. */
    return false
}

/* Export module. */
module.exports = isString
