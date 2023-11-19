<script setup lang="ts">
/* Define properties. */
// https://vuejs.org/guide/components/props.html#props-declaration
const props = defineProps({
    title: String,
    link: String,
    background: String,
    caption: String,
})

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
    <NuxtLink :to="link" class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80">
        <img
            :src="background"
            alt=""
            class="absolute inset-0 -z-10 h-full w-full object-cover"
        >

        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
        <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>

        <div class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
            <h2 class="text-3xl text-gray-100 font-bold">
                {{title}}
            </h2>
        </div>

        <h3 class="mt-3 text-lg font-semibold leading-6 text-white">
            <span>
                <span class="absolute inset-0"></span>
                {{caption}}
            </span>
        </h3>
    </NuxtLink>
</template>
