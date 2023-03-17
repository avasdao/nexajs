/* Import modules. */
import { getAddressUnspent } from '@nexajs/rostrum'

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

const getUtxos = (_address) => {

}

const getNexaUnspentOutputs = async (_address) => {
    let resolve
    let reject

    const unspents = await getAddressUnspent(_address)

    return unspents.map(_unspent => {
        return {
            outpointHash: _unspent.outpoint_hash.match(/[a-fA-F0-9]{2}/g).reverse().join(''),
            value: _unspent.value,
        }
    })
}
