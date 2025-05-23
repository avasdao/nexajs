/* Import module. */
import numeral from 'numeral'

/* Set (general) constants. */
const BALANCE_UPDATE_DELAY = 30000 // 30 seconds
const FIAT_CALC_PRECISION = 9


/**
 * Satoshis To Fiat
 *
 * Will convert satoshis OR (token) amount into a formatted fiat value.
 */
const satsToFiat = (_satoshis, _rate, _decimals = 0, _precision = FIAT_CALC_PRECISION) => {
    let fiatUSD
    let rateBI

    // console.log('SATOSHIS', _satoshis);
    // console.log('RATE', _rate);
    // console.log('DECIMALS', _decimals);

    rateBI = BigInt(parseInt(_rate * (10 ** _precision) * (10 ** FIAT_CALC_PRECISION)))
    // console.log('RATE BigInt', rateBI)

    /* Set USD. */
    fiatUSD = (_satoshis * rateBI).toString() // calculate USD value
    // console.log('FIAT USD-1', fiatUSD)

    if (fiatUSD.length < (_decimals + _precision + FIAT_CALC_PRECISION)) {
        fiatUSD = fiatUSD.padStart((_decimals + _precision + FIAT_CALC_PRECISION), '0')
    }
    // console.log('FIAT USD-2', fiatUSD)

    let whole
    let fraction

    if (fiatUSD.length > (_decimals + _precision + FIAT_CALC_PRECISION)) {
        whole = fiatUSD.slice(0, (-1 * (_decimals + _precision + FIAT_CALC_PRECISION)))

        fraction = fiatUSD.slice(whole.length, 10)
    } else {
        whole = '0'

        fraction = fiatUSD.slice(0, 10)
    }

    /* Handle rounding. */
    // FIXME Preserve (prefix) padding.
    // if (fraction) {
    //     fraction = Number(fraction) / 10.0
    //     fraction = Math.round(fraction)
    //     fraction = fraction.toString()
    // }

    // console.log('FIAT USD-3', whole, fraction)
    fiatUSD = parseFloat(whole + '.' + fraction)
    // console.log('FIAT USD-4', fiatUSD)

    return fiatUSD
}

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
    let assetTotal
    let coinsTotal
    let fiat
    let fiatUSD
    let markets
    let price
    let rate
    let response
    let satoshis
    let ticker
    let tokenid
    let tokenList

    /* Validate markets. */
    if (!this.markets) {
        /* Initialize markets. */
        this._markets = {}
    }

    // console.log('ASSETS', this.assets)

    /* Requet NEXA ticker. */
    response = await fetch('https://telr.exchange/v1/ticker/quote/NEXA')
        .catch(err => console.error(err))

    /* Validate response. */
    if (!response || typeof response === 'undefined') {
        throw new Error(`There is NO market data available at this time.`)
    }

    /* Request JSON. */
    this._markets['NEXA'] = await response
        .json()
        .catch(err => console.error(err))
    // console.log('MARKETS', this._markets)

    /* Validate NEXA market. */
    if (!this._markets['NEXA']?.quote || !this._markets['NEXA'].quote[_fiat]?.price) {
        return console.error('There is NO $NEXA data available at this time.')
    }

    /* Set (ticker) price. */
    price = Number(this._markets['NEXA'].quote[_fiat].price)
    // console.log('PRICE', price)

    /* Validate price. */
    if (!price) {
        throw new Error(`There is NO price data available at this time.`)
    }

    /* Calculate total coins. */
    // console.log('COINS', this.coins)
    coinsTotal = this.coins.reduce(
        (_total, _coins) => (_total + _coins.satoshis), BigInt(0)
    )

    /* Validate native asset. */
    if (this._assets['0']) {
        /* Set amount. */
        this._assets['0'].amount = Number(coinsTotal) / 100.0

        /* Set satoshis. */
        this._assets['0'].satoshis = coinsTotal
    }

    /* Validate fiat value(s). */
    if (this._assets['0'] && _fiat) {
        /* Set USD. */
        fiatUSD = Number(coinsTotal) / 100 // convert to amount
        fiatUSD = fiatUSD * price // calculate USD value
        fiatUSD = numeral(fiatUSD).format('0,0.00[000000]') // format value
        fiatUSD = parseFloat(fiatUSD) // conver to decimal

        /* Set fiat value. */
        this._assets['0'].fiat = {
            'USD': fiatUSD,
        }
    }

    /* Emit (asset) changes to subscribers. */
    this.emit('balances', this.assets)

    /* Initialize tokens list. */
    // tokens = {}
    tokenList = []

    this.tokens.forEach(_token => {
        /* Set token id. */
        tokenid = _token.tokenidHex

        /* Validate (token) asset. */
        if (this._assets[tokenid]) {
            /* Initialize token. */
            this._assets[tokenid].amount = BigInt(0)
            this._assets[tokenid].satoshis = BigInt(0)

            /* Validate token ID. */
            if (!tokenList.includes(tokenid)) {
                /* Add to token list. */
                tokenList.push(tokenid)
            }
        }
    })

    this.tokens.forEach(_token => {
        /* Set token id. */
        tokenid = _token.tokenidHex

        /* Validate (token) asset. */
        if (this._assets[tokenid]) {
            /* Add tokens to total. */
            this._assets[tokenid].amount += _token.tokens

            /* Add satoshis to total. */
            this._assets[tokenid].satoshis += _token.satoshis
        }
    })
    // console.log('TOKEN LIST', tokenList)

    /* Emit (asset) changes to subscribers. */
    this.emit('balances', this.assets)

    if (_fiat) {
        /* Handle token list. */
        for (let i = 0; i < tokenList.length; i++) {
            /* Reset handlers. */
            assetTotal = null
            rate = null
            response = null

            /* Set token id. */
            tokenid = tokenList[i]

            /* Validate fiat handler. */
            if (!this._assets[tokenid].fiat || typeof this._assets[tokenid].fiat === 'undefined') {
                /* Initialize fiat handler. */
                this._assets[tokenid].fiat = {}
            }

            /* Validate fiat (CURRENCY) handler. */
            if (!this._assets[tokenid].fiat[_fiat] || typeof this._assets[tokenid].fiat[_fiat] === 'undefined') {
                /* Initialize fiat handler. */
                this._assets[tokenid].fiat[_fiat] = {}
            }

            try {
                /* Request (ticker) quote. */
                response = await fetch(`https://telr.exchange/v1/ticker/quote/${tokenid}`)
                    .catch(err => console.error(err))
                // console.log('RESPONSE (ticker)', response)
            } catch (err) {
                console.error(err)
            }

            /* Validate response. */
            if (!response || typeof response === 'undefined') {
                continue
            }

            /* Set markets. */
            this._markets[tokenid] = await response
                .json()
                .catch(err => console.error(err))
            // console.log('TICKER', this._markets[tokenid])

            /* Validate (token) markets. */
            if (
                !this._markets[tokenid] ||
                typeof this._markets[tokenid] === 'undefined'
            ) {
                continue
            }

            if (this._markets[tokenid]?.quote && this._markets[tokenid].quote[_fiat]?.price) {
                /* Set rate (ie. price). */
                rate = this._markets[tokenid].quote[_fiat].price
            }
            // console.log('RATE', rate)

            /* Validate rate. */
            if (!rate || typeof rate === 'undefined') {
                continue
            }

            /* Set asset total. */
            assetTotal = this._assets[tokenid].amount
            // console.log('ASSET TOTAL', assetTotal)

            /* Validate asset total. */
            if (!assetTotal || typeof assetTotal === 'undefined') {
                continue
            }

            /* Set market (to asset). */
            this._assets[tokenid].fiat[_fiat] = satsToFiat(
                assetTotal,
                rate,
                this._assets[tokenid].decimal_places,
            )

            /* Emit (asset) changes to subscribers. */
            // NOTE: This is emitted after EACH asset.
            this.emit('balances', this.assets)
        }
    }

    /* Set a timeout (delay) for the next update. */
    // NOTE: Use an "arrow function" to resolve (this) issue.
    setTimeout(() => {
        /* Update balances. */
        this.updateBalances(_fiat)
    }, BALANCE_UPDATE_DELAY)

    /* Return success. */
    return true
}
