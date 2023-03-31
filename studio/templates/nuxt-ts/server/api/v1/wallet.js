export default defineEventHandler((event) => {
    /* Initialize runtime configuration. */
    const config = useRuntimeConfig()

    /* Set project mnemonic. */
    const mnemonic = config.mnemonic

    /* Build wallet. */
    const wallet = {
        mnemonic,
    }

    /* Return wallet details. */
    return wallet
})
