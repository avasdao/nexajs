// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application Settings */
    app: {
        /* Application Header */
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Nexa Builder Studio',
            meta: [
                { name: 'description', content: 'Start your next JavaScript project using Nexa Builder Studio boilerplate templates.' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
        },
    },

    /* Application Modules */
    modules: [
        /* Tailwind CSS */
        '@nuxtjs/tailwindcss'
    ],

    /* Runtime Configuration */
    runtimeConfig: {
        /* Set (project) mnemonic. */
        mnemonic: process.env.PROJECT_MNEMONIC,

        // NOTE: Exposed to the client.
        public: {
            /* Set (project) id. */
            id: process.env.PROJECT_ID,

            /* Set (project) name. */
            name: process.env.PROJECT_NAME,
        }
    },
})
