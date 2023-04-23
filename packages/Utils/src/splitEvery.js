import range from './range.js'

/**
 * Split a string into an array of `chunkLength` strings. The final string may have a length between 1 and `chunkLength`.
 *
 * E.g.: `splitEvery('abcde', 2)` → `['ab', 'cd', 'e']`
 */
export default (input, chunkLength) =>
    range(Math.ceil(input.length / chunkLength))
        .map((index) => index * chunkLength)
        .map((begin) => input.slice(begin, begin + chunkLength))
