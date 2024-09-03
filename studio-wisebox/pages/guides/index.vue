<script setup lang="ts">
useHead({
    title: `Guides — Wisebox`,
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
            Guides
        </h1>

        <p>
            A collection of Scripts ready to drop-in to your own smart contracts.
        </p>

        <section>
            <h2>
                Beginner
            </h2>

            <p>
                Get started here...
            </p>
        </section>

        <section>
            <h2>
                Advanced
            </h2>

            <p>
                These Scripts require a basic understanding of stacks and OPs.
            </p>
        </section>

        <section>
            <h2>
                Expert
            </h2>

            <p>
                For the elite scripters.
            </p>
        </section>

    </main>
</template>
