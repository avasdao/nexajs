<script setup lang="ts">
/* Import modules. */
// import nexc from '@nexscript/nexc'


useHead({
    title: `Simulators — Wisebox`,
    meta: [
        { name: 'description', content: `Wisebox is the Ultimate Playground for UTXO Script developers to design, test and deploy their smart contracts.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

onMounted(() => {
    // console.log('NEXC', nexc)
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<template>
    <main class="flex flex-col gap-4">
        <h1 class="text-5xl font-medium">
            Simulators
        </h1>

        <p>
            Nexa transactions run on a virtual machine (VM) called <NuxtLink to="https://debug.nexa.org/" target="_blank" class="text-blue-500 hover:underline">Nexa Script</NuxtLink>.

        </p>

        <SimChooser />

    </main>
</template>
