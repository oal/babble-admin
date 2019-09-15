import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import i18n from './i18n';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false;

axios.defaults.baseURL = '/api/';
Vue.use(VueAxios, axios);

new Vue({
    router,
    vuetify,
    i18n,
    data: {
        drawer: true,
        messages: []
    },
    created() {
        this.drawer = this.$vuetify.breakpoint.mdAndUp;

        this.axios.interceptors.response.use(response => {
            let message = response.data.message;
            if (!message) {
                if (response.config.method === 'post') message = this.$t('saveSuccessful');
                else if (response.config.method === 'put') message = this.$t('updateSuccessful');
            }
            if (message) {
                this.addMessage(message, 'success');
            }
            return response;
        }, error => {
            let message = error.response.data.error;
            if (!message && error.response.status === 500) {
                message = this.$t('unknownError');
            }

            if (message) {
                this.addMessage(message, 'error');
            }
            return Promise.reject(error);
        });
    },
    mounted() {
        setInterval(() => {
            this.messages = this.messages.filter(message => message.visible);
        }, 1000);
    },
    methods: {
        addMessage(message, type) {
            this.messages.push({
                key: Math.random().toString(36).substr(2, 5),
                message: message,
                type: type || 'info',
                visible: true
            });
        }
    },
    render: h => h(App)
}).$mount('#app');
