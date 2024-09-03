// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application Settings */
    app: {
        /* Application Header */
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Wisebox: The Swiss Army Knife of Smart Contracts',
            meta: [
                { name: 'description', content: 'Wisebox is the Ultimate Playground for UTXO Script developers to design, test and deploy their smart contracts.' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
            script: [
                { src: '/js/matomo.js' },
            ],
        },
    },

    /* Application Modules */
    modules: [
        /* Tailwind CSS */
        '@nuxtjs/tailwindcss',

        /* Pinia */
        '@pinia/nuxt',

        /* Internationalization for Nuxt */
        '@nuxtjs/i18n',

        /* Monaco Editor for Nuxt */
        'nuxt-monaco-editor',
    ],

    /* Set compatibility date. */
    compatibilityDate: '2024-08-30',
})
