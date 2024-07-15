/**
 * Verify Transaction Signature
 */
export default (
    shuffleTxInstance,
    inputSigData,
    publicKeyHexOfSigner,
) => {
    // console.log('Verify transaction signature',
    //     'shuffleTxInstance', shuffleTxInstance,
    //     'inputSigData', inputSigData,
    //     'publicKeyHexOfSigner', publicKeyHexOfSigner
    // )

    /* Set input to sign. */
    const inputToSign = _.reduce(
        shuffleTxInstance.inputs, function (keeper, oneInput, arrayIndex) {
            // If we already found the right input, pass it through
            // without bothering to check the others;
            if (keeper) {
                return keeper
            }

            const asJson = oneInput.toObject()

            if (inputSigData.prevTxId === asJson.prevTxId && Number(inputSigData.vout) === Number(asJson.outputIndex)) {
                return {
                    input: oneInput,
                    inputIndex: arrayIndex
                }
            } else {
                return undefined
            }
        }, undefined)
    // console.log('Input to sign:', inputToSign)

    /* Validate input to sign. */
    if (!inputToSign) {
        return false
    }

    /* Set signer public key. */
    const signerPublicKey = bch.PublicKey(publicKeyHexOfSigner)

    /* Set signature instance. */
    const signatureInstance = bch.crypto.Signature
        .fromTxFormat(Buffer.from(inputSigData.signature, 'hex'))
    // console.log('Signature instance:', signatureInstance)

    /* Set signature object. */
    const signatureObject = {
        signature: signatureInstance,
        publicKey: signerPublicKey,
        inputIndex: inputToSign.inputIndex,
        sigtype: signatureInstance.nhashtype
    }
    // console.log('Signature object:', signatureObject)

    /* Initialize verification results. */
    let verificationResults = false

    try {
        verificationResults = inputToSign.input
            .isValidSignature(shuffleTxInstance, signatureObject)
    } catch (nope) {
        console.error(nope) // eslint-disable-line no-console
        verificationResults = false
    }
    // console.log('Verification results:', verificationResults)

    /* Validate verification results. */
    if (verificationResults) {
        return {
            success: true,
            inputIndex: signatureObject.inputIndex,
            signature: signatureObject
        }
    } else {
        return {
            success: false
        }
    }
}
