// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application Settings */
    app: {
        /* Application Header */
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Nexa dApp Boilerplate',
            meta: [
                { name: 'description', content: 'NexaJS boilerplate Nuxt template.' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
        },
    },
    modules: ['@nuxtjs/tailwindcss'],
})
