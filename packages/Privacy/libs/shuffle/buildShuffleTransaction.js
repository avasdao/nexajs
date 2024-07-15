/**
 * Build Shuffle Transaction
 *
 * NOTE: FOR DEVELOPMENT PURPOSE ONLY
 *       ----------------------------
 *       An intermediary function, used to switch between the different
 *       transaction building methods currently being evaluated.
 */
export default async (options) => {
    // console.log('Build shuffle transaction (options):', options)
    /* Initialize ins and outs. */
    let insAndOuts

    try {
        // insAndOuts = await this.prepareShuffleInsAndOuts({
        insAndOuts = await prepareShuffleInsAndOuts({
            players: options.players,
            feeSatoshis: options.feeSatoshis
        })
    } catch (nope) {
        console.error('cannot prepare inputs and outputs for shuffle Transaction') // eslint-disable-line no-console
        throw nope
    }
    console.log('Build shuffle transaction (insAndOuts):', insAndOuts)

    /* Set shuffle transaction data. */
    // const shuffleTxData = await this.getShuffleTxAndSignature({
    const shuffleTxData = await getShuffleTxAndSignature({
        inputs: insAndOuts.inputs,
        outputs: insAndOuts.outputs
    })
    console.log('Build shuffle transaction (shuffleTxData):', shuffleTxData)

    /* Return the results. */
    return {
        tx: shuffleTxData.tx,
        inputs: insAndOuts.inputs,
        outputs: insAndOuts.outputs,
        serialized: shuffleTxData.serialized,
        signatureBase64: Buffer
            .from(shuffleTxData.signature, 'utf-8')
            .toString('base64')
    }
}
