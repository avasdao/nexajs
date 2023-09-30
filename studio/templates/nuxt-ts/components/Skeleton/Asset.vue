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
    <div class="flex flex-col w-full gap-5 p-2 mx-auto bg-white shadow-lg select-none sm:p-4 sm:h-64 rounded-2xl sm:flex-row ">
        <div class="bg-gray-200 h-52 sm:h-full sm:w-72 rounded-xl animate-pulse">
        </div>

        <div class="flex flex-col flex-1 gap-5 sm:p-2">
            <div class="flex flex-col flex-1 gap-3">
                <div class="w-full bg-gray-200 animate-pulse h-14 rounded-2xl">
                </div>

                <div class="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                </div>

                <div class="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                </div>

                <div class="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                </div>

                <div class="w-full h-3 bg-gray-200 animate-pulse rounded-2xl">
                </div>
            </div>
            <div class="flex gap-3 mt-auto">
                <div class="w-20 h-8 bg-gray-200 rounded-full animate-pulse">
                </div>

                <div class="w-20 h-8 bg-gray-200 rounded-full animate-pulse">
                </div>

                <div class="w-20 h-8 ml-auto bg-gray-200 rounded-full animate-pulse">
                </div>
            </div>
        </div>
    </div>
</template>
