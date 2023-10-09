<script setup>
import numeral from 'numeral'

/* Initialize stores. */
import { useWalletStore } from '@/stores/wallet'
import { useSystemStore } from '@/stores/system'
const Wallet = useWalletStore()
const System = useSystemStore()

const tokens = ref([])

const loadAssets = async () => {
    tokens.value = await Wallet.groupTokens()
        .catch(err => console.error(err))
    // console.log('MY TOKENS (grouped):', tokens.value)
}

watch(() => Wallet.tokens, (_tokens) => {
    // console.log('TOKENS CHANGED (assets):', _tokens)
    loadAssets()
})

const coinAmount = computed(() => {
    if (!Wallet.coins) {
        return '0.00'
    }

    let total

    total = Wallet.coins.reduce(
        (totalSatoshis, coin) => (totalSatoshis + coin.satoshis), BigInt(0)
    )

    return numeral(parseFloat(total) / 100.0).format('0,0.00[00000000]')
})

const coinAmountUsd = computed(() => {
    if (!Wallet.coins) {
        return '0.00'
    }

    let satoshis
    let mex
    let mexUsd

    satoshis = Wallet.coins.reduce(
        (totalSatoshis, coin) => (totalSatoshis + coin.satoshis), BigInt(0)
    )

    /* Calculate (NEX) total. */
    mex = (parseInt(satoshis) / 1e8)

    mexUsd = mex * System.usd

    if (mexUsd >= 10.0) {
        /* Return formatted value. */
        return numeral(mexUsd).format('$0,0.00')
    } else {
        /* Return formatted value. */
        return numeral(mexUsd).format('$0,0.00[00]')
    }
})

const displayTokenName = (_tokenid) => {
    if (!Wallet.assets[_tokenid]?.name) {
        return 'Unknown Asset'
    }

    return Wallet.assets[_tokenid].name
}

const displayDecimalAmount = (_token) => {
    let decimalValue
    let bigIntValue

    decimalValue = _token.tokens * BigInt(1e4)

    if (_token.decimals > 0) {
        bigIntValue = decimalValue / BigInt(10**_token.decimals)
    } else {
        bigIntValue = decimalValue
    }

    return numeral(parseFloat(bigIntValue) / 1e4).format('0,0.[00000000]')
}

const displayDecimalAmountUsd = (_token) => {
    let decimalValue
    let bigIntValue
    let price
    let amount

    decimalValue = _token.tokens * BigInt(1e4)

    if (_token.decimals > 0) {
        bigIntValue = decimalValue / BigInt(10**_token.decimals)
    } else {
        bigIntValue = decimalValue
    }

    price = _token.ticker?.price || 0.00

    amount = (parseFloat(bigIntValue) / 1e4) * price

    if (amount >= 10.0) {
        return numeral(amount).format('$0,0.00')
    } else {
        return numeral(amount).format('$0,0.00[00]')
    }
}

const displayIcon = (_token) => {
    if (!_token.iconUrl || _token.iconUrl === '') {
        return null
    }

    return _token.iconUrl
}


const init = () => {
    // console.log('ASSETS (coins):', Wallet.coins)
    // console.log('ASSETS (tokens):', Wallet.tokens)
    loadAssets()
}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<template>
    <main class="flex flex-col gap-5">
        <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 text-center" aria-label="Tabs">
                <a href="javascript://" class="w-1/2 border-indigo-500 text-indigo-600 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium" aria-current="page">
                    Assets

                    <span class="bg-indigo-100 text-indigo-600 ml-1 sm:ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium">
                        {{tokens ? Object.keys(tokens).length + 1 : 1}}
                    </span>
                </a>

                <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700" -->
                <a href="javascript://" class="w-1/2 border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                    Collectibles

                    <!-- Current: "bg-indigo-100 text-indigo-600", Default: "bg-gray-100 text-gray-900" -->
                    <span class="bg-gray-100 text-gray-900 ml-1 sm:ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium">
                        0
                    </span>
                </a>
            </nav>
        </div>

        <!-- <h2 class="text-2xl font-medium">
            Assets
        </h2> -->

        <div
            @click="Wallet.selectAsset(null)"
            class="flex flex-row justify-between items-end pl-1 pr-3 pt-2 pb-1 sm:py-3 bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-300 rounded-lg shadow hover:bg-amber-200 cursor-pointer"
        >
            <div class="flex flex-row items-start">
                <img src="~/assets/nexa.svg" class="-mt-1 mr-1 h-12 w-auto opacity-80" />

                <div class="flex flex-col">
                    <h3 class="text-base text-amber-800 font-medium uppercase truncate">
                        Nexa
                    </h3>

                    <h3 class="sm:hidden text-lg font-medium text-amber-600">
                        {{coinAmount}}
                    </h3>
                    <h3 class="hidden sm:flex text-xl font-medium text-amber-600">
                        {{coinAmount}}
                    </h3>
                </div>
            </div>

            <h3 class="flex flex-col items-end font-medium text-amber-700">
                <sup class="text-xs">
                    USD
                </sup>

                <span class="-mt-3 sm:hidden text-2xl">
                    {{coinAmountUsd}}
                </span>
                <span class="-mt-3 hidden sm:flex text-3xl">
                    {{coinAmountUsd}}
                </span>
            </h3>
        </div>

        <div
            v-for="(token, tokenid) in tokens" :key="tokenid"
            @click="Wallet.selectAsset(tokenid)"
            class="flex flex-row justify-between items-end pl-1 pr-3 pt-2 pb-1 sm:py-3 bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-300 rounded-lg shadow hover:bg-amber-200 cursor-pointer"
        >
            <div class="flex flex-row items-start">
                <img :src="displayIcon(token)" class="-mt-0.5 mr-1 h-12 w-auto p-2 opacity-80" />

                <div class="flex flex-col">
                    <h3 class="text-base text-amber-800 font-medium uppercase truncate">
                        {{displayTokenName(tokenid)}}
                    </h3>

                    <span class="sm:hidden text-lg font-medium text-amber-600">
                        {{displayDecimalAmount(token)}}
                    </span>
                    <span class="hidden sm:flex text-xl font-medium text-amber-600">
                        {{displayDecimalAmount(token)}}
                    </span>
                </div>
            </div>

            <h3 class="flex flex-col items-end font-medium text-amber-700">
                <sup class="text-xs">
                    USD
                </sup>

                <span class="-mt-3 sm:hidden text-2xl">
                    {{displayDecimalAmountUsd(token)}}
                </span>
                <span class="-mt-3 hidden sm:flex text-3xl">
                    {{displayDecimalAmountUsd(token)}}
                </span>
            </h3>
        </div>

    </main>
</template>
