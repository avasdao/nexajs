<script setup lang="ts">
useHead({
    title: `Help — Nexa Studio`,
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
    <main class="bg-white">
        <div class="mx-auto max-w-7xl px-6 py-0 sm:pt-8 lg:px-8 lg:py-20">
            <div class="lg:grid lg:grid-cols-12 lg:gap-8">
                <div class="lg:col-span-5">
                    <h1 class="text-5xl font-medium text-gray-700">
                        Need help?
                    </h1>

                    <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-500">
                        Frequently Asked Questions
                    </h2>

                    <p class="mt-4 text-lg leading-7 text-gray-600">
                        Can’t find the answer you’re looking for? Reach out to <a href="mailto:support@avasdao.org" class="font-semibold text-blue-600 hover:text-blue-500">Ava's Support Team</a> 24x7x365.
                        We'll respond within 24-72 hours.
                    </p>

                    <section class="mt-5 pt-5 flex flex-col border-t-8 border-sky-200 gap-6">
                        <h3 class="text-2xl font-light text-sky-700">
                            <span class="font-bold">We're all fam!</span>
                            Don't hesitate to reach out to us for support via our Socials at anytime..
                        </h3>

                        <NuxtLink to="https://t.me/Nexa_Socials/9497" target="_blank" class="px-5 py-2 text-3xl text-sky-800 text-center font-bold bg-sky-300 border-2 border-sky-500 rounded-lg shadow hover:bg-sky-400">
                            Telegram
                        </NuxtLink>

                        <NuxtLink to="https://discord.com/channels/993441205474041886/1150793798671147018" target="_blank" class="px-5 py-2 text-3xl text-sky-800 text-center font-bold bg-sky-300 border-2 border-sky-500 rounded-lg shadow hover:bg-sky-400">
                            Discord
                        </NuxtLink>
                    </section>
                </div>

                <div class="mt-10 lg:col-span-7 lg:mt-0">
                    <dl class="space-y-10">
                        <div>
                            <dt class="text-lg lg:text-xl font-semibold leading-8 text-gray-900">
                                Can I use the same seed phrase from another wallet?
                            </dt>

                            <dd class="mt-2 text-lg lg:text-xl leading-8 text-gray-600">
                                You can use ANY 12 or 24 word seed phrase to Connect to your Studio wallet.

                                Always remember to follow <NuxtLink to="https://nexa.wiki/security" target="_blank" class="text-blue-500 font-bold hover:text-blue-600">best security practices</NuxtLink> when handling your Crypto secrets.
                            </dd>
                        </div>

                        <div>
                            <dt class="text-lg lg:text-xl font-semibold leading-8 text-gray-900">
                                How do you make holy water?
                            </dt>

                            <dd class="mt-2 text-lg lg:text-xl leading-8 text-gray-600">
                                You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.
                            </dd>
                        </div>

                    </dl>
                </div>
            </div>
        </div>
    </main>

    <Footer />
</template>
