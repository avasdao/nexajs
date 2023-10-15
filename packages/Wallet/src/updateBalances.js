/* Import module. */
import fetch from 'cross-fetch'
import numeral from 'numeral'

/* Set (general) constants. */
const BALANCE_UPDATE_DELAY = 30000 // 30 seconds


/**
 * Update Balances
 *
 * Retrieve balances for ALL wallet assets, ie.
 *   - coins / satoshis
 *   - all tokens
 *
 * (Optionally) convert all asset values to fiat.
 */
export default async function (_fiat = 'USD') {
// console.log('UPDATE BALANCES (fiat):', _fiat)

    /* Initialize locals. */
    let coins
    let coinsTotal
    let fiat
    let fiatUSD
    let markets
    let price
    let response
    let satoshis
    let ticker
    // let token
    let tokenid
    let tokenList
    let tokens

    /* Validate markets. */
    if (!this.markets) {
        /* Initialize markets. */
        this._markets = {}
    }

    // console.log('ASSETS', this.assets)

    /* Requet NEXA ticker. */
    response = await fetch('https://nexa.exchange/ticker')
        .catch(err => console.error(err))

    /* Request JSON. */
    this._markets['NEXA'] = await response.json()
    // console.log('MARKETS', this._markets)

    /* Set (ticker) price. */
    price = Number(this._markets['NEXA'].quote.USD.price)
    // console.log('PRICE', price)

    /* Calculate total coins. */
    // console.log('COINS', this.coins)
    coinsTotal = this.coins.reduce(
        (_total, _coins) => (_total + _coins.satoshis), BigInt(0)
    )

    /* Build coins bundle. */
    coins = {
        amount: Number(coinsTotal) / 100.0,
        satoshis: coinsTotal,
    }

    /* Validate fiat value(s). */
    if (_fiat) {
        /* Set USD. */
        fiatUSD = Number(coinsTotal) / 100 // convert to amount
        fiatUSD = fiatUSD * price // calculate USD value
        fiatUSD = numeral(fiatUSD).format('0,0.00[000000]') // format value
        fiatUSD = parseFloat(fiatUSD) // conver to decimal

        /* Set fiat value. */
        coins.fiat = {
            'USD': fiatUSD,
        }
    }

    /* Initialize tokens bundle. */
    tokens = {}

    this.tokens.forEach(_token => {
        if (!tokens[_token.tokenidHex]) {
            /* Initialize token. */
            tokens[_token.tokenidHex] = {
                amount: BigInt(0),
                satoshis: BigInt(0),
            }
        }

        /* Add tokens to total. */
        tokens[_token.tokenidHex].amount += _token.tokens

        /* Add satoshis to total. */
        tokens[_token.tokenidHex].satoshis += _token.satoshis
    })

    if (_fiat) {
        tokenList = []
        /* Handle each token (fiat) conversion. */
        Object.keys(tokens).forEach(_tokenid => {
            tokenList.push(_tokenid)
        })
        // console.log('TOKEN LIST', tokenList)

        for (let i = 0; i < tokenList.length; i++) {
            tokenid = tokenList[i]

            tokens[tokenid].fiat = {}

            if (!tokens[tokenid].fiat['USD']) {
                response = await fetch(`https://nexa.exchange/v1/ticker/quote/${tokenid}`)
                    .catch(err => console.error(err))

                ticker = await response.json()
                // console.log('TICKER', ticker)

                tokens[tokenid].fiat['USD'] = ticker
            }
        }
    }

    /* Save balances. */
    this._balances = {
        coins,
        tokens,
    }
    // console.log('UPDATED BALANCES (coins):', this._balances.coins)
    // console.log('UPDATED BALANCES (tokens):', this._balances.tokens)

    /* Set a timeout (delay) for the next update. */
    // NOTE: Use an "arrow function" to resolve (this) issue.
    setTimeout(() => {
        /* Update balances. */
        this.updateBalances(_fiat)
    }, BALANCE_UPDATE_DELAY)

    /* Return balances. */
    return this._balances
}
