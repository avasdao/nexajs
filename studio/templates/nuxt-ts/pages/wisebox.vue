<script setup lang="ts">
useHead({
    title: `Wisebox Playground & Learning Center — Nexa Studio`,
    meta: [
        { name: 'description', content: `A playground and learning center for the FOSS Wisebox suite of Nexa Script components.` }
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
        <h1 class="text-4xl font-medium tracking-widest">
            Wisebox Playground &amp; Learning Center
        </h1>

        <NuxtLink to="https://github.com/avasdao/wisebox" target="_blank" class="text-2xl font-bold text-blue-500 hover:underline">
            https://github.com/avasdao/wisebox

            <small class="pl-3 block text-xs text-blue-400 font-base italic tracking-widest">
                Wisebox is Free and Open Source Software (FOSS)
            </small>
        </NuxtLink>


        <p>
            Experiement with Wisebox scripts.
        </p>

        <div class="grid grid-cols-3 gap-8">
            <section class="col-span-2">
                <h2 class="text-2xl font-medium tracking-widest">
                    Bytecode
                </h2>

                <textarea
                    class="w-full h-48 p-5 text-xl font-light bg-amber-100 border-2 border-ameber-300 rounded-xl shadow-md"
                    placeholder="Place your NexScript or CashScript bytecode here."
                ></textarea>

            </section>

            <section class="col-span-1">
                <h2 class="text-2xl font-medium tracking-widest">
                    Execution Results
                </h2>

                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi magni repellendus corporis similique doloribus consectetur nobis officiis omnis ab minus? Ullam deleniti, possimus maxime incidunt necessitatibus cum odio nemo dignissimos?
                </p>
            </section>
        </div>
    </main>

    <Footer />
</template>
