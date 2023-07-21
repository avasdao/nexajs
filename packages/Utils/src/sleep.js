/**
 * Sleep
 *
 * Delay execution for the specified number of milliseconds.
 */
export default function (_milliseconds) {
    return new Promise(r => setTimeout(r, _milliseconds))
}
