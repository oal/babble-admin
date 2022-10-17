<template>
  <v-app class="white">
    <v-navigation-drawer
      v-model="$root.drawer"
      clipped-left
      app
      dark
      color="blue-grey darken-1"
    >
      <v-list
        v-if="!loading"
        dense
        class="pt-0"
      >
        <v-list-item class="py-3">
          <div class="d-flex justify-space-between">
            <div>
              <v-list-item-title>
                <router-link
                  v-slot="{ navigate }"
                  :to="{name: 'Index'}"
                  custom
                >
                  <div
                    role="link"
                    @click="navigate"
                    @keypress.enter="navigate"
                  >
                    Babble Admin
                  </div>
                </router-link>
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="$root.user"
                class="pt-1"
              >
                {{ $t('welcome') }}, {{ $root.user.id }}!
              </v-list-item-subtitle>
            </div>
            <v-btn
              size="small"
              :title="$t('logout')"
              icon="exit_to_app"
              @click="logout"
            />
          </div>
        </v-list-item>
        <v-list-item
          v-for="model in models"
          :key="model.type"
          :to="{name: 'List', params: {modelType: model.type}}"
          :prepend-icon="model.options?.admin?.icon"
          :title="model.single ? model.name : model.name_plural"
        />
        <v-list-item
          :to="{name: 'Files'}"
          :title="$t('fileManager')"
          prepend-icon="folder"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container
        v-if="loading"
        fill-height
      >
        <v-layout
          justify-center
          align-center
        >
          <v-progress-circular
            :indeterminate="true"
            color="primary"
          />
        </v-layout>
      </v-container>

      <router-view v-else />

      <v-dialog
        v-model="showLoginDialog"
        persistent
        max-width="300px"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-toolbar-title>{{ $t('login') }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <LoginForm @login="onLogin" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import LoginForm from '../components/LoginForm.vue'
import { defineComponent } from 'vue'
import { AxiosError, AxiosResponse } from 'axios'
import api from '@/api'

export default defineComponent({
  name: 'PanelWrapper',

  components: {
    LoginForm
  },

  data () {
    return {
      loading: false,
      showLoginDialog: false,
      models: []
    }
  },

  created: function () {
    this.loading = true

    api.get('/login').then((response: AxiosResponse) => {
      this.$root.user = response.data
      api.options('/models').then((response: AxiosResponse) => {
        this.models = response.data
        this.loading = false
      })
    }).catch(() => {
      this.$router.push({ name: 'Login' })
      this.loading = false
    })

    api.interceptors.response.use(undefined, (error: AxiosError) => {
      if (error.response?.status === 401) {
        this.showLoginDialog = true
      }
      return Promise.reject(error)
    })
  },

  methods: {
    logout () {
      api.defaults.auth = undefined
      this.$router.push({ name: 'Login' })
    },
    onLogin () {
      this.showLoginDialog = false
    }
  }
})
</script>

<style>
#login-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(25, 25, 25, 0.8);
  z-index: 1;
  display: flex;
}
</style>
