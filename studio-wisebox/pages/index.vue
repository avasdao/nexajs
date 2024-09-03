<script setup lang="ts">
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
    <section class="block grid grid-cols-5 gap-6">
        <div class="col-span-3">
            <h1 class="text-fuchsia-800 text-6xl lg:text-7xl font-light italic">
                Wisebox
            </h1>

            <h3 class="text-fuchsia-600 text-xl lg:text-2xl font-medium tracking-tight">
                The Swiss Army Knife of Smart Contracts
            </h3>

            <p class="mt-2 lg:mt-5 text-sm lg:text-base">
                Wisebox is the Ultimate Playground for UTXO Script developers to design, test and deploy their smart contracts.
                Deliver unparalleled digital experiences for real world enterprises.
            </p>
        </div>

        <MyLibrary />
    </section>

    <section class="my-5 flex flex-row gap-4">
        <div class="flex-1 h-96">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                My Contracts
            </h2>

            <div class="h-full bg-rose-100 border border-rose-300 rounded-xl shadow">
                <!-- preview windows -->
            </div>
        </div>

        <div class="mt-5 w-48 h-96">
            <Thumbnails />
        </div>

        <div class="w-[350px]">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                My Recent Activity
            </h2>

            <div class="w-full h-96 bg-gray-50 border border-gray-300 rounded-xl shadow" />
        </div>
    </section>

    <section class="my-5 py-5 flex flex-row gap-4">
        <div class="flex-1 h-96">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Transaction Builder
            </h2>

            <div class="h-full bg-fuchsia-100 border border-fuchsia-300 rounded-xl shadow">
                <!-- preview windows -->
            </div>
        </div>

    </section>

</template>
