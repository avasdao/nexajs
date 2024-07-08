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
    <main class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
            <h2 class="text-xl font-semibold leading-7 text-gray-900">
                Metadata
            </h2>

            <div class="mt-1 text-sm leading-6 text-gray-600">
                Add any additional details here that you believe are relevant to your newly created asset.

                <p class="mt-7 pr-5 text-red-500 font-medium text-xs leading-5">
                    <span class="block font-bold text-sm">
                        !! WARNING !!
                    </span>

                    This information will be inscribed onto the Nexa blockchain FOREVER, so be careful what information you enter here.
                </p>
            </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">

            <div class="sm:col-span-4">
                <label for="website" class="block text-sm font-medium leading-6 text-gray-900">
                    Website URL
                </label>

                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 text-lg">
                            https://
                        </span>

                        <input
                            type="text"
                            name="website"
                            id="website"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg sm:leading-6 focus:outline-0"
                            placeholder="www.example.com"
                        />
                    </div>
                </div>
            </div>

            <div class="col-span-full">
                <label for="about" class="block text-sm font-medium leading-6 text-gray-900">About</label>
                <div class="mt-2">
                    <textarea
                        id="about"
                        name="about"
                        rows="3"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>

                <p class="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about yourself.
                </p>
            </div>

        </div>
    </main>
</template>
