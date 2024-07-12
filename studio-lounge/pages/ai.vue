<script setup lang="ts">
useHead({
    title: `AI Generator — Wisebox`,
    meta: [
        { name: 'description', content: `Wisebox makes building your next BIG idea effortless.` }
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
            AI Generator
        </h1>

        <p>
            Find the perfect backdrop for your NFT masterpiece.
        </p>

        <ol class="pl-10 list-decimal">
            <li>https://backgrounds.com</li>
        </ol>
    </main>
</template>
