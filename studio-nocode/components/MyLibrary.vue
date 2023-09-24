<script setup lang="ts">
/* Define properties. */
// https://vuejs.org/guide/components/props.html#props-declaration
const props = defineProps({
    data: {
        type: [Object],
    },
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
    <div class="col-span-2 h-full flex flex-col">
        <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
            My Library
        </h2>

        <div class="w-full h-full bg-sky-100 border border-sky-300 rounded-lg shadow">

        </div>
    </div>
</template>
