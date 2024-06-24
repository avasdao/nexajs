/* Import modules. */
import { getAddressUnspent } from '@nexajs/rostrum'
import { getAddressTokenUnspent } from '@nexajs/rostrum'

/* Set API endpoints. */
const BCH_ENDPOINT = 'https://insomnia.fountainhead.cash/v1'
const NEXA_ENDPOINT = 'https://nexa.sh/v1'

/**
 * List Unspent Outputs
 *
 * Returns an array of Unspent Transaction Outputs (UTXOs).
 *
 * @param {String} _address Address used to query for UTXOs.
 * @returns {Array} Returns a list of UTXOs.
 */
export default async (_address) => {
    let utxos

    /* Handle address formats. */
    if (_address.includes('nexa')) {
        utxos = await listNexaUnspent(_address)
    } else if (_address.includes('bitcoincash')) { // TODO: Confirm "test" and "reg" formats.
        utxos = await listBCHUnspent(_address)
    } else {
        throw new Error('Oops! That address format is NOT currently supported by NEXA.js.')
    }

    /* Return UTXOs. */
    return utxos
}

const listBCHUnspent = async (_address) => {
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

    body = await response
        .json()
        .catch(err => console.error(err))
    // console.log('getUnspentOutputs (body):', body)

    utxos = body.utxos
    // console.log('getUnspentOutputs (utxos):', utxos)

    /* Return UTXOs. */
    return utxos
}

const getUtxos = (_address) => {

}

const listNexaUnspent = async (_address) => {
    /* Initialize locals. */
    let token
    let unspentCoins
    let unspentTokens

    /* Request unspent coins. */
    unspentCoins = await getAddressUnspent(_address)

    /* Request unspent tokens. */
    unspentTokens = (await getAddressTokenUnspent(_address)).unspent

    /* Aggregate asset lists. */
    return unspentCoins.map(_unspent => {
        /* Search for token info. */
        token = unspentTokens.find(_token => {
            return _token.outpoint_hash === _unspent.outpoint_hash
        })

        /* Validate token. */
        if (token) {
            return {
                height: _unspent.height,
                outpoint: _unspent.outpoint_hash,
                txid: _unspent.tx_hash,
                pos: _unspent.tx_pos,
                amount: parseFloat(_unspent.value / 100.0),
                satoshis: BigInt(_unspent.value),
                tokenid: token.group,
                tokenidHex: token.token_id_hex,
                tokens: BigInt(token.token_amount),
                hasToken: true,
            }
        } else {
            return {
                height: _unspent.height,
                outpoint: _unspent.outpoint_hash,
                txid: _unspent.tx_hash,
                pos: _unspent.tx_pos,
                amount: parseFloat(_unspent.value / 100.0),
                satoshis: BigInt(_unspent.value),
                hasToken: false,
            }
        }
    })
}
