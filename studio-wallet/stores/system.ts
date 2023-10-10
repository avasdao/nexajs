/* Import modules. */
import { defineStore } from 'pinia'

/* Import clipboard manager. */
import './system/clipboard.ts'

/* Initialize constants. */
const UPDATE_TICKER_INTERVAL = 30000 // 30 seconds

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

        /**
         * Tickers
         *
         * Support for multiple exchange tickers across multiple currencies.
         */
        _tickers: null,




        sponsors: 'Our beloved sponsors',

        /* Initialize network. */
        // NOTE: Current available options are `mainnet` and `testnet`.
        network: null,

        /* Initialize provider. */
        provider: null,

        /* Initialize block number. */
        blockNum: 0,

        /* Initialize seed phrase. */
        // NOTE: This value is persisted in the browser's Local Storage.
        seed: null,

        /* Initialize currency. */
        currency: null,

        /* USD price. */
        // usd: null,

        /* Campaign ID. */
        // NOTE: This is the contract address.
        campaignid: null,

        /* Set amount funded. */
        // amountFunded: 1.337,

        /* Initialize amount requested. */
        amountRequested: 30,

        /* Initialize category. */
        category: null,

        /* Initialize domain. */
        domain: null,

        /* Initialize title. */
        title: null,

        /* Initialize summary. */
        summary: null,

        /* Initialize description. */
        description: null,

        /* Initialize banner. */
        banner: null,

        /* Initialize highlights. */
        highlights: null,

        /* Initialize funding goal. */
        fundingGoal: null,

        /* Initialize starting time. */
        starting: null,

        /* Initialize expiration time. */
        expiration: null,

        /* Initialize publishing flag. */
        isPublished: null,

        /* Initialize (profile) about. */
        profileAbout: null,

        /* Initialize (profile) about. */
        profileAvatar: null,

        /* Initialize (profile) homepage. */
        profileHomepage: null,

        /* Initialize (profile) nickname. */
        profileNickname: null,

        /* Initialize (profile) tagline. */
        profileTagline: null,



        adDisplay: null,

        /**
         * Application Starts
         */
        appStarts: 0,

        /**
         * Application Version
         */
        appVersion: null,

        /**
         * Assets (Sources)
         *
         * An object, used to retrieve the address / location of
         * our latest assets from our IPFS storage.
         */
        assets: null,

        /**
         * Authorization Hashes
         *
         * During sign in, we compute a SHA1 hash from the provided credentials.
         * In the case of a first-time use of supplied credentials, we will notify
         * the user and request confirmation.
         */
        authHashes: null,

        campaignDisplay: null,

        currentPage: null,

        /**
         * Flags
         *
         * 1. Dark mode
         * 2. Unconfirmed transactions
         */
        flags: null,

        /**
         * Header Photo
         */
        headerPhoto: null,

        // TODO
        inbox: null,

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
        // notices: null,

        // TODO
        outbox: null,

        pifDisplay: null,

        profileDisplay: null,

        /**
         * Schema Version
         *
         * v1: Alpha (Preview) Edition
         */
        schemaVersion: 1,

        sheetVisibility: false,

        titleVisibility: true,
    }),

    getters: {
        nex() {
            if (!this._tickers?.NEXA) {
                return null
            }

            return this._tickers.NEXA.quote.USD.price
        },

        usd() {
            if (!this.nex) {
                return null
            }

            return this.nex * 10**6
        },

        locale() {
            if (!this._locale) {
                return null
            }

            return this._locale
        },
    },

    actions: {
        /**
         * Initialize Application
         *
         * Performs startup activities.
         */
        init() {
            this._appStarts++

            /* Validate tickers. */
            if (!this._tickers) {
                /* Initialize tickers. */
                this._tickers = {}
            }

            /* Initialize ticker interval. */
            setInterval(this.updateTicker, UPDATE_TICKER_INTERVAL)

            /* Update ticker. */
            this.updateTicker()

            if (this._locale === null) {
                /* Set (library) locale from (store) locale. */
                this._locale = navigator.language || navigator.userLanguage
                console.log(`User's preferred language is:`, this.locale)
            }

            /* Initialize (library) locale. */
            // const { locale } = useI18n()

            /* Set (library) locale. */
            // locale.value = this.locale
        },

        async updateTicker () {
            if (!this._tickers.AVAS) {
                this._tickers.AVAS = {}
            }

            if (!this._tickers.NEXA) {
                this._tickers.NEXA = {}
            }

            this._tickers.AVAS = await $fetch('https://nexa.exchange/v1/ticker/quote/57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000')

            this._tickers.NEXA = await $fetch('https://nexa.exchange/ticker')
        },

        // FIXME: TEMPORARY -- Move to ACTIONS
        setTitleVisibility(state, _isShowing) {
            state.titleVisibility = _isShowing
        },

        setSheetVisibility(state, _isShowing) {
            // console.log('SETTING SHEET', _isShowing);
            if (typeof _isShowing !== 'undefined') {
                state.sheetVisibility = _isShowing
            } else {
                state.sheetVisibility = !state.sheetVisibility
            }
        },

        showAd(state, _adid) {
            // console.log('SHOWING AD', _adid)
            state.adDisplay = _adid
        },

        showCampaign(state, _campaignid) {
            // console.log('SHOWING CAMPAIGN', _campaignid)
            state.campaignDisplay = _campaignid
        },

        showPIF(state, _campaignid) {
            // console.log('SHOWING PIF', _campaignid)
            state.pifDisplay = _campaignid
        },

        showProfile(state, _showing) {
            // console.log('SHOWING PROFILE', _showing)

            state.profileDisplay = _showing
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
