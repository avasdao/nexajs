/* Import modules. */
import { defineStore } from 'pinia'

/**
 * Profile Store
 */
export const useProfileStore = defineStore('profile', {
    state: () => ({
        /* Initialize session. */
        _session: null,

        /* Initialize entropy (used for HD wallet). */
        // NOTE: This is a cryptographically-secure "random" 32-byte (256-bit) value. */
        // _entropy: null,

        /**
         * Email
         *
         * This is a valid email address.
         */
        _email: null,

        /**
         * Master Seed
         *
         * A 32-byte seed, which can be generated randomly, or by importing
         * from an existing wallet.
         */
        // _masterSeed: null,

        /**
         * Metadata
         *
         * Used to store (user-defined) data for:
         *     1. Individual accounts
         *     2. Individual unspent transaction outputs (UXTOs)
         *
         * NOTE: Metadata MUST be used sparingly, to avoid data storage bloat;
         *       and should be deleted when no longer needed.
         *
         * TODO: Allow this data to be stored on-chain using:
         *       1. Bitcoin Files Protocol (BFP) (https://bitcoinfiles.com/)
         *       2. Telr Locker (https://locker.telr.io)
         */
        _meta: null,

        /**
         * Nickname
         *
         * This is a public alias.
         *
         * NOTE: Only alpha-numeric characters are accepted.
         *       Both upper and lower-case characters are accepted.
         */
        _nickname: null,
    }),

    getters: {
        challenge(_state) {
            return _state._session?.challenge || null
        },

        session(_state) {
            return _state._session || null
        },

        sessionid(_state) {
            return _state._session?.id || null
        },
    },

    actions: {
        deleteSession() {
            /* Set session. */
            this._setSession(null)
        },

        saveSession(_session) {
            /* Set session. */
            this._setSession(_session)
        },

        /**
         * Set Session
         *
         * @param {Object} _session Save session details.
         */
        _setSession (_session) {
            /* Set session. */
            this._session = _session
            console.log('SET SESSION', this._session)
        },
    },
})
