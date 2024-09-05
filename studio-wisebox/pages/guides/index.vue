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
                Get started here with Guides designed to be simple and yet educational.
            </p>

            <section class="">
                <h3>
                    Select a Guide
                </h3>

                <h4>
                    Multi-Function
                </h4>

                <h4>
                    Introspection Emulation
                </h4>

                <div class="grid grid-cols-6 gap-8">
                    <div class="col-span-4 p-5 bg-amber-50 border-4 border-amber-300 rounded-xl shadow overflow-x-scroll">
                        <GuideTransferWithTimeout />
                    </div>

                    <div class="col-span-2 p-5 bg-gray-800 border-4 border-amber-400 rounded-xl shadow">
                        <p class="text-gray-200">
                            Click on a line to get detailed info.
                        </p>

                    </div>
                </div>

            </section>

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
