/* Import modules. */
import { defineStore } from 'pinia'

/**
 * Asset Store
 */
export const useAssetStore = defineStore('asset', {
    state: () => ({
            /* Initialize session. */
            _session: null,

            _apiKeys: {},
    }),

    getters: {
        session(_state) {
            return _state._session
        },

        sessionid(_state) {
            return _state._session?.id
        },

        challenge(_state) {
            return _state._session?.challenge
        },

        apiKey(_state) {
            return (_exchangeid) => _state._apiKeys[_exchangeid]
        },
    },

    actions: {
        async createAsset() {
            let appuri
            let author
            let bindata
            let category
            let data
            let gardenVer
            let info
            let jsonTemplate
            let keywords
            let license
            let series
            let title

            gardenVer= '1'

            keywords = []

            data = {}

            /* Build JSON file. */
            jsonTemplate = {
                gardenVer,
                title,
                series,
                author,
                keywords,
                appuri,
                category,
                info,
                bindata,
                data,
                license,
            }

            return jsonTemplate
        },

    },
})
