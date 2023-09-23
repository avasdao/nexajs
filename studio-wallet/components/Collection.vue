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
                Collection
            </h2>

            <div class="mt-1 text-sm leading-6 text-gray-600">
                Create a new collection or choose from one of your existing to host your new asset.

                <p class="mt-7 pr-5 text-red-500 font-medium text-xs leading-5">
                    <span class="block font-bold text-sm">
                        !! WARNING !!
                    </span>

                    You MUST record the 12 word seed phrase from your wallet, or you risk PERMANENTLY LOSING the ability to manage your Collection(s).
                </p>

                <NuxtLink to="/wallet" class="mt-2 w-fit flex text-base text-red-800 font-medium hover:text-red-600">
                    go to My Wallet
                </NuxtLink>
            </div>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div class="sm:col-span-4">
                <label for="website" class="block text-lg font-medium leading-6 text-gray-900">
                    Choose a collection to host your asset
                </label>

                <input
                    type="text"
                    name="website"
                    id="website"
                    class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg sm:leading-6 focus:outline-0"
                    placeholder="Builder Studio Collection"
                />
            </div>

            <div class="sm:col-span-4">
                <label for="website" class="block text-lg font-medium leading-6 text-gray-900">
                    Summary
                </label>

                <input
                    type="text"
                    name="website"
                    id="website"
                    class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg sm:leading-6 focus:outline-0"
                    placeholder="enter a brief asset summary"
                />
            </div>

            <div class="col-span-full">
                <label for="about" class="block text-lg font-medium leading-6 text-gray-900">
                    Description
                </label>

                <div class="mt-2">
                    <textarea
                        id="about"
                        name="about"
                        rows="3"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>

                <p class="mt-3 text-sm leading-6 text-gray-600">
                    Write one or two sentence(s) to describe this asset.
                </p>
            </div>

            <div class="col-span-full">
                <label for="photo" class="block text-lg font-medium leading-6 text-gray-900">
                    Icon / Logo
                </label>

                <div class="mt-2 flex items-center gap-x-3">
                    <svg class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path
                            fill-rule="evenodd"
                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label for="website" class="block text-lg font-medium leading-6 text-gray-900">
                    Legal
                </label>

                <input
                    type="text"
                    name="website"
                    id="website"
                    class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg sm:leading-6 focus:outline-0"
                    placeholder="enter your legal terms"
                />
            </div>
        </div>

        <div class="col-span-1 md:col-span-3 mt-5 pr-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-xl font-semibold leading-6 text-gray-900">
                Reset
            </button>

            <button
                @click="build"
                class="rounded-md bg-lime-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
            >
                Create a New Collection
            </button>
        </div>
    </main>
</template>
