/* Import modules. */
import { defineStore } from 'pinia'
import { ethers } from 'ethers'

/**
 * System Store
 */
export const useSystemStore = defineStore('system', {
    state: () => ({
        /* Set constants. */
        ONE_SAT: BigInt('1'),
        ONE_NEX: BigInt('100'),
        ONE_KEX: BigInt('100000'),
        ONE_MEX: BigInt('100000000'),
        ONE_META: BigInt('1000000000000000000'),

        /* Initialize notifications. */
        notif: {
            isShowing: false,
            icon: null,
            title: null,
            description: null,
            delay: 7000,
        },

        /**
         * Application Starts
         */
        appStarts: 0,

        /**
         * Application Version
         */
        appVersion: null,

        /**
         * Flags
         *
         * 1. Dark mode
         * 2. Unconfirmed transactions
         */
        flags: null,

        /**
         * Locale
         *
         * Controls the localization language.
         * (default is english)
         */
        locale: null,

        /**
         * Notices
         *
         * System notices that nag/remind the user of some important action or
         * information; which can be permanently disabled ("Do Not Show Again")
         * via checkbox and confirmation.
         *
         * NOTE: Unique 1-byte (hex) codes (up to 255) are used to reduce the size
         *       of this storage field.
         */
        notices: null,
    }),

    getters: {
        // TODO
    },

    actions: {
        /**
         * Initialize Application
         *
         * Performs startup activities.
         */
        initApp(state) {
            state.appStarts++
        },
    },

    persist: true,
})
