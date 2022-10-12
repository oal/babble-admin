import Vue from 'vue';
import VueI18n from 'vue-i18n';
const rawLocales = import.meta.glob('@/locales/*.json')

Vue.use(VueI18n);

let i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {}
});

async function loadLocaleMessages() {
    const messages = {};
    for (const path in rawLocales) {
        let mod = await rawLocales[path]()
        const matched = path.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            i18n.setLocaleMessage(locale, JSON.parse(JSON.stringify(mod)))
        }
    }

    let locale = 'en';
    for(let i = 0; i < navigator.languages.length; i++) {
        let language = navigator.languages[i];
        console.log(messages[language])
        if(i18n.getLocaleMessage(language)) {
            locale = language;
            break;
        }
    }

    i18n.locale = locale
}

loadLocaleMessages().then(() => {
    console.debug('Language files loaded.')
})


export default i18n
