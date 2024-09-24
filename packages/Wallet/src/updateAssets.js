/* Import modules. */
import { listUnspent } from '@nexajs/address'

/* Set (REST) API endpoints. */
const INSOMNIA_ENDPOINT = 'https://insomnia.fountainhead.cash/v1'
const ROSTRUM_ENDPOINT = 'https://nexa.sh/v1/rostrum'

/* Set constants. */
const ROSTRUM_METHOD = 'POST'

/* Initialize globals. */
let body
let response

const headers = new Headers()
headers.append('Content-Type', 'application/json')

const getTokenInfo = async (_tokenid) => {
    body = JSON.stringify({
        request: 'token.genesis.info',
        params: _tokenid,
    })

    response = await fetch(ROSTRUM_ENDPOINT, {
        method: ROSTRUM_METHOD,
        headers,
        body,
    }).catch(err => console.error(err))
    response = await response.json()
    // console.log('RESPONSE', response)

    return response

}

/**
 * Update Assets (Coins & Tokens)
 *
 * Will retrieve real-time asset info and save the details locally.
 */
export default async function (_subscribe = false, _fiat = 'USD') {
    /* Initialize locals. */
    let details
    let info
    let response
    let signature
    let token
    let unspent
    let url

    /* Subscribe to (receiving) addresses. */
    if (_subscribe === true) {
        // FIXME This is has been DISABLED after Rostrum refactoring.
        /* Subscribe to address. */
        // await subscribeAddress(this.address, async () => {
        //     /* Update (latest) assets. */
        //     await this.updateAssets(false, _fiat)
        // })
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

            iconUrl: 'https://cdn.nexa.studio/img/nexa.svg',
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
        console.info('There are NO unspent outputs available.')
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
                // https://telr.exchange/v1/ticker/quote/<token-id>
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

                try {
                    /* Request token description document (TDD). */
                    response = await fetch(url)
                        .catch(err => console.error(err))
                    // console.log('RESPONSE', response)

                    if (response) {
                        /* Request JSON. */
                        details = await response
                            .json()
                            .catch(err => console.error(err))
                        // console.log('INFO', info)
                    }
                } catch (err) {
                    console.error(err)
                }

                /* Validate (TDD) info. */
                if (
                    !details ||
                    typeof details === 'undefined' ||
                    !details.length === 2
                ) {
                    continue
                }

                /* Set signature.*/
                signature = details[1]

                /* (Re-)set details. */
                details = details[0]

                /* Validate details. */
                if (!details) {
                    continue
                }

                // TODO Validate details using signature.

                /* Set icon URL (from TDD). */
                // TODO: Validate FULL URL.
                if (details?.icon.includes('http')) {
                    this._assets[token.tokenidHex].iconUrl = details?.icon
                } else {
                    url = url.slice(0, url.lastIndexOf('/')) + details?.icon

                    // TODO Validate URL using library.

                    this._assets[token.tokenidHex].iconUrl = url
                }

                /* Set summary (from TDD). */
                this._assets[token.tokenidHex].summary = details?.summary

                /* Set description (from TDD). */
                this._assets[token.tokenidHex].description = details?.description
            }

        } // validate asset
    } // handle tokens

    /* Emit (asset) changes to subscribers. */
    this.emit('assets', this.assets)
    // console.log('ASSETS UPDATE', this.assets)

    /* Completed successfully. */
    return true
}
