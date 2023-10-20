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
    <main class="">
        <div class="flex flex-col gap-4 p-5 text-gray-600 font-medium text-3xl font-medium tracking-widest">
            <h2 class="block">Your wallet is loading,</h2>
            <h2 class="block">please wait a moment...</h2>
        </div>
    </main>
</template>
