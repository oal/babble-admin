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
        <v-list-item class="blue-grey py-3">
          <v-list-item-content>
            <v-list-item-title class="title">
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
          </v-list-item-content>

          <v-btn
            text
            :title="$t('logout')"
            @click="logout"
          >
            <v-icon>exit_to_app</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-for="model in models"
          :key="model.type"
          :to="{name: 'List', params: {modelType: model.type}}"
        >
          <v-list-item-action>
            <v-icon v-if="model.options && model.options.admin && model.options.admin.icon">
              {{ model.options.admin.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="model.single">{{ model.name }}</span>
              <span v-else>{{ model.name_plural }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{name: 'Files'}">
          <v-list-item-action>
            <v-icon>folder</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('fileManager') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
            indeterminate
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

<script>
    import LoginForm from '../components/LoginForm.vue';

    export default {
        name: 'Panel',

        components: {
            LoginForm
        },

        data() {
            return {
                loading: false,
                showLoginDialog: false,
                models: []
            }
        },

        created: function () {
            this.loading = true;

            this.axios.get('/login').then(response => {
                this.$root.user = response.data;
                this.axios.options('/models').then(response => {
                    this.models = response.data;
                    this.loading = false;
                });
            }).catch(() => {
                this.$router.push({name: 'Login'});
                this.loading = false;
            });

            this.axios.interceptors.response.use(null, (error) => {
                if (error.response.status === 401) {
                    this.showLoginDialog = true;
                }
                return Promise.reject(error);
            });
        },

        methods: {
            logout() {
                this.axios.auth = null;
                this.$router.push({name: 'Login'});
            },
            onLogin() {
                this.showLoginDialog = false;
            }
        }
    }
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
