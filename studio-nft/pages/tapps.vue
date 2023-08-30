<script setup lang="ts">
useHead({
    title: `Token Apps (tApps) — NFT/SFT Studio`,
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
            Token Apps (tApps)
        </h1>

        <p>
            Create fun and interactive applications for your collectors.
        </p>

        <p class="text-sm text-gray-700 italic">
            <strong>NOTE:</strong>
            tApps DO NOT connect to any external resources, as per specification.
            <NuxtLink to="https://spec.nexa.org/nexa/nft" target="_blank" class="block text-blue-500 font-medium hover:text-blue-400">
                https://spec.nexa.org/nexa/nft
            </NuxtLink>
        </p>

        <ol class="pl-10 list-decimal">
            <li>Magic 8-Ball for Degens</li>
        </ol>
    </main>
</template>
