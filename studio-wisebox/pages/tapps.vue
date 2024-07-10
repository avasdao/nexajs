<script setup lang="ts">
useHead({
    title: `Token Apps (tApps) — Wisebox`,
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
    <section class="grid lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 flex flex-col gap-4">
            <h1 class="text-5xl font-medium">
                Token Apps (tApps)
            </h1>

            <p>
                Create fun and interactive applications for your collectors.
                Token Applications are a great way to add engagement to your collection and additional value for your collectors.
            </p>

            <p class="text-sm text-gray-700 italic">
                <strong>NOTE:</strong>
                Embedded tApps DO NOT connect to ANY external resources, as per specification.
                <NuxtLink to="https://spec.nexa.org/nexa/nft" target="_blank" class="block text-blue-500 hover:text-blue-400">
                    https://spec.nexa.org/nexa/nft
                </NuxtLink>
            </p>

            <h2 class="text-2xl font-medium text-gray-700">
                FOSS Community Games
            </h2>

            <ol class="pl-10 list-decimal">
                <li>
                    Ask Satoshi
                </li>

                <li>
                    Battle Chess (Bulls vs Bears)
                </li>

                <li>
                    Lambo Moon
                </li>
            </ol>

            <h2 class="text-2xl font-medium text-gray-700">
                NEXA.games

                <span class="text-base italic text-gray-500">
                    Real-money Wagering
                </span>
            </h2>

            <ol class="pl-10 list-decimal">
                <li>
                    <NuxtLink to="https://wallydice.com" target="_blank" class="text-blue-500 font-medium hover:text-blue-400">
                        Wally Dice
                    </NuxtLink>
                </li>

                <li>
                    Nakamoto Tower
                </li>
            </ol>
        </div>

        <div class="h-64 sm:h-96 lg:col-span-2 px-3 py-2 bg-sky-100 border border-sky-300 rounded-lg shadow">

            <div class="h-full flex items-center justify-center">
                <h2 class="text-2xl sm:text-3xl font-light italic text-sky-500">
                    SHOWCASE VIDEO REEL
                </h2>
            </div>

        </div>
    </section>
</template>
