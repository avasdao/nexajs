/* Import modules. */
import { defineStore } from 'pinia'

/**
 * Profile Store
 */
export const useProfileStore = defineStore('profile', {
    state: () => ({
            /* Initialize session. */
            _session: null,

            _apiKeys: {},
    }),

    getters: {
        session(_state) {
            return _state._session || null
        },

        sessionid(_state) {
            return _state._session?.id || null
        },

        challenge(_state) {
            return _state._session?.challenge || null
        },

        apiKey(_state) {
            return (_exchangeid) => _state._apiKeys[_exchangeid] || null
        },
    },

    actions: {
        async initSession () {
            console.log('INIT SESSION (before):', this._session)
            /* Check for existing session. */
            if (this._session) {
                return this._session
            }

            /* Request new session. */
            const session = await $fetch('/api/newSession')
            console.log('INIT SESSION (after fetch):', session)

            /* Set session. */
            this._setSession(session)

            /* Return session. */
            return session
        },

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

        /**
         * Set API Key
         *
         * @param {Object} _key Information for the Exchange's API key.
         */
        setApiKey (_key: Object) {
            /* Set session. */
            this._apiKeys[_key.exchangeid] = _key
            console.log('SET API KEY', this._apiKeys)
        },
    },
})
