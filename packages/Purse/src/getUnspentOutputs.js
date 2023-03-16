/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:getUnspentOutputs')

/* Set API endpoints. */
const BCH_ENDPOINT = 'https://insomnia.fountainhead.cash/v1'
const NEXA_ENDPOINT = 'https://nexa.sh/v1'

/**
 * Get Unspent Outputs
 *
 * Returns an array of Unspent Transaction Outputs (UTXOs).
 *
 * @param {String} _address Address used to query for UTXOs.
 * @returns {Array} Returns a list of UTXOs.
 */
export default async (_address) => {
    let utxos

    /* Handle address formats. */
    if (_address.includes('bitcoincash:')) {
        utxos = await getBCHUnspentOutputs(_address)
    } else if (_address.includes('nexa:')) {
        utxos = await getNexaUnspentOutputs(_address)
    } else {
        throw new Error('Oops! That address format is NOT currently supported by NexaJS.')
    }

    /* Return UTXOs. */
    return utxos
}

const getBCHUnspentOutputs = async (_address) => {
    let body
    let target
    let response
    let utxos

    /* Set target. */
    target = `${BCH_ENDPOINT}/address/utxos/${_address}`

    /* Make API request. */
    response = await fetch(target, {
        /* Set (request) headers. */
        headers: {
            'Content-Type': 'application/json',
          }
    })
    .catch(err => {
        console.error(err)
        // TODO Handle error

        /* Set error. */
        // error = err
    })

    body = await response.json()
    // console.log('getUnspentOutputs (body):', body)

    utxos = body.utxos
    // console.log('getUnspentOutputs (utxos):', utxos)

    /* Return UTXOs. */
    return utxos
}

const getNexaUnspentOutputs = async () => {
    let outpointHash = 'd0c2e49c05d287c18b24f66bba000ec66751467b14318871a2d538bae83f621c'
    // outpointHash = outpointHash.match(/[a-fA-F0-9]{2}/g).reverse().join('')

    return [{
        outpointHash,
        txPos: 0,
        addressScript: '00511484ac0b79c2695ceb96aa88c6f5b7bedbd5e193f2', // P2PKT
        value: 133445,
        // address: 'nexa:nqtsq5g5afy0ggk2wp05n6w0760wy766m8s072tkx79t63xl',
    }]
}
