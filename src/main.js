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
        drawer: true
    },
    created() {
        this.drawer =this.$vuetify.breakpoint.mdAndUp;
    },
    render: h => h(App)
}).$mount('#app');
