<script setup lang="ts">
/* Define properties. */
// https://vuejs.org/guide/components/props.html#props-declaration
const props = defineProps({
    data: {
        type: [Object],
    },
})

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
    <main class="flex flex-col gap-5">
        <p class="px-3 py-2 bg-yellow-100 text-base font-medium border-2 border-yellow-200 rounded-lg shadow-md">
            Welcome to your Studio wallet.
            Click the button below to create a new wallet and begin trading.
        </p>

        <div @click="Wallet.createWallet" class="cursor-pointer px-3 py-2 text-2xl text-blue-100 font-medium bg-blue-500 border-2 border-blue-700 rounded-lg shadow hover:bg-blue-400">
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
    </main>
</template>
