export default defineEventHandler((event) => {
    /* Set project mnemonic. */
    const mnemonic = process.env.PROJECT_MNEMONIC

    /* Build wallet. */
    const wallet = {
        mnemonic,
    }

    /* Return wallet details. */
    return wallet
})
