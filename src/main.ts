import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/styles' // Global CSS has to be imported
import { createApp, defineAsyncComponent, h } from 'vue'
import { createVuetify, useDisplay } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import i18n from './i18n'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import api from '@/api'
import type { Toast, ToastType } from '@/types'

const app = createApp({
  setup () {
    const { mdAndUp } = useDisplay()
    return {
      mdAndUp
    }
  },
  data () {
    return {
      drawer: true,
      messages: [] as Toast[]
    }
  },
  created () {
    this.drawer = this.mdAndUp

    api.interceptors.response.use(response => {
      let message = response.data.message
      if (!message) {
        if (response.config.method === 'post') message = this.$t('saveSuccessful')
        else if (response.config.method === 'put') message = this.$t('updateSuccessful')
      }
      if (message) {
        this.addMessage(message, 'success')
      }
      return response
    }, error => {
      let message = error.response.data.error
      if (!message && error.response.status === 500) {
        message = this.$t('unknownError')
      }

      if (message) {
        this.addMessage(message, 'error')
      }
      return Promise.reject(error)
    })
  },
  mounted () {
    setInterval(() => {
      this.messages = this.messages.filter((message: Toast) => message.visible)
    }, 1000)
  },
  methods: {
    addMessage (message: string, type: ToastType) {
      this.messages.push({
        key: Math.random().toString(36).substr(2, 5),
        message,
        type: type || 'info',
        visible: true
      })
    }
  },
  render: () => h(App)
})

app.component('FieldWrapper', defineAsyncComponent(() =>
  import('@/components/fields/helpers/FieldWrapper.vue'))
)

app.use(router)
app.use(i18n)
app.use(createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md
    }
  }
}))

app.mount('#app')
