<script setup lang="ts">
useHead({
    title: `Logger — Nexa Studio`,
    meta: [
        { name: 'description', content: `A robust logging engine.` }
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
    <main class="max-w-5xl mx-auto py-5 flex flex-col gap-4">
        <h1 class="text-5xl font-medium">
            Logger
        </h1>

        <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id eius voluptatem minus natus at eveniet dolorum eos mollitia, maxime animi excepturi harum omnis illum odit recusandae pariatur! Unde, explicabo molestias.
        </p>

        <p>
            Launch the Logger Studio:
            <NuxtLink to="https://logger.nexa.studio" class="block text-2xl font-bold text-blue hover:underline">
                https://logger.nexa.studio
            </NuxtLink>
        </p>
    </main>

    <Footer />
</template>
