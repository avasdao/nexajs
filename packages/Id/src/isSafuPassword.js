import zxcvbn from 'zxcvbn'

/**
 * Is Safe Password
 *
 * Uses `zxcvbn` to return a score of the strength for the entered password.
 */
export default (_password) => {
    /* Query zxcvbn library. */
    const result = zxcvbn(_password)

    /* Build package. */
    const pkg = {
        /* (User-provided) Password */
        password: result.password,

        /* Estimated Guesses */
        guesses: result.guesses,

        /* Seconds to Crack */
        seconds: result.crack_times_seconds?.offline_fast_hashing_1e10_per_second,

        /* UI Display */
        display: result.crack_times_display?.offline_fast_hashing_1e10_per_second,

        /* Score */
        score: result.score,

        /* Suggestions */
        suggestions: result.feedback?.suggestions,

        /* Warnings */
        warning: result.feedback?.warning,

        /* Raw Zxcvbn Source. */
        _zxcvbn: result,
    }

    /* Return package. */
    return pkg
}
