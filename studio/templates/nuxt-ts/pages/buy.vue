<script setup lang="ts">
/* Import modules. */
import numeral from 'numeral'

useHead({
    title: `Buy $STUDIO Time — Nexa Studio`,
    meta: [
        { name: 'description', content: `Nexa Studio makes building your next BIG idea effortless.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

const mex = ref(null)

const buy10 = computed(() => {
    if (!mex.value) {
        return 0
    }

    return numeral(mex.value * 10).format('$0,0.00')
})

const buy100 = computed(() => {
    if (!mex.value) {
        return 0
    }

    return numeral(mex.value * 90).format('$0,0.00')
})

const buy1000 = computed(() => {
    if (!mex.value) {
        return 0
    }

    return numeral(mex.value * 800).format('$0,0.00')
})

const init = async () => {
    let response

    mex.value = await $fetch('https://nexa.exchange/mex')
        .catch(err => console.error(err))
    console.log('MEX', mex.value)

}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<template>
    <main class="mx-auto max-w-7xl py-12 sm:px-2 sm:py-16 lg:px-4">
        <section class="mx-auto max-w-2xl px-4 lg:max-w-none">
            <div class="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
                <div class="flex flex-col gap-5">
                    <h2 class="text-5xl font-bold tracking-tight text-gray-900">
                        Purchase <span class="text-6xl text-rose-400 font-light italic">$STUDIO</span> Time in bulk and save <span class="text-6xl text-rose-400 font-light italic">BIG!</span>
                    </h2>

                    <p class="mt-4 text-xl leading-8 tracking-wide text-gray-500">
                        Are you ready to become a <span class="font-bold">Market Maker</span> and provide <span class="font-bold">Liquidity for Profit</span> to Nexa's retail community?
                        Be sure to take FULL advantage of the studio's <span class="font-bold">Wholesale Discounts!</span>
                    </p>

                    <p class="mt-4 text-xl leading-8 tracking-wide text-gray-500">
                        The <span class="font-bold">base minting price (BMP)</span> of $STUDIO Time is pegged with $NEXA at a <span class="font-bold">1-to-1</span> ratio.
                        This is a <span class="font-bold">FIXED</span> ratio, permanently set for the <span class="font-bold">LIFETIME</span> of this asset.
                    </p>

                    <p class="mt-4 text-xl leading-8 tracking-wide text-gray-500">
                        Larger quantities of $STUDIO Time are available at <span class="font-bold">up to 20% discount</span> from the BMP.
                    </p>
                </div>

                <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100 border-2 border-rose-300 shadow">
                    <img src="https://images.unsplash.com/photo-1579225663317-c0251b4369bc?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" class="object-cover object-center" />
                </div>
            </div>

            <div class="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                <div class="flex flex-col text-center items-center">
                    <div class="sm:flex-shrink-0">
                        <img class="w-32 h-auto" src="~/assets/icon.svg" alt="" />
                    </div>

                    <div class="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                        <h3 class="text-4xl font-light text-sky-700">
                            <span class="text-5xl font-normal">10M</span> $STUDIO
                        </h3>

                        <p class="mt-2 text-sm font-medium text-sky-800 uppercase">
                            Wholesale purchase price
                        </p>

                        <div class="flex items-center gap-1 mt-0 text-2xl font-light text-rose-500">
                            10M $NEXA | <span class="text-3xl font-normal">{{buy10}}</span>
                        </div>
                    </div>

                </div>

                <div class="flex flex-col text-center items-center">
                    <div class="sm:flex-shrink-0">
                        <img class="w-32 h-auto" src="~/assets/icon.svg" alt="" />
                    </div>

                    <div class="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                        <h3 class="text-4xl font-light text-sky-700">
                            <span class="text-5xl font-normal">100M</span> $STUDIO
                        </h3>

                        <p class="mt-2 text-sm font-medium text-sky-800 uppercase">
                            Wholesale purchase price
                        </p>

                        <div class="flex items-center gap-1 mt-0 text-2xl font-light text-rose-500">
                            90M $NEXA | <span class="text-3xl font-normal">{{buy100}}</span>
                        </div>

                        <p class="mt-2 text-4xl font-light text-lime-600 italic">
                            SAVE 10%
                        </p>
                    </div>
                </div>

                <div class="flex flex-col text-center items-center">
                    <div class="sm:flex-shrink-0">
                        <img class="w-32 h-auto" src="~/assets/icon.svg" alt="" />
                    </div>

                    <div class="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                        <h3 class="text-4xl font-light text-sky-700">
                            <span class="text-5xl font-normal">1B</span> $STUDIO
                        </h3>

                        <p class="mt-2 text-sm font-medium text-sky-800 uppercase">
                            Wholesale purchase price
                        </p>

                        <div class="flex items-center gap-1 mt-0 text-2xl font-light text-rose-500">
                            800M $NEXA | <span class="text-3xl font-normal">{{buy1000}}</span>
                        </div>

                        <p class="mt-2 text-4xl font-light text-lime-600 italic">
                            SAVE 20%
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- <section class="bg-white py-24 sm:py-32">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="mx-auto max-w-2xl sm:text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
                    <p class="mt-6 text-lg leading-8 text-gray-600">Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.</p>
                </div>
                <div class="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                    <div class="p-8 sm:p-10 lg:flex-auto">
                        <h3 class="text-2xl font-bold tracking-tight text-gray-900">Lifetime membership</h3>
                        <p class="mt-6 text-base leading-7 text-gray-600">Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.</p>
                        <div class="mt-10 flex items-center gap-x-4">
                            <h4 class="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                            <div class="h-px flex-auto bg-gray-100"></div>
                        </div>
                        <ul role="list" class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>
                                Private forum access
                            </li>
                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>
                                Member resources
                            </li>
                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>
                                Entry to annual conference
                            </li>
                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>
                                Official member t-shirt
                            </li>
                        </ul>
                    </div>
                    <div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                        <div class="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                            <div class="mx-auto max-w-xs px-8">
                                <p class="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                                <p class="mt-6 flex items-baseline justify-center gap-x-2">
                                    <span class="text-5xl font-bold tracking-tight text-gray-900">$349</span>
                                    <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                                </p>
                                <a
                                    href="#"
                                    class="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Get access
                                </a>
                                <p class="mt-6 text-xs leading-5 text-gray-600">Invoices and receipts available for easy company reimbursement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> -->

        <section class="max-w-5xl mx-auto h-32 mt-20 px-3 py-1 bg-sky-50 border-2 border-sky-200 rounded-xl shadow">
            <span class="text-2xl font-medium text-sky-700">
                Purchase $STUDIO
            </span>

            <p>
                Send the exact amount of $NEXA to the Vending address shown below.
                Your $STUDIO Time will be delivered immediately!
            </p>
        </section>

        <section class="max-w-5xl mx-auto mt-5 flex flex-col gap-5">
            <p class="text-base text-gray-700">
                <h3 class="text-lg text-red-500 font-medium">NOTE:</h3>
                * Please use <NuxtLink to="https://wiserswap.com" target="_blank" class="text-lg text-blue-500 font-medium hover:underline">WiserSwap</NuxtLink> <em>(or ANY supporting DEX)</em> to purchase quantities under 10M $STUDIO.
            </p>
        </section>
    </main>

    <Footer />
</template>
