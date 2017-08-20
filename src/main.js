import axios from 'axios';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

// Load language files.
let req = require.context('./languages/', false, /.*\.js/);
let languages = [];
req.keys().forEach(key => {
    let languageCode = key.substr(2, 2);
    languages[languageCode] = req(key).default
});

// Init language.
Vue.use(VueI18n);
let language = navigator.languages[0];
if (!languages[language]) language = 'en';
const i18n = new VueI18n({
    locale: language,
    messages: languages,
});

Vue.prototype.$http = axios.create({
    baseURL: '/api'
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    i18n: i18n,
    router,
    template: '<App/>',
    components: {
        App
    }
});
