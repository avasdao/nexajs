<script setup lang="ts">
useHead({
    title: `Characters — NFT/SFT Studio`,
    meta: [
        { name: 'description', content: `Nexa Studio makes building your next BIG idea effortless.` }
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
            Characters
        </h1>

        <p>
            Find the perfect character for your NFT masterpiece.
        </p>

        <ol class="pl-10 list-decimal">
            <li>https://characters.com</li>
        </ol>
    </main>
</template>
