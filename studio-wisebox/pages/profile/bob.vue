<script setup lang="ts">
useHead({
    title: `Bob — Wisebox`,
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
            Bob
        </h1>

        <p>
            Introduces an active wallet with on-chain transaction activity.
        </p>

        <p>
            Introduces a NEW non-fungible token (NFTs) with on-chain activity.
        </p>
    </main>
</template>
