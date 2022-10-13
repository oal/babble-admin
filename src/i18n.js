import {createI18n} from 'vue-i18n'

const rawLocales = import.meta.glob('@/locales/*.json')

let i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {}
});

async function loadLocaleMessages() {
    for (const path in rawLocales) {
        let mod = await rawLocales[path]()
        const matched = path.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            i18n.global.setLocaleMessage(locale, mod.default)
        }
    }

    let locale = 'en';
    for (let i = 0; i < navigator.languages.length; i++) {
        let language = navigator.languages[i];
        if (i18n.global.availableLocales.indexOf(language) !== -1) {
            locale = language;
            break;
        }
    }

    i18n.global.locale = locale
}

loadLocaleMessages().then(() => {
    console.debug('Language files loaded.')
})


export default i18n
