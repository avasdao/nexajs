

/**
 * Exponential Randomness
 *
 * TBD...
 */
const expRandom = (_lambda) =>
    -Math.log(1.0 - Math.random()) / _lambda

/**
 * Random Outputs For Tier
 *
 * Given a specific tier (scale), will provide a distribution
 * of outputs to total the intput value.
 */
export default (
    _inputAmount,
    _tierScale,
    _feeOffset,
    _maxOutputCount,
    allowExtraChange = false,
) => {
    /* Initialize (final) outputs. */
    const outputs = []
    const values = []

    const lambda = 1.0 / _tierScale
    // console.log('LAMBDA', lambda)

    /* Initialize remaining value. */
    let remaining = _inputAmount

    /* Handle all output possiblities. */
    for (let i = 0; i < _maxOutputCount + 1; i++) {
        const val = expRandom(lambda)
        // console.log('RANDOM VAL', val)

        remaining -= Math.ceil(val) + _feeOffset
        // console.log('REMAINING', remaining);

        if (remaining < 0) {
            break
        }

        /* Add new value. */
        values.push(val)
    }
    // console.log('VALUES', values)

    const desiredRandomSum = _inputAmount - values.length * _feeOffset
    // console.log('desiredRandomSum', desiredRandomSum);

    /* Validate desired random sum. */
    if (desiredRandomSum < 0) {
        throw new Error('The desired random sum CANNOT be below zero.')
    }

    // # Now we need to rescale and round the values so they fill up the desired.
    // # input amount exactly. We perform rounding in cumulative space so that the
    // # sum is exact, and the rounding is distributed fairly.
    let acc = 0
    const cumSum = values.map(_val => {
        acc += _val
        return acc
    })
    // console.log('CUMULATIVE SUM', cumSum, cumSum[cumSum.length - 1])

    const rescale = parseFloat(desiredRandomSum) / cumSum[cumSum.length - 1]
    // console.log('RESCALE', rescale)

    // const normCumSum = [round(rescale * v) for v in cumsum]
    const normCumSum = cumSum.map(_val => {
        return Math.round(_val * rescale)
    })
    // console.log('NORMALIZED CUMULATIVE SUM', normCumSum)

    /* Validate normalize cumulative sum. */
    if (normCumSum[normCumSum.length - 1] !== desiredRandomSum) {
        throw new Error('Normalized cumulative sum MUST equal the desired random sum.')
    }

    // acc = 0
    let lastVal = 0
    const differences = normCumSum.map(_val => {
        const diff = _val - lastVal
        lastVal = _val
        return diff
    })
    // console.log('DIFFERENCES', differences)

    // const finalOutputs = [(offset + d) for d in differences]
    const finalOutputs = differences.map(_val => {
        return _val + _feeOffset
    })
    // console.log('FINAL OUTPUTS', finalOutputs)

    const sumOutputs = finalOutputs.reduce(
        (acc, curVal) =>  acc + curVal, 0
    )
    // console.log('SUM OUTPUTS', sumOutputs)

    /* Validate desired random sum. */
    if (sumOutputs !== _inputAmount) {
        throw new Error('The generated outputs DO NOT total the expected amount.')
    }

    /* Return outputs. */
    return finalOutputs
}
