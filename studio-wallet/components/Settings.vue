<script setup>
import moment from 'moment'

/* Initialize stores. */
import { useProfileStore } from '@/stores/profile'
import { useSystemStore } from '@/stores/system'
import { useWalletStore } from '@/stores/wallet'
const Profile = useProfileStore()
const System = useSystemStore()
const Wallet = useWalletStore()

const isShowingSaveGamesOptions = ref(false)
const isShowingMnemonic = ref(false)

const currency = ref(null)


const wordList = computed(() => {
    if (!Wallet.wallet.mnemonic) {
        return null
    }

    const list = Wallet.wallet.mnemonic.split(' ')

    return list
})


const setNEXA = () => {
    if (currency.value !== 'NEXA') {
        currency.value = 'NEXA'

        // amount.value = ((amount.value / props.usd) * 1000000).toFixed(2)
    }
}

const setUSD = () => {
    if (currency.value !== 'USD') {
        currency.value = 'USD'

        // amount.value = ((amount.value * props.usd) / 1000000).toFixed(2)
    }
}

/**
 * Destroy Wallet
 */
 const destroyWallet = () => {
    if (window.confirm(`Are you really sure you want to destroy your wallet?`)) {
        Wallet.destroy()
    }
}

/* Set (default) currency. */
currency.value = 'USD'

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })

</script>

<template>
    <main class="flex flex-col gap-4">

        <section class="pr-1 sm:px-3 flex items-center justify-between gap-4">
            <span class="flex flex-grow flex-col">
                <span class="text-sm font-medium leading-6 text-gray-900" id="availability-label">
                    ENABLE password protection
                </span>

                <span class="text-xs sm:text-sm text-gray-500" id="availability-description">
                    Activate a strong password that will be required before performing ALL sensitive activities.
                </span>
            </span>

            <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
            <button type="button" class="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" role="switch" aria-checked="false" aria-labelledby="availability-label" aria-describedby="availability-description">
                <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
                <span aria-hidden="true" class="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 duration-200 ease-in-out"></span>
            </button>
        </section>

        <section class="pr-1 sm:px-3 flex items-center justify-between gap-4">
            <span class="flex flex-grow flex-col">
                <span class="text-sm font-medium leading-6 text-gray-900" id="availability-label">
                    ENABLE address privacy
                </span>

                <span class="text-xs sm:text-sm text-gray-500" id="availability-description">
                    Auto-select the next <em>(unused)</em> wallet address, to be used for change, before every transaction.
                </span>
            </span>

            <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
            <button type="button" class="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" role="switch" aria-checked="false" aria-labelledby="availability-label" aria-describedby="availability-description">
                <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
                <span aria-hidden="true" class="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 duration-200 ease-in-out"></span>
            </button>
        </section>

        <section class="pr-1 sm:px-3 flex items-center justify-between gap-4">
            <span class="flex flex-grow flex-col">
                <span class="text-sm font-medium leading-6 text-gray-900" id="availability-label">
                    ENABLE transaction privacy
                </span>

                <span class="text-xs sm:text-sm text-gray-500" id="availability-description">
                    Automatically send &amp; manage <em>"un-mixed"</em> coins to Nexa's decentralized CoinJoin pools.
                </span>
            </span>

            <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
            <button type="button" class="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" role="switch" aria-checked="false" aria-labelledby="availability-label" aria-describedby="availability-description">
                <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
                <span aria-hidden="true" class="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 duration-200 ease-in-out"></span>
            </button>
        </section>

        <div class="mx-5 my-5 border-t border-gray-300" />

        <section v-if="Wallet.address" class="mb-5 px-3 py-2 bg-red-300 border border-red-500 rounded-lg shadow">
            <h2 class="text-2xl text-red-900 font-bold">
                Danger Zone
            </h2>

            <div class="mt-3 rounded-md bg-amber-50 p-4 border border-red-500">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="w-6 h-auto text-red-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"></path>
                        </svg>
                    </div>

                    <div class="ml-3">
                        <h3 class="text-lg font-medium text-red-700">
                            Mnemonic Seed Phrase
                        </h3>
                    </div>
                </div>

                <div class="mt-2 text-sm text-amber-700">
                    <div v-if="isShowingMnemonic">
                        <div class="grid grid-cols-2 gap-3">
                            <h3 v-for="(word, index) of wordList" :key="word" class="text-xl font-medium">
                                {{(index + 1).toString().padStart(2, '0')}}: {{word}}
                            </h3>
                        </div>

                        <p class="mt-2 text-sm text-gray-500 font-medium">
                            Backup the words shown above to a safe place in order to recovery your Wallet.
                        </p>
                    </div>

                    <SkeletonMnemonic v-else />
                </div>

                <div class="mt-4">
                    <div class="-mx-2 -my-1.5 flex">
                        <button v-if="isShowingMnemonic" @click="isShowingMnemonic = false" type="button" class="ml-3 rounded-md bg-amber-50 px-2 py-1.5 text-base font-medium text-red-600 border border-red-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-50">
                            Hide Secret
                        </button>

                        <button v-else @click="isShowingMnemonic = true" type="button" class="rounded-md bg-amber-50 px-2 py-1.5 text-base font-medium text-red-600 border border-red-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-50">
                            Show Secret
                        </button>
                    </div>
                </div>
            </div>

            <div class="my-8 border-t border-red-400" />

            <div>
                <div @click="destroyWallet" class="w-full px-3 py-1 bg-red-500 border border-red-700 text-center text-2xl text-red-100 font-medium rounded-lg cursor-pointer hover:bg-red-600">
                    Destroy Wallet
                </div>

                <p class="px-3 py-2 text-sm text-center font-bold">
                    BE CAREFUL!
                    THIS CANNOT BE UNDONE.
                    YOU'RE WALLET WILL BE PERMANENTLY ERASED!
                </p>
            </div>
        </section>

    </main>
</template>
