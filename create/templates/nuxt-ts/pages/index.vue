<script setup lang="ts">
/* Import modules. */
import { ref } from 'vue'

/* Initialize tabs. */
const tabStart = ref(true)
const tabConfig = ref(false)
const tabLabs = ref(false)
const tabExtras = ref(false)

/* Initialize blockchain handlers. */
const blockHeight = ref(0)

/**
 * Load Tab
 *
 * @param _tabid Specifies the "active" tab.
 */
const loadTab = (_tabid: string) => {
    /* Disable ALL tabs. */
    tabStart.value = false
    tabConfig.value = false
    tabLabs.value = false
    tabExtras.value = false

    /* Enable selected tab. */
    switch(_tabid) {
    case 'start':
        tabStart.value = true
        break
    case 'config':
        tabConfig.value = true
        break
    case 'labs':
        tabLabs.value = true
        break
    case 'extras':
        tabExtras.value = true
        break
    }
}

/**
 * Get Block Height
 *
 * Will query a cluster of Rostrum servers for the current block height.
 */
const getBlockHeight = () => {
    /* Set block height. */
    // FIXME FOR DEV PURPOSES ONLY
    blockHeight.value = 1337
}

/* Request (current) block height. */
getBlockHeight()
</script>

<template>
    <main class="max-w-7xl mx-auto">
        <header class="flex flex-col items-center">
            <img src="~/assets/nexa.svg" class="w-24 h-24" />

            <h1 class="text-5xl font-bold">
                Welcome to Nexa!
            </h1>
        </header>

        <section class="mt-10 py-5 max-w-5xl mx-auto border border-purple-500 rounded-lg bg-gradient-to-r from-yellow-100 via-gray-50 to-yellow-100">
            <div class="-mt-10 relative flex justify-center">
                <span class="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                        @click="loadTab('start')"
                        type="button"
                        class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Get started</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                        </svg>
                    </button>

                    <button
                        @click="loadTab('config')"
                        type="button"
                        class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Configuration</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                                fill-rule="evenodd"
                                d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>

                    <button
                        @click="loadTab('labs')"
                        type="button"
                        class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Annotate</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                                fill-rule="evenodd"
                                d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>

                    <button
                        @click="loadTab('extras')"
                        type="button"
                        class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Delete</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                                fill-rule="evenodd"
                                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </span>
            </div>

<!-- BEGIN TABS -->
            <section v-if="tabStart" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Get started
                    </h2>
                </div>

                <p class="px-10 py-3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </section>

            <section v-if="tabConfig" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Configuration
                    </h2>
                </div>

                <p class="px-10 py-3">
                    Start by modifying `nuxt.config.ts` to best suite your needs.
                    Customize your app name, description and favorite icon.
                    Favicon is located in `/public` folder.
                </p>
            </section>

            <section v-if="tabLabs" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Lab Experiments
                    </h2>
                </div>

                <p class="px-10 py-3">
                    Latest block is <NuxtLink :to="'https://explorer.nexa.org/block-height/' + blockHeight" target="_blank" class="text-xl text-blue-500 font-medium hover:underline">{{blockHeight}}</NuxtLink>
                </p>

                <p class="px-10 py-3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </section>

            <section v-if="tabExtras" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Extra Resources
                    </h2>
                </div>

                <p class="px-10 py-3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </section>
<!-- END TABS -->
        </section>

        <section class="mt-5 max-w-5xl mx-auto grid grid-cols-5 gap-5">
            <div class="flex flex-col col-span-3 gap-5">
                <NuxtLink to="https://nexajs.org" target="_blank" class="flex items-center gap-4 bg-gradient-to-r from-rose-500 to-rose-700 rounded-lg">
                    <svg class="mx-5 w-32 h-32 text-rose-900" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"></path>
                    </svg>

                    <div>
                        <h2 class="text-2xl text-rose-100 font-medium">
                            Why Build on Nexa?
                        </h2>

                        <p class="text-rose-100">
                            Nexa offers a premium Developer Experience (DX) that favors rapid iterations to get you deployed as quickly as possible.
                        </p>
                    </div>
                </NuxtLink>

                <NuxtLink to="https://nexajs.org" target="_blank" class="flex items-center gap-4 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg">
                    <svg class="mx-5 w-32 h-32 text-yellow-900" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"></path>
                    </svg>

                    <div>
                        <h2 class="text-2xl text-yellow-100 font-medium">
                            Check our more Examples
                        </h2>

                        <p class="text-yellow-100">
                            The Nexa community offers ample examples to help you get started quickly using the industry's best practices.
                        </p>
                    </div>
                </NuxtLink>
            </div>

            <NuxtLink to="https://nexajs.org" target="_blank" class="col-span-2 py-3 flex flex-col items-center gap-2 bg-gradient-to-b from-sky-700 to-sky-500 rounded-lg">
                <div class="p-3 flex flex-col">
                    <h2 class="text-3xl text-sky-100 font-medium text-center">
                        Documentation
                    </h2>

                    <p class="mt-3 text-sky-100">
                        Nexa offers excellent documentation that offers modern and up-to-date guides and tutorials for anything and everything you need.
                    </p>
                </div>

                <svg class="mx-5 w-24 h-24 text-sky-900" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                </svg>
            </NuxtLink>
        </section>

        <Footer />
    </main>
</template>
