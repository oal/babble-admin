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
let language = 'en';
let validLanguages = navigator.languages.filter(lang => !!languages[lang]);
if(validLanguages.length) {
    language = validLanguages[0];
}
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
    data: {
        messages: []
    },
    created() {
        this.$http.interceptors.response.use(response => {
            let message = response.data.message;
            if(!message) {
                if(response.config.method === 'post') message = this.$t('saveSuccessful');
                else if(response.config.method === 'put') message = this.$t('updateSuccessful');
            }
            if(message) {
                this.addMessage(message, 'success');
            }
            return response;
        }, error => {
            let message = error.response.data.error;
            if(!message && error.response.status === 500) {
                message = this.$t('unknownError');
            }

            if(message) {
                this.addMessage(message, 'error');
            }
            return Promise.reject(error);
        });
    },
    mounted() {
        setInterval(() => {
            let time = new Date();
            this.messages = this.messages.filter(message => time - message.added < 5000);
        }, 500);
    },
    methods: {
        addMessage(message, type) {
            this.messages.push({
                message: message,
                type: type || 'info',
                added: new Date()
            })
        }
    },
    components: {
        App
    }
});
