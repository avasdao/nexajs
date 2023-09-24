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
    <main class="h-full flex flex-col gap-4">
        <label
            for="file-upload"
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Add Cover
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                id="file-upload"
                name="file-upload"
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>

        <label
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Add Front
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>

        <label
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Add Back
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>

        <label
            class="relative group flex-1 flex flex-col justify-center items-center bg-gray-50 border border-gray-300 rounded-xl shadow cursor-pointer hover:bg-sky-100"
        >
            <h3 class="text-xl text-gray-600 font-medium group-hover:text-sky-600">
                Add Play
            </h3>

            <span class="text-gray-700">
                Upload a file
            </span>

            <p class="block text-xs text-gray-500 line-through">
                or drag and drop
            </p>

            <input
                type="file"
                @change="handleChange"
                class="sr-only"
            />
        </label>
    </main>
</template>
