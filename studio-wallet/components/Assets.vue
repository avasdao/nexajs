<script setup>
/* Import modules. */
import numeral from 'numeral'

/* Initialize stores. */
import { useWalletStore } from '@/stores/wallet'
import { useSystemStore } from '@/stores/system'
const Wallet = useWalletStore()
const System = useSystemStore()

const activeTab = ref(null)

watch(() => Wallet._assets, (_assets) => {
    console.log('(LOCAL) ASSETS', _assets)
})

const assets = computed(() => {
    if (!Wallet.assets) {
        return []
    }

    /* Initialize filtered list. */
    const filtered = []

    /* Handle assets. */
    Object.keys(Wallet.assets).map(_assetid => {
        if (_assetid === '0' || _assetid.length === 64) {
            const asset = { ...Wallet.assets[_assetid] }
            asset.id = _assetid
            filtered.push(asset)
        }
    })

    /* Return filtered. */
    return filtered
})

const collection = computed(() => {
    if (!Wallet.assets) {
        return []
    }

    /* Initialize filtered list. */
    const filtered = []

    /* Handle assets. */
    Object.keys(Wallet.assets).map(_assetid => {
        if (_assetid.length === 128) {
            const asset = { ...Wallet.assets[_assetid] }
            asset.id = _assetid
            filtered.push(asset)
        }
    })

    /* Return filtered. */
    return filtered
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
    if (!Wallet.assets || !Wallet.assets[_tokenid]?.name) {
        return 'Unknown Asset'
    }

    return Wallet.assets[_tokenid].name
}

const displayDecimalAmount = (_token) => {
    // console.log('_token', _token)
    let decimalValue
    let bigIntValue

    if (_token.group === '0') {
        decimalValue = _token.satoshis * BigInt(1e4)
    } else {
        decimalValue = _token.amount * BigInt(1e4)
    }

    if (_token.decimal_places > 0) {
        bigIntValue = decimalValue / BigInt(10**_token.decimal_places)
    } else {
        bigIntValue = decimalValue
    }

    return numeral(parseFloat(bigIntValue) / 1e4).format('0,0[.]00[0000]')
}

const displayDecimalAmountUsd = (_token) => {
    // console.log('_token', _token)
    let amount

    /* Set amount. */
    amount = _token.fiat?.USD || 0.00

    /* Handle amount. */
    if (amount >= 10.0) {
        return numeral(amount).format('$0,0.00')
    } else {
        return numeral(amount).format('$0,0.00[0000]')
    }
}

const displayIcon = (_token) => {
    if (!_token.iconUrl || _token.iconUrl === '') {
        return null
    }

    return _token.iconUrl
}


const init = () => {
    // console.log('ASSETS', Wallet.assets)

    activeTab.value = 'assets'
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
                <button @click="activeTab = 'assets'" class="w-1/2 text-indigo-600 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium" aria-current="page" :class="[ activeTab === 'assets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700']">
                    <span class="text-lg">
                        Assets
                    </span>

                    <span class="bg-indigo-100 text-indigo-600 ml-1 sm:ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium">
                        {{Wallet.assets ? Object.keys(Wallet.assets).length : 0}}
                    </span>
                </button>

                <!-- Current: "", Default: "" -->
                <button @click="activeTab = 'collection'" class="w-1/2 text-gray-500 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium" :class="[ activeTab === 'collection' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700']">
                    <span class="text-lg">
                        Collection
                    </span>

                    <!-- Current: "bg-indigo-100 text-indigo-600", Default: "bg-gray-100 text-gray-900" -->
                    <span class="bg-gray-100 text-gray-900 ml-1 sm:ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium">
                        0
                    </span>
                </button>
            </nav>
        </div>

        <div v-if="activeTab === 'assets'" class="flex flex-col gap-5">
            <div
                v-for="token in assets" :key="token.id"
                @click="Wallet.wallet.setAsset(token.id)"
                class="flex flex-row justify-between items-end pl-1 pr-3 pt-2 pb-1 sm:py-3 bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-300 rounded-lg shadow hover:bg-amber-200 cursor-pointer"
            >
                <div class="flex flex-row items-start">
                    <img :src="displayIcon(token)" class="-mt-0.5 mr-1 h-12 w-auto p-2 opacity-80" />

                    <div class="flex flex-col">
                        <h3 class="text-base text-amber-800 font-medium uppercase truncate">
                            {{displayTokenName(token.id)}}
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
        </div>

        <div v-else class="flex flex-col gap-5">
            <div
                v-for="token in collection" :key="token.id"
                @click="Wallet.wallet.setAsset(token.id)"
                class="flex flex-row justify-between items-end pl-1 pr-3 pt-2 pb-1 sm:py-3 bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-300 rounded-lg shadow hover:bg-amber-200 cursor-pointer"
            >
                <div class="flex flex-row items-start">
                    <img :src="displayIcon(token)" class="-mt-0.5 mr-1 h-12 w-auto p-2 opacity-80" />

                    <div class="flex flex-col">
                        <h3 class="text-base text-amber-800 font-medium uppercase truncate">
                            {{displayTokenName(token.id)}}
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
        </div>

    </main>
</template>
