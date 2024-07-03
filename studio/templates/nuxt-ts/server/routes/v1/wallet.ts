export default defineEventHandler((event) => {
    /* Initialize locals. */
    let mnemonic
    let wallet

    /* Set project mnemonic. */
    mnemonic = process?.env?.PROJECT_MNEMONIC

    /* Build wallet. */
    wallet = {
        mnemonic,
    }

    /* Return wallet details. */
    return wallet
})
