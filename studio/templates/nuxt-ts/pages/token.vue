<script setup lang="ts">
useHead({
    title: `$STUDIO Time — Nexa Studio`,
    meta: [
        { name: 'description', content: `Nexa Studio makes building your next BIG idea effortless.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

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
    <main class="isolate">
        <!-- Hero section -->
        <div class="relative isolate -z-10">
            <svg class="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]" aria-hidden="true">
                <defs>
                    <pattern id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                        <path d="M.5 200V.5H200" fill="none" />
                    </pattern>
                </defs>
                <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
                    <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
                </svg>
                <rect width="100%" height="100%" stroke-width="0" fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" />
            </svg>
            <div class="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48" aria-hidden="true">
                <div
                    class="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                    style="
                        clip-path: polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%);
                    "
                ></div>
            </div>
            <div class="overflow-hidden">
                <div class="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pt-32 lg:px-8 lg:pt-16">
                    <div class="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                        <div class="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                $STUDIO Time
                            </h1>

                            <p class="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                                Official burning &amp; staking token of Nexa Studio.
                            </p>

                            <p class="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                                Providing Nexicans who dream BIG with a premium suite of tools and services to Plan, Build and maximize a sustainable Profit!
                            </p>

                            <p class="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                                Builders burn & stake $STUDIO Time for access to premium tools & services, featuring: bleeding-edge AI, uncensorable content storage & delivery, plus a direct line to Ava's world-class support team.
                            </p>

                            <p class="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                                Creators may choose to publish one or more of their original NFTs and SFTs to The Nexican Gallery — Nexa's premier, ultra-exclusive, digital art collection.
                            </p>

                            <p class="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                                Builder's & Creator's works are their own.
                            </p>
                        </div>

                        <div class="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                            <div class="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                                <div class="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1632582204758-5ac65783517a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                                        alt=""
                                        class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                    />
                                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                                </div>
                            </div>
                            <div class="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                                <div class="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1535406208535-1429839cfd13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80"
                                        alt=""
                                        class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                    />
                                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                                </div>
                                <div class="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1525362081669-2b476bb628c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                                        alt=""
                                        class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                    />
                                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                                </div>
                            </div>
                            <div class="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                                <div class="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1551710029-607e06bd45ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80"
                                        alt=""
                                        class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                    />
                                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                                </div>
                                <div class="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1634148739677-a5bb54df2611?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                                        alt=""
                                        class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                    />
                                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content section -->
        <div class="mx-auto -mt-12 max-w-7xl sm:mt-0 xl:-mt-8">

            <div class="px-3 sm:px-10 py-5">
                <h2 class="my-5 text-4xl sm:text-5xl font-medium text-center">
                    Token Details
                </h2>

                <ul class="mt-2 flex flex-col gap-8 leading-6 sm:leading-8">

                    <li class="flex items-center">
                        <NuxtLink
                            class="px-3 py-2 w-full flex flex-col items-center bg-blue-300 border-2 border-blue-500 rounded-lg shadow hover:bg-blue-200"
                            to="https://nexa.exchange/token/9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000"
                            target="_blank"
                        >
                            <h3 class="text-sm sm:text-lg text-blue-700 font-medium uppercase">
                                Token ID
                            </h3>

                            <span class="sm:hidden text-lg">
                                tztnyazksgqpk...pqqqq99lxywr8
                            </span>
                            <span class="hidden sm:block lg:hidden text-lg">
                                tztnyazksgqpkphrx2m2fgxa...7xtlc8k4xcjpqqqq99lxywr8
                            </span>
                            <span class="hidden lg:block text-xl">
                                nexa:tztnyazksgqpkphrx2m2fgxapllufqmuwp6k07xtlc8k4xcjpqqqq99lxywr8
                            </span>

                        </NuxtLink>
                    </li>

                    <li>
                        <div class="px-3 py-2 w-full flex flex-col items-center bg-amber-200 border-2 border-amber-400 rounded-lg shadow">
                            <h3 class="text-sm text-amber-700 font-medium uppercase">
                                Max Token Supply
                            </h3>

                            <h3 class="text-3xl font-medium">
                                Unlimited
                            </h3>
                        </div>
                    </li>
                </ul>

            </div>

        </div>
    </main>
</template>
