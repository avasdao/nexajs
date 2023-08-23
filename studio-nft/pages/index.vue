<script setup lang="ts">
/* Initialize tabs. */
const tabWelcome = ref(true)
const tabExplorers = ref(false)
const tabWallet = ref(false)
const tabScript = ref(false)

/* Initialize blockchain handlers. */
const blockHeight = ref(0)

/* Set project details. */
const { projectid, projectName } = await $fetch('/api/v1/project')

/* Set project mnemonic. */
const { mnemonic } = await $fetch('/api/v1/wallet')

/**
 * Load Tab
 *
 * @param _tabid Specifies the "active" tab.
 */
const loadTab = (_tabid: string) => {
    /* Disable ALL tabs. */
    tabWelcome.value = false
    tabExplorers.value = false
    tabWallet.value = false
    tabScript.value = false

    /* Enable selected tab. */
    switch(_tabid) {
    case 'welcome':
        tabWelcome.value = true
        break
    case 'explorers':
        tabExplorers.value = true
        break
    case 'wallet':
        tabWallet.value = true
        break
    case 'script':
        tabScript.value = true
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
    <main class="max-w-7xl mx-auto py-5">
        <header class="flex flex-col items-center">
            <img src="~/assets/nexa.svg" class="w-24 h-24" />

            <h1 class="text-5xl font-bold">
                {{projectName}}
            </h1>
        </header>

        <section class="mt-10 py-5 max-w-5xl mx-auto border border-purple-500 rounded-lg bg-gradient-to-r from-yellow-100 via-gray-50 to-yellow-100">
            <div class="-mt-10 relative flex justify-center">
                <span class="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                        @click="loadTab('welcome')"
                        type="button"
                        class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Welcome to Nexa Builder Studio</span>
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"></path>
                        </svg>
                    </button>

                    <button
                        @click="loadTab('explorers')"
                        type="button"
                        class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Block Explorers</span>
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"></path>
                        </svg>
                    </button>

                    <button
                        @click="loadTab('wallet')"
                        type="button"
                        class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Asset Wallets</span>
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"></path>
                        </svg>
                    </button>

                    <button
                        @click="loadTab('script')"
                        type="button"
                        class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <span class="sr-only">Script Plus Wise Contracts</span>
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"></path>
                        </svg>
                    </button>
                </span>
            </div>

<!-- BEGIN TABS -->

            <section v-if="tabWelcome" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Welcome Builder!
                    </h2>
                </div>

                <p class="px-10 py-3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </section>

            <section v-if="tabExplorers" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Block + Token Explorers
                    </h2>
                </div>

                <p class="px-10 py-3">
                    Latest block is <NuxtLink :to="'https://explorer.nexa.org/block-height/' + blockHeight" target="_blank" class="text-xl text-blue-500 font-medium hover:underline">{{blockHeight}}</NuxtLink>
                </p>

                <p class="px-10 py-3">
                    Start by modifying `nuxt.config.ts` to best suite your needs.
                    Customize your app name, description and favorite icon.
                    Favicon is located in `/public` folder.
                </p>
            </section>

            <section v-if="tabWallet" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Asset Wallets
                    </h2>
                </div>

                <div class="px-10 py-3">
                    <h2 class="text-xs text-gray-500 uppercase">
                        Project Mnemonic
                    </h2>

                    <span class="w-2/3 block text-base text-rose-500 font-mono font-medium">
                        {{mnemonic}}
                    </span>
                </div>

                <p class="px-10 py-3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </section>

            <section v-if="tabScript" class="">
                <div class="mt-5 flex justify-center">
                    <h2 class="text-2xl font-bold">
                        Nexscript + Wise Contracts
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
                            Check out more Examples
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
    </main>

    <Footer />
</template>
