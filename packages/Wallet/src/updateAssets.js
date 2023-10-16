/* Import modules. */
import {
    // encodeAddress,
    listUnspent,
} from '@nexajs/address'

import {
    getTokenInfo,
    subscribeAddress,
} from '@nexajs/rostrum'


/**
 * Update Assets (Coins & Tokens)
 *
 * Will retrieve real-time asset info and save the details locally.
 */
export default async function (_subscribe = false, _fiat = 'USD') {
    /* Initialize locals. */
    let info
    let response
    let token
    let unspent
    let url

    /* Subscribe to (receiving) addresses. */
    if (_subscribe === true) {
        /* Subscribe to address. */
        await subscribeAddress(this.address, async () => {
            /* Update (latest) assets. */
            await this.updateAssets(false, _fiat)

            /* Emit assets to subscribers. */
            this.emit('onUpdate', this.assets)
        })
    }

    /* Validate assets. */
    if (!this.assets) {
        this._assets = {}
    }

    /* Validate (native) NEXA asset. */
    if (!this.assets['0']) {
        /* Add (native) NEXA asset. */
        this._assets['0'] = {
            group: '0',
            name: `Nexa`,
            ticker: 'NEXA',
            token_id_hex: '0x',
            decimal_places: 2,
            document_hash: null,
            document_url: null,

            markets: {
                'USD': {
                    price: 0.0000,
                    marketCap: 0.00
                },
            },

            iconUrl: 'https://bafkreigyp7nduweqhoszakklsmw6tbafrnti2yr447i6ary5mrwjel7cju.nexa.garden', // nexa.svg
            summary: `A digital economy with capacity for all.`,
            description: `Nexa is the most scalable Layer-1 blockchain ever built. It will handle over 10 billion transactions per day while offering EVM-like smart-contracts & native token services, all while staying decentralized.`,
        }
    }

    // Fetch all unspent transaction outputs for the temporary in-browser wallet.
    unspent = await listUnspent(this.address)
        .catch(err => console.error(err))
    // console.log('\nUNSPENT', unspent)

    /* Validate unspent outputs. */
    if (unspent.length === 0) {
        return console.error('There are NO unspent outputs available.')
    }

    /* Retrieve coins. */
    this._coins = unspent
        .filter(_u => _u.hasToken === false)
        .map(_unspent => {
            const outpoint = _unspent.outpoint
            const satoshis = _unspent.satoshis

            return {
                outpoint,
                satoshis,
                wif: this.wif,
            }
        })
    // console.log('\nCOINS', this.coins)

    /* Retrieve tokens. */
    this._tokens = unspent
        .filter(_u => _u.hasToken === true)
        .map(_unspent => {
            const outpoint = _unspent.outpoint
            const satoshis = _unspent.satoshis
            const tokenid = _unspent.tokenid
            const tokenidHex = _unspent.tokenidHex
            const tokens = _unspent.tokens

            return {
                outpoint,
                satoshis,
                tokenid,
                tokenidHex,
                tokens,
                wif: this.wif,
            }
        })
    // console.log('\nTOKENS', this.tokens)

    /* Handle tokens. */
    for (let i = 0; i < this.tokens.length; i++) {
        /* Set token. */
        token = this.tokens[i]
        // console.log('TOKEN', token)

        /* Validate asset (exists in handler). */
        if (!this._assets[token.tokenidHex]) {

            /* Request token info. */
            info = await getTokenInfo(token.tokenidHex)
            // console.log('TOKEN INFO', info)

            /* Initialize (native) NEXA asset. */
            this._assets[token.tokenidHex] = {
                group: info.group,
                name: info.name,
                ticker: info.ticker,
                token_id_hex: info.token_id_hex,
                decimal_places: info.decimal_places,
                document_hash: info.document_hash,
                document_url: info.document_url,

                /* Request from Exchange API. */
                // https://nexa.exchange/v1/ticker/quote/<token-id>
                markets: {
                    'USD': {
                        price: 0.0000,
                        marketCap: 0.00
                    },
                },
            }

            if (info.document_url) {
                /* Set URL. */
                url = info.document_url

                /* Request token description document (TDD). */
                response = await fetch(url)
                    .catch(err => console.error(err))
                // console.log('RESPONSE', response)

                /* Request JSON. */
                info = await response.json()
                // console.log('INFO', info)

                /* Validate (TDD) info. */
                if (!info || !info.length === 2) {
                    continue
                }

                /* Set icon URL (from TDD). */
                // TODO: Validate FULL URL.
                if (info[0].icon.includes('http')) {
                    this._assets[token.tokenidHex].iconUrl = info[0].icon
                } else {
                    url = url.slice(0, url.lastIndexOf('/')) + info[0].icon

                    // TODO Validate URL using library.

                    this._assets[token.tokenidHex].iconUrl = url
                }

                /* Set summary (from TDD). */
                this._assets[token.tokenidHex].summary = info[0].summary

                /* Set description (from TDD). */
                this._assets[token.tokenidHex].description = info[0].description
            }

        } // validate asset
    } // handle tokens

    /* Completed successfully. */
    return true
}
