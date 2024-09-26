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

        <div class="px-5 py-10 flex flex-col gap-8">
            <h2 class="text-sky-400 text-3xl italic font-light tracking-tighter">
                A NEW Personas Lounge is coming soon...
            </h2>

            <img src="https://personas.cash/icon.png" class="h-32 w-32" />
        </div>

    </main>
</template>
