<script setup lang="ts">
/* Set project details. */
const { projectid, projectName } = await $fetch('/api/v1/project')

</script>

<template>
    <footer class="mt-20 py-5 max-w-7xl mx-auto">
        <div class="inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300"></div>
        </div>

        <div class="-mt-5 relative flex justify-center">
            <span class="bg-white px-3 text-gray-500">
                <img src="~/assets/nexa.svg" class="w-8 h-8" />
            </span>
        </div>

        <section class="mt-5 px-3 flex justify-between">
            <span class="text-sm text-gray-400">
                &copy; {{new Date().getFullYear()}} {{projectName}} - MIT License
            </span>

            <div class="flex flex-row items-center gap-2">
                <NuxtLink to="/admin" class="text-sm text-blue-400 font-medium hover:underline">
                    Admin
                </NuxtLink>

                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path>
                </svg>

                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"></path>
                </svg>

                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                </svg>
            </div>
        </section>
    </footer>
</template>
