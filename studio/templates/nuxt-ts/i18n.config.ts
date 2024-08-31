/* Import ALL locales. */
// NOTE: We utilize "lazy loading" for efficiency.
import en_loc from './locales/en.js'
import fr_loc from './locales/fr.js'
import tr_loc from './locales/tr.js'
import zh_loc from './locales/zh.js'

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    lazy: true,
    messages: {
        en: en_loc,
        'en-US': en_loc,
        fr: fr_loc,
        tr: tr_loc,
        zh: zh_loc,
        'zh-CN': zh_loc,
    },
}))
