/**
 * Get Indices
 */
const getIndices = (state) => {
    /* Validate state. */
    if (!state || !state.indices) {
        return null
    }

    /* Initialize indices. */
    const indices = state.indices

    /* Return indices. */
    return indices
}

/* Export module. */
export default getIndices
