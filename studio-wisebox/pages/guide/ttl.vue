<script setup lang="ts">
useHead({
    title: `Time-To-Live — Wisebox`,
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
            Time-To-Live
        </h1>

        <p>
            Being a responsible Script writer means setting your contracts to expire and allow them to be purged by the system.
        </p>
    </main>
</template>
