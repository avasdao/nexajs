<script setup lang="ts">
useHead({
    title: `Buy $STUDIO Time — Nexa Studio`,
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
    <main class="max-w-5xl mx-auto py-5">
        <h1 class="text-5xl font-medium">
            Buy $STUDIO Time
        </h1>

        <section class="mt-5 flex flex-col gap-5">
            <p>
                10M $STUDIO can be purchased for 10M $NEXA = $60.00
            </p>

            <p>
                100M $STUDIO can be purchased for 85M $NEXA = $510.00 (15% discount)
            </p>

            <p>
                1B $STUDIO can be purchased for 700M $NEXA = $4,200.00 (30% discount)
            </p>

            <div>
                <h3 class="text-sm text-red-500 font-medium">NOTE:</h3>
                * Please use <span class="text-blue-500 font-medium hover:underline cursor-pointer">Wiserswap</span> <em>(or any supporting DEX)</em> to purchase quantities under 10M $STUDIO.
            </div>
        </section>
    </main>

    <Footer />
</template>
