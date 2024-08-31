// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application Settings */
    app: {
        /* Application Header */
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Studio Wallet for Builders — Nexa Studio',
            meta: [
                { name: 'description', content: `A highly-configurable, non-custodial Nexa wallet; designed from the ground-up to specifically address the MOST important needs of Builders and Creators.` },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
            script: [
                { src: '/js/matomo.js' },
            ],
        },
        baseURL: '/wallet',
    },

    /* Progressive Web Application Settings */
    pwa: {
        manifest: {
            name: 'Studio Wallet for Builders',
            short_name: 'Studio Wallet',
            description: `A highly-configurable, non-custodial Nexa wallet; designed from the ground-up to specifically address the MOST important needs of Builders and Creators.`,
            // lang: 'en',
            // useWebmanifestExtension: false,
        },
        meta: {
            name: 'Studio Wallet for Builders',
            description: `A highly-configurable, non-custodial Nexa wallet; designed from the ground-up to specifically address the MOST important needs of Builders and Creators.`,
            author: `Nexa contributors`,
            // nativeUI: true,
        },
        // icon: false, // disables the icon module
        workbox: {
            // workboxURL: 'TBD',
            // enabled: true, // FOR DEV PURPOSES ONLY
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

        /* Progressive Web Application */
        '@kevinmarrec/nuxt-pwa',
    ],

    /* Route Rules */
    routeRules: {
        /* Add CORS headers to root. */
        // NOTE: We need this to make <token>.json files available to web apps.
        '/**': { cors: true },
    },

    /* Set compatibility date. */
    compatibilityDate: '2024-08-30',
})
