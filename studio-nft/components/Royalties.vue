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
                Royalties (optional)
            </h2>

            <p class="mt-1 text-sm leading-6 text-gray-600">
                Create an unbreakable contract on ALL asset transfers that enforces a minimum compensation amount to a fixed set of payout recipients.
            </p>
        </div>

        <div class="max-w-2xl space-y-10 md:col-span-2">

            <fieldset>
                <legend class="text-lg font-semibold leading-6 text-gray-900">
                    Choose a Compensation Program
                </legend>

                <p class="mt-1 text-sm leading-6 text-gray-600">
                    Please choose from one of the compensation options shown below:
                </p>

                <div class="mt-6 space-y-6">
                    <div class="flex items-center gap-x-3">
                        <input id="no-royalties" name="royalties" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" checked />
                        <label for="no-royalties" class="block text-lg font-medium leading-6 text-gray-900">
                            No Royalties
                        </label>
                    </div>

                    <div class="flex items-center gap-x-3">
                        <input id="creator-royalties" name="royalties" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" disabled />
                        <label for="creator-royalties" class="block text-lg font-medium leading-6 text-gray-900">
                            Require Creator ONLY
                        </label>
                    </div>

                    <div class="flex items-center gap-x-3">
                        <input id="marketplace-royalties" name="royalties" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" disabled />
                        <label for="marketplace-royalties" class="block text-lg font-medium leading-6 text-gray-900">
                            Require Creator + Allowed Marketplace(s)
                        </label>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend class="text-lg font-semibold leading-6 text-gray-900">
                    Allowed Marketplaces
                </legend>

                <p class="mt-1 text-sm leading-6 text-gray-600">
                    Grant listing/royalty permission to the following platforms:
                </p>

                <div class="mt-6 space-y-6">
                    <div class="relative flex gap-x-3">
                        <div class="flex h-6 items-center">
                            <input id="comments" name="comments" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" disabled />
                        </div>

                        <div class="leading-6">
                            <label for="comments" class="text-lg font-medium text-gray-900">
                                NiftyArt
                            </label>

                            <p class="text-sm text-gray-500">
                                The premier Nexa marketplace for NFTs and SFTs.
                            </p>
                        </div>
                    </div>

                    <div class="relative flex gap-x-3">
                        <div class="flex h-6 items-center">
                            <input id="candidates" name="candidates" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" disabled />
                        </div>
                        <div class="leading-6">
                            <label for="candidates" class="text-lg font-medium text-gray-900">
                                Causes Cash
                            </label>

                            <p class="text-sm text-gray-500">
                                The #1 crowdfunding platform for Nexicans.
                            </p>
                        </div>
                    </div>

                    <div class="relative flex gap-x-3">
                        <div class="flex h-6 items-center">
                            <input id="offers" name="offers" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" disabled />
                        </div>

                        <div class="leading-6">
                            <label for="offers" class="text-lg font-medium text-gray-900">
                                OpenSea
                            </label>

                            <p class="text-sm text-gray-500">
                                Add support for Ethereum's #1 marketplace.
                            </p>
                        </div>
                    </div>
                </div>
            </fieldset>

        </div>
    </main>
</template>
