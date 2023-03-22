import zxcvbn from 'zxcvbn'

/**
 * Is Safe Password
 *
 * Uses `zxcvbn` to return a score of the strength for the entered password.
 */
export default (_val) => {
    return zxcvbn(_val)
}
