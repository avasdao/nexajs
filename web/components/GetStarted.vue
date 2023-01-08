<template>
    <main class="bg-white">
        <div class="max-w-4xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 class="font-extrabold tracking-tight text-gray-900">
                <span class="block text-5xl">
                    Ready to get started?
                </span>

                <span class="mt-2 pb-1 block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-3xl text-transparent">
                    Choose a path —
                    <br class="hidden sm:block" />then begin your journey down the rabbit hole
                </span>
            </h2>

            <div class="flex flex-col">
                <div class="mt-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-5">
                    <a href="https://matrix.to/#/#nexacoin:matrix.org" target="_blank" class="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-3 border border-transparent text-xl font-medium rounded-md shadow-sm text-white hover:from-purple-700 hover:to-indigo-700">
                        Matrix
                    </a>

                    <a href="https://t.me/nexacoin" target="_blank" class="flex items-center justify-center px-4 py-3 border border-transparent text-xl font-medium rounded-md shadow-sm text-indigo-800 bg-indigo-50 hover:bg-indigo-100">
                        Telegram
                    </a>

                    <a href="javascript://" class="flex items-center justify-center px-4 py-3 border border-transparent text-xl font-medium rounded-md shadow-sm text-indigo-800 bg-indigo-50 hover:bg-indigo-100">
                        Discord
                    </a>
                </div>

                <small class="mt-2 flex justify-center text-gray-500 italic">
                    all rooms are bridged via
                    <a href="https://t2bot.io/" target="_blank" class="ml-1 text-blue-500 font-medium hover:underline">
                        t2bot.io
                    </a>
                </small>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    data: () => ({
        //
    }),
    computed: {
        //
    },
    methods: {
        //
    },
    created: function () {
        //
    },
    mounted: function () {
        //
    },
}
</script>
