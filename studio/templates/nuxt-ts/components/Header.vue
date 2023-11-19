<script setup lang="ts">
/* Define properties. */
// https://vuejs.org/guide/components/props.html#props-declaration
const props = defineProps({
    data: {
        type: [Object],
    },
})

const isShowingMenu = ref(false)

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
    <header class="absolute inset-x-0 top-0 z-50">
        <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1">
                <NuxtLink to="/" class="-m-1.5 p-1.5">
                    <span class="sr-only">Nexa Studio</span>
                    <img class="h-12 w-auto" src="~/assets/icon.svg" alt="" />
                </NuxtLink>
            </div>

            <div class="flex lg:hidden">
                <button @click="isShowingMenu = true" type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-12 h-auto" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            <div class="hidden lg:flex lg:gap-x-12">
                <NuxtLink to="https://nexajs.org/studio" target="_blank" class="text-xl font-semibold leading-6 text-gray-600">
                    Docs
                </NuxtLink>

                <NuxtLink to="https://avas.cash/bootstrap" target="_blank" class="text-xl font-semibold leading-6 text-gray-600">
                    Bootstrap
                </NuxtLink>

                <NuxtLink to="/token" class="text-xl font-semibold leading-6 text-gray-600">
                    $STUDIO
                </NuxtLink>

                <NuxtLink to="/help" class="text-xl font-semibold leading-6 text-gray-600">
                    Help
                </NuxtLink>
            </div>

            <div class="hidden lg:flex lg:flex-1 lg:justify-end flex items-center gap-1">
                <NuxtLink to="/buy" class="text-xl font-semibold text-gray-600 hover:underline">
                    Buy $STUDIO
                </NuxtLink>

                <span class="text-4xl text-sky-500 font-light">/</span>

                <NuxtLink to="/pro" class="text-xl font-semibold text-gray-600 hover:underline">
                    Go PRO
                </NuxtLink>
            </div>
        </nav>

        <!-- Mobile menu, show/hide based on menu open state. -->
        <div v-if="isShowingMenu" class="lg:hidden" role="dialog" aria-modal="true">
            <!-- Background backdrop, show/hide based on slide-over state. -->
            <div class="fixed inset-0 z-50"></div>
            <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div class="flex items-center justify-between">
                    <NuxtLink to="/" @click="isShowingMenu = false" class="-m-1.5 p-1.5">
                        <span class="sr-only">Nexa Studio</span>
                        <img class="h-12 w-auto" src="~/assets/icon.svg" alt="" />
                    </NuxtLink>

                    <button @click="isShowingMenu = false" type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
                        <span class="sr-only">Close menu</span>
                        <svg class="w-12 h-auto" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mt-6 flow-root">
                    <div class="-my-6 divide-y divide-gray-500/10">
                        <div class="space-y-2 py-6">
                            <NuxtLink to="https://nexajs.org/studio" target="_blank" @click="isShowingMenu = false" class="-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-gray-600 hover:bg-gray-50">
                                Docs
                            </NuxtLink>

                            <NuxtLink to="https://avas.cash/bootstrap" target="_blank" @click="isShowingMenu = false" class="-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-gray-600 hover:bg-gray-50">
                                Bootstrap
                            </NuxtLink>

                            <NuxtLink to="/token" @click="isShowingMenu = false" class="-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-gray-600 hover:bg-gray-50">
                                $STUDIO
                            </NuxtLink>

                            <NuxtLink to="/help" @click="isShowingMenu = false" class="-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-gray-600 hover:bg-gray-50">
                                Help
                            </NuxtLink>
                        </div>

                        <div class="py-6">
                            <NuxtLink to="/buy" @click="isShowingMenu = false" class="-mx-3 block rounded-lg px-3 py-2.5 text-2xl font-semibold leading-7 text-gray-600 hover:bg-gray-50">
                                Buy $STUDIO Time
                            </NuxtLink>

                            <NuxtLink to="/pro" @click="isShowingMenu = false" class="-mx-3 block rounded-lg px-3 py-2.5 text-2xl font-semibold leading-7 text-gray-600 hover:bg-gray-50">
                                Go PRO
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
