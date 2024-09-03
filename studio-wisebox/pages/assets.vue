<script setup lang="ts">
useHead({
    title: `Assets — Wisebox`,
    meta: [
        { name: 'description', content: `Wisebox is the Ultimate Playground for UTXO Script developers to design, test and deploy their smart contracts.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

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
        <h1 class="text-5xl font-medium">
            Assets
        </h1>

        <div>
            <h4 class="font-bold">
                PLEASE NOTE:
            </h4>

            <p>
                Your Wisebox assets are 100% independent from your <NuxtLink to="https://nexa.studio/wallet" target="_blank" class="text-blue-500 font-medium hover:underline">Studio Wallet</NuxtLink> assets.
            </p>
        </div>
    </main>
</template>
