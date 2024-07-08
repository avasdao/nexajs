/* Import modules. */
import { defineStore } from 'pinia'

/* Import (browser) clipboard manager. */
import './system/clipboard.ts'

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
        _notif: {
            isShowing: false,
            icon: null,
            title: null,
            description: null,
            delay: 7000,
        },

        /**
         * Application Starts
         */
        _appStarts: 0,

        /**
         * Application Version
         */
        _appVersion: null,

        /**
         * Flags
         *
         * 1. Dark mode
         * 2. Unconfirmed transactions
         */
        _flags: null,

        /**
         * Locale
         *
         * Controls the localization language.
         * (default is english)
         */
        _locale: null,

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
        _notices: null,
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
        initApp() {
            this._appStarts++
        },

        downloadBlob(data, fileName, mimeType) {
            let blob, url
            blob = new Blob([data], {
                type: mimeType
            })
            url = window.URL.createObjectURL(blob);
            this.downloadURL(url, fileName);
            setTimeout(() => {
                return window.URL.revokeObjectURL(url)
            }, 1000)
        },

        downloadURL(data, fileName) {
            var a
            a = document.createElement('a')
            a.href = data
            a.download = fileName
            document.body.appendChild(a)
            a.style = 'display: none'
            a.click()
            a.remove()
        },
    },
})
