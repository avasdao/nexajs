<script setup lang="ts">
/* Initialize stores. */
import { useWalletStore } from '@/stores/wallet'
const Wallet = useWalletStore()

const mnemonic = ref(null)

const createWallet = () => {
    // NOTE: This confirmation is NOT REQUIRED for single-application
    //       wallet integration(s), and can be SAFELY removed.
    if (confirm('Before you continue, please close ALL other Studio browser windows. Failure to do so may result in LOSS OF ASSETS!\n\nWould you like to continue creating a new wallet?')) {
        /* Create a new wallet. */
        Wallet.createWallet()
    }
}

const importWallet = () => {
    // NOTE: This confirmation is NOT REQUIRED for single-application
    //       wallet integration(s), and can be SAFELY removed.
    if (confirm('Before you continue, please close ALL other Studio browser windows. Failure to do so may result in LOSS OF ASSETS!\n\nWould you like to continue importing an existing wallet?')) {
        /* Set/save mnemonic. */
        // NOTE: Will save `entropy` to the local storage.
        Wallet.setMnemonic(mnemonic.value)
    }
}

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
    <section class="flex flex-col gap-5">
        <p class="px-3 py-2 bg-yellow-100 text-base font-medium border-2 border-yellow-200 rounded-lg shadow-md">
            Welcome to your Studio wallet.
            Click the button below to create a new wallet and begin trading.
        </p>

        <div @click="createWallet" class="cursor-pointer px-3 py-2 text-2xl text-blue-100 font-medium bg-blue-500 border-2 border-blue-700 rounded-lg shadow hover:bg-blue-400">
            Create New Wallet
        </div>

        <hr />

        <p class="px-3 py-2 bg-yellow-100 text-base font-medium border-2 border-yellow-200 rounded-lg shadow-md">
            Import your existing wallet into Studio.
        </p>

        <textarea
            placeholder="Seed #1 Seed #2 Seed #3 ..."
            v-model="mnemonic"
            class="px-3 py-2 border-2 border-amber-500 rounded-lg shadow"
        />

        <div @click="importWallet" class="cursor-pointer px-3 py-2 text-2xl text-blue-100 font-medium bg-blue-500 border-2 border-blue-700 rounded-lg shadow hover:bg-blue-400">
            Import Existing Wallet
        </div>
    </section>
</template>
